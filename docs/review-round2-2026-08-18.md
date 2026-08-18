# 라운드 2 독립 재점검 — rn-upgrade-kit 감사 원장

검토자: critic (독립 라운드) · 검토일: 2026-08-18
대상: `docs/audit-ledger.md` (A-01~A-20 + 라운드 2 수렴 주장) + 미커밋 diff 4파일
판정 기준: `.omc/specs/*.md` · `CLAUDE.md` · `seed/rn-currency-SKILL.md` · `shared/constants.md` · `shared/lockstep-sets.md`

**결론 요약: 라운드 0·1의 실질 판정은 대체로 유효하다. 그러나 라운드 2의 「신규 발견 0」 주장은 거짓이다 — 스펙 인용 가능한 신규 결함 3건이 남아 있고, 그중 1건은 A-17 수정이 직접 만들어낸 것이다.** 추가로 근거 file:line 3곳이 「현재 트리 기준」이라는 원장 자신의 선언을 위반한다.

---

## (1) 라운드 0 인용 검증 — 15건 전수

「구현 근거 (현재 트리)」의 file:line을 전부 열어 대조했다. **13건은 줄 번호·인용문·원 지적 폐쇄 관계가 모두 성립한다.** 문제가 있는 건 아래뿐이다.

### 1-a. A-07 — 줄 번호가 현재 트리가 아니라 HEAD 기준이다 (확정 · 신뢰도 HIGH)

원장 근거: `skills/platform-watch/references/report-format.md:140-146`(enum 전수 + 고정 표기) · `:159-162`

현재 트리에서 그 자리에 있는 것:

- `:140` = `- stale: 2026-08-09`  ← 핸드오프 예시의 `ios/min-deployment-target` 꼬리
- `:159` = `- **stale은 이번 실행에서 조회되지 않은 항목에만 붙인다.**`

원장이 서술한 내용(*"enum 전수 + 고정 표기"*)은 실제로는 **`:142-148`**(`## android/16kb-page-size` + `미조회 (한 번도 조회되지 않음)` 6줄)과 **`:161-164`**(`enum 전체를 싣는다` / `위 병합 규칙` / `stale과 고정 표기는 다른 상태다` / `urgency도 고정 표기`)에 있다.

원인: 이번 라운드의 A-16 수정이 같은 파일 `:77-78`에 2줄을 삽입해 그 아래가 전부 +2 밀렸다. `git show HEAD:skills/platform-watch/references/report-format.md`로 확인하면 옛 `:140-146`·`:159-162`가 정확히 그 내용이다. 같은 원인으로 A-18·A-19가 인용한 `references/report-format.md:108`(*"승격 후보 제안 조건은 seen_count ≥ enum_promotion_min_count"*)도 현재 트리에서는 **`:110`**이다.

**원장 `docs/audit-ledger.md:19`가 *"각 건의 근거 file:line은 **현재 트리 기준**이다(감사 문서의 옛 줄 번호가 아니다)"*라고 명시했으므로, 이 3곳은 원장 자신의 선언 위반이다.** 지적 자체는 유효하다 — 줄 번호만 틀렸다.

### 1-b. 나머지 14건 — 이상 없음 (표본이 아니라 전수)

| id | 검증한 자리 | 결과 |
| --- | --- | --- |
| A-01 | `pw/references/report-format.md:13` = *"초과분을 지우지 않는다 — 보고만 한다"* · `cur/references/report-format.md:11-15` | 일치. 스펙 `deep-interview-platform-watch.md:329`·`deep-interview-currency.md:442` 원문 일치 |
| A-02 | `shared/constants.md:5-11` «이 파일에 도달하는 법» · `cur/SKILL.md:258`(degrade 12) · `pw/SKILL.md:132`(degrade 8) · `reh/SKILL.md:332`(degrade 1) | 4곳 전부 그 자리 |
| A-03 | `watch-targets.md:14-15`(`교차`·`실측`) · `:19-39`(3단계) | 일치 |
| A-04 | `cur/SKILL.md:91-92`(실측 기록) · `:98-99`(전면 실패 고정 문구) | 일치 |
| A-05 | `reh/SKILL.md:64-85` «작업 트리 검증» | 일치 |
| A-06 | `reh/SKILL.md:39`(검사 1 = `node -e`) · `:45-56` | 일치 |
| A-08 | `pw/SKILL.md:7` `disallowed-tools: Bash Edit` · `cur/SKILL.md:7` `disallowed-tools: WebSearch Edit` | 일치. AC `deep-interview-platform-watch.md:635`·`deep-interview-currency.md:598`이 둘 다 요구 — 대체 수정이 AC를 실제로 닫는다 |
| A-09 | `shared/lockstep-sets.md` 전체 · `cur/SKILL.md:182`·`:185-187` · `reh/SKILL.md:41`·`:58-62` | 일치 |
| A-10 | `reh/SKILL.md:124-136`(탐지 표)·`:138-152`(타임아웃) · `shared/constants.md:29-32` | 일치 |
| A-11 | `reh/SKILL.md:283-288` · `reh/references/report-format.md:110`·`:166-181` | 일치 |
| A-12 | `shared/constants.md:28` · `reh/SKILL.md:245`·`:250-260` | 일치 |
| A-13 | `reh/SKILL.md:228-239` · `reh/references/log-patterns.md:61-66` | 일치 |
| A-14 | `pw/SKILL.md:114`·`:133` · `cur/SKILL.md:264` · `reh/SKILL.md:348-359` | 일치 |
| A-15 | `cur/SKILL.md:54-66` · `:261-263`(degrade 15·16·17) | 일치 |

스펙 쪽 인용도 전수 대조했다. `deep-interview-rn-rehearsal.md:653`·`:655`·`:657`·`:661`·`:663`·`:665`·`:667`·`:669`·`:671`·`:673`, AC `:493`·`:547-549`·`:550-551`·`:552-553`·`:554-557`·`:559-560`, `deep-interview-platform-watch.md:325`·`:329`, AC `:550-552`·`:609-610`, `deep-interview-currency.md:442`·`:490`(한 줄에 두 인용문이 모두 들어 있다 — 정확), `plugin-shell.md:56-60`·`:49-54`·`:193` **전부 원문 그대로 존재한다.**

### 1-c. 근거가 원 지적을 닫는가 — A-08만 별도 판단

A-08은 원 진단(*"공백 구분자라 파싱이 깨진다"*)이 `plugin-shell.md:193`에서 명시적으로 기각됐고, 그 자리를 `disallowed-tools` 신설이 메웠다. **AC 두 개(`deep-interview-platform-watch.md:635`, `deep-interview-currency.md:598`)가 `disallowed-tools`를 직접 요구하므로 대체 수정은 실제로 AC를 닫는다.** `REJECTED (전제 기각) → 대체 수정 CLOSED`라는 이중 표기는 정확하다.


---

## (2) 라운드 1의 5건이 진짜인가

각 건의 스펙 인용이 **그 문장 그대로** 존재하는지, 그리고 그 문장이 구현 결함을 실제로 함의하는지 검사했다.

| id | 인용 존재 | 논리 도달 | 판정 |
| --- | --- | --- | --- |
| A-16 | ✔ `deep-interview-platform-watch.md:197` *"✖ 없음 / 요건을 만족할 페이지를 못 찾았다 / `없음 (<사유>)` + 리포트에 `이중화 없음` 병기"* · AC `:552` *"2차가 `없음`인 항목은 리포트에 `이중화 없음`이 병기된다"* — 둘 다 원문 그대로 | ✔ | **진짜** |
| A-17 | ✔ AC `deep-interview-currency.md:611` *"핸드오프 `schema_version`이 `shared/constants.md`의 값과 다르면 `스키마 불일치` degrade로 간다"* — 원문 그대로 | ✔ | **진짜** |
| A-18 | ✔ `plugin-shell.md:45`·`:47`·`:77` 전부 원문 그대로 | ✔ | **진짜** |
| A-19 | ✔ `plugin-shell.md:64`·`:86` · `deep-interview-platform-watch.md:714` *"`seen_count` ≥ `enum_promotion_min_count`(`shared/constants.md` · 기본 2)"* — 원문 그대로 | ✔ | **진짜** (구현 근거 줄번호만 `:108`→`:110`) |
| A-20 | 일부 ✖ — 아래 | 부분 | **결론 유효 / 근거 문장 거짓** |

### 2-a. A-16 — 진짜다. 반례 주장까지 확인했다

수정 전 HEAD의 `skills/platform-watch/references/report-format.md:59`는
`✅ D-247 · android/16kb-page-size — 정렬 확인됨      [무변화]`
였고, `watch-targets.md:57`이 그 항목의 2차를 `**없음**`으로 확정해 뒀다. **리포트 포맷 정본의 예시가 자기 AC의 반례였다는 주장은 사실이다.** 규칙이 `watch-targets.md:37`·`:58`에만 있었다는 것도 확인했다.

(사소) A-16 행의 *"같은 파일 `:59` 예시가…"*에서 「같은 파일」의 선행사는 바로 앞에 나온 `references/report-format.md`인데, 그 앞 문장이 `watch-targets.md:37`·`:58`로 끝나 `watch-targets.md:59`(실측 줄)로 오독된다. 지시 대상 명시 권장.

### 2-b. A-17 — 진짜다. 다만 이 수정이 새 결함을 만들었다 (§4 N-2)

수정 전 `cur/SKILL.md`는 `schema_version` 불일치 degrade만 정의하고 비교 대상의 출처를 어디에서도 지목하지 않았다. `shared/constants.md:18`이 소비자를 `currency(검증)`로 지목하고, `handoff_schema_version`이라는 이름이 `cur/SKILL.md` 어디에도 없었던 것도 확인했다. **AC `:611`은 "shared/constants.md의 값과" 비교하라고 명시하므로 논리가 도달한다.**

### 2-c. A-18 — 진짜다. "셋 중 이것만" 주장도 사실이다

`grade_threshold_days`는 `pw/SKILL.md:98`이 경로를 주고, `enum_promotion_min_count`는 `pw/references/report-format.md:110`이 준다. `url_candidate_limit`만 어느 파일에서도 경로가 없었다 — 16개 상수 전수 grep으로 확인했다.

### 2-d. A-20 — 결론은 맞지만 **근거 문장이 거짓이다**

원장 `docs/audit-ledger.md:59`: *"두 건 다 **다른 스펙 파일이 구현 쪽을 요구한 것**이라 `plugin-shell.md`가 형제 스펙과 어긋나 있던 상태다. 판단 근거는 구현이 아니라 형제 스펙이다."*

§1에 추가된 3줄을 하나씩 검사했다:

| 추가된 줄 | 형제 스펙이 그 파일을 요구하나 |
| --- | --- |
| `platform-watch/references/cadence.md` | **요구한다.** `deep-interview-platform-watch.md:706` *"실행 케이던스 안내 (`references/cadence.md` — seed와 동형)"* — 파일명이 명시돼 있다 |
| `platform-watch/references/report-format.md` | **요구하지 않는다.** `.omc/specs/**` 전체 grep 결과, 어느 스펙도 platform-watch의 `references/report-format.md`를 이름으로 부르지 않는다 (`references/report-format.md`를 이름으로 부르는 스펙 줄은 `deep-interview-currency.md:560` 하나뿐이고 그건 currency 것이다 — 이미 레이아웃에 있었다) |
| `rehearsal/references/report-format.md` | **요구하지 않는다.** 원장이 든 `deep-interview-rn-rehearsal.md:594`는 *"리포트·artifacts **경로 규칙** (`.rn-upgrade-kit/rehearsal/reports/YYYY-MM-DD-<target>.md` …)"*이고 §「구현자에게 남기는 미확정 (설계 재량 — 인터뷰에서 다루지 않음)」 아래에 있다 — 경로 문자열을 정할 뿐 참조 파일의 존재를 요구하지 않는다. `:597`은 `log-patterns.md` 얘기라 이 줄의 근거가 아니다 |

**즉 3줄 중 1줄만 형제 스펙 근거가 있고, 2줄은 사실상 "구현이 그렇게 되어 있으니 스펙을 맞췄다"이다 — 사용자가 우려한 순환 논증이 이 2줄에 실제로 있다.**

다만 **결론(§1 레이아웃 갱신) 자체는 기각 대상이 아니다.** `plugin-shell.md:182`가 참조 파일의 물리 구성을 **구현 재량**으로 명시적으로 위임했고(`shared/constants.md`의 물리 포맷 항목과 같은 위상), §1은 인터뷰 산물이 아니라 *"세 스펙이 참조만 하고 정의하지 않은 것을 모은"* 레이아웃 기술(`plugin-shell.md:7`)이다. 재량으로 만든 파일을 레이아웃에 반영하는 건 순환이 아니라 기술 갱신이다.

→ **고칠 것은 원장 `:59`의 근거 문장과 A-20 행의 「스펙 근거」 칸이다.** `:594`를 근거로 세우지 말고 `plugin-shell.md:182`(참조 파일 물리 구성 = 구현 재량) + `deep-interview-rn-rehearsal.md:587`/`deep-interview-currency.md:751`(*"`references/*.md` 지연 로드 패턴을 그대로 따른다"*)로 바꿔야 문장과 실제가 맞는다.

A-19는 이 문제가 없다 — `deep-interview-platform-watch.md:714`가 `enum_promotion_min_count`를 이름으로, 그리고 그 정본 위치를 `shared/constants.md`로 명시한다. §2 「키 정본」 표에 그 행이 없던 건 형제 스펙과의 진짜 불일치다. **A-19는 순환이 아니다.**

---

## (3) 수정이 과했거나 모자란가 — 건별

### A-16 — 범위 정확. 「등급 4값·마킹 3값 어휘를 늘리지 않는다」 제약을 깨지 않는다

수정문 `skills/platform-watch/references/report-format.md:77-78`:

> **`references/watch-targets.md`에서 2차 URL이 `없음`인 항목에는 `이중화 없음`을 병기한다** — 블록과 등급에 무관하게(✅ 항목에도 붙는다). …
>   - 이건 등급도 마킹도 아니다. 🔴🟠✅⚠ 4값과 `[신규]`·`[변경]`·`[미분류]` 3값 어디에도 들어가지 않는 **소스 상태 표기**다 — 어휘를 늘리는 게 아니라 항목 줄에 붙는 꼬리표다.

**이 주장은 성립한다.** 제약을 거는 AC를 전수 확인했다:

- AC `deep-interview-platform-watch.md:526` *"마킹 어휘가 `[신규]`·`[변경]`·`[미분류]` 3값을 벗어나지 않는다"* → 꼬리표는 `[]` 마킹 슬롯을 쓰지 않는다. 수정된 예시 `:59`에서도 `[무변화]`가 그 자리에 그대로 남아 있다.
- AC `:565` *"🟡·⚪가 출력에 존재하지 않는다"* / AC `:564` *"등급이 `f(D-day, 충족 여부)` 순수 함수이며 독립 판정 경로가 존재하지 않는다"* → 꼬리표는 등급 함수의 입력도 출력도 아니다. 그 줄의 `✅` 판정은 변하지 않는다.
- 그리고 **꼬리표를 요구한 건 스펙 자신이다** — `:197`이 `✖ 없음` 행의 「표기」 칸에 *"`없음 (<사유>)` + 리포트에 `이중화 없음` 병기"*라고 직접 적었다. 어휘를 하나 늘리는 결정은 이번 수정이 아니라 스펙이 이미 한 것이고, A-16은 그것을 리포트 정본에 옮긴 것뿐이다.

범위 판단: AC `:552`는 *"리포트에"*라고만 하고 블록·등급을 제한하지 않는다. 「블록·등급 무관」은 **AC보다 넓지도 좁지도 않다.** 핸드오프 스키마(`references/report-format.md` §3)·`state.json`(§2)으로 번지지 않았으므로 과하지도 않다. 병기 대상이 `android/16kb-page-size` 하나뿐인 것도 `watch-targets.md` 7항목 전수 확인으로 맞다(나머지 6항목은 2차가 ①·②·③ 중 하나).

**판정: 범위 정확. 「수정문의 주장이 성립하나」에 대한 답은 예다.**

### A-17 — 기존 표와는 충돌하지 않는다. 그러나 **새 문장 자체가 실행 불가능한 동작을 지시한다** (→ §4 N-2)

충돌 검사 결과:

- degrade 18경로 표(`cur/SKILL.md:245-264`)와 충돌 없음. 12행(*"상수에 기대는 판정만 `확인 못 함`, 리포트는 정상 산출"*)의 표현과 새 문장의 *"스키마 판정만 `확인 못 함`"*이 정확히 같은 모양이다. 표의 행 번호·개수(18)도 그대로다.
- 핸드오프 3상태 표(`:133-139`)와 충돌 없음 — 새 문장은 `schema_version 불일치` 행을 바꾸지 않고 "비교 불가" 경로를 옆에 붙인다.
- AC `deep-interview-currency.md:611`·`:642`·`:643`·`:644`와 충돌 없음. 스펙 §degrade 2분기(`:193-205`)의 *"낡은 하한도 그대로 적용 — 안 쓰는 쪽이 낙관 편향"* 비대칭 논리와도 방향이 같다.
- 스펙 `deep-interview-currency.md:490`의 18경로 재정정 문장과도 충돌 없음.

**모자란 곳도 과한 곳도 아니다 — 다만 마지막 문장이 자기모순이다.** 상세는 §4 N-2.

### A-18 — 그게 전부다 (한 곳 예외는 §4 N-4)

`shared/constants.md`의 16개 키 전부를 `skills/**` 전 파일에서 grep해 참조 지점마다 경로 유무를 확인했다. **`url_candidate_limit` 외에 "어느 파일에서도 경로가 없는" 상수는 남아 있지 않다.** `soak_minor_days`·`soak_patch_days`는 `cur/SKILL.md:184`가, `step_timeout_*`는 `reh/SKILL.md:142` 표 헤더가, `enum_promotion_min_count`는 `pw/references/report-format.md:110`이, `artifact_retention_n`·`worktree_path_template`은 `reh/SKILL.md:237`·`:245`와 `reh/references/report-format.md:29`·`:98`·`:100`·`:131`·`:193`이, `boot_survival_seconds`는 `reh/SKILL.md:212`가, `report_retention_n`은 양쪽 `references/report-format.md:11`·`:13`이, `handoff_path`·`handoff_schema_version`은 `cur/SKILL.md:129`·`:131`과 `pw/references/report-format.md:116`·`:151`이 각각 경로와 함께 준다.

한 곳만 형태가 다르다 — `skills/platform-watch/SKILL.md:111`이 상대경로 접두사 없이 `shared/constants.md`로 적는다. 코드펜스 안 주석이고 실제 Read 지시가 아니므로 저신뢰로 §4 N-4에 둔다.

### A-19 / A-20 — 스펙을 고친 판단

- **A-19: 정당하다. 순환 아님.** `deep-interview-platform-watch.md:714`가 상수 이름과 정본 위치(`shared/constants.md` · 기본 2)를 둘 다 명시하고, `plugin-shell.md:64`가 스스로를 「키 정본」이라 선언하며 `:86`이 *"값 변경은 이 파일 한 곳에서만"*이라고 못박는다. 정본을 자칭하는 표에 형제 스펙이 이름으로 부르는 키가 빠져 있던 것 — 형제 스펙 근거가 실재한다. 갱신 후 `shared/constants.md`(16키)와 `plugin-shell.md` §2(16행)가 정확히 일치하는 것도 확인했다.
- **A-20: 결론 정당 / 근거 문장 거짓.** §2-d 참조. 3줄 중 2줄은 형제 스펙 근거가 없고 구현 근거뿐이다. `plugin-shell.md:182`가 참조 파일 구성을 구현 재량으로 위임했으므로 레이아웃 갱신 자체는 순환이 아니지만, **원장이 그 근거를 쓰지 않고 없는 형제 스펙 요구를 인용한 게 문제다.** 또한 갱신된 §1이 실제 트리와 일치하는지는 `git ls-files` 전수로 확인했다 — `.claude-plugin/plugin.json`·`README.md`·`skills/**` 11파일·`shared/**` 2파일 전부 일치한다(레이아웃이 안 싣는 `.gitignore`·`CLAUDE.md`·`seed/`·`docs/`·`.omc/`는 플러그인 배포물이 아니므로 누락이 아니다).

---

## (4) 라운드 2의 「신규 발견 0」 주장 검증 — **거짓. 신규 3건**

`skills/*/SKILL.md` 3개 + `skills/*/references/*.md` 8개를 스펙 4개의 Acceptance Criteria와 직접 대조했다. **A-01~A-20에 없는 신규 결함 3건이 있다.**

### N-1. 핸드오프 파일 레벨 `scope` 필드의 내용 규칙이 구현 어디에도 없다 — 확정 (신뢰도 HIGH)

**스펙 근거 (두 곳, 원문):**

- `.omc/specs/deep-interview-platform-watch.md:295` (§좁힌 실행의 상태·핸드오프 병합, 표의 「핸드오프」 행):
  *"조회된 항목만 갱신. 미조회 항목은 이전 값을 그대로 싣되 **`stale: <마지막 조회일>`을 부착**. 파일 레벨 `scope`에 이번에 실제 조회된 슬러그를 적는다. **보존할 이전 값이 없으면 `미조회 (한 번도 조회되지 않음)`**"*
- AC `.omc/specs/deep-interview-platform-watch.md:625`:
  *"- [ ] 좁힌 실행 후 파일 레벨 `scope`에 이번에 실제 조회된 슬러그가 기록된다"*

**구현 근거:** `scope`라는 문자열은 `skills/platform-watch/**` 전체에서 **단 한 곳**에만 나온다 —

- `skills/platform-watch/references/report-format.md:122` = `scope: 전체` (핸드오프 예시 frontmatter의 한 줄)

`skills/platform-watch/references/report-format.md:153-164` «규칙» 12줄 어디에도 `scope`가 없고, `skills/platform-watch/SKILL.md:149`(좁힌 실행 병합 규칙)도 `stale`·고정 표기만 다루고 `scope`를 언급하지 않는다. `SKILL.md:104`가 가리키는 리포트 정본에도, `references/cadence.md`에도 없다.

**왜 A-07과 다른가:** A-07이 닫은 것은 AC `:609-610`(미조회 **항목**의 섹션 존치 + 고정 표기 + `stale` 미부착)이다. AC `:625`는 **파일 레벨 메타 필드**에 관한 별개 항목이고, 원장 20건 어디에도 없다.

**왜 결함인가:** 예시 한 줄의 `전체`가 유일한 단서라 좁힌 실행에서 `scope`가 무엇이 되어야 하는지 구현이 알 수 없다. `전체`를 그대로 복사하면 **좁혀 돌린 실행이 전수 실행이라고 주장하는 핸드오프**가 나온다 — 항목별 `stale`이 잡아내는 신선도와 달리 파일 레벨의 이 거짓말은 `currency` 쪽에 감지 수단이 없다(`deep-interview-currency.md:203` *"`오래됨`은 상태가 아니다 — 신선도 임계값 N을 발명하지 않는다"*).

**고칠 곳:** `skills/platform-watch/references/report-format.md` §3 «규칙»에 한 줄 추가 — *"파일 레벨 `scope`에는 이번 실행에서 **실제 조회된 슬러그**를 적는다(전수면 `전체`). 좁힌 실행에서 `전체`를 그대로 남기지 마라 — 파일 레벨 거짓은 `currency`가 감지할 수단이 없다."*

### N-2. A-17이 넣은 문장이 degrade 12에서 구조적으로 불가능한 동작을 지시한다 — 확정 (신뢰도 HIGH)

**구현 근거:** `skills/currency/SKILL.md:131` (이번 라운드 신규 추가 줄, 마지막 문장):

> *"…상수를 못 읽어 비교 자체가 불가능하면 degrade 12로 가고 **스키마 판정만** `확인 못 함`으로 둔다 — **하한은 그대로 적용한다.** 못 읽은 것을 불일치로 취급하지 않는다."*

같은 절 두 줄 위 — `skills/currency/SKILL.md:129`:

> *"경로는 `../../shared/constants.md`의 `handoff_path`. **소유자는 `platform-watch`, 독자는 이 스킬. 단방향이다.**"*

**스펙 근거 (원문):**

- `.omc/specs/plugin-shell.md:68` (§2 키 정본 표): `handoff_path` = `.rn-upgrade-kit/handoff/platform-requirements.md`, 소비자 *"platform-watch(쓰기) · currency(읽기)"* — 핸드오프 경로는 상수다
- `.omc/specs/plugin-shell.md:47`: *"**하드코딩 금지 대상:** 아래 표의 모든 값. 스킬 본문에 숫자를 적지 않고 이 파일을 Read한다."*
- `shared/constants.md:10`: *"**둘 다 실패하면 숫자를 지어내지 마라.** 세 스킬 전부 `상수 도달 실패` degrade 경로를 가진다 — 상수에 기대는 판정만 `확인 못 함`으로 두고…"*
- 대조군 — `platform-watch`는 같은 자리를 명시적으로 처리한다. `skills/platform-watch/SKILL.md:135`: *"`handoff_path`를 못 읽으면 핸드오프 쓰기만 9와 같이 처리한다 — 경로를 지어내 엉뚱한 자리에 쓰면 `currency`는 갱신을 영영 못 본다."*

**왜 결함인가:** degrade 12는 `shared/constants.md`가 `Glob` 폴백까지 실패한 상태다(`cur/SKILL.md:258` · `shared/constants.md:9-10`). 그 상태에서는 `handoff_schema_version`뿐 아니라 **`handoff_path`도 못 읽으므로 `currency`는 핸드오프 파일을 애초에 찾지 못한다.** 따라서 *"하한은 그대로 적용한다"*는 (a) 실행 불가능하거나 (b) 경로를 하드코딩해야만 가능한데 `plugin-shell.md:47`이 그걸 금지한다. 생산자 쪽(`platform-watch` degrade 8)은 이 파급을 한 문장으로 처리해 뒀는데, **소비자 쪽 대응 자리(degrade 12, `cur/SKILL.md:258`)에는 그 문장이 없고, 새로 들어온 `:131`이 오히려 반대 방향을 단언한다.**

이건 A-02(상수 도달 실패 degrade 부재)가 닫은 것과 다르다 — A-02는 degrade 경로의 **존재**를 확인했고, 이건 그 경로가 `handoff_path`에 주는 **파급의 방향이 거꾸로**인 문제다. **라운드 1이 만든 회귀이고, 라운드 2가 「A-16~A-20의 반영 지점을 재검증했다」(`docs/audit-ledger.md:67`)고 적은 바로 그 자리다.**

**고칠 곳:** `skills/currency/SKILL.md:131`의 마지막 문장을 실행 가능한 것으로 교체 —
*"상수를 못 읽으면 `handoff_path`도 못 읽으므로 **핸드오프 자체를 열 수 없다.** 이때는 하한 없이 계산하되 사유를 파일 부재와 구분해 `플랫폼 하한 미반영 (핸드오프 경로 미상 — 상수 도달 실패)`로 적는다. **경로를 지어내지 마라.**"*
그리고 degrade 표 12행(`:258`)의 「결과」 칸에 그 파급을 한 구절 덧붙인다.

### N-3. 스펙 자신의 리포트 예시가 자기 AC `:552`의 반례다 — 확정 (신뢰도 HIGH)

**근거 (한 파일 안의 자기모순, 전부 원문):**

- `.omc/specs/deep-interview-platform-watch.md:472` (§리포트 §구조 예시, 「이미 충족」 블록):
  `✅ D-247 · android/16kb-page-size — 정렬 확인됨      [무변화]`
- 같은 파일 AC `:552`: *"2차가 `없음`인 항목은 리포트에 `이중화 없음`이 병기된다"*
- 같은 파일 `:197`: *"✖ 없음 … `없음 (<사유>)` + 리포트에 `이중화 없음` 병기"*
- `skills/platform-watch/references/watch-targets.md:57`이 그 슬러그의 2차를 확정: *"**2차:** **없음** (후보 3개가 전부 실측에서 탈락 …)"*

**왜 결함인가:** A-16이 구현 쪽 `references/report-format.md:59`에서 고친 것과 **같은 슬러그·같은 블록·같은 모양의 반례**가 스펙 원문에 그대로 남아 있다. 원장 A-16은 이 결함을 *"포맷 정본의 예시가 규칙의 반례였다"*라고 정확히 서술해 놓고 스펙 쪽 쌍둥이는 지나쳤다. A-19·A-20에서 스펙을 고칠 용의를 이미 보였으므로 「스펙은 안 고친다」로 방어되지 않는다.

**고칠 곳:** `.omc/specs/deep-interview-platform-watch.md:472`를 `✅ D-247 · android/16kb-page-size — 정렬 확인됨 · 이중화 없음      [무변화]`로 바꾸거나, 그 예시가 2026-08-18 실측 이전 산물임을 한 줄 주석으로 명시한다.

### N-4. (저신뢰 · Open Question) `pw/SKILL.md:111`의 상수 파일 참조가 상대경로 형태가 아니다

**구현:** `skills/platform-watch/SKILL.md:111` = `.rn-upgrade-kit/handoff/platform-requirements.md   ← 경로는 shared/constants.md의 handoff_path`
**스펙:** `.omc/specs/plugin-shell.md:45` *"스킬 본문에서 상대 경로로 참조한다: `../../shared/constants.md`."* · `shared/constants.md:7` *"스킬은 **자기 파일 위치 기준** 상대경로로 Read한다 — `SKILL.md`에서 `../../shared/constants.md`"*

같은 파일 `:60`·`:98`은 `../../shared/constants.md`로 적는다. **다만 `:111`은 코드펜스 안 출력 경로 목록의 화살표 주석이지 Read 지시가 아니고, 실제 Read 지시는 `references/report-format.md:116`이 `../../../shared/constants.md`로 정확히 준다.** 저자가 "주석이지 지시가 아니다"로 즉시 반박 가능하므로 확정 결함으로 세지 않는다.

### 대조 범위 — 어떤 AC 그룹을 실제로 봤나

「0건」 주장을 검증하려면 대조 범위가 있어야 하므로 나열한다. 아래 **AC 그룹 전부를 항목 단위로 구현과 대조**했다(AC 체크박스 합계 약 190개).

**`deep-interview-platform-watch.md` AC `:512-637` — 12그룹**
정체성·상태(4) / 동일성 키·마킹(7) / 날짜(6) / 현재값(5) / 소스 도달(11) / 등급·리포트(8) / 호스트(5) / 스코프 인자(5) / 산출물(12) / 핸드오프(16) / **좁힌 실행의 병합(5)** / 참조 파일 스키마(6)
→ 대조 상대: `skills/platform-watch/SKILL.md`(167줄 전수) · `references/report-format.md`(173줄 전수) · `references/watch-targets.md`(120줄 전수) · `references/cadence.md`(12줄 전수)
→ **적발: 「좁힌 실행의 병합」 그룹의 AC `:625` (N-1). 나머지 11그룹 통과.** 특히 `:598-601`(보존 상한 보고·`자동 정리` 문구 부재·`currency`와 글자까지 같은 표기·같은 상수 참조), `:609-610`(고정 표기·`stale` 미부착·`urgency` 고정 표기), `:614-619`(파일 레벨 메타 3필드·`urgency` 3값·같은 임계일), `:634-635`(`allowed-tools`/`disallowed-tools`)를 각각 구현 줄과 1:1로 확인했다.

**`deep-interview-currency.md` AC `:592-724` — 13그룹**
수집·이식성(8) / 핸드오프 `urgency`·`stale`(6) / 인자 문법(3) / 델타(10) / 범위·하한(5) / **핸드오프(10)** / 게이트·권장 버전(15) / 등급·리포트 블록(7) / 스냅샷·네이티브(7) / rehearsal 간선(5) / 스코프 인자(8) / 산출물(11) / 서브에이전트(2)
→ 대조 상대: `skills/currency/SKILL.md`(293줄 전수) · `references/report-format.md`(106줄 전수) · `references/sources.md`(63줄 전수) · `references/cadence.md`(11줄 전수)
→ **적발: 「핸드오프」 그룹에서 degrade 12 ↔ `handoff_path` 상호작용 (N-2). 나머지 12그룹 통과.**
→ 부수 확인: `deep-interview-currency.md:760-768`의 seed `report-format.md` 7개 수정과 `:770-774`의 `cadence.md` 3개 수정 — **10건 전부 반영돼 있다**(`plugin-shell.md:27-28`의 「7개 수정」·「3개 수정」 표기와 실제가 일치).

**`deep-interview-rn-rehearsal.md` AC `:490-564` — 3그룹**
본 AC(40) + 스킬 표면·식별자(9) + 구현 감사 반영(20)
→ 대조 상대: `skills/rehearsal/SKILL.md`(367줄 전수) · `references/report-format.md`(197줄 전수) · `references/log-patterns.md`(70줄 전수)
→ **적발 0.** `:535`(`allowed-tools` = `Read Write Glob Bash WebFetch`, `Agent`·`WebSearch` 없음)는 구현 `:6`과 정확히 일치하고, **rehearsal AC는 `disallowed-tools`를 요구하지 않는다** — 원장이 그 지적을 폐기한 것은 옳다(platform-watch AC `:635`·currency AC `:598`만 요구하고 둘 다 충족). `:547-564`(구현 감사 반영 20항)는 `SKILL.md:64-85`·`:124-152`·`:228-239`·`:245-260`·`:283-288`·`:326-359`와 `references/report-format.md:105-131`·`:166-181`, `references/log-patterns.md:58-59`에 각각 대응한다.

**`plugin-shell.md` §1~§5 전체**
디렉터리 레이아웃 / §2 키 정본 16행 / §3 `plugin.json` / §4 README 필수 절 6항 / §5 미해결 위임
→ 대조 상대: 실제 트리(`git ls-files` 전수) · `.claude-plugin/plugin.json` 실물 · `shared/constants.md` · `shared/lockstep-sets.md`
→ **적발 0.** §2 16행 = `constants.md` 16키 정확히 일치. `plugin.json`은 §3의 `name`·`version`·`description`·`author` 전 필드 일치.

**스펙 내부 정합성 (교차 대조)** — `deep-interview-platform-watch.md` §리포트 예시(`:446-484`) ↔ 자기 AC(`:512-637`)
→ **적발: N-3.**

**대조에서 제외한 것:** `README.md`(판정 기준 5종에 없음) · `docs/audit-2026-08-12.md`(원 감사 문서, 라운드 0이 이미 소진) · `seed/**`(정본이지 대조 대상이 아님 — 다만 포팅 수정 10건의 반영 여부는 위에서 확인).

---

## 판정 근거 정리

- **라운드 0의 15건:** 실질 판정은 전수 유효. **줄 번호 3곳이 원장 자신의 「현재 트리 기준」 선언을 위반**(A-07 2곳, A-18·A-19가 공유하는 `:108` 1곳) — 이번 라운드의 A-16 수정이 만든 +2 시프트를 반영하지 않았다.
- **라운드 1의 5건:** A-16·A-17·A-18·A-19는 **진짜다** — 인용이 원문 그대로 있고 논리가 결함에 도달한다. 취향을 스펙으로 포장한 건은 없다. A-20은 결론은 유효하나 **근거 문장이 사실이 아니다**(형제 스펙이 요구했다는 3줄 중 1줄만 참).
- **수정 범위:** A-16 정확(어휘 제약 미위반, 주장 성립) / A-17 기존 표와 무충돌이나 **자기모순 문장 내포** / A-18 완결 / A-19 정당·비순환 / A-20 결론 유지·근거 교체 필요.
- **라운드 2의 「신규 발견 0」:** **거짓.** 스펙 인용 가능한 신규 3건(N-1·N-2·N-3, 전부 신뢰도 HIGH). N-2는 라운드 1의 수정이 직접 만든 회귀라, 원장 `:67`이 재검증 축으로 든 *"A-16~A-20의 반영 지점"*을 실제로는 보지 않았음을 보여준다.

**종료 조건은 아직 충족되지 않았다.** 원장의 「미해결 잔여: 없음」(`:77`)과 「라운드 수 3 — 최대 5 미도달」(`:74`)은 정정 대상이다.

---

판정: REJECTED — (1) `skills/currency/SKILL.md:131` 마지막 문장 *"하한은 그대로 적용한다"*를 `handoff_path` 파급이 반영된 문장으로 교체하고 degrade 12행(`:258`)에 그 파급을 명시할 것 (N-2). (2) `skills/platform-watch/references/report-format.md` §3 «규칙»에 파일 레벨 `scope` 기록 규칙을 추가할 것 — AC `deep-interview-platform-watch.md:625` 미충족 (N-1). (3) `.omc/specs/deep-interview-platform-watch.md:472` 예시에 `이중화 없음`을 병기해 자기 AC `:552`의 반례를 제거할 것 (N-3). (4) 원장 A-07의 `references/report-format.md:140-146`·`:159-162`를 `:142-148`·`:161-164`로, A-18·A-19의 `references/report-format.md:108`을 `:110`으로 현재 트리에 맞출 것. (5) 원장 `:59`와 A-20 「스펙 근거」 칸에서 `deep-interview-rn-rehearsal.md:594`를 근거로 세운 부분을 삭제하고 `plugin-shell.md:182`(참조 파일 물리 구성 = 구현 재량)로 교체할 것 — 지금 문장은 없는 형제 스펙 요구를 인용한다. (6) N-1~N-3을 A-21~A-23으로 원장에 append하고 「라운드 2 — 신규 발견 0」 절을 「신규 3건」으로 정정한 뒤 라운드 3을 돌릴 것.
