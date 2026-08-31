# 수정 계약 — 실행 검증 발견 10건 (2026-08-31)

`docs/exec-verification-2026-08-31.md`가 낸 F-1~F-10을 닫는 작업의 계약이다.
**착수 전에 고정했고, 작업 중에 완화하지 않는다.** 완화가 필요하면 그 사실을 이 파일에 적고 사유를 남긴다.

---

## 1. 의도와 범위

### 의도

**스킬이 자기가 막겠다고 선언한 실패 모드를 실제로 막게 만든다.** 기능 추가가 아니다.
F-9는 「거짓 통과 방지」를, F-4는 「짝 하나만 올리는 사고 방지」를 스킬 자신이 어긴 경우다 —
새 계약을 세우는 게 아니라 **이미 선언된 계약을 집행 가능하게** 만든다.

### 범위 안

| 대상 | 사유 |
| --- | --- |
| `skills/rehearsal/SKILL.md` | F-1·F-2·F-3·F-5·F-6·F-7·F-8·F-9·F-10 |
| `skills/rehearsal/references/report-format.md` | 헤더 고정 줄 신설 (F-5·F-7) |
| `shared/lockstep-sets.md` | F-4 |
| `shared/constants.md` | F-10 |
| `.omc/specs/deep-interview-rn-rehearsal.md` | 위 변경의 **판정 기준**이므로 같은 방향으로 동시 수정 |
| `docs/audit-ledger.md` | 원장 반영 (append-only) |

### 범위 밖 — 손대지 않는다

- **`platform-watch`·`currency` 스킬 본문.** `shared/lockstep-sets.md`는 단일 정본이라
  `currency` 게이트 6은 파일만 다시 읽으면 자동으로 새 세트를 본다. 양쪽에 적으면 드리프트가 생긴다 —
  그 파일이 존재하는 이유가 그것이다. **단, 파급이 실제로 없는지는 통과조건 P-11로 확인한다.**
- **판정 어휘 3값(통과·실패·미실행)**. 어떤 수정도 4번째 어휘를 만들지 않는다.
- **새 인자.** `--platform` 외 인자를 늘리지 않는다. 이 플러그인의 인자는 좁히기 전용이다.
- **T2/ios·T3·§6 채택 경로의 신규 설계.** 이번 실행이 도달하지 못한 구간이라 관측이 없다.
  관측 없이 고치면 이 문서가 비판한 것과 같은 짓이다.
- **woka_app 레포.** 읽기만 한다. 어떤 파일도 쓰지 않는다.

---

## 2. 근거 형식

주장 1건당 아래 둘 중 **하나 이상**을 붙인다. 없으면 그 주장은 리포트에 싣지 않는다.

| 종류 | 형식 |
| --- | --- |
| 정적 근거 | `파일:라인` + 그 줄의 인용. 라인은 **수정 후 트리 기준**으로 다시 맞춘다 |
| 실행 근거 | 실제 실행한 커맨드 1줄 + 출력 발췌. 발췌는 **원문 그대로**, 요약 금지 |

- **환각 금지.** 돌리지 않은 커맨드를 근거로 쓰지 않는다. 미실행은 `미검증`으로 분리해 적는다.
- **부분 통과를 통과로 접지 않는다.** 통과조건이 2개면 2개 다 증거가 있어야 한다.
- 이 repo의 기존 원장(`docs/audit-ledger.md`)이 쓰는 `file:line` 인용 관례를 따른다.

---

## 3. 통과조건

각 항목은 **기계로 확인 가능**해야 한다. "고쳤다"는 통과 근거가 아니다.

### 정적 통과조건 (수정 결과물에 대한 검사)

| # | 조건 | 확인 방법 |
| --- | --- | --- |
| P-1 | §2 베이스라인 절에 **install 실패 처리**가 있고, 실패 시 T1을 통과로 만들지 않는다 | `SKILL.md` §2 인용 |
| P-2 | 베이스라인 되돌림 설치 커맨드가 PM 4종별로 정의돼 있고 **`--frozen-lockfile`이 아니다** | `SKILL.md` §2 표 인용 |
| P-3 | 베이스라인 측정 후 **업그레이드 복원 단계**가 명시돼 있다 | `SKILL.md` §2 인용 |
| P-4 | `shared/lockstep-sets.md` 확정 세트에 **RN 툴체인** 행이 있다 | 파일 인용 |
| P-5 | §1 T1 정의에 **버전 세트 적용** 단계가 있고, §2에 PM별 적용 커맨드가 있다 | `SKILL.md` §1·§2 인용 |
| P-6 | §0에 **커밋 외 파일** 절이 있고, `report-format.md` 헤더에 고정 줄이 등록됐다 | 두 파일 인용 |
| P-7 | §1 단계 타임아웃에 **강제 래퍼**가 명시돼 있다 | `SKILL.md` §1 인용 |
| P-8 | §0 dirty 거부 문구에 **우회 안내**가 있다 | `SKILL.md` §0 인용 |
| P-9 | §0에 **격리 누수** 탐지가 있고 헤더 줄이 등록됐다 | 두 파일 인용 |
| P-10 | 패치 개수의 **분모**가 정의됐고, 전체 실행 상한이 정의되거나 **부재가 명시 선언**됐다 | `SKILL.md` §2·§1 인용 |
| P-11 | 위 변경이 `currency`·`platform-watch` 본문 수정 없이 성립한다 | `git diff --stat`에 두 스킬 본문 없음 |
| P-12 | 스펙 `.omc/specs/deep-interview-rn-rehearsal.md`가 같은 방향으로 갱신됐다 | 스펙 정정 블록 인용 |
| P-13 | **`SKILL.md`와 `shared/*`만 읽고** 리허설 전 절차를 커맨드까지 특정할 수 있다 (`references/*`의 «예시»에 의존하지 않는다) | 절차 재구성 후 대조 |

### 실행 통과조건 (재실행으로 확인)

동일 조건 재실행: `woka_app` @ `v2.0.5` (`b768f6eb8d5362b3746bf2461b26271b57fa0997`) 클린 clone.

| # | 조건 | 확인 방법 |
| --- | --- | --- |
| R-1 | `react-native@0.85.3 react@19.2.8`만 인자로 주면 **인자 검증 3이 거부**한다 (`@react-native/*` 짝 누락) | 실행 로그 |
| R-2 | 짝을 채운 완전 세트로는 인자 검증 3을 **통과**한다 | 실행 로그 |
| R-3 | 베이스라인 install이 실패하는 상황을 재현했을 때 **T1이 통과로 나오지 않는다** | 실행 로그 |
| R-4 | 수정된 절차로 베이스라인이 **정상 측정**되고 진짜 델타(신규 2 / 기존 15)를 낸다 | 실행 로그 |
| R-5 | 리포트 헤더에 `커밋 외 파일` · `격리 누수` 줄이 실제로 실린다 | 생성된 리포트 |
| R-6 | 완전 세트로 T2/android가 **F-4의 실패(`hermes-android:0.85.3` 미해결)를 더 이상 내지 않는다** | 빌드 로그 |

> **R-6은 「빌드 성공」이 아니다.** 그 프로젝트가 다른 이유로 실패할 수 있고 그건 이 수정의 책임이 아니다.
> 조건은 **`Could not find com.facebook.react:hermes-android:0.85.3`가 사라지는 것** 하나다.

---

## 4. 종료조건

아래 넷을 **전부** 만족할 때 종료한다. 하나라도 미달이면 계속한다.

1. **P-1~P-13 전부 충족.** 각각 근거 형식 §2를 만족하는 인용이 붙어 있다.
2. **R-1~R-6 전부 충족.** 각각 실행 로그 발췌가 붙어 있다.
3. **수정이 만든 신규 모순 0.** 수정 후 트리에서 아래를 재대조한다:
   - `SKILL.md` ↔ `.omc/specs/deep-interview-rn-rehearsal.md` Acceptance Criteria
   - `SKILL.md` ↔ `references/report-format.md` ↔ `references/log-patterns.md`의 상호 참조
   - `shared/constants.md` 키 ↔ 소비자 표기
   - 원장 `docs/audit-ledger.md`의 `file:line` 좌표 (수정으로 밀린 것 재정렬)
4. **미검증 축을 명시적으로 적었다.** 이번에도 닫지 못한 것(T2/ios·T3·§6 채택·PM 3종)을
   종료 리포트가 «보증하지 않는 축»으로 싣는다. **닫은 것처럼 적지 않는다.**

### 종료조건이 아닌 것

- **"10건 다 손댔다"** — 손댄 것과 통과조건 충족은 다르다.
- **"빌드가 성공했다"** — R-6 참조. 이 수정의 범위는 게이트지 그 프로젝트의 업그레이드 성공이 아니다.
- **독립 리뷰어 서명** — 이번 세션에서는 못 받는다(서브에이전트 미사용). 그 사실을 종료 리포트에 적고,
  **「무서명」으로 남긴다.** 원장의 2026-08-29 후속 절과 같은 처분이다.

---

## 5. 진행 중 발견에 대한 처분

수정 도중 새 결함이 나오면:

- **범위 안(rehearsal 축)이면** 번호를 F-11부터 이어 붙이고 통과조건을 추가한 뒤 닫는다.
- **범위 밖이면** 이 파일 말미에 적고 **닫지 않는다.** 범위를 조용히 넓히지 않는다.

---

# 집행 결과 (같은 날 · 계약 고정 후 집행)

## 정적 통과조건 — 13/13 충족

| # | 근거 (수정 후 트리 기준) |
| --- | --- |
| P-1 | `skills/rehearsal/SKILL.md:233` — *"되돌림을 검증한다 — exit code를 믿지 마라 … 델타를 계산하지 않고 `베이스라인: 미측정 (되돌림 실패: <사유>)` … T1 판정은 실패 그대로 둔다"* |
| P-2 | `skills/rehearsal/SKILL.md:224-231` — 되돌림 설치 표 (pnpm `--no-frozen-lockfile` / npm `npm install` / yarn `--no-immutable` / bun `bun install`) |
| P-3 | `skills/rehearsal/SKILL.md:235` — §2-6 «복원» + 복원 실패 시 `미실행 (베이스라인 복원 실패로 중단)` (`:133` 표기 등재) |
| P-4 | `shared/lockstep-sets.md:11` — RN 코어 = `react-native` · `react` · `@react-native/*` 전체 (+`:17` CLI 제외 근거) |
| P-5 | `skills/rehearsal/SKILL.md:115`(T1 정의) · `:190-196`(PM 표 「버전 세트 적용」 열) |
| P-6 | `skills/rehearsal/SKILL.md:88-102` «커밋 외 파일 · 격리 누수» · `references/report-format.md:111`(헤더 **항상** 줄) |
| P-7 | `skills/rehearsal/SKILL.md:169` — `perl -e 'alarm shift; exec @ARGV' <초> <커맨드>` |
| P-8 | `skills/rehearsal/SKILL.md:79` — 거부 출력 우회 안내 고정 문구 |
| P-9 | `skills/rehearsal/SKILL.md:88-102` · `references/report-format.md:117` |
| P-10 | `skills/rehearsal/SKILL.md:216`(분모 = PM 등록분) · `:170`(전체 상한 부재 명시 선언) · `references/report-format.md:118` |
| P-11 | `git diff --stat` = `.omc/specs/deep-interview-rn-rehearsal.md` · `shared/lockstep-sets.md` · `skills/rehearsal/SKILL.md` · `skills/rehearsal/references/report-format.md` 4파일 — currency·platform-watch 본문 0건 |
| P-12 | 스펙 `:207`·`:229` 정정 블록 · `:574` AC 11항 신설 · `:699` «실행 검증 반영 — 2026-08-31» |
| P-13 | 재실행이 `SKILL.md`+`shared/*`의 규범 문장만으로 커맨드를 특정해 진행됐다 — 아래 R-1~R-6의 커맨드 전부가 §0·§1·§2 본문에 있다 |

## 실행 통과조건 — 6/6 충족 (woka_app clone @ b768f6eb8)

| # | 실행 근거 (발췌 원문) |
| --- | --- |
| R-1 | 코어 2종 인자 → `실행 거부 — lockstep 짝 누락: @react-native/babel-preset @react-native/codegen @react-native/eslint-config @react-native/gradle-plugin @react-native/metro-config` (exit=1) |
| R-2 | 완전 세트 7종 → `인자 검증 3 통과` (exit=0) · registry 존재 5/5 = 200 |
| R-3 | frozen 되돌림 재현: `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` (exit=1) → 신설 §2-4 검증이 `react-native = 0.85.3 ≠ 기대 0.81.1`로 되돌림 실패 감지 → 델타 미계산 · T1 실패 유지 |
| R-4 | `--no-frozen-lockfile` 되돌림 → `react-native = 0.81.1` ✓ → 델타 `신규 2 / 기존 15` (신규 = `ClusterMarker.{android,ios}.tsx` TS2551 `absoluteFillObject`) |
| R-5 | 리포트 헤더에 `커밋 외 파일: 없음`(하니스 주석 병기) · `격리 누수: pnpm-workspace.yaml 3건` 실림 — `scratchpad/woka_app/.rn-upgrade-kit/rehearsal/reports/2026-08-31-0.85.3.md` |
| R-6 | 완전 세트 `./gradlew assembleDebug` → `Could not find com.facebook.react:hermes-android:0.85.3` **0건** (grep -c = 0). 빌드 242s·893태스크 진행 후 `:app:validateSigningDebug`에서 keystore 부재(gitignored `config/`)로 실패 — F-4와 무관한 F-7 시나리오의 실측이며, 수정된 커밋 외 파일 병기 규칙이 이 실패를 오분류에서 가른다 |

## 종료조건 판정

1. P-1~P-13 전부 충족 — 위 표. **충족**
2. R-1~R-6 전부 충족 — 위 표. **충족**
3. 신규 모순 재대조 — 신설 문구 4종(`되돌림 실패`·`베이스라인 복원 실패로 중단`·`커밋 외 파일:`·`격리 누수:`·`미등록 패치:`)이 SKILL·report-format·스펙 3자 일치. lockstep 구성원 열거가 다른 스킬·스펙에 0건(파급 없음). `shared/constants.md` 무변경·신규 상수 참조 0건. 원장 좌표 — 이번 수정으로 밀린 rehearsal 계열 `file:line` 23곳을 현재 트리 기준으로 재정렬하고 전수 실측(부적중 0). **충족**
4. 미검증 축 명시 — 아래. **충족**

**종료.**

## 보증하지 않는 축

- **T2/ios · T3 · §6 채택 경로** — 이번에도 미도달 (T1 실패 fail-fast). `log-patterns.md` 전체·채택 게이트·부팅 판정은 여전히 실행 관측 0이다.
- **커밋 외 파일 검사의 실사용 출력** — 클린 clone에는 gitignored 파일이 없어 `없음`이 나왔다. 실제 woka_app 트리에 같은 커맨드를 돌려 목록이 나오는 것(.env·config/ 등)은 확인했지만, **스킬 전체 흐름 안에서** 그 목록이 헤더에 실리는 것은 실사용 실행에서만 확인된다.
- **npm·yarn·bun 경로** — pnpm만 실측. 되돌림 설치 커맨드 3종(`npm install`·`yarn install --no-immutable`·`bun install`)은 문서 근거이지 실행 근거가 아니다.
- **독립 리뷰어 서명 없음.** 이 집행 결과는 집행자 자신의 검증이다 — 원장 2026-08-29 후속과 같은 «무서명» 처분. 다음 감사가 열리면 이 수정의 파급부터 훑는 게 맞다.
