---
name: rn-currency
description: RN 스택(코어·라이브러리·iOS/Android 플랫폼 정책)이 최신 릴리즈 대비 뒤처졌는지 점검하고 안전한 권장 버전까지 산정하는 advisory — gap 리포트만 내고 스택은 고치지 않는다. "RN 최신성", "버전 gap", "권장 버전", "rn currency"에 사용. 구현·버그 수정·업그레이드 실행에는 쓰지 않는다.
user-invocable: true
argument-hint: [대상 예 reanimated | 스코프 core·lib·platform]
allowed-tools: Read Write Bash Grep WebSearch WebFetch Agent Skill
---

# /rn-currency — RN 스택 최신성 점검 (advisory)

혼자 개발하면 놓치기 쉬운 **React Native 생태계의 최신 릴리즈**를 대신 추적한다. 현재 스택(`package.json` + 네이티브 설정)을 스냅샷으로 뜨고, 각 대상의 **최신 릴리즈 노트·공식 정책을 실시간 조회**해 우리 버전과 대조한 뒤, "뒤처졌거나 놓친 것"을 **권장 버전과 함께** 우선순위로 정리한 **advisory 리포트**를 낸다.

- **이건 게이트가 아니다.** 아무것도 막지 않는다. gap 리포트만 낸다. [review-gate](../review-gate/SKILL.md)는 diff 결함을 blocking하는 관문이고, 이 스킬은 스택 최신성을 알려주는 advisory다 — 성격·빈도·판정이 정반대다.
- **최신은 목적지가 아니다.** 리포트가 답할 질문은 "최신이 몇이냐"가 아니라 **"지금 뭘로 올려야 하나"**다. 갓 나온 릴리즈는 회귀가 아직 안 드러난 상태다 — 최신을 그대로 권장하면 이 스킬은 남의 회귀를 우리 앱에 배달하는 파이프가 된다. 대상마다 최신과 별개로 **권장 버전**을 §3 게이트로 산정한다.
- **코드·`package.json`·네이티브 설정을 수정하지 않는다.** 업그레이드 여부는 사용자 결정(AGENTS.md: "도구·라이브러리 도입 → 자동 금지, 트레이드오프 제시 후 승인"). 이 스킬의 유일한 쓰기는 §5 리포트 파일이다.
- **환각 금지 (핵심 제약).** "최신 버전은 X다", "Y가 deprecated됐다" 같은 최신성 주장은 **반드시 webfetch로 확인한 릴리즈 노트·공식 문서 링크를 근거로 단다.** 최신 릴리즈는 어시스턴트 지식 cutoff보다 미래일 수 있으므로, 조회로 확인 못 한 항목은 "확인 못 함"으로 분리한다 — 추측을 사실로 쓰지 않는다.

## 0. 스냅샷 — 현재 스택 수집

- **인자로 스코프를 먼저 확정한다** — `core`(§1 A)·`lib`(§1 B)·`platform`(§1 C)이면 해당 트랙만, 특정 대상명(`reanimated` 등)이면 그것만. **수집 자체를 스코프로 자른다**: `platform`은 아래 registry·peer ceiling이 불필요하고, `core`·`lib`는 네이티브 설정 Read가 불필요하다.
- `package.json` Read — 스냅샷 헤더용 현재 버전(RN·React 등). 아래 `outdated`는 gap 있는 대상만 반환하므로, gap 0인 대상의 현재 버전은 여기서만 나온다.
- **registry 일괄 수집 — Bash 한 콜.**

```bash
pnpm outdated --format json 2>/dev/null \
  | jq -r 'to_entries[] | select(.value.dependencyType=="dependencies")
           | "\(.key)|\(.value.current)→\(.value.latest)\(if .value.isDeprecated then "|DEPRECATED" else "" end)"'
```

`dependencyType` 필터가 devDependencies(eslint·babel·jest·`@types`)를 같은 패스에서 뺀다 — 실측 116개 중 52개가 트랙 밖이었다. `isDeprecated`는 §2의 `deprecated` 분류를 노트 없이 확정해준다.

**`latest`는 stable 보증이 아니다** — 퍼블리셔가 RC를 `latest`로 태깅하면 그대로 나온다(실측: `@tamagui/lucide-icons` latest = `2.0.0-rc.26`). 버전에 `-rc`·`-beta` 같은 프리릴리즈 식별자가 붙으면 승격 대상으로 세지 말고 별도 표기한다(`pnpm info <pkg> dist-tags`로 확인).

- **도달 가능 상한(peer ceiling) 계산** — 최신이 곧 우리가 쓸 수 있는 버전은 아니다. gap이 있는 대상마다 요구 RN 범위를 읽고, 현재 RN이 범위 밖이면 **RN에 잠긴 상한**으로 표기한다.

```bash
pnpm info react-native-reanimated@4.4.0 peerDependencies
# { react: '*', 'react-native': '0.83 - 0.86', ... }  → RN 0.81.1이면 4.3.x가 우리 상한
```

상한이 RN에 잠긴 대상이 여럿이면 **그 사실 자체가 리포트의 핵심 통찰**이다("RN 업그레이드가 마스터 키"). 개별 라이브러리 gap보다 먼저 쓴다.

- 네이티브:
  - `android/build.gradle` · `android/gradle.properties` — `compileSdkVersion` · `targetSdkVersion` · `minSdkVersion` · `kotlinVersion` · `ndkVersion` · `newArchEnabled` · `hermesEnabled`
  - `ios/Podfile` — `platform :ios` 최소 배포 타깃, New Arch/Hermes 관련 플래그
- 이 프로젝트는 **New Architecture** 기반이다(`newArchEnabled=true` · Hermes · Nitro Modules · Reanimated 4). 이를 전제로 조회한다.

## 1. 점검 대상 (3 트랙)

대상 목록은 **`package.json` 실사용분 기준**으로 산정한다(아래는 핵심 예시 — 스택 변경 시 자동 반영되도록 목록을 하드코딩에 의존하지 말 것).

| 트랙                   | 대상(예시)                                                                                                                                                                                                                                                                                                | 최신 정보 1차 출처                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **A. RN 코어**         | `react-native` · `react` · New Arch(Fabric/Bridgeless/TurboModules/codegen) · Hermes                                                                                                                                                                                                                      | reactnative.dev/blog, RN GitHub releases, RN Upgrade Helper            |
| **B. 주요 라이브러리** | Reanimated(+`react-native-worklets`) · Gesture Handler · `react-native-svg` · React Navigation · TanStack Query · Zustand · FlashList(v2) · LegendList · `@gorhom/bottom-sheet` · Tamagui · screens · safe-area-context · mmkv · keyboard-controller · permissions · Nitro Modules · Sentry · hot-updater | 각 GitHub releases / 공식 문서                                         |
| **C. 플랫폼 정책**     | Android `targetSdk` 요구 마감 · 16KB page size · iOS deployment target · 스토어 심사 정책 변경                                                                                                                                                                                                            | developer.android.com, developer.apple.com, Play/App Store 정책 페이지 |

- **SM(Software Mansion) 라이브러리**(Reanimated·Gesture Handler·SVG·worklets)의 정본 API·사실은 AGENTS.md에 따라 `react-native-best-practices`(SM) skill을 1차로 쓰고, 불일치·불명확 시 SM 공식 문서를 webfetch로 검증한다. skill이 없으면 SM 문서 webfetch로 폴백.
- **성능 진단성 정보**(FlashList v2·Hermes mmap·R8·16KB 정렬 등)는 `react-native-perf-guide`(Callstack) skill 관점을 참고한다.

## 2. 조회 & 대조

**2단계로 나눈다 — 1차는 registry, 2차는 노트.** 웹 검색으로 "최신이 몇이냐"를 찾지 않는다(검색 결과 래핑 페이지 오독·prerelease 혼선의 원인).

- **1차 (registry · Track B)**: §0 수집 결과로 `현재 → 최신 → peer 상한`을 확정한다. `outdated`에 안 나온 대상은 gap 0이므로 2차 대상이 아니다.
- **2차 (릴리즈 노트)**: gap이 있는 대상만, **검색이 아니라 정확한 태그 URL로 직행 fetch**한다(`github.com/<org>/<repo>/releases/tag/<ver>`). 읽을 범위는 버전 델타로 정해진다(`4.3.1→4.3.3`이면 노트 2개). 패치 수준이라 ⚪가 확정된 대상은 2차를 생략해도 된다.
- **Track A는 절반만 registry다.** `react-native`·`react`의 버전 숫자는 §0 출력에 그대로 나온다(실측 `react-native 0.81.1→0.86.2`) — **이걸 웹 검색으로 다시 찾지 마라.** registry 밖인 건 **서사**뿐이다: 그 버전에서 무엇이 강제됐나(New Arch 전환·Bridgeless 기본값·Hermes V1). Hermes·New Arch 자체는 패키지가 아니라 RN 내장·`newArchEnabled` 플래그이므로 숫자조차 registry에 없다. `@react-native/*`(codegen 등)는 devDeps라 §0 필터에서 빠지지만 RN 버전에 lockstep이라 독립 신호가 없다.
- **Track C는 registry에 아예 없다 — 웹 조회가 유일한 경로다.** `targetSdk` 마감·Apple 심사 요구·16KB page size는 npm 패키지가 아니다. registry로 대체하려 들면 **날짜 박힌 강제 사항을 통째로 놓친다** — 🔴·🟠의 주 공급원이 이쪽이다.
- gap 분류:
  - **breaking change** — major가 올랐나, 마이그레이션 가이드가 있나
  - **새 권장 패턴/API** — 신규 훅·API로 기존 방식이 legacy가 됐나
  - **deprecated/제거 예정** — 현재 우리가 쓰는 API가 곧 사라지나(§0 `isDeprecated`가 패키지 단위로 선판정)
  - **known issue** — 현재 버전에 알려진 크래시·보안·심각 버그가 있나(고쳐진 버전 명시)
  - **플랫폼 마감일** — `targetSdk` 상향 요구처럼 **날짜가 박힌** 강제 사항
  - 분류별 기본 등급(§4): known issue·마감 임박 → 🔴 / deprecated·제거 예정·여유 있는 마감일 → 🟠 / breaking change·새 권장 패턴 → 🟡 / minor·patch → ⚪. 실제 영향으로 조정하되 근거를 남긴다.
- **노트를 읽을 때 §3 게이트 재료를 같이 건진다.** 어차피 펼친 노트다 — revert·hotfix 예고·"do not upgrade" 경고·후속 패치 언급은 그 자리에서 메모한다. 나중에 다시 fetch하면 왕복이 두 배다.
- **병렬화**: 1차(registry)는 **메인이 Bash 한 콜로 끝낸다** — 서브에이전트에 위임하지 않는다(위임 이득 없이 왕복 비용만 든다). 2차 노트 fetch와 Track A·C 웹 조회만 `Agent`에게 나눠 동시 실행하고, 메인은 취합·우선순위·리포트를 맡는다.
  - `subagent_type`은 **쓰기 도구가 적은 것**을 고른다: `oh-my-claudecode:document-specialist`(Write·Edit 미보유) → 없으면 `general-purpose`.
  - 단 **쓰기 불가 에이전트는 없다** — Bash만 있어도 리다이렉트로 파일을 쓴다. 도구 선택은 완화책일 뿐이고 **실효 통제는 아래 프롬프트 잠금**이다. 각 서브에이전트 프롬프트에 **반드시** 넣는다.
    - **read-only 못박기**: "`package.json`·네이티브 설정·소스를 수정하지 마라. 파일 수정 도구와 쓰기 명령 금지. 조회 결과만 반환하라."
    - **조회 범위 잠금**: "너는 오직 `<트랙/대상>`만 조회한다. 다른 대상은 무시하라."
    - **반환 형식**: `[대상] 현재 vX → 최신 vY | gap 분류 | 영향 | 관측: <배포일·후속 패치·revert/known issue> | 근거: <링크>` 한 줄씩. 조회 실패·불명확은 `확인 못 함: <대상> — <사유>`로 분리. 근거 링크 없는 최신성 주장은 반환 금지.
    - **판정 금지**: "권장 버전은 Z다"라고 결론 내지 마라 — §3 게이트 해석은 메인 몫이다. 서브에이전트는 **관측 사실만** 올린다. 대상마다 다른 에이전트가 각자 기준을 세우면 리포트의 권장 버전이 서로 다른 잣대로 나온다.

## 3. 권장 버전 산정 — 최신 ≠ 권장

gap이 있는 대상마다 **권장 버전(safe target)** 하나를 확정한다. 정의: `현재 ≤ 권장 ≤ 도달 가능 상한(§0 peer ceiling)` 범위에서 아래 게이트를 **전부** 통과하는 가장 높은 stable. 통과하는 게 하나도 없으면 권장 = 현재(유지)다.

배포일·churn은 registry에 있다 — 웹으로 찾지 마라.

```bash
pnpm info react-native-reanimated time --json \
  | jq -r 'to_entries|map(select(.key|test("^[0-9]+\\.[0-9]+\\.[0-9]+$")))
           |sort_by(.value)|.[-8:]|.[]|"\(.key) \(.value[:10])"'
# 4.3.2 2026-07-04 / 4.5.2 2026-07-16 / 4.5.3 2026-07-22 / 4.3.3 2026-07-23 ...
#   ↑ 시간순, 라인 혼재. 라인 병행 유지(4.3.x·4.4.x·4.5.x)가 보이면 상한이 잠겨도 백포트가 온다는 뜻
date -v-14d +%F   # 컷오프. macOS는 BSD date — GNU `-d`는 없다(쓰면 죽는다)
```

날짜는 ISO라 **문자열 비교로 충분**하다(`"2026-07-23" > "2026-07-17"`). 파싱·산술 하지 마라.

### 게이트 (하나라도 걸리면 그 버전은 권장이 아니다 — 한 단계 내려 다시 건다)

| #   | 게이트             | 판정                                                                                                                                                                             |
| --- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **stable only**    | `-rc`·`-beta`·`-next`·`-canary` 제외. `latest`가 프리릴리즈면(§0 실측 `@tamagui/lucide-icons` `2.0.0-rc.26`) 그 아래 최신 stable이 후보                                          |
| 2   | **major 고정**     | 권장의 상한은 **현재와 같은 major 라인**. major 점프의 비용은 우리 코드에 달렸고 이 스킬은 그걸 모른다 → 권장 버전이 아니라 §4 🟡 항목으로 따로 낸다                             |
| 3   | **soak(숙성)**     | 배포 후 경과일이 minor 14일 · patch 7일 미만이면 이르다. 회귀는 릴리즈 직후에 드러난다 — 미달이면 그 전 stable로 내린다                                                          |
| 4   | **churn 없음**     | 그 버전 직후 며칠 새 패치가 연달아 나왔으면 아직 회귀 사냥 중이다. 마지막 패치가 soak를 채울 때까지 라인 전체 보류                                                               |
| 5   | **known issue 0**  | 노트에 revert·hotfix 예고·"do not upgrade", 이슈 트래커에 **우리가 쓰는 기능**의 크래시 → 고쳐진 버전이 나올 때까지 보류. 우리가 안 쓰는 기능의 이슈는 게이트가 아니다            |
| 6   | **lockstep 동반**  | 짝이 있는 패키지는 세트로만 권장한다(Reanimated↔`react-native-worklets`, `react-native`↔`react`, React Navigation 패키지군). **짝 하나가 걸리면 세트 전체가 걸린 것**            |

- **soak 면제 — 보안 픽스·크래시 픽스.** 안 올리는 쪽이 더 위험한 경우다. 면제했으면 면제라고 쓴다(게이트를 몰래 건너뛰면 다음 실행이 이유를 모른다).
- **권장 = 현재**일 수 있다. "gap은 있지만 지금은 올리지 마라"는 유효한 결론이다 — 대상을 빼지 말고 `권장: 유지(현재)`로 남긴다. 침묵은 "점검 안 함"과 구분되지 않는다.
- **권장 < 최신이면 사유를 반드시 적는다** — 어느 게이트에 걸렸나 + **언제 풀리나**(soak면 해제 날짜, churn·known issue면 기다리는 대상). 사유 없는 하향은 근거 없는 몸사림이고 서두의 환각 금지에 걸린다.
- **등급(§4)과 권장 버전은 별개 축이다.** 🔴이어도 권장이 `유지`일 수 있고(고칠 버전이 아직 없음), ⚪여도 권장 승격이 뜬다(무해한 패치). 등급은 "얼마나 급하냐", 권장 버전은 "뭘로 올리냐" — 섞지 마라.
- Track A(RN 코어)도 같은 게이트를 받는다. RN은 lockstep 반경이 가장 넓다 — RN을 올리면 §0에서 상한에 잠겨 있던 라이브러리들의 권장 버전이 통째로 바뀐다. **RN 권장 버전을 먼저 확정하고 나머지를 그 위에서 계산한다.**
- Track C(플랫폼 정책)에는 권장 버전이 없다 — 버전이 아니라 **날짜**다. §4 🟠의 기한 표기로 대신한다.

## 4. 우선순위 (권고 강도)

게이트가 아니므로 CRITICAL/HIGH가 아니라 "얼마나 급히 손대야 하나"로 등급을 매긴다. 축은 둘 — **반드시 해야 하나**(강제성) × **언제까지**(임박도).

- 🔴 **Urgent** — 이미 손해가 나고 있거나 마감이 임박. 현재 버전의 알려진 크래시/보안, 스토어 `targetSdk` 마감 임박, New Arch 강제 전환 흐름
- 🟠 **Deadline** — 파손이 **확정**됐고 시점만 남음. deprecated·제거 예고, 다음 major에서 사라질 API, 아직 여유 있는 플랫폼 마감일. 지금 손댈 필요는 없지만 **선택지가 아니다** — 기한(날짜 또는 제거 예정 버전)을 반드시 함께 적는다
- 🟡 **Recommended** — 파손 예고 없음. major 신버전(breaking 있으나 이득 큼), 새 권장 패턴으로의 이행
- ⚪ **Optional** — minor/patch, 선택적 편의 기능

🔴·🟠는 "언젠가 반드시", 🟡·⚪는 "임의".

## 5. 리포트 — 포맷 · 저장

**`references/report-format.md`를 Read해서 그대로 따른다.** 조회가 끝난 뒤에만 열면 된다 — 그 전에는 필요 없다. 유일한 쓰기(리포트 파일 1개)의 경로·날짜 규칙도 거기 있다.

## 실행 타이밍

이 스킬이 이미 발동한 뒤라면 불필요하다. **다음 실행 시점을 정할 때만** `references/cadence.md`를 Read한다.

## 실행 원칙

서두 불릿(advisory · 최신≠권장 · 스택 미수정 · 근거 링크 필수)이 정본 — 여기 재진술하지 않는다. 유일한 예외 쓰기는 §5 리포트.

- **프로젝트 결정·컨벤션은 이 스킬의 판단 대상이 아니다**(Rules 소관). 외부 skill 우선순위는 §1에 한 번만 적는다.
- **Expo 관련 제안 금지** — 이 프로젝트는 Expo 미사용. `expo-*` 대안 제시하지 않는다.
- 대상이 많으면 `Agent`로 병렬 분담, 메인은 취합만(AGENTS.md: 조회 3쿼리 이상 예상되면 위임).
