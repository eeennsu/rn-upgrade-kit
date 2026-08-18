# 감사 원장 — rn-upgrade-kit

**append-only.** 한 번 판정된 항목은 재발견하지 않는다. 새 라운드는 아래에 덧붙인다.

판정 기준(이것 밖은 개선사항이 아니다): `.omc/specs/*.md` · `CLAUDE.md` · `seed/rn-currency-SKILL.md` · `shared/constants.md` · `shared/lockstep-sets.md`.
**스펙 인용을 못 붙이는 건은 폐기한다** — 취향 문제이고 원장에 남기지 않는다.

| 상태 | 뜻 |
| --- | --- |
| `CLOSED` | 수정이 반영됐고 현재 트리에서 확인됨 |
| `REJECTED` | 재검증에서 오진으로 판정 — 고칠 것이 없음 |
| `OPEN` | 발견됐으나 아직 미반영 |
| `WONTFIX` | 유효하나 구조적으로 못 고침 — 사유 병기 |

---

## 라운드 0 — `docs/audit-2026-08-12.md` 15건 재검증

**새로 찾지 않고 기존 15건만 갈랐다.** 각 건의 근거 file:line은 **현재 트리 기준**이다(감사 문서의 옛 줄 번호가 아니다).

결과: **CLOSED 14 · REJECTED 1**(#8은 전제가 기각됐고 그 자리를 다른 수정이 메웠으므로 CLOSED로도 계산되나, 원 진단 자체는 REJECTED로 남긴다).

| id | 원 감사 # | 항목 | 상태 | 구현 근거 (현재 트리) | 스펙 근거 |
| --- | --- | --- | --- | --- | --- |
| A-01 | 1 | 보존 자동 정리가 도구상 불가능 | CLOSED | `skills/platform-watch/references/report-format.md:13-16` *"초과분을 지우지 않는다 — 보고만 한다"* · `skills/currency/references/report-format.md:11-15` | `.omc/specs/deep-interview-platform-watch.md:329` *"초과분을 지우지 않는다 — 보고만 한다 … 없는 수단의 실행 결과를 리포트에 적으면 그게 환각"* · `deep-interview-currency.md:442` |
| A-02 | 2 | `shared/constants.md` 도달 실패에 degrade 없음 | CLOSED | `shared/constants.md:5-11` «이 파일에 도달하는 법» · `skills/currency/SKILL.md:258`(degrade 12) · `skills/platform-watch/SKILL.md:132`(degrade 8) · `skills/rehearsal/SKILL.md:332`(degrade 1) | `.omc/specs/plugin-shell.md:56-60` *"첫 Read 실패 시 `Glob` 폴백, 둘 다 실패하면 숫자를 지어내지 말고 … degrade"* |
| A-03 | 3 | `watch-targets.md`가 자기 스키마 규칙을 위반 | CLOSED (진단 정정) | `skills/platform-watch/references/watch-targets.md:14-15`(`교차`·`실측` 필드) · `:19-39`(독립성 3단계) | `.omc/specs/deep-interview-platform-watch.md:188-201` *"요건을 3단계로 가르고 `없음`을 허용한다"* · AC `:550-551` |
| A-04 | 4 | `node -e` PowerShell 인용 · 조용한 열화 | CLOSED (인용 진단은 기각) | `skills/currency/SKILL.md:91-92`(실측 기록) · `:98-99`(전면 실패 헤더 고정 문구) | `.omc/specs/deep-interview-currency.md:490` *"11이 9와 별도 행인 이유는 게이트 2개가 통째로 죽은 리포트가 정상 리포트와 겉보기에 같아지는 자리가 거기라서다"* |
| A-05 | 5 | rehearsal에 base 선택·dirty tree 처리 없음 | CLOSED | `skills/rehearsal/SKILL.md:64-85` «작업 트리 검증» | `.omc/specs/deep-interview-rn-rehearsal.md:653-655` «`base_sha` 정의»·«dirty tree 처리» · AC `:547-549` |
| A-06 | 6 | WebFetch 신뢰 모델이 두 스킬에서 반대 | CLOSED | `skills/rehearsal/SKILL.md:39`(검사 1 = `node -e`) · `:45-56` | `.omc/specs/deep-interview-rn-rehearsal.md:657` «인자 검증 1을 `node -e`로» · AC `:493` |
| A-07 | 7 | 좁힌 첫 실행의 핸드오프 필드 부재가 미정의 | CLOSED | `skills/platform-watch/references/report-format.md:140-146`(enum 전수 + 고정 표기) · `:159-162` · `skills/currency/SKILL.md:137`·`:141` | `.omc/specs/deep-interview-platform-watch.md:304-306` · AC `:609-610` |
| A-08 | 8 | `allowed-tools` 구분자가 규격과 다를 가능성 | REJECTED (전제 기각) → 대체 수정 CLOSED | `skills/platform-watch/SKILL.md:7` `disallowed-tools: Bash Edit` · `skills/currency/SKILL.md:7` `disallowed-tools: WebSearch Edit` | `.omc/specs/plugin-shell.md:193` *"구분자는 공백·콤마·YAML 리스트 전부 유효 … 우려는 기각. 대신 그 필드는 원래 아무것도 막지 않는다"* |
| A-09 | 9 | lockstep 세트 하드코딩 | CLOSED | `shared/lockstep-sets.md`(전체) · `skills/currency/SKILL.md:182`·`:185-187` · `skills/rehearsal/SKILL.md:41`·`:58-62` | `.omc/specs/plugin-shell.md:49-54` «`shared/lockstep-sets.md` — 두 번째 공유물» |
| A-10 | 10 | rehearsal 환경 전제 검증·타임아웃 부재 | CLOSED | `skills/rehearsal/SKILL.md:124-136`(탐지 규칙 표) · `:138-152`(단계 타임아웃) · `shared/constants.md:29-32` | `.omc/specs/deep-interview-rn-rehearsal.md:661`·`:663` · AC `:554-557` |
| A-11 | 11 | 채택 게이트 3이 사후 감사 불가능 | CLOSED | `skills/rehearsal/SKILL.md:283-288` · `skills/rehearsal/references/report-format.md:110`·`:166-181` | `.omc/specs/deep-interview-rn-rehearsal.md:665` «베이스라인 필드» · AC `:550-551` |
| A-12 | 12 | worktree 경로가 하드코딩 | CLOSED | `shared/constants.md:28` `worktree_path_template` · `skills/rehearsal/SKILL.md:245` · `:250-260`(기존 디렉토리 처리) | `.omc/specs/deep-interview-rn-rehearsal.md:667`·`:669` · AC `:552-553` |
| A-13 | 13 | T3 스크린샷 수집 방법 미정의 | CLOSED | `skills/rehearsal/SKILL.md:228-239` · `skills/rehearsal/references/log-patterns.md:61-66` | `.omc/specs/deep-interview-rn-rehearsal.md:671` «T3 스크린샷 수집 방법» · AC `:559-560` |
| A-14 | 14 | 산출물 쓰기 실패 degrade 부재 | CLOSED | `skills/platform-watch/SKILL.md:114`(쓰기 순서)·`:133`(degrade 9) · `skills/currency/SKILL.md:264`(degrade 18) · `skills/rehearsal/SKILL.md:348-359` | `.omc/specs/deep-interview-platform-watch.md:325` · `deep-interview-rn-rehearsal.md:673` |
| A-15 | 15 | monorepo·프로토콜 버전 미처리 | CLOSED | `skills/currency/SKILL.md:54-66`(정본 `package.json` 선택) · `:261-263`(degrade 15·16·17) | `.omc/specs/deep-interview-currency.md:490` *"구현의 degrade 표는 이제 18경로다 … `package.json` 2개 이상(15) · `workspace:*`·`catalog:`(16) · `latest` 부재(17)"* |

**라운드 0 결론:** 15건 전부 처리 완료 상태다. 재발견 금지 목록에 들어간다.

---

## 라운드 1 — `.omc/specs/*` ↔ `skills/**` 전수 대조

라운드 0에서 판정된 15건을 제외하고 새로 찾았다. 대조 대상: `skills/*/SKILL.md` 3개 + `skills/*/references/*.md` 8개 + `shared/*.md` 2개, 스펙 4개의 본문·Acceptance Criteria 전수.

**폐기한 것(원장에 남기지 않음):** `rehearsal`에 `disallowed-tools`가 없다 / README 호스트 절 문구가 스펙 «고정 문구»의 확장판이다 / 재현 블록 예시의 `/tmp/...` 리터럴 / `핸드오프: … (일부 항목 stale 없음)` 표현 — **넷 다 스펙 인용을 못 붙였다.** 앞 둘은 스펙이 요구하지 않고, 뒤 둘은 스펙 자신이 같은 형태를 쓴다.

| id | 항목 | 상태 | 구현 근거 | 스펙 근거 |
| --- | --- | --- | --- | --- |
| A-16 | **`이중화 없음` 병기 규칙이 리포트 포맷 정본에 없고, 예시가 반례다** | CLOSED | 규칙이 `skills/platform-watch/references/watch-targets.md:37`·`:58`에만 있고 리포트 정본(`references/report-format.md`)에 없었다. 같은 파일 `:59` 예시가 `android/16kb-page-size`(= 2차 `없음` 항목)를 병기 없이 ✅ 블록에 실었다 — 포맷 정본의 예시가 규칙의 반례였다 | `.omc/specs/deep-interview-platform-watch.md:197` *"✖ 없음 … `없음 (<사유>)` + 리포트에 `이중화 없음` 병기"* · AC `:552` *"2차가 `없음`인 항목은 리포트에 `이중화 없음`이 병기된다"* |
| A-17 | **`currency`가 핸드오프 `schema_version`을 무엇과 비교하는지 명시가 없다** | CLOSED | `skills/currency/SKILL.md:136`(수정 전 `:134`)이 *"`schema_version` 불일치"* degrade만 정의하고 비교 대상 값의 출처를 어디에서도 지목하지 않았다. `shared/constants.md`를 Read하라는 지시는 `handoff_path`(`:129`)와 soak 임계값(`:184`)에만 붙어 있었다 — `handoff_schema_version`은 이름조차 등장하지 않는다 | `.omc/specs/deep-interview-currency.md` AC `:611` *"핸드오프 `schema_version`이 `shared/constants.md`의 값과 다르면 `스키마 불일치` degrade로 간다"* · `shared/constants.md:18`이 소비자를 *"currency(검증)"*로 지목 |
| A-18 | **`url_candidate_limit`을 어디서 읽는지 지시가 없다** | CLOSED | `skills/platform-watch/SKILL.md:60`이 `상한 = url_candidate_limit`이라고만 적고 파일 경로를 안 준다. 같은 파일 `:98`은 `grade_threshold_days`에 `../../shared/constants.md`를 붙였고 `enum_promotion_min_count`는 `references/report-format.md:108`이 경로를 준다 — **셋 중 이것만 어느 파일에서도 경로가 없었다** | `.omc/specs/plugin-shell.md:45` *"스킬 본문에서 상대 경로로 참조한다: `../../shared/constants.md`"* · `:47` *"하드코딩 금지 대상: 아래 표의 모든 값. 스킬 본문에 숫자를 적지 않고 이 파일을 Read한다"* (표에 `url_candidate_limit` 포함 — `:77`) |
| A-19 | **`plugin-shell.md` §2 «키 정본»에 `enum_promotion_min_count`가 없다** | CLOSED | `shared/constants.md:27`이 그 키를 정의하고 `skills/platform-watch/SKILL.md:42`·`references/report-format.md:108`이 소비하는데, **키 정본이라고 선언한 표에 그 행이 없었다**(15행 vs 실제 16키) | `.omc/specs/plugin-shell.md:64` *"§2 `shared/constants.md` — 키 정본"* · `:86` *"값 변경은 이 파일 한 곳에서만"* vs `.omc/specs/deep-interview-platform-watch.md:714` *"`seen_count` ≥ `enum_promotion_min_count`(`shared/constants.md` · 기본 2)"* |
| A-20 | **`plugin-shell.md` §1 디렉터리 레이아웃이 실제 파일 구성과 다르다** | CLOSED | 실제 트리에는 `skills/platform-watch/references/{report-format.md,cadence.md}`와 `skills/rehearsal/references/report-format.md`가 있는데 레이아웃에 없었다. 구현이 아니라 스펙이 낡은 쪽이다 — 두 파일 다 다른 스펙이 요구한다 | `.omc/specs/deep-interview-platform-watch.md:706` *"실행 케이던스 안내 (`references/cadence.md` — seed와 동형)"* · `deep-interview-rn-rehearsal.md:597` *"로그 스캔 패턴 목록의 정본 위치 (`references/log-patterns.md` 권장)"* · `:594`(리포트 경로 규칙) |

**A-19·A-20은 스펙 쪽을 고쳤다.** 구현이 옳고 `plugin-shell.md`가 뒤처진 경우다 — 스펙을 정본이라 부르면서 구현에 맞추는 건 순환이지만, 두 건 다 **다른 스펙 파일이 구현 쪽을 요구한 것**이라 `plugin-shell.md`가 형제 스펙과 어긋나 있던 상태다. 판단 근거는 구현이 아니라 형제 스펙이다.

---

## 라운드 2 — 신규 발견 0

라운드 1의 5건 반영 후 재대조. **스펙 인용 가능한 신규 발견 0건** → 종료 조건 충족.

- 재검증한 축: A-16~A-20의 반영 지점 + 그 수정이 건드린 파일의 인접 규칙(리포트 4블록·상수 참조 경로·`plugin-shell.md` §1/§2).
- 라운드 0·1에서 판정된 20건은 재발견 대상에서 제외했다.

---

## 종료

- **라운드 수:** 3 (0·1·2) — 최대 5 미도달
- **총 발견:** 20건 (라운드 0 재검증 15 · 라운드 1 신규 5)
- **반영:** CLOSED 19 · REJECTED 1(A-08 — 원 진단의 전제가 기각됐고 대체 수정이 들어갔다)
- **미해결 잔여:** 없음

### 이 원장이 덮지 못하는 것

- **실행 검증 0.** 전부 명세 대조다. `rehearsal`은 실제 RN 프로젝트에서 한 번도 돌지 않았고, 이번 라운드도 그 사실을 바꾸지 않는다.
- **URL 재실측 없음.** `watch-targets.md`의 `실측` 필드는 2026-08-18 값 그대로다.
