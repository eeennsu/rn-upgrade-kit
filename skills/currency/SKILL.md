---
name: currency
description: RN 스택(코어·주요 라이브러리)이 registry 최신 릴리즈 대비 얼마나 뒤처졌는지 점검하고, 최신과 별개로 안전한 권장 버전(safe target)을 게이트로 산정하는 advisory — gap 리포트만 내고 스택은 고치지 않는다. "RN 최신성", "버전 gap", "권장 버전", "currency"에 사용. 플랫폼 정책 마감은 platform-watch, 업그레이드 실행은 rehearsal 소관이다.
user-invocable: true
argument-hint: [--track core|lib] [--target <pkg>] | platform
allowed-tools: Read Write Glob Bash WebFetch Agent Skill
---

# /currency — RN 스택 최신성 · 권장 버전 산정 (advisory)

혼자 개발하면 놓치기 쉬운 React Native 생태계의 최신 릴리즈를 대신 추적한다. 리포트가 답할 질문은 **"최신이 몇이냐"가 아니라 "지금 뭘로 올려야 하나"**다. 갓 나온 릴리즈는 회귀가 아직 안 드러난 상태다 — 최신을 그대로 권장하면 이 스킬은 **남의 회귀를 우리 앱에 배달하는 파이프**가 된다.

- **advisory 전용.** 아무것도 막지 않는다. 코드·`package.json`·네이티브 설정·`.gitignore`를 수정하지 않는다. 쓰기는 §6 리포트 파일 1개뿐이다.
- **환각 금지 (핵심 제약).** 최신성 주장은 registry 응답 또는 webfetch로 확인한 릴리즈 노트 링크가 근거다. 확인 못 한 항목은 `확인 못 함`으로 분리한다.
- **대상은 목록에서 사라지지 않는다. 자리를 옮길 뿐이다.** §7 degrade 10경로가 전부 이 원칙에서 나온다.
- **플랫폼 정책(Track C)은 이 스킬에 없다.** `platform-watch` 소관이다 — `platform` 인자는 받되 안내만 한다(§5).

## 0. 인자 문법

| 입력 | 해석 |
| --- | --- |
| `platform` (bare) 또는 `--track platform` | §5 범위 안내 후 **종료**. 리포트를 생성하지 않는다 |
| `--track core\|lib` | 트랙 좁히기. **단일값만** 받는다 |
| `--target <pkg>` · bare `<pkg>` | 대상 좁히기. 둘은 같은 뜻이다 |
| `--target <pkg>`가 lockstep 짝의 한쪽 | **세트 전체가 조회 대상**이 된다 — 아래 |
| 유효하지 않은 bare 토큰 | `지정 스코프에 해당 대상 없음` + 유효 값 목록 |

- **기본값은 항상 전체다. 넓히는 방향의 인자는 두지 않는다.**
- 두 인자를 동시에 주면 **AND(교집합)**. 공집합이면 빈 리포트가 아니라 안내문 + 유효 값 목록.
- 제외된 트랙·대상은 조용히 빠지지 않고 `미조회 (사용자 지정 스코프)` 블록에 남는다.
- **`--target`이 lockstep 세트의 한쪽만 가리키면 세트 전체를 조회한다.** 넓히기가 아니다 — §4 게이트 6이 *"짝 하나가 걸리면 세트 전체가 걸린 것"*이라 **짝을 안 보면 게이트 6을 판정할 수 없다.** 인자는 좁히기 전용이되 **lockstep 세트 경계에서 반올림한다.**
- 자동 포함분은 조용히 늘리지 않고 헤더 스코프 줄에 명시한다: `--target react-native-reanimated (+lockstep: react-native-worklets)`.
- **인자는 이 둘로 닫는다.** `--since`·`--format`·`--json`은 범위 밖이다.

## 1. 점검 대상 — 2 트랙

대상 목록은 **`package.json`의 `dependencies` 키에서 산정한다.** 하드코딩하지 않는다 — `dependencies`만 읽으면 devDependencies(eslint·babel·jest·`@types`)가 자동 배제된다.

- **Track A는 `react-native`·`react` 둘로 닫힌다.** Hermes·New Arch는 패키지가 아니라 RN 내장·플래그라 `dependencies`에 없다.
- **나머지 `dependencies` 전부가 Track B다.** 아래 표의 B 열은 **예시이지 목록이 아니다** — "하드코딩하지 않는다"는 건 이 말이다. 새 라이브러리가 들어와도 이 파일을 고칠 일이 없어야 한다.
- `--track`의 유효 값은 `core`·`lib` 둘뿐이다.

| 트랙 | 대상(예시) | 1차 출처 |
| --- | --- | --- |
| **A. RN 코어** | `react-native` · `react` · New Arch(Fabric/Bridgeless/TurboModules/codegen) · Hermes | registry + reactnative.dev/blog · RN GitHub releases · Upgrade Helper |
| **B. 주요 라이브러리** | Reanimated(+`react-native-worklets`) · Gesture Handler · `react-native-svg` · React Navigation · TanStack Query · Zustand · FlashList · LegendList · `@gorhom/bottom-sheet` · Tamagui · screens · safe-area-context · mmkv · keyboard-controller · permissions · Nitro Modules · Sentry · hot-updater | registry + 각 GitHub releases |

- **Track A는 절반만 registry다.** `react-native`·`react`의 버전 숫자는 registry에 그대로 있다 — **이걸 웹으로 다시 찾지 마라.** registry 밖인 건 **서사**뿐이다(그 버전에서 무엇이 강제됐나). Hermes·New Arch는 패키지가 아니라 RN 내장·플래그라 숫자조차 registry에 없다.
- `@react-native/*`는 devDependencies라 대상 밖이고 RN에 lockstep이라 독립 신호가 없다.
- 외부 skill 우선순위와 폴백 URL은 `references/sources.md`에 있다.

## 2. 수집 — 유닉스 유틸 의존 0

| 재료 | 획득 경로 |
| --- | --- |
| 대상 목록 · 선언 범위 | `package.json` **Read** |
| 설치된 정확 버전 | lockfile **Read** (`Glob`으로 4종 중 존재하는 것 탐지) |
| `latest` · dist-tags · 프리릴리즈 여부 | `registry.npmjs.org/-/package/<pkg>/dist-tags` **WebFetch** |
| peer 상한 · `deprecated` | `registry.npmjs.org/<pkg>/<ver>` **WebFetch** |
| 버전 목록 · 배포일 (soak·churn 재료) | **`node -e` 1줄** — 아래 |
| 오늘 날짜 | **컨텍스트 현재 날짜** — `date` 호출 없음 |

### full packument를 WebFetch로 읽지 마라

**절단된다.** 실측(2026-08-09 · `react-native-worklets`): `registry.npmjs.org/<pkg>` 응답에서 최상위 `time` 객체가 통째로 없고 `latest` 버전 엔트리조차 오지 않았다. 인기 패키지는 더 심하다. GitHub releases·tags 페이지는 마크다운 변환에서 목록이 소실되고, `npmjs.com` 버전 탭은 **403**이다.

**WebFetch는 작은 모델이 요약해 돌려준다.** 실측에서 그 모델이 ms 타임스탬프를 1년 5개월 틀리게 변환했다 — **날짜 산술을 요약 모델에 맡기면 틀린다.** 비공식 필드(`_npmOperationalInternal`)도 쓰지 않는다.

### `node -e` — 유일하게 허용되는 Bash 용도

```sh
node -e "fetch('https://registry.npmjs.org/react-native-worklets').then(r=>r.json()).then(d=>{
  const t=d.time;
  Object.keys(d.versions).filter(v=>!/-/.test(v)).slice(-10)
    .forEach(v=>console.log(v, t[v].slice(0,10), d.versions[v].deprecated?'DEPRECATED':''));
})"
```

- **Bash 출력은 원문 그대로 온다** — 요약 모델을 경유하지 않는다. 이게 이 예외의 유일한 근거다.
- **`node`는 새 의존이 아니다** — 대상이 RN 프로젝트이므로 항상 있다. 호스트·PM 무관, Windows Git Bash에서도 돈다.
- **다른 셸 사용은 전부 금지**: `pnpm`·`jq`·`date`·`cat`·`ls`·파이프·리다이렉트. 날짜 비교는 ISO 문자열 비교로 충분하다(`"2026-07-23" > "2026-07-17"`) — 파싱·산술 하지 마라.
- **degrade:** `node -e`가 실패하면 그 대상의 **soak·churn 게이트만** `확인 못 함`으로 두고 나머지 게이트(1·2·5·6)로 산정한다. 대상을 빼지 말고 권장 줄에 `⚠ 숙성 미확인`을 병기한다 — 근거 없이 "충분히 익었다"고 말하지 않는다.
- **degrade — lockfile:** 4종(`pnpm-lock.yaml`·`package-lock.json`·`yarn.lock`·`bun.lock`/`bun.lockb`)이 하나도 없거나 **둘 이상이라 판별 불가**면 설치 버전을 `package.json`의 **선언 범위**로 대체한다. 헤더에 `설치 버전 미확정 (lockfile 없음 / 미지원: <파일명> / 2종 존재)`을 적고, 대상마다 권장 줄에 `⚠ 설치 버전 미확정`을 병기한다. **대상을 리포트에서 빼지 않는다.**
- 선언 범위(`^5.0.2`)는 정확한 설치 버전이 아니다. **gap은 범위 하단 기준으로 보수적으로 잡는다** — 상단으로 잡으면 이미 최신인 것처럼 보여 놓친다. §날짜/버전 판정의 낙관 편향 금지와 같은 방향이다.

### 조회 순서

- **1차 (registry)**: `현재 → 최신 → peer 상한`을 확정한다. 최신 = 현재인 대상은 gap 0이라 2차 대상이 아니다.
- **2차 (릴리즈 노트)**: gap이 있는 대상만, **검색이 아니라 정확한 태그 URL로 직행 fetch**한다. 태그 URL 조립 규칙은 `references/sources.md`. 패치 수준이라 ⚪가 확정된 대상은 생략해도 된다.
- **노트를 읽을 때 §4 게이트 재료를 같이 건진다** — revert·hotfix 예고·"do not upgrade"·후속 패치 언급을 그 자리에서 메모한다. 나중에 다시 fetch하면 왕복이 두 배다.

## 3. 범위 산정 — 게이트보다 먼저

```
하한 = max(현재, 정책 하한)      ← 핸드오프 번역 산물. 없으면 현재
상한 = 도달 가능 상한(peer ceiling)
권장 = [하한, 상한] 안에서 §4 게이트를 전부 통과하는 가장 높은 stable
```

**정책 하한은 게이트가 아니다.** 게이트 6개는 전부 하강 필터인데 하한은 반대 방향 제약이라 7번째로 넣으면 하강 재시도 루프와 충돌한다. **범위 축에 두면 예외가 없다.**

### 하한 > 상한 — `도달 불가`

범위가 공집합이면 `권장: 유지(현재)`와 **구분해서** 말한다. 유지는 "지금은 올리지 마라"는 판단이고 도달 불가는 "판단할 범위가 없다"는 상태다 — 같은 자리에 쓰면 사용자가 마감을 놓친다.

- **상한을 잠근 패키지를 반드시 지목한다.** 지목이 없으면 사용자가 손댈 지점을 모른다.
- 등급은 🔴다. 마감이 있고 경로가 없다.

### 핸드오프 읽기

경로는 `../../shared/constants.md`의 `handoff_path`. **소유자는 `platform-watch`, 독자는 이 스킬. 단방향이다.**

| 상태 | 동작 | 리포트 표기 |
| --- | --- | --- |
| 파일 없음 | 하한 없이 계산 | `플랫폼 하한 미반영 (파일 없음)` |
| `schema_version` 불일치 | 하한 없이 계산 | `플랫폼 하한 미반영 (스키마 불일치)` |
| 파싱됨 (낡음 여부 무관) | 하한 적용 | 헤더에 `핸드오프 <generated>` 병기 |

- **`오래됨`은 상태가 아니다.** 신선도 임계값을 발명하지 마라 — 이 스킬에는 N을 고를 근거가 없다. **정책 하한은 시간이 갈수록 오르기만 하므로 낡은 하한은 과소평가일 뿐이지만, 하한 부재는 마감 자체를 못 본다.** 안 쓰는 쪽이 낙관 편향이다.
- **`stale`이 붙은 항목도 그대로 쓴다.** 헤더에 `(일부 항목 stale)`을 병기한다.
- 어느 경우든 **대상은 리포트에서 사라지지 않는다.** 하한만 빠진다.

### 번역 — 3결과 어휘

정책 요구를 버전 하한으로 옮기는 건 이 스킬 몫이다(재료를 가진 쪽이다). **함정: `targetSdk`는 RN이 아니라 앱 `android/build.gradle`이 정한다** — "정책 요구 → 버전 하한"은 항상 성립하는 함수가 아니다.

| 결과 | 조건 | 리포트 |
| --- | --- | --- |
| ① **하한 있음** | 노트·Upgrade Helper diff가 그 요구를 만족하는 최소 버전을 명시 | 하한 적용 + **근거 링크 필수** |
| ② **하한 불요 (프로젝트 설정 축)** | 요구가 앱 설정 한 줄로 충족 가능 | 범위 불변 + `버전 하한 불요 — <설정 경로> 축` |
| ③ **번역 확인 못 함** | 근거를 못 찾음 | 하한 만들지 않고 ⚠ 블록 |

- **매핑표를 보유하지 않는다.** 보유하면 낡을 수 있고 환각 금지가 낡은 표를 근거로 삼는 걸 막지 못한다. 매 실행 노트를 근거로 단다.
- **②는 정보 부재가 아니라 행동 지시다.** "이건 버전 문제가 아니라 설정 한 줄"은 유용한 결론이다 — ③과 같은 자리에 두면 그 정보를 잃는다.
- ①의 대상은 RN에 한정되지 않는다. 정책 요구가 라이브러리 하한을 만들 수도 있다.

### 임박도는 계산하지 않는다

정책 하한 항목의 🔴/🟠는 **핸드오프 `urgency` 필드에서만** 나온다. `deadline`으로 D-day를 계산하지 마라 — 날짜 축은 `platform-watch` 소관이고 임계일도 그쪽이 소유한다.

| `urgency` | 등급 |
| --- | --- |
| `임박` | 🔴 |
| `여유` | 🟠 |
| `판정 불가` | 등급 축 밖 → ⚠ 블록 `마감 임박도 판정 불가 (platform-watch)` |

## 4. 게이트 6개 — 최신 ≠ 권장

범위 `[하한, 상한]` 안에서 아래를 **전부** 통과하는 가장 높은 stable이 권장이다. 하나라도 걸리면 한 단계 내려 다시 건다. 통과하는 게 없으면 권장 = 현재(유지)다.

| # | 게이트 | 판정 |
| --- | --- | --- |
| 1 | **stable only** | `-rc`·`-beta`·`-next`·`-canary` 제외. **`latest`는 stable 보증이 아니다** — 퍼블리셔가 RC를 `latest`로 태깅하면 그대로 나온다. 프리릴리즈면 그 아래 최신 stable이 후보 |
| 2 | **major 고정** | 권장의 상한은 현재와 같은 major 라인. major 점프의 비용은 우리 코드에 달렸고 이 스킬은 그걸 모른다 → 권장이 아니라 🟡 항목으로 따로 낸다 |
| 3 | **soak(숙성)** | 배포 후 경과일이 `soak_minor_days` · `soak_patch_days` 미만이면 이르다. 미달이면 그 전 stable로 내린다 |
| 4 | **churn 없음** | 그 버전 직후 며칠 새 패치가 연달아 나왔으면 아직 회귀 사냥 중이다. 마지막 패치가 soak를 채울 때까지 **라인 전체 보류** |
| 5 | **known issue 0** | 노트에 revert·hotfix 예고·"do not upgrade", 이슈 트래커에 **우리가 쓰는 기능**의 크래시 → 고쳐진 버전까지 보류. 우리가 안 쓰는 기능의 이슈는 게이트가 아니다 |
| 6 | **lockstep 동반** | 짝이 있는 패키지는 세트로만 권장한다(Reanimated↔`react-native-worklets`, `react-native`↔`react`, React Navigation 패키지군). **짝 하나가 걸리면 세트 전체가 걸린 것** |

- soak 임계값은 `../../shared/constants.md`에서 온다. **본문에 숫자를 적지 마라.**
- **soak 면제 — 보안 픽스·크래시 픽스.** 안 올리는 쪽이 더 위험한 경우다. 면제했으면 면제라고 쓴다 — 몰래 건너뛰면 다음 실행이 이유를 모른다.
- **권장 = 현재일 수 있다.** "gap은 있지만 지금은 올리지 마라"는 유효한 결론이다 — 대상을 빼지 말고 `권장: 유지(현재)`로 남긴다. **침묵은 "점검 안 함"과 구분되지 않는다.**
- **권장 < 최신이면 사유를 반드시 적는다** — 어느 게이트에 걸렸나 + **언제 풀리나**(soak면 해제 날짜, churn·known issue면 기다리는 대상). 사유 없는 하향은 근거 없는 몸사림이고 환각 금지에 걸린다.
- **등급과 권장 버전은 별개 축이다.** 🔴이어도 권장이 `유지`일 수 있고(고칠 버전이 아직 없음) ⚪여도 승격이 뜬다.
- **RN 권장 버전을 먼저 확정하고 나머지를 그 위에서 계산한다.** RN은 lockstep 반경이 가장 넓다 — RN이 오르면 상한에 잠겨 있던 라이브러리들의 권장이 통째로 바뀐다.

### gap 분류 → 기본 등급

| 분류 | 등급 |
| --- | --- |
| known issue (현재 버전의 크래시·보안) | 🔴 |
| 마감 임박 정책 하한 (`urgency: 임박`) | 🔴 |
| deprecated·제거 예정 | 🟠 |
| 여유 있는 정책 하한 (`urgency: 여유`) | 🟠 |
| breaking change (major 신버전) · 새 권장 패턴 | 🟡 |
| minor · patch | ⚪ |

실제 영향으로 조정하되 근거를 남긴다. **등급 어휘는 🔴🟠🟡⚪ 4값, ⚠·✅는 등급이 아니라 블록 표식이다** — 섞지 마라.

## 5. 스냅샷 헤더 · 네이티브 설정

**이 스킬은 네이티브 설정 파싱 규칙을 갖지 않는다.**

| 헤더 필드 | 출처 |
| --- | --- |
| RN · React 버전 | `package.json` + lockfile |
| `targetSdk` · iOS min | **핸드오프 `current` 필드** — 직접 파싱하지 않는다 |
| New Arch · Hermes | `newArchEnabled`·`hermesEnabled` — `Glob`으로 `gradle.properties` 전부 + CI 워크플로 override 탐색 |

- 핸드오프가 없으면 값을 비우지 말고 **사유를 병기한다**: `targetSdk — (핸드오프 없음)`. "읽기 실패"와 "안 읽음"은 구분돼야 한다.
- **읽는 경로는 하나가 아니다.** `Glob`으로 `android/gradle.properties`·`gradle.properties`·flavor별 오버라이드 파일을 전부 찾고, `.github/workflows/*.yml`의 `-PnewArchEnabled`·`ORG_GRADLE_PROJECT_newArchEnabled` 문자열도 본다. **한 경로만 읽으면 충돌이 관측되지 않아 §7 degrade 5가 사문화된다.**
- **런타임 env는 판정 대상이 아니다.** repo 안에서 읽을 수 있는 것만 읽고, 그래서 판정이 안 서면 `확인 못 함`이다 — 못 본 것을 없는 것으로 세지 않는다.
- **boolean 충돌은 "가장 낮은 값" 규칙이 적용되지 않는다.** `newArchEnabled`·`hermesEnabled`가 flavor·CI env로 갈리면 **모두 병기하고 판정은 `확인 못 함`**으로 둔다 — `false`로 가정하면 New Arch 강제 항목을 놓치고 `true`로 가정하면 없는 전제 위에서 권장한다.
- **degrade:** New Arch가 `확인 못 함`이면 New Arch 전제에 걸린 gap 항목을 **등급 축에 올리지 않고 ⚠ 블록으로** 보낸다.
- **"이 프로젝트는 New Architecture 기반"은 전제이고 `gradle.properties`는 관측이다. 전제로 관측을 덮지 마라.**

### `platform` — 범위 안내 (수명 영구)

```
platform 추적은 platform-watch가 담당한다.

  /rn-upgrade-kit:platform-watch

리포트를 생성하지 않았다.
```

- **문구는 범위 안내로 쓴다.** 이관 문구("~로 옮겨졌다")는 언젠가 지울 것처럼 읽혀 유지보수 판단을 흐린다 — 과거 이력이 아니라 현재 구조를 말한다.
- 대상은 마이그레이션이 아니라 **신규 사용자 발견성**이다. `currency`라는 이름 때문에 정책을 여기서 찾는 건 자연스러운 오해다.

## 6. 리포트

**`references/report-format.md`를 Read해서 그대로 따른다.** 조회가 끝난 뒤에만 열면 된다 — 포맷·경로·보존·델타 규칙이 거기 있다.

- **쓰기는 메인만, `Write` 1회.** 서브에이전트는 read-only다.

## 7. degrade — 10경로

| # | 조건 | 결과 | 위치 |
| - | --- | --- | --- |
| 1 | 핸드오프 파일 없음 | 하한 없이 계산 | 헤더 |
| 2 | 핸드오프 스키마 불일치 | 하한 없이 계산 | 헤더 |
| 3 | 번역 근거 없음 | 하한 만들지 않음 | ⚠ 블록 |
| 4 | registry 도달 실패 · 노트 불명확 | `확인 못 함 — <사유>` | ⚠ 블록 |
| 5 | New Arch 플래그 충돌·부재 | 병기 + `확인 못 함`, 관련 gap은 등급 축 밖 | ⚠ 블록 |
| 6 | 범위 공집합 (하한 > 상한) | `산정 불가 — 도달 불가` + 잠근 패키지 지목 | 🔴 |
| 7 | 사용자 스코프 제외 | `미조회 (사용자 지정 스코프)` | 별도 블록 |
| 8 | **직전 리포트 없음** | 델타 줄만 생략, 리포트 정상 산출 | — |
| 9 | `node -e` 실패 (배포일 미확보) | soak·churn만 `확인 못 함` + `⚠ 숙성 미확인` | 제자리 |
| 10 | **lockfile 부재·미지원·2종** | 선언 범위로 대체 + `⚠ 설치 버전 미확정` | 제자리 |

3·4·5는 같은 ⚠ 블록에 가되 **사용자가 할 일로 갈라 적는다**. 7은 할 일이 없으므로 ⚠와 섞지 않는다.

## 8. 병렬화

1차 registry 조회는 대상당 응답 1개이므로 `Agent`에 분담한다. 2차 노트 fetch와 Track A 서사 조회도 분담하고 **메인은 취합·게이트 판정·리포트를 맡는다.**

- `subagent_type`은 **쓰기 도구가 적은 것**을 고른다: `oh-my-claudecode:document-specialist` → 없으면 `general-purpose`.
- **쓰기 불가 에이전트는 없다** — 도구 선택은 완화책일 뿐이고 실효 통제는 프롬프트 잠금이다. 각 서브에이전트 프롬프트에 **반드시** 넣는다:
  - **read-only 못박기**: "`package.json`·네이티브 설정·소스를 수정하지 마라. 파일 수정 도구와 쓰기 명령 금지. 조회 결과만 반환하라."
  - **조회 범위 잠금**: "너는 오직 `<대상>`만 조회한다. 다른 대상은 무시하라."
  - **반환 형식**: `[대상] 현재 vX → 최신 vY | gap 분류 | 영향 | 관측: <배포일·후속 패치·revert/known issue> | 근거: <링크>` 한 줄씩. 실패·불명확은 `확인 못 함: <대상> — <사유>`로 분리. **근거 링크 없는 최신성 주장은 반환 금지.**
  - **판정 금지**: "권장 버전은 Z다"라고 결론 내지 마라 — 게이트 해석은 메인 몫이다. **대상마다 다른 에이전트가 각자 기준을 세우면 리포트의 권장 버전이 서로 다른 잣대로 나온다.**

## 실행 원칙

서두 불릿(advisory · 최신≠권장 · 환각 금지 · 대상 미소멸)이 정본 — 여기 재진술하지 않는다. 유일한 예외 쓰기는 §6 리포트.

- **웹 검색을 쓰지 않는다.** `allowed-tools`에 `WebSearch`가 없다 — "최신이 몇이냐"를 검색으로 찾지 않는다는 규칙을 도구 목록으로 강제한다. 릴리즈 노트 URL이 죽으면 대안 검색 대신 `확인 못 함`으로 간다.
- **Expo 관련 제안 금지** — 이 프로젝트는 Expo 미사용. `expo-*` 대안을 제시하지 않는다.
- **프로젝트 결정·컨벤션은 이 스킬의 판단 대상이 아니다.**
- 다음 실행 시점을 정할 때만 `references/cadence.md`를 Read한다.
