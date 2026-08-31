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
| A-01 | 1 | 보존 자동 정리가 도구상 불가능 | CLOSED | `skills/platform-watch/references/report-format.md:13-16` *"초과분을 지우지 않는다 — 보고만 한다"* · `skills/currency/references/report-format.md:11-15` | `.omc/specs/deep-interview-platform-watch.md:329` *"초과분을 지우지 않는다 — 보고만 한다 … 없는 수단의 실행 결과를 리포트에 적으면 그게 환각"* · `deep-interview-currency.md:445` |
| A-02 | 2 | `shared/constants.md` 도달 실패에 degrade 없음 | CLOSED | `shared/constants.md:5-11` «이 파일에 도달하는 법» · `skills/currency/SKILL.md:260`(degrade 12) · `skills/platform-watch/SKILL.md:132`(degrade 8) · `skills/rehearsal/SKILL.md:372`(degrade 1) | `.omc/specs/plugin-shell.md:56-60` *"첫 Read 실패 시 `Glob` 폴백, 둘 다 실패하면 숫자를 지어내지 말고 … degrade"* |
| A-03 | 3 | `watch-targets.md`가 자기 스키마 규칙을 위반 | CLOSED (진단 정정) | `skills/platform-watch/references/watch-targets.md:14-15`(`교차`·`실측` 필드) · `:19-39`(독립성 3단계) | `.omc/specs/deep-interview-platform-watch.md:188-201` *"요건을 3단계로 가르고 `없음`을 허용한다"* · AC `:552-553` |
| A-04 | 4 | `node -e` PowerShell 인용 · 조용한 열화 | CLOSED (인용 진단은 기각) | `skills/currency/SKILL.md:91-92`(실측 기록) · `:98-99`(전면 실패 헤더 고정 문구) | `.omc/specs/deep-interview-currency.md:493` *"11이 9와 별도 행인 이유는 게이트 2개가 통째로 죽은 리포트가 정상 리포트와 겉보기에 같아지는 자리가 거기라서다"* |
| A-05 | 5 | rehearsal에 base 선택·dirty tree 처리 없음 | CLOSED | `skills/rehearsal/SKILL.md:64-86` «작업 트리 검증» | `.omc/specs/deep-interview-rn-rehearsal.md:675-677` «`base_sha` 정의»·«dirty tree 처리» · AC `:547-549` |
| A-06 | 6 | WebFetch 신뢰 모델이 두 스킬에서 반대 | CLOSED | `skills/rehearsal/SKILL.md:39`(검사 1 = `node -e`) · `:45-56` | `.omc/specs/deep-interview-rn-rehearsal.md:679` «인자 검증 1을 `node -e`로» · AC `:493` |
| A-07 | 7 | 좁힌 첫 실행의 핸드오프 필드 부재가 미정의 | CLOSED | `skills/platform-watch/references/report-format.md:145-151`(enum 전수 + 고정 표기) · `:173-176` · `skills/currency/SKILL.md:138`·`:142` | `.omc/specs/deep-interview-platform-watch.md:304-306` · AC `:611-612` |
| A-08 | 8 | `allowed-tools` 구분자가 규격과 다를 가능성 | REJECTED (전제 기각) → 대체 수정 CLOSED | `skills/platform-watch/SKILL.md:7` `disallowed-tools: Bash Edit` · `skills/currency/SKILL.md:7` `disallowed-tools: WebSearch Edit` | `.omc/specs/plugin-shell.md:193` *"구분자는 공백·콤마·YAML 리스트 전부 유효 … 우려는 기각. 대신 그 필드는 원래 아무것도 막지 않는다"* |
| A-09 | 9 | lockstep 세트 하드코딩 | CLOSED | `shared/lockstep-sets.md`(전체) · `skills/currency/SKILL.md:183`·`:186-188` · `skills/rehearsal/SKILL.md:41`·`:58-62` | `.omc/specs/plugin-shell.md:49-54` «`shared/lockstep-sets.md` — 두 번째 공유물» |
| A-10 | 10 | rehearsal 환경 전제 검증·타임아웃 부재 | CLOSED | `skills/rehearsal/SKILL.md:140-152`(탐지 규칙 표) · `:154-170`(단계 타임아웃) · `shared/constants.md:29-32` | `.omc/specs/deep-interview-rn-rehearsal.md:683`·`:685` · AC `:554-557` |
| A-11 | 11 | 채택 게이트 3이 사후 감사 불가능 | CLOSED | `skills/rehearsal/SKILL.md:323-328` · `skills/rehearsal/references/report-format.md:110`·`:170-185` | `.omc/specs/deep-interview-rn-rehearsal.md:687` «베이스라인 필드» · AC `:550-551` |
| A-12 | 12 | worktree 경로가 하드코딩 | CLOSED | `shared/constants.md:28` `worktree_path_template` · `skills/rehearsal/SKILL.md:285` · `:290-300`(기존 디렉토리 처리) | `.omc/specs/deep-interview-rn-rehearsal.md:689`·`:691` · AC `:552-553` |
| A-13 | 13 | T3 스크린샷 수집 방법 미정의 | CLOSED | `skills/rehearsal/SKILL.md:268-279` · `skills/rehearsal/references/log-patterns.md:61-66` | `.omc/specs/deep-interview-rn-rehearsal.md:693` «T3 스크린샷 수집 방법» · AC `:559-560` |
| A-14 | 14 | 산출물 쓰기 실패 degrade 부재 | CLOSED | `skills/platform-watch/SKILL.md:114`(쓰기 순서)·`:133`(degrade 9) · `skills/currency/SKILL.md:266`(degrade 18) · `skills/rehearsal/SKILL.md:388-399` | `.omc/specs/deep-interview-platform-watch.md:325` · `deep-interview-rn-rehearsal.md:695` |
| A-15 | 15 | monorepo·프로토콜 버전 미처리 | CLOSED | `skills/currency/SKILL.md:54-66`(정본 `package.json` 선택) · `:263-265`(degrade 15·16·17) | `.omc/specs/deep-interview-currency.md:493` *"구현의 degrade 표는 이제 18경로다 … `package.json` 2개 이상(15) · `workspace:*`·`catalog:`(16) · `latest` 부재(17)"* |

**라운드 0 결론:** 15건 전부 처리 완료 상태다. 재발견 금지 목록에 들어간다.

---

## 라운드 1 — `.omc/specs/*` ↔ `skills/**` 대조

라운드 0에서 판정된 15건을 제외하고 새로 찾았다. 대조 대상: `skills/*/SKILL.md` 3개 + `skills/*/references/*.md` 8개 + `shared/*.md` 2개, 스펙 4개의 본문·Acceptance Criteria.

> **정정 (라운드 7 · 2026-08-19 — 리뷰어 지적):** 위 *"전수"*는 **AC 축에 대해서만 참이다.** 스펙 **본문** 축(§미확정 해소·§구현 감사 반영·Ontology)은 근거로 **인용**됐을 뿐 한 줄씩 대조되지 않았다 — 라운드 6이 그 구간에서 A-32를, 라운드 6 리뷰어가 `.omc/specs/deep-interview-rn-rehearsal.md:379`·`:380`을 각각 찾아낸 것이 그 증거다. «종료» 절의 잔여 5가 이 사실을 싣는다.

**폐기한 것(원장에 남기지 않음):** `rehearsal`에 `disallowed-tools`가 없다 / README 호스트 절 문구가 스펙 «고정 문구»의 확장판이다 / 재현 블록 예시의 `/tmp/...` 리터럴 — **셋 다 스펙 인용을 못 붙였다.** 앞 둘은 스펙이 요구하지 않고, 마지막은 스펙 자신이 같은 형태를 쓴다(`.omc/specs/plugin-shell.md:79` · `.omc/specs/deep-interview-rn-rehearsal.md:689`가 `/tmp/rn-rehearsal-<target>-<base_sha7>`를 그대로 싣는다).

> **정정 (라운드 4 마감 · 2026-08-19 — 리뷰어 지적):** 이 목록에 `핸드오프: … (일부 항목 stale 없음)` 표현이 넷째로 있었고 폐기 사유가 *"스펙 자신이 같은 형태를 쓴다"*였다. **그 사유는 거짓이다** — 저장소 전체 grep에서 그 문자열은 `skills/platform-watch/references/report-format.md:68`과 이 폐기 문장 두 곳뿐이고, 스펙의 대응 예시 `.omc/specs/deep-interview-platform-watch.md:481`은 괄호 없이 `핸드오프: .rn-upgrade-kit/handoff/platform-requirements.md 갱신`이다. *"스펙 인용을 못 붙였다"*도 틀렸다 — `.omc/specs/deep-interview-platform-watch.md:295`·`:373`이 붙는다. **폐기를 취소하고 A-28에서 다뤘다.**

| id | 항목 | 상태 | 구현 근거 | 스펙 근거 |
| --- | --- | --- | --- | --- |
| A-16 | **`이중화 없음` 병기 규칙이 리포트 포맷 정본에 없고, 예시가 반례다** | CLOSED | 규칙이 `skills/platform-watch/references/watch-targets.md:37`·`:58`에만 있고 리포트 정본(`references/report-format.md`)에 없었다. `skills/platform-watch/references/report-format.md:59` 예시가 `android/16kb-page-size`(= 2차 `없음` 항목)를 병기 없이 ✅ 블록에 실었다 — 포맷 정본의 예시가 규칙의 반례였다 | `.omc/specs/deep-interview-platform-watch.md:197` *"✖ 없음 … `없음 (<사유>)` + 리포트에 `이중화 없음` 병기"* · AC `:554` *"2차가 `없음`인 항목은 리포트에 `이중화 없음`이 병기된다"* |
| A-17 | **`currency`가 핸드오프 `schema_version`을 무엇과 비교하는지 명시가 없다** | CLOSED | `skills/currency/SKILL.md:137`(라운드 1 이전 `:134`)이 *"`schema_version` 불일치"* degrade만 정의하고 비교 대상 값의 출처를 어디에서도 지목하지 않았다. `shared/constants.md`를 Read하라는 지시는 `handoff_path`(`:129`)와 soak 임계값(`:185`)에만 붙어 있었다 — `handoff_schema_version`은 이름조차 등장하지 않는다 | `.omc/specs/deep-interview-currency.md:614` AC *"핸드오프 `schema_version`이 `shared/constants.md`의 값과 다르면 `스키마 불일치` degrade로 간다"* · `shared/constants.md:18`이 소비자를 *"currency(검증)"*로 지목 |
| A-18 | **`url_candidate_limit`을 어디서 읽는지 지시가 없다** | CLOSED | `skills/platform-watch/SKILL.md:60`이 `상한 = url_candidate_limit`이라고만 적고 파일 경로를 안 준다. 같은 파일 `:98`은 `grade_threshold_days`에 `../../shared/constants.md`를 붙였고 `enum_promotion_min_count`는 `skills/platform-watch/references/report-format.md:113`이 경로를 준다 — **셋 중 이것만 어느 파일에서도 경로가 없었다** | `.omc/specs/plugin-shell.md:45` *"스킬 본문에서 상대 경로로 참조한다: `../../shared/constants.md`"* · `:47` *"하드코딩 금지 대상: 아래 표의 모든 값. 스킬 본문에 숫자를 적지 않고 이 파일을 Read한다"* (표에 `url_candidate_limit` 포함 — `:77`) |
| A-19 | **`plugin-shell.md` §2 «키 정본»에 `enum_promotion_min_count`가 없다** | CLOSED | `shared/constants.md:27`이 그 키를 정의하고 `skills/platform-watch/SKILL.md:42`·`skills/platform-watch/references/report-format.md:113`이 소비하는데, **키 정본이라고 선언한 표에 그 행이 없었다**(15행 vs 실제 16키) | `.omc/specs/plugin-shell.md:64` *"§2 `shared/constants.md` — 키 정본"* · `:86` *"값 변경은 이 파일 한 곳에서만"* vs `.omc/specs/deep-interview-platform-watch.md:716` *"`seen_count` ≥ `enum_promotion_min_count`(`shared/constants.md` · 기본 2)"* |
| A-20 | **`plugin-shell.md` §1 디렉터리 레이아웃이 실제 파일 구성과 다르다** | CLOSED | 실제 트리에는 `skills/platform-watch/references/{report-format.md,cadence.md}`와 `skills/rehearsal/references/report-format.md`가 있는데 레이아웃에 없었다. 구현이 아니라 스펙이 낡은 쪽이다 — 두 파일 다 다른 스펙이 요구한다 | `.omc/specs/deep-interview-platform-watch.md:708` *"실행 케이던스 안내 (`references/cadence.md` — seed와 동형)"* · `deep-interview-rn-rehearsal.md:617` *"로그 스캔 패턴 목록의 정본 위치 (`references/log-patterns.md` 권장)"* · `:594`(리포트 경로 규칙) |

**A-19·A-20은 스펙 쪽을 고쳤다.** 구현이 옳고 `plugin-shell.md`가 뒤처진 경우다 — 스펙을 정본이라 부르면서 구현에 맞추는 건 순환이지만, 두 건 다 **다른 스펙 파일이 구현 쪽을 요구한 것**이라 `plugin-shell.md`가 형제 스펙과 어긋나 있던 상태다. 판단 근거는 구현이 아니라 형제 스펙이다.

> **정정 (라운드 3 · 2026-08-19 — 리뷰어 지적):** 위 문장의 *"두 건 다 다른 스펙 파일이 구현 쪽을 요구한 것"*은 **A-20에 대해 거짓이다.** A-20이 §1 레이아웃에 추가한 3줄 중 형제 스펙이 이름으로 요구하는 건 하나뿐이다:
>
> | 추가한 줄 | 형제 스펙이 이름으로 요구하나 |
> | --- | --- |
> | `platform-watch/references/cadence.md` | **요구한다** — `.omc/specs/deep-interview-platform-watch.md:708` *"실행 케이던스 안내 (`references/cadence.md` — seed와 동형)"* |
> | `platform-watch/references/report-format.md` | **요구하지 않는다** — 어느 스펙도 이 파일을 이름으로 부르지 않는다 |
> | `rehearsal/references/report-format.md` | **요구하지 않는다** — 원장이 인용했던 `deep-interview-rn-rehearsal.md:616`는 *리포트·artifacts 경로 규칙*이지 파일 존재 요구가 아니다 |
>
> **결론(레이아웃 갱신)은 유지한다. 교체하는 것은 근거다.** `deep-interview-rn-rehearsal.md:616` 인용을 빼고 아래로 대신한다:
>
> - `.omc/specs/plugin-shell.md:177` «5. 미해결 위임 (구현 재량)» — 그 목록에 `references/log-patterns.md`(`:180`)·`references/sources.md`(`:181`)·`shared/constants.md`의 물리 포맷(`:182`)이 들어 있다. **참조 파일의 물리 구성은 스펙이 구현에 위임한 축이다.**
> - `.omc/specs/deep-interview-rn-rehearsal.md:609` · `.omc/specs/deep-interview-currency.md:755` — 둘 다 *"`references/*.md` 지연 로드 패턴을 그대로 따른다"*. 실제 파일 구성이 그 패턴의 산물이라는 근거다.
>
> **A-19의 근거는 그대로 유효하다** — `deep-interview-platform-watch.md:716`이 `enum_promotion_min_count`를 `shared/constants.md` 키로 명시한다.

---

## 라운드 2 — ~~신규 발견 0~~ → **신규 3건 (리뷰어 적발)**

라운드 1의 5건 반영 후 재대조. 자체 판정은 *"스펙 인용 가능한 신규 발견 0건 → 종료 조건 충족"*이었다.

- 재검증한 축: A-16~A-20의 반영 지점 + 그 수정이 건드린 파일의 인접 규칙(리포트 4블록·상수 참조 경로·`plugin-shell.md` §1/§2).
- 라운드 0·1에서 판정된 20건은 재발견 대상에서 제외했다.

> **정정 (2026-08-19):** 위 「신규 발견 0」 주장은 **독립 리뷰어(`critic`)가 기각했다.** 판정 REJECTED, 리포트 전문은 `docs/review-round2-2026-08-18.md`. 신규 결함 3건(N-1·N-2·N-3)이 나왔고 아래 라운드 3에서 **A-21·A-22·A-23**으로 판정했다. 원장 정정 3건(줄 번호 시프트 · A-20 근거)도 같이 지시됐고 반영했다.
>
> **이 절의 자체 수렴 판정은 무효다.** 종료 조건은 라운드 3에서 다시 잰다.

---

## 라운드 3 — 리뷰어 적발 3건 + 전수 재대조 1건

입력은 `docs/review-round2-2026-08-18.md`(판정 REJECTED)다. N-1·N-2·N-3을 A-21·A-22·A-23으로 판정하고, 그 수정의 파급을 좇는 과정에서 A-24가 새로 나왔다.

**폐기한 것(원장에 남기지 않음):** 핸드오프 항목의 `key`가 필드가 아니라 `## <슬러그>` 제목으로만 존재한다 / `skills/platform-watch/SKILL.md:111`이 `handoff_path` 값을 리터럴로 적었다 — **둘 다 스펙이 같은 형태를 쓴다.** 앞은 스펙이 필드 표(`deep-interview-platform-watch.md:362-373`)만 주고 물리 표현을 정하지 않았고, 뒤는 스펙 자신의 산출물 트리(`:318`)가 같은 리터럴을 싣는다.

| id | 항목 | 상태 | 구현 근거 (현재 트리) | 스펙 근거 |
| --- | --- | --- | --- | --- |
| A-21 | **핸드오프 파일 레벨 `scope` 기록 규칙이 리포트 포맷 정본에 없다** | CLOSED | `scope` 문자열이 `skills/platform-watch/**` 전체에서 예시 한 곳(`skills/platform-watch/references/report-format.md:125` `scope: 전체`)뿐이었다. §3 «규칙»에도 `skills/platform-watch/SKILL.md:149`(좁힌 실행 병합)에도 기록 규칙이 없었다 → `skills/platform-watch/references/report-format.md:172`에 규칙 추가 | `.omc/specs/deep-interview-platform-watch.md:295` *"파일 레벨 `scope`에 이번에 실제 조회된 슬러그를 적는다"* · `:358` 파일 레벨 메타 표 *"`전체` 또는 실제 조회된 슬러그 목록"* · AC `:627` *"좁힌 실행 후 파일 레벨 `scope`에 이번에 실제 조회된 슬러그가 기록된다"* |
| A-22 | **degrade 12에서 `handoff_path`도 못 읽는다는 파급이 소비자 쪽에 없다** (라운드 1 A-17이 만든 회귀) | CLOSED | A-17이 넣은 `skills/currency/SKILL.md:131` 마지막 문장이 *"하한은 그대로 적용한다"*였다 — 상수를 못 읽으면 `handoff_path`도 못 읽어 **핸드오프를 열 수조차 없으므로** 실행 불가능하거나 경로 하드코딩을 요구했다. 생산자 쪽은 `skills/platform-watch/SKILL.md:135`가 같은 파급을 한 문장으로 처리해 뒀는데 소비자 쪽에 대응이 없었다 → `skills/currency/SKILL.md:131` 문장 교체 + 같은 파일 `:136` 상태 표에 행 추가 + `:260` degrade 12 「결과」 칸에 파급 명시 | `.omc/specs/plugin-shell.md:47` *"하드코딩 금지 대상: 아래 표의 모든 값. 스킬 본문에 숫자를 적지 않고 이 파일을 Read한다"* (표 `:68`에 `handoff_path` 포함) · `shared/constants.md:10` *"둘 다 실패하면 숫자를 지어내지 마라 … 상수에 기대는 판정만 `확인 못 함`"* |
| A-23 | **스펙 자신의 리포트 예시가 자기 AC의 반례다** | CLOSED | `.omc/specs/deep-interview-platform-watch.md:472`가 `android/16kb-page-size`(= 2차 `없음` 항목)를 병기 없이 ✅ 블록에 실었다. **A-16이 구현 쪽에서 고친 것과 같은 슬러그·같은 블록의 쌍둥이 반례**가 스펙에 남아 있었다 → `· 이중화 없음` 병기, `skills/platform-watch/references/report-format.md:59`와 표기 일치 | `.omc/specs/deep-interview-platform-watch.md:554` AC *"2차가 `없음`인 항목은 리포트에 `이중화 없음`이 병기된다"* · 같은 파일 `:197` *"✖ 없음 … `없음 (<사유>)` + 리포트에 `이중화 없음` 병기"* · `skills/platform-watch/references/watch-targets.md:57`이 그 슬러그의 2차를 `없음`으로 확정 |
| A-24 | **스냅샷 헤더 부재 표기 3상태가 degrade 12를 못 담는다** | CLOSED | degrade 12(상수 도달 실패)가 만드는 네 번째 상태를 `skills/currency/SKILL.md:218`과 `skills/currency/references/report-format.md:82`의 **3상태 열거**가 담지 못했다. **A-22 이전부터 있던 상태다** — A-22는 이 결함을 드러냈을 뿐 만들지 않았다. 넷째를 파일 부재로 접으면 사용자는 `platform-watch`를 다시 도는데 고칠 것은 상수 도달이다 → 양쪽을 4상태로 확장(`skills/currency/SKILL.md:218-219` · `skills/currency/references/report-format.md:82`), 스펙에도 같은 정제 추가(`.omc/specs/deep-interview-currency.md:200` 표 행 · `:204` 정제 주석 · AC `:646`·`:685`) | `.omc/specs/deep-interview-currency.md:234` 계약 5항 *"핸드오프의 `current` 필드는 currency 스냅샷 헤더의 `targetSdk`·`iOS min`의 **유일한 공급원**"* — 대체 경로가 없으므로 못 읽은 사유가 헤더에 드러나야 한다. `plugin-shell.md:47`·`:68`이 `handoff_path` 하드코딩을 금지했으므로 degrade 12에서 헤더 값을 못 얻는 사유는 **기존 3상태 중 어느 것도 아니다.** `.omc/specs/deep-interview-currency.md:493`이 degrade 12를 이미 싣고 있는데 같은 파일 AC는 3값만 열거했다 — **한 파일 안의 자기모순이다** |

**A-23·A-24는 스펙 쪽을 고쳤다.** 판단 근거는 구현이 아니다 — **둘 다 한 스펙 파일 안의 자기모순**이다.

- A-23: 같은 파일의 AC `:554`·표기 규칙 `:197`이 예시 `:472`를 반증한다. 그 슬러그의 2차가 죽었다는 사실조차 스펙 자신이 싣는다(`:190`·`:200`) — **구현을 전부 지워도 이 모순은 스펙 안에서 관측된다.**
- A-24: `.omc/specs/deep-interview-currency.md:493`이 degrade 12를 싣고 같은 파일 계약 5항 `:234`가 `current`를 스냅샷 헤더의 **유일한 공급원**으로 못박았으며 `plugin-shell.md:47`·`:68`이 `handoff_path` 하드코딩을 금지했다. 셋이 겹치면 **degrade 12에서 헤더 값을 못 얻는 사유는 기존 3상태 중 어느 것도 아니다.** 그런데 같은 파일 AC가 3값만 열거했다.

> **정정 (라운드 4 · 2026-08-19 — 리뷰어 지적):** 이 자리에 원래 적혀 있던 A-24의 정당화 — *"`plugin-shell.md`가 요구한 degrade가 `deep-interview-currency.md`의 3상태 열거보다 **나중에 생겨** 형제 스펙 간에 어긋난 상태다. 라운드 1 A-19와 같은 모양이다"* — 는 **git 이력으로 반증됐다.** `git log -S`가 3상태 정제 · degrade 18경로 재정정(`deep-interview-currency.md:493`) · `plugin-shell.md`의 «상수 도달 실패» 절(`:56-60`)을 **전부 같은 커밋 `cb603be`**로 지목한다 — "나중에"라는 시간 관계는 존재하지 않는다. A-19는 `deep-interview-platform-watch.md:716`이 이름으로 요구한 키가 `plugin-shell.md` 표에 없던 **실재하는 비대칭**이었고 여기엔 그런 비대칭이 없다. **결론(4상태 확장)은 유지하고 근거만 위로 교체했다** — 라운드 2가 A-20에서 지적한 것과 같은 실패 유형이다.

### 라운드 3 전수 재대조 — ~~위 4건 외 신규 0건~~ → **리뷰어가 신규 3건 적발 (아래 라운드 4)**

대조 범위와 결과:

| 축 | 결과 |
| --- | --- |
| `deep-interview-currency.md` AC 전수(`:595-728`, 약 80항) ↔ `skills/currency/**` | A-24 외 적발 0 |
| `deep-interview-platform-watch.md` AC 전수(`:514-638`, 약 70항) ↔ `skills/platform-watch/**` | A-21·A-23 외 적발 0 |
| `plugin-shell.md` §1 레이아웃·§2 키 정본 16행 ↔ `shared/constants.md` 16키 | 정확히 일치 |
| `shared/lockstep-sets.md` ↔ `plugin-shell.md:49-54` (확정/잠정 2단 · 도달 실패 자체 정의) | 일치. 고정 문구도 `skills/currency/references/report-format.md:104`와 글자까지 같다 |
| 보존 표기 문자열 `platform-watch` ↔ `currency` (AC `:602`) | 글자까지 일치 |
| README 호스트 매트릭스 ↔ AC `:581`(거부 사유 명시) | 일치 (`README.md:38-54`) |

> **이 표에서 뺀 것 (라운드 4 정정):** `deep-interview-rn-rehearsal.md` AC 전수(67항) 행이 여기 있었다. 그 칸이 스스로 *"라운드 2에서 이미 전수, 리뷰어가 확인해줬다"*라고 적어 **이번 라운드에 대조하지 않았음을 밝혔다** — 대조하지 않은 축을 대조 표에 두면 「신규 0건」의 분모가 부풀려진다. **rehearsal 축은 라운드 3·4가 보증하지 않는다.** 라운드 2의 전수 결과(적발 0)가 마지막 관측이다.

**라운드 4 시점의 재발견 금지 집합: A-01~A-28 (28건).** 최신 집합은 라운드 5 절 말미에 있다.

---

## 라운드 4 — 리뷰어 적발 3건 (라운드 3의 반영 누락)

입력은 `docs/review-round3-2026-08-19.md`(판정 REJECTED)다. **세 건 다 라운드 3의 수정이 건드린 값을 소비하는 자리**이고, 라운드 3의 「전수 재대조 신규 0건」 주장을 거짓으로 만든다.

리뷰어가 라운드 3에 대해 확인해준 것(재검증 불요): A-21~A-24는 넷 다 진짜 결함이고 취향을 스펙으로 포장한 건 없다 · 폐기 판단 2건도 옳다 · **원장 좌표 재조정 14곳 전수 정확, 부적중 0** · 과잉 반영 없음 · A-23의 순환 논증 판정 성립.

| id | 항목 | 상태 | 구현 근거 (현재 트리) | 스펙 근거 |
| --- | --- | --- | --- | --- |
| A-25 | **A-24의 4상태 확장이 구현 정본을 건너뛰었다** | CLOSED | `skills/currency/SKILL.md:218`과 `skills/currency/references/report-format.md:82`가 둘 다 *"§3 «핸드오프 읽기»가 정본이다"*로 지목하는데, 그 §3 안의 `skills/currency/SKILL.md:142`가 *"**세 표기는 사용자가 할 일이 각각 다르다**"*로 남아 있었다. **파생 둘은 4상태, 정본은 3상태.** 바로 위 상태 표(`:133-140`)는 6행인데 해설이 셋만 셌다 → `:142`를 네 표기로 확장, 넷째의 할 일을 *"`platform-watch`를 다시 돌릴 일이 아니라 상수 도달을 고칠 일"*로 명시 | `.omc/specs/deep-interview-currency.md:685` AC *"핸드오프에서 값을 못 얻으면 헤더의 해당 값이 사유와 함께 출력되고 **네 상태가 갈린다**"* · 같은 파일 `:200` 표 행 · `:204` 정제 *"파일 부재와 같은 표기로 접으면 사용자는 `platform-watch`를 다시 돌리는데 고칠 것은 상수 도달이다"* |
| A-26 | **스펙 자신의 결정 원장이 자기 AC의 반례로 남았다** | CLOSED | `.omc/specs/deep-interview-currency.md:960` §«구현 감사 반영 — 2026-08-18»이 *"**핸드오프 결손을 3상태로 가른다.**"*로 남아 A-24가 고친 본문·AC와 어긋났다 → `:961`에 정정 한 줄 append (이 파일의 append 패턴을 따랐다. 원문은 지우지 않았다) | 같은 파일 `:685`(AC — 4상태) · `:200`·`:204` · **그 절 자신의 선언** `:952` *"위 본문의 해당 자리도 같이 고쳐 뒀다 — 여기는 결정과 근거를 한곳에 모아 두는 자리다"* |
| A-27 | **A-21이 규칙을 넣은 파일의 예시가 그 규칙의 반례다** | CLOSED | `skills/platform-watch/references/report-format.md:125`가 `scope: 전체`인데 같은 예시가 `:143`에서 `ios/min-deployment-target`에 `stale`(= 이번에 조회 안 함)을 붙이고 `:145-151`에서 `android/16kb-page-size`를 고정 표기(= 한 번도 조회 안 함)로 채웠다 — **좁힌 실행의 산물인데 `scope`만 전수라고 주장한다.** A-21이 같은 파일 `:172`에서 이름 붙여 금지한 바로 그 상태다 → `:125`를 `scope: android/target-sdk`로, `:156`에 예시가 좁힌 실행 산물임을 명시. **`:143`의 `stale`과 `:145-151`의 고정 표기는 건드리지 않았다** — A-07이 닫은 `.omc/specs/deep-interview-platform-watch.md:609-610` AC의 시연이다 | `.omc/specs/deep-interview-platform-watch.md:295` *"미조회 항목은 이전 값을 그대로 싣되 **`stale: <마지막 조회일>`을 부착**. 파일 레벨 `scope`에 이번에 실제 조회된 슬러그를 적는다"* · `:358` 파일 레벨 메타 표 · `:373` *"`stale` … 이 항목이 **이번 실행에서 조회되지 않았을 때만** 부착"* · AC `:627` |

**A-26은 스펙 쪽을 고쳤다.** 근거는 구현이 아니라 **그 스펙 파일 자신의 선언**(`:952`)이다 — 결정 원장과 본문을 같이 고친다고 못박은 절이 본문만 고쳐진 상태였다. A-23·A-24와 같은 유형이다.

**세 건의 공통 원인:** 수정 한 건의 파급을 **그 파일 안에서만** 찾았다. A-25는 같은 파일 11줄 위, A-26은 같은 파일 750줄 아래, A-27은 같은 파일 41줄 위였다. 라운드 3이 A-24를 그 방식으로 찾아 놓고 같은 실수를 세 번 더 했다.

### 라운드 4 마감 — A-28 (리뷰어가 라운드 4의 수정에서 적발)

`docs/review-round4-2026-08-19.md` 판정 REJECTED. **지시 7건은 전부 집행됐고 좌표·수치도 흠이 없었으나**, A-27의 수정이 같은 파일 위쪽에 새 모순을 만들었다. 리뷰어가 *"새 라운드를 여는 게 아니라 라운드 4를 닫는 작업"*으로 분류한 건이라 라운드 5를 열지 않고 여기서 처리한다.

| id | 항목 | 상태 | 구현 근거 (현재 트리) | 스펙 근거 |
| --- | --- | --- | --- | --- |
| A-28 | **한 파일 안의 세 예시가 서로 다른 스코프를 주장한다** (A-27의 수정이 모순을 파일 레벨로 밀어올렸다) | CLOSED | A-27이 `skills/platform-watch/references/report-format.md:125`를 `scope: android/target-sdk`로 바꾸고 `:156`에 좁힌 실행 산물이라고 선언했는데, **같은 파일의 §1 리포트 예시와 §2 state 예시는 전수 실행이라고 말한다** — `:35` `스코프: 전체` · `:42` ios 항목의 신선한 판정과 `[변경]` 마킹(핸드오프 `:143`은 같은 항목을 `stale`로 둔다) · `:59` `android/16kb-page-size` ✅ 충족(핸드오프 `:146-151`은 고정 표기) · `:61-62` 블록 4가 `(없음)` · `:99-100` state의 `last_seen: 2026-08-16`. 날짜(`:34`=`:124`)와 현재값(`:39`=`:132`)이 겹쳐 한 실행으로 읽혔다 → **§3 예시를 별개 실행 이력으로 분리**: `:124` `generated: 2026-08-23`, `:156-160`에 가정한 이력(2026-08-09 `--platform ios` → 2026-08-23 `--target android/target-sdk`, 전수 실행 없음)을 명시. `:143`의 `stale`과 `:145-151`의 고정 표기는 이번에도 건드리지 않았다 | `.omc/specs/deep-interview-platform-watch.md:296` *"병합하지 않는다 — **리포트는 이번 실행의 산물**이고 미조회분은 이미 **블록 4가 담당한다**"* · `:295`(핸드오프 행 — 같은 실행의 산물임을 못박는다) · `:373` *"`stale` … 이 항목이 **이번 실행에서 조회되지 않았을 때만** 부착"* · AC `:611`·`:627` · `skills/platform-watch/SKILL.md:146` *"제외된 항목은 조용히 빠지지 않고 블록 4에 남는다"* · 같은 파일 `:114` *"쓰기 순서는 핸드오프 → state → 리포트로 못박는다"*(셋을 한 실행에 묶는다) |

**`(일부 항목 stale 없음)` 폐기 취소분의 처리:** 라운드 1이 폐기했던 `skills/platform-watch/references/report-format.md:68`의 그 표현은 **§1이 전수 실행 예시로 남으므로 그대로 유효하다** — 전수 실행에는 `stale`인 항목이 없다. 폐기 *사유*가 거짓이었던 것이고(위 라운드 1 절의 정정 참조) 표현 자체는 A-28의 실행 이력 분리로 정합해졌다.

**리뷰어가 라운드 4에 대해 확인해준 것(재검증 불요):** 지시 7건 전부 집행 · 부분/오집행 0 · 지시 3의 명시적 금지 준수 · 과잉 집행 없음(스펙 수정이 순환 아님) · **원장 좌표 기계 전수 389줄 대조 부적중 0** · 원장 수치 주장(27 / CLOSED 26 / REJECTED 1 / 라운드 5 / 정정 2곳) 전부 참 · `rehearsal`을 «보증하지 않는 축»에 넣은 것은 회피가 아니라 정직한 처리.

---

## 라운드 5 — 잔여 소진 (사용자 지시로 상한 연장)

**라운드 상한 5는 이 루프의 자기 규율이었다. 사용자가 "안 끝난 거 마저 해줘"로 연장을 지시해 잔여 3항을 직접 팠다.** 상한을 어긴 게 아니라 상한의 주인이 바꾼 것이고, 그 사실을 여기 적는다.

소진 대상은 라운드 4 마감이 «미해결 잔여»로 남긴 3항이다:

| 잔여 | 이번 라운드의 처리 |
| --- | --- |
| 1. A-28 이후 재대조 없음 | **전수 재대조 수행** — 아래 «대조 축» |
| 2. `rehearsal` 축 (마지막 관측이 라운드 2) | **AC 67항 전수 재대조 수행 — 적발 0** |
| 3. 실행 검증 0 · URL 재실측 0 | **URL 12개 전수 재실측 수행 — 1건 적발(A-29).** 실행 검증은 여전히 0(아래) |

| id | 항목 | 상태 | 구현 근거 (현재 트리) | 스펙 근거 |
| --- | --- | --- | --- | --- |
| A-29 | **`ios/min-deployment-target`의 1차·2차 어느 쪽에도 그 항목의 재료가 없다 — 실측 기록이 내용 실패를 도달 성공으로 적었다** | **PARTIAL** (기록은 정정, URL 재선정은 구현 재량이라 미결) | `skills/platform-watch/references/watch-targets.md:61-67`. 1차 `developer.apple.com/news/upcoming-requirements/`는 **Xcode/SDK 요구만** 싣고(2026-08-19 재실측: *"Since April 28, 2026 … built with Xcode 26 … SDK for iOS 26"*), 2차 `help/app-store-connect/manage-builds/upload-builds`는 **업로드 Xcode 버전표만** 싣는다 — **최소 배포 타깃 값이 어느 쪽에도 없다.** 그런데 `:67` 실측 기록은 *"1차·2차 모두 도달"*이라 적어 이 항목이 **매 실행 degrade 5로 떨어지는 상태**를 숨기고 있었다 → 실측 필드를 사실대로 고치고(`:67`) 재료가 실재하는 페이지(`developer.apple.com/support/xcode/` — Xcode 26.6 → `iOS 15 or later`)를 지목했다 | `.omc/specs/deep-interview-platform-watch.md:76` enum 정의 *"`ios/min-deployment-target` | Apple 최소 배포 타깃"* · AC `:556` *"HTTP 200이어도 해당 항목의 재료를 못 찾으면 실패로 취급되고 2차로 넘어간다"* · `skills/platform-watch/SKILL.md:58` *"**"1차 실패"에 내용 실패를 포함한다.** HTTP 200이어도 그 페이지에서 해당 항목이 요구하는 재료(임계값·날짜 문구)를 못 찾으면 실패로 취급하고 2차로 넘어간다"* · `skills/platform-watch/references/watch-targets.md:12` *"1차 URL | ✔ | 공식 정책 **본문**"* |

**A-29를 CLOSED로 올리지 않은 이유:** 재료가 실재하는 URL은 `ios/min-xcode`의 1차라, 옮기면 **두 항목이 1차를 공유**한다. 이 파일의 독립성 스키마(①완전/②부분/③교차/✖없음)에는 **1차끼리의 겹침을 표기할 자리가 없다** — ③ 교차는 *"이 항목의 **2차**가 다른 항목의 1차와 같을 때"*로만 정의됐다(`skills/platform-watch/references/watch-targets.md:14`). URL 재선정과 스키마 확장은 `.omc/specs/deep-interview-platform-watch.md:704`가 *"enum 초기 목록의 정확한 슬러그 문자열과 1차·2차 URL"*을 **구현 재량**으로 위임한 축이라 **감사가 결정하지 않는다.** 사실을 참조 파일과 원장 양쪽에 적고 미결로 남긴다.

**폐기한 것(원장에 남기지 않음):** `billing` 1차의 버전별 지원 타임라인 표(v7 → 2026-08-31 / v8 → 2027-08-31)가 2차 배너(*"By Aug 31, 2026 … version 8 or later"*)와 어긋나 보인다 — **어긋나지 않는다.** 표는 각 버전의 **폐기 기한**이고 배너는 **현재 최소 요구**라 v7의 기한이 2026-08-31인 것과 그때부터 v8이 최소인 것은 같은 사실이다.

### 라운드 5 대조 축 — 무엇을 실제로 봤나

| 축 | 방법 | 결과 |
| --- | --- | --- |
| `deep-interview-rn-rehearsal.md` AC **67항 전수** ↔ `skills/rehearsal/SKILL.md`(367줄) · `references/report-format.md`(197줄) · `references/log-patterns.md`(70줄) | AC 한 줄씩 구현 자리 대조 | **적발 0.** 잔여 2 해소 |
| `references/watch-targets.md`의 URL **12개 전수** | `WebFetch`로 실제 조회 + 각 페이지가 그 항목의 «요구» 재료를 싣는지 대조 | **1건 적발 (A-29).** 나머지 11개는 도달·내용 모두 첫 실측과 동일 |
| A-28의 파급 (`generated: 2026-08-23` · `scope: android/target-sdk`) | 저장소 전체 grep | 소비처가 `skills/platform-watch/references/report-format.md:124`·`:158` 두 곳뿐. **파급 0** |
| A-25의 파급 (4상태 확장) | `skills`·`shared`·`seed` 전체 grep — `세 상태`·`세 표기`·`3상태` | **0건.** 잔여 없음 |
| 원장 인용 좌표 | 기계 전수 추출 → 실제 줄 열기 | **미해석 0** |

**A-01~A-29로 판정된 29건은 재발견 대상에서 제외했다.**

---

## 라운드 6 — 라운드 5의 검사 기준을 라운드 5가 안 지킨 자리

`docs/review-round5-2026-08-19.md` 판정 REJECTED. **라운드 5가 A-29에서 발견한 검사 기준 — «도달했다는 것과 그 페이지가 이 항목의 재료를 싣는다는 것은 다르다» — 을 바로 옆 항목에 적용하지 않았다.** 리뷰어가 URL을 직접 열어 확인했다.

리뷰어가 라운드 5에 대해 확인해준 것(재검증 불요): A-29는 진짜 결함이고 **PARTIAL은 회피가 아니라 정직한 미결 처리** · `rehearsal` AC를 **독립 전수 재대조해 「적발 0」이 참임을 확인** · `play/billing` 폐기 판단 옳음 · **원장 좌표 216건 범위 부적중 0** · 수치 5종 전부 참 · 잔여 나열과 상한 연장 처리 정직.

| id | 항목 | 상태 | 구현 근거 (현재 트리) | 스펙 근거 |
| --- | --- | --- | --- | --- |
| A-30 | **`ios/min-xcode`의 1차가 그 항목의 «요구» 재료를 싣지 않는다 — 라운드 5가 「요구 내용 일치」로 인증했다** | **PARTIAL** (기록은 정정, URL 재선정은 A-29와 같은 사유로 미결) | `skills/platform-watch/references/watch-targets.md:76` 요구 = *"심사 제출용 최소 Xcode / SDK 버전"* · `:77` 1차 = `developer.apple.com/support/xcode/`. 리뷰어 실측: **그 페이지는 Xcode 버전별 능력 참조표이고 "제출하려면 최소 Xcode N 이상"이라는 정책 문장이 없다** — 자기 Legend가 각 열을 *"Deployment Target: The OS range supported by this version of Xcode for uploading apps"* · *"SDK: The version of SDKs included in this version of Xcode"*로 정의한다. 라운드 5의 `:80`은 1차에서 읽었다고 적은 재료(`최소 배포 타깃`)가 **이웃 항목 `ios/min-deployment-target`의 요구**인데 그것으로 이 항목의 「일치」를 선언했다 → `:80` 실측 정정 + `:79` «교차» 필드의 경고(*"죽으면 동시에 단일 소스로 떨어진다"*)를 **이미 도달한 상태**로 정정 | `skills/platform-watch/SKILL.md:58` *"**"1차 실패"에 내용 실패를 포함한다.** HTTP 200이어도 그 페이지에서 해당 항목이 요구하는 재료를 못 찾으면 실패로 취급하고 2차로 넘어간다"* · `.omc/specs/deep-interview-platform-watch.md:556` AC *"HTTP 200이어도 해당 항목의 재료를 못 찾으면 실패로 취급되고 2차로 넘어간다"* · `skills/platform-watch/references/watch-targets.md:12` *"1차 URL | ✔ | 공식 정책 **본문**"* |
| A-31 | **A-29의 파급을 좇지 않아 같은 슬러그를 정상 판정으로 싣는 예시 세 자리가 남았다** | CLOSED | A-29가 `ios/min-deployment-target`을 *"매 실행 degrade 5로 떨어진다"*로 선언했는데, `skills/platform-watch/references/report-format.md:42`(리포트 예시 — 🟠 등급·D-day·`[변경]` 마킹까지 산출)·`:136-142`(핸드오프 예시 — `requires`·`deadline`·`urgency`·`status` 전부 채워짐)·`.omc/specs/deep-interview-platform-watch.md:455`(구현과 같은 줄의 쌍둥이)가 그 항목을 정상 산출물로 싣는다. **URL이 재료를 못 실은 건 처음부터의 상태라 날짜로 방어되지 않는다** → 세 자리를 고치지 않고 **전제를 명시했다**: `skills/platform-watch/references/report-format.md:75`와 `.omc/specs/deep-interview-platform-watch.md:491`에 *"이 예시는 URL 문제가 해소된 뒤의 상태를 가정한다 … URL이 고쳐지면 이 주석을 지운다"* | `.omc/specs/deep-interview-platform-watch.md:556` AC · `:558` AC *"1차·2차 모두 실패 시 항목이 리포트에서 사라지지 않고 `확인 못 함 (소스 도달 실패)`로 남는다"* · `skills/platform-watch/references/report-format.md:168` *"같은 항목이 리포트 🔴인데 핸드오프 `여유`인 상태는 발생할 수 없다"*(리포트와 핸드오프가 한 실행의 산물이라는 계약) |
| A-32 | **스펙이 해소한 `base_sha` 표기 자릿수 결정이 구현에 안 내려왔다** | CLOSED | `skills/rehearsal/**` 전체에서 자릿수를 다루는 문장이 0건이었고 리포트 본문 예시(`references/report-format.md`의 `검증 기준` 줄 · 채택 절 · 채택 커밋 메시지 · 신선도 경고문 · 재현 블록 git 인자)가 전부 7자리였다 — **규칙 문장이 없어 예시가 사실상의 정본**인 상태 → `skills/rehearsal/references/report-format.md:120`에 규칙 신설(*"리포트 본문에 값으로 싣는 자리는 전체 SHA, 브랜치명·worktree 경로만 7자리"*) + 본문 예시 5자리를 전체 SHA로 · `skills/rehearsal/SKILL.md:343`에 같은 규칙 한 줄. **브랜치명(`rn-upgrade/0.83.4-a3f9c21`)과 worktree 경로는 7자리 그대로다** | `.omc/specs/deep-interview-rn-rehearsal.md:624` *"**`base_sha` 표기 자릿수** → 브랜치명과 worktree 경로는 **7자리**(`worktree_path_template`의 `<base_sha7>`), 리포트 본문은 전체"* · `shared/constants.md:41` *"참조 파일 예시에만 있으면 예시가 사실상의 정본이 되고, 예시를 고칠 때 나머지 둘이 따라오지 않는다"* |

**A-31은 예시를 고치지 않고 전제를 명시했다.** A-16·A-23·A-27이 «예시가 규칙의 반례»를 예시 수정으로 닫았는데 여기서는 반대로 갔다 — 그 세 건은 **규칙이 옳고 예시가 틀린** 경우였고, 이건 **예시가 그리는 정상 동작이 옳고 URL이 틀린** 경우라 예시를 실패 상태로 바꾸면 포맷 정본이 등급·D-day·델타 마킹 시연을 통째로 잃는다. A-28이 쓴 방식(예시의 전제를 명시)과 같은 모양이다.

### 라운드 5의 원장 오류 4건 — 정정

| # | 무엇 | 정정 |
| --- | --- | --- |
| N-12 | `rehearsal` AC 분모를 **「73항」**이라 적었다(원장 네 자리). 라운드 2는 **「69항」**이라 적었다 | **실제 67항.** `awk 'NR>=490&&NR<=565' … | grep -c '^- [ ]'` = 67. 네 자리 + 라운드 4 정정 블록의 「69항」까지 전부 67로 고쳤다. **실질 판정(적발 0)은 리뷰어가 독립 전수로 확인했으므로 결론은 유지하고 분모만 고친다** |
| N-13 | «보증하지 않는 축»의 `rehearsal` 취소선이 **실제로 한 일보다 넓다** — 라운드 5가 본 것은 **AC 축**이고 스펙 본문(§미확정 해소·§구현 감사 반영·Ontology) 축은 안 봤다 | 취소선 범위를 **「AC 축은 보증, 스펙 본문 축은 미보증」**으로 갈랐다. **A-32가 정확히 그 미보증 구간(§미확정 해소 `:599`·`:604`)에서 나왔다** |
| N-14 | A-29의 PARTIAL 사유가 인용한 좌표가 틀렸다 — *"③ 교차는 «이 항목의 2차가 다른 항목의 1차와 같을 때»로만 정의됐다(`watch-targets.md:27`)"* | 인용문이 실재하는 곳은 **`:14`**(`교차` 필드 스키마 행)다. `:27`은 ③ 교차 강도 행이라 문장이 다르다. **주장은 참이므로 좌표만 고쳤다** |
| N-15 | A-29 주석이 `support/xcode/`의 **Deployment Targets 열** 값이라며 `iOS 15 or later`를 인용했다 | 실제 그 열은 `iOS 15–26.5`이고 `iOS 15 or later`는 **Device Support 열**이다. 하한이 같아 결론은 안 바뀌지만 **A-29 자신이 「열을 잘못 읽는 것」을 결함으로 세운 항목**이라 정정했다 |

**A-01~A-32로 판정된 32건은 재발견 대상에서 제외했다.**

---

## 라운드 7 — 라운드 6의 부분 집행과 미검증 실측값

`docs/review-round6-2026-08-19.md` 판정 REJECTED. 리뷰어가 Apple 페이지를 **직접 두 번** 열어 라운드 6이 `실측` 필드에 박은 값을 반증했다.

리뷰어가 라운드 6에 대해 확인해준 것(재검증 불요): **A-30은 진짜 결함**(정책 문장 부재를 독립 실측으로 확인, 인용한 Legend 두 문장 원문 일치) · **A-29와 별건으로 둔 분리 옳음** · **A-31의 「전제 명시」 선택은 회피가 아님**(결함 위치·비용 비대칭·A-28 선례 셋으로 뒷받침) · **A-32의 자릿수 적용은 발명이 아니라 충실한 이행**(`a3f9c21` 전수 16자리, 오분류 0) · N-12·N-14 정확히 집행 · **원장 좌표 254건 범위 부적중 0** · 수치 6종 전부 참 · 잔여 나열 정직 · 자가 승인 없음.

| id | 항목 | 상태 | 구현 근거 (현재 트리) | 스펙 근거 |
| --- | --- | --- | --- | --- |
| A-33 | **A-31이 부분 집행됐다 — 세 자리 중 핸드오프 예시에 전제가 안 붙었고, 붙은 주석은 없는 항목을 지목했다** | CLOSED | A-31이 단 주석 `skills/platform-watch/references/report-format.md:75`는 §1 안에서 *"**위** 예시"*라 적어 **62줄 아래 §3 핸드오프 예시(`:136-142`)를 안 덮는다.** 게다가 *"위 예시의 `ios/min-deployment-target`·`ios/min-xcode` **두 항목**"*이라 적었는데 **`ios/min-xcode`는 §1 예시에 존재하지 않는다** → `:75` 문구를 실제 예시에 맞추고(§1 `:42` 한 줄만 지목 + `ios/min-xcode`는 A-30 소관임을 명시), §3 예시의 자기 주석 블록 `:162`에 같은 취지 문단 추가. **`:143`의 `stale`과 `:145-151`의 고정 표기는 이번에도 건드리지 않았다** | `.omc/specs/deep-interview-platform-watch.md:558` AC *"1차·2차 모두 실패 시 항목이 리포트에서 사라지지 않고 `확인 못 함 (소스 도달 실패)`로 남는다"* · `skills/platform-watch/references/report-format.md:168` *"같은 항목이 리포트 🔴인데 핸드오프 `여유`인 상태는 발생할 수 없다"* — 리포트와 핸드오프가 한 실행의 산물이므로 **전제도 양쪽에 걸려야 한다** |
| A-34 | **라운드 6의 N-15 정정이 미검증 값을 날짜 붙은 `실측`으로 승격시켰고, 그 값이 틀렸다** | CLOSED | 라운드 6이 `skills/platform-watch/references/watch-targets.md:68`에 *"Deployment Targets 열 = `iOS 15–26.5`, `iOS 15 or later`는 Device Support 열"*이라 적었다. **자체 측정 없이 라운드 5 리뷰어의 관측을 옮긴 것이고, 직접 실측하니 정반대다** — 2026-08-19 `developer.apple.com/support/xcode/` Xcode 26.6 행: **`Deployment Targets` = `iOS 15 or later` · `Device Support` = `iOS 15–26.5` · `Simulator` = `iOS 15 or later`.** Legend가 앞을 *"The OS range supported by this version of Xcode for uploading apps to App Store Connect"*, 뒤를 *"…for installing and debugging applications on device"*로 가른다 → `:68`을 직접 실측값으로 되돌리고 세 열을 전부 적었다. **A-29·A-30의 결론은 열 값과 무관하므로 건드리지 않았다** | `.omc/specs/deep-interview-platform-watch.md:36` *"**환각 금지 (핵심 제약).** … 확인 못 한 항목은 `확인 못 함`으로 분리한다 — **추측을 사실로 쓰지 않는다**"* · `skills/platform-watch/references/watch-targets.md:15` *"`실측` | ✔ | 마지막으로 URL 도달을 확인한 날짜와 결과. **확인 안 했으면 `미실측`**"* |

**A-34가 이 루프에서 가장 뼈아픈 건이다.** 라운드 6은 *"「열을 잘못 읽는 것」을 결함으로 세운 항목"*이라며 N-15를 정정했는데, **그 정정 자체가 열을 잘못 읽은 것을 검증 없이 옮긴 결과**였다. 원 표기가 옳았다. **남의 관측을 자기 `실측`으로 옮기지 마라** — 스키마 `:15`가 그 자리를 *"확인한 날짜와 결과"*로 정의했다.

### 라운드 6의 원장 오류 3건 — 정정

| # | 무엇 | 정정 |
| --- | --- | --- |
| N-21 | 라운드 6 자신이 `deep-interview-platform-watch.md`에 넣은 2줄이 만든 +2 오프셋을 **세 자리에서 못 좇았다** — 원장 `:108`(`:552`)·`:123`(`:600`)·`:124`(`:579`) | 각각 `:554`·`:602`·`:581`로. 같은 파일의 다른 12개 좌표는 정확히 따라갔으므로 **규칙의 부재가 아니라 훑기의 미완**이다 |
| N-22 | 참조 파일도 같은 오프셋에 걸렸다 — `skills/platform-watch/references/watch-targets.md:69`의 `:702` | `:704`로. 원장은 이미 `:704`를 쓰고 있었다 |
| N-23 | 원장이 같은 축을 두고 자기 자신을 반증했다 — 라운드 1 절의 *"스펙 4개의 본문·Acceptance Criteria **전수**"* vs «종료» 잔여 5의 *"스펙 본문 축은 **어느 라운드도 대조하지 않았다**"* | **둘 다 정밀화했다.** 라운드 1의 「전수」는 **AC 축에 대해서만 참**이고, 본문 축은 **인용은 됐으나 전수 대조된 적이 없다.** 라운드 1 절에 정정 블록을, 잔여 5에 그 사실과 실물 두 건(A-32 · `deep-interview-rn-rehearsal.md:379`·`:380`)을 적었다 |

**A-01~A-34로 판정된 34건은 재발견 대상에서 제외했다.**

---

## 종료

- **라운드 수:** 8 (0·1·2·3·4·5·6·7) — **상한 5는 사용자 지시로 연장됐다**(라운드 5 절 참조)
- **총 발견:** 34건 (라운드 0 재검증 15 · 라운드 1 신규 5 · 라운드 3 신규 4 · 라운드 4 신규 3 · 라운드 4 마감 1 · 라운드 5 신규 1 · 라운드 6 신규 3 · 라운드 7 신규 2)
- **반영:** CLOSED 31 · **PARTIAL 2**(A-29·A-30 — 사실은 기록했고 URL 재선정은 구현 재량이라 미결) · REJECTED 1(A-08 — 원 진단의 전제가 기각됐고 대체 수정이 들어갔다)
- **종료 사유: 라운드 상한(5) 도달. 수렴이 아니다.** 세 라운드 연속으로 자체 「신규 0건」 주장이 리뷰어에게 기각됐다 — 이 루프는 **자기 수정의 파급을 스스로 끝내지 못했다는 것이 관측된 사실**이고, 상한이 그 반복을 끊었다.
  - ~~라운드 2: "신규 발견 0 → 수렴"~~ → **거짓이었다** (리뷰어가 3건 적발 → A-21·A-22·A-23)
  - ~~라운드 3: "위 4건 외 신규 0건"~~ → **거짓이었다** (리뷰어가 3건 적발 → A-25·A-26·A-27)
  - ~~라운드 4: "판정 가능한 축에서는 잔여 없음"~~ → **거짓이었다.** 라운드 4는 지시 집행만 했고 **전수 재대조를 한 줄도 하지 않은 채** 그 문장을 적었다 — 라운드 0·1·3이 전부 갖고 있던 «대조 축» 선언이 라운드 4 절에는 없다. 리뷰어가 A-28을 적발해 반증했다.
  - **라운드 4 마감: A-28 반영 후 재대조하지 않았다.** 「신규 0건」을 주장하지 않는다 — 세 번 틀린 주장을 네 번째로 적지 않는다.
- **미해결 잔여 (라운드 5 갱신):**
  1. ~~A-28 이후의 재대조 없음~~ → **해소.** 라운드 5가 전수 재대조했다(위 «대조 축»).
  2. ~~`rehearsal` 축~~ → **해소.** 라운드 5가 AC 67항 전수 재대조, 적발 0.
  3. ~~URL 재실측 0~~ → **해소.** 라운드 5가 12개 전수 재실측, 1건 적발(A-29).
  4. **A-29·A-30 미결 (URL 축)** — `ios/min-deployment-target`은 1차·2차 **둘 다**, `ios/min-xcode`는 **1차**가 그 항목의 재료를 안 싣는다. 사실은 참조 파일에 적혔고 **URL 재선정·독립성 스키마 확장은 `.omc/specs/deep-interview-platform-watch.md:704`가 구현 재량으로 위임한 축이라 감사가 결정하지 않았다.** 결과: 앞 항목은 매 실행 `확인 못 함 (소스 도달 실패)`, 뒤 항목은 2차로 넘어가 판정은 나오나 **이미 단일 소스**다.
  5. **`rehearsal` 스펙 본문 축** — 라운드 5·6이 **전수로 보증하는 것은 AC 축(67항)뿐**이다. §미확정 해소·§구현 감사 반영·Ontology는 **라운드 0·1이 근거로 인용은 했으나**(A-05·A-10~A-14가 `deep-interview-rn-rehearsal.md:675-677`·`:687`·`:689`·`:691`·`:695`를 인용한다) **전수 대조는 어느 라운드도 하지 않았다.** A-32가 정확히 그 구간(`:599`·`:604`)에서 나왔고, 라운드 6 리뷰어가 같은 구간에서 실물 하나를 더 지목했다 — `.omc/specs/deep-interview-rn-rehearsal.md:379`·`:380`이 리포트 본문 자리에 7자리를 써서 `:604` 결정의 반례다(`:604`가 상위라 **구현은 옳고 스펙 예시가 낡았다**). 같은 자리에 더 있을 수 있다.
  6. **실행 검증 0** — 이 세션으로 못 닫는다. `rehearsal`은 실제 RN 프로젝트가 있어야 돌고 이 repo에는 없다. 아래 «이 원장이 덮지 못하는 것».
  7. **라운드 7 자신의 재대조 없음** — A-33·A-34 반영 뒤 다시 훑지 않았다. **라운드 5도 6도 같은 자리를 남겼고 거기서 각각 A-30~A-32, A-33~A-34가 나왔다.** 이 루프가 **여섯 번** 당한 자리라 그대로 적는다.
- **이 종료의 유효성은 아래 «승인 주체»의 서명 범위 안에서만 성립한다.**
- **줄 번호 정정:** 라운드 3에서 14곳, 라운드 4에서 2곳(A-07 `:168-171` · A-21 `:167`)을 두 번에 걸쳐 현재 트리 기준으로 다시 맞췄다. 이 repo는 전부 명세라 파일을 고치면 아래 줄이 밀리고, 원장이 `file:line`으로 근거를 대므로 **수정할 때마다 원장 좌표가 썩는다.** 판정 자체는 지우지 않았다 — append-only는 유지된다.

### 승인 주체

- 라운드 2 승인 시도: **자체 판정 → 독립 리뷰어(`critic`)가 REJECTED** (`docs/review-round2-2026-08-18.md`)
- 라운드 3 승인 시도: **독립 리뷰어(`critic`)가 REJECTED** (`docs/review-round3-2026-08-19.md`) — 신규 3건 + 정정 지시 7건. 원장 좌표 축은 이 리뷰에서 **전수 대조·부적중 0**으로 해소됐다.
- 라운드 4 승인 시도: **독립 리뷰어(`critic`, 라운드 3과 다른 컨텍스트)가 REJECTED** (`docs/review-round4-2026-08-19.md`) — 신규 1건(A-28) + 원장 거짓 주장 2건. **지시 7건 집행·좌표·수치 축은 이 리뷰에서 전부 통과했다.**
- 라운드 4 마감: 그 지시 3건(A-28 · 종료 판정 정정 · 라운드 1 폐기 사유 정정)을 집행하고 **상한 도달로 종료했다.**
- 마감 수정 승인: **독립 리뷰어(`critic`, 앞선 둘과 다른 컨텍스트)가 APPROVED** (`docs/review-closing-2026-08-19.md`) — 범위는 마감 지시 3건과 그 파급으로 한정. 신규 발견은 집계 문장 1건(MINOR)뿐이었고 반영했다(위 라운드 3 절 말미의 재발견 금지 집합 27 → 28). **자가 승인 없음.**
- 라운드 5 승인 시도: **독립 리뷰어가 REJECTED** (`docs/review-round5-2026-08-19.md`) — 신규 7건. **A-29·PARTIAL 처리·`rehearsal` AC 「적발 0」·좌표 216건·수치 5종은 이 리뷰에서 전부 통과했다.** 리뷰어가 Apple 페이지를 직접 열어 A-29를 실측으로 확인했고, `rehearsal` AC 67항을 독립 전수로 다시 대조했다.
- 라운드 6 승인 시도: **독립 리뷰어가 REJECTED** (`docs/review-round6-2026-08-19.md`) — 신규 6건. **A-30·A-31의 처리 방식·A-32·N-12·N-14·좌표 254건·수치 6종은 이 리뷰에서 전부 통과했다.**
- 라운드 7: 그 지적 7건을 집행했다(A-33·A-34 + 원장 정정 3건).
- **서명 범위:** 네 리뷰가 각각 자기 «대조 범위» 절에 무엇을 안 봤는지 적었다. 위 «미해결 잔여»가 그 합집합이다 — 특히 마감 리뷰는 저장소 전면 재감사를, 라운드 5 리뷰는 `rehearsal` 스펙 본문 축과 `platform-watch/references/report-format.md` 전문을 보지 않았다.

### 보증하지 않는 축

- **`rehearsal`** — **AC 축(67항)은 라운드 5가 대조하고 라운드 5 리뷰어가 독립 전수로 재확인했다(적발 0).** 그러나 **스펙 본문 축(§미확정 해소·§구현 감사 반영·Ontology)은 인용만 됐지 전수 대조된 적이 없다** — 라운드 1의 *"스펙 4개의 본문·Acceptance Criteria 전수"*(위 라운드 1 절)는 **본문 축에 대해서는 과장이다.** A-32와 `.omc/specs/deep-interview-rn-rehearsal.md:379`·`:380`이 그 구간에서 나왔다.
- ~~**A-28 이후**~~ → **라운드 5가 보증한다.** 전수 재대조 수행. **단 A-29 이후는 라운드 6이, A-30~A-32 이후는 아무도 보증하지 않는다.**
- ~~**URL 재실측 0**~~ → **라운드 5가 보증한다.** 12개 전수 재실측, A-29 적발.
- **A-29·A-30의 URL 재선정** — 재료가 실재하는 URL이 형제 항목의 1차라 옮기면 이 파일의 독립성 스키마에 표기 자리가 없다. **구현 재량 축이라 감사가 결정하지 않았다.**
- **라운드 7 자신의 재대조** — A-33·A-34 반영 뒤 다시 훑지 않았다.
- **실행 검증 0** — 아래 «이 원장이 덮지 못하는 것»과 같다. 이 세션으로 못 닫는다.

### 이 원장이 덮지 못하는 것

- **실행 검증 0.** 전부 명세 대조다. `rehearsal`은 실제 RN 프로젝트에서 한 번도 돌지 않았다 — **이 repo에 RN 프로젝트가 없으므로 이 세션으로 닫을 수 없는 유일한 축이다.** 닫으려면 실제 RN 앱에서 `/rn-upgrade-kit:rehearsal`을 한 번 돌려야 한다.
- ~~**URL 재실측 없음.**~~ → **라운드 5에서 12개 전수 재실측 (2026-08-19).** `watch-targets.md`의 `실측` 필드가 그 값이고, 재실측 이력이 같은 파일 말미에 있다. **다음 실측 전까지만 유효하다** — 정책 페이지는 예고 없이 개편된다.

---

## 후속 — 2026-08-29 (원장 밖 총점검의 반영 기록)

감사 루프 종료 후, 별도 총점검 세션이 **스펙 자체의 구멍**(이 원장의 판정 기준 밖)을 손봤다. **원장 라운드가 아니다** — 판정 기준인 스펙을 고친 건들이라 스펙·구현을 같은 방향으로 동시 수정했고, 근거는 각 스펙의 `2026-08-29` 정정 블록에 있다. 여기는 원장 상태에 닿는 것만 적는다.

- **A-29·A-30 (PARTIAL) — 미결 축 소진.** 사용자 결정으로 `ios/min-deployment-target`을 `ios/min-xcode`로 **흡수 통합**했다(enum 7 → 6). 요구는 `upcoming-requirements`(1차)가 싣고, 배포 타깃 하한은 요구 Xcode 행의 `support/xcode/` 표에서 파생하며, 단일 소스라는 사실은 `2차: 없음`이 드러낸다. 두 건의 미결 사유였던 «URL 재선정은 구현 재량 축» 이 이로써 소진됐다 — 상태 행 자체는 append-only라 고치지 않는다. 정본: `skills/platform-watch/references/watch-targets.md`의 «통합 이력 (2026-08-29)»와 같은 파일 실측 이력의 2026-08-29 절.
- 같은 세션의 나머지 반영(각 스펙의 2026-08-29 정정 블록 참조): rehearsal T2 판정선을 관측 범위로 정합(구 문구가 관측 안 한 "로그인 화면 도달"을 주장) · `shared/constants.md` `Glob` 폴백의 설치본 한계 명시 · currency 계약 6항에 기한 경과 예외 신설 · currency registry 판정 재료(`latest`·peer·`deprecated`)의 `node -e` 일원화 — 확장 원라이너를 PowerShell 5.1·Git Bash 양쪽에서 재실측(출력 동일) · 저정밀 날짜에 D-day를 실었던 리포트 예시 정정(§날짜 신뢰 모델의 반례였다) · 서브에이전트 프롬프트 잠금에 셸 금지 추가 · «enum에서 제거된 슬러그»의 state·핸드오프 잔재 처리 규칙 신설.
- **이 절은 무서명이다.** 독립 리뷰어 검증을 거치지 않았다 — 다음 감사가 열리면 이 후속의 파급부터 훑는 게 맞다.

## 후속 — 2026-08-31 (첫 실행 검증과 그 수정의 반영 기록)

**«이 원장이 덮지 못하는 것»의 유일 축이었던 실행 검증이 처음으로 수행됐다.** 실제 RN 프로젝트(`woka_app` @ `b768f6eb8` 클린 clone · 타깃 `react-native@0.85.3 react@19.2.8`)에서 `rehearsal` 절차를 집행했고, 명세 대조 7라운드가 못 잡은 결함 10건(F-1~F-10)이 1회 실행에서 나왔다. **원장 라운드가 아니다** — 기록은 `docs/exec-verification-2026-08-31.md`(발견), `docs/fix-contract-2026-08-31.md`(수정 계약 + 집행 결과 P-13종·R-6종 전부 충족)에 있고, 여기는 원장 상태에 닿는 것만 적는다.

- **핵심 2건**: §2 조건부 베이스라인이 되돌림 설치 실패를 처리하지 않아 **업그레이드된 트리를 자기 자신과 비교한 거짓 통과**를 실제로 냈다(F-9 · 실측 재현 후 수정·재검증). lockstep 「RN 코어」 세트가 `@react-native/*`를 빠뜨려 **게이트 통과 후 31초 만에 빌드 사망**을 냈다(F-4 · 세트 확장 후 같은 빌드가 242s·893태스크 진행으로 실측 확인).
- 수정 파일: `skills/rehearsal/SKILL.md` · `skills/rehearsal/references/report-format.md` · `shared/lockstep-sets.md` · `.omc/specs/deep-interview-rn-rehearsal.md`(정정 블록 2 + AC 11항 + «실행 검증 반영» 절). `currency`·`platform-watch` 본문 무변경 — lockstep 정본이 공유 파일이라 파급이 구조적으로 0임을 확인했다.
- **줄 번호 정정:** 이 수정으로 밀린 rehearsal 계열 좌표 23곳(`skills/rehearsal/SKILL.md` 10 · `references/report-format.md` 2 · `deep-interview-rn-rehearsal.md` 11)을 현재 트리 기준으로 재정렬하고 전수 실측했다 — 부적중 0. 이 중 일부(`:587`→`:609` 등)는 2026-08-29 후속이 만들고 재정렬하지 않았던 기존 부패를 함께 닦은 것이다. 판정 자체는 지우지 않았다 — append-only는 유지된다.
- **이 절은 무서명이다.** 수정과 검증을 같은 집행자가 했다 — 독립 리뷰어 검증 없음. 위 2026-08-29 후속과 같은 처분: 다음 감사가 열리면 이 후속의 파급부터 훑는 게 맞다.
- **여전히 닫히지 않은 축**: T2/ios·T3·§6 채택 경로는 실행 관측 0 (이번 실행이 T1 실패 fail-fast로 미도달) · PM은 pnpm만 실측 · 커밋 외 파일 검사의 실사용 출력은 실제 트리 실행에서만 확인된다.
