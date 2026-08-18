# 루프 인계 — 다음 세션은 여기서부터

**작성:** 2026-08-18 · 세션 `1409c832-e6d3-411e-b230-13c87a9faed5`
**중단 사유:** 사용자 지시로 루프 중지. 작업이 끝나서 멈춘 게 아니다 — **리뷰어가 REJECTED를 냈고 미반영 지적 6건이 남아 있다.**

---

## 0. 30초 요약

`rn-upgrade-kit`이 스펙대로 세팅됐는지 수렴할 때까지 감사·수정하는 ralph 루프였다.

- **라운드 0** — 기존 감사(`docs/audit-2026-08-12.md`) 15건 재검증 → 전부 처리 완료 상태 확인 (A-01~A-15)
- **라운드 1** — 스펙 대비 신규 5건 발견·수정 (A-16~A-20)
- **라운드 2** — 자체 판단은 "신규 0건, 수렴" 이었으나 **독립 리뷰어가 이 주장을 기각했다**
- **리뷰어 판정: REJECTED** — 신규 결함 3건(N-1·N-2·N-3) + 원장 정정 3건. 상세는 `docs/review-round2-2026-08-18.md`

**따라서 원장 `docs/audit-ledger.md`의 「라운드 2 — 신규 발견 0」·「미해결 잔여: 없음」은 거짓이고 정정 대상이다.**

---

## 1. 지금 트리 상태

| 항목 | 값 |
| --- | --- |
| 브랜치 | `fix/audit-2026-08-12-reflection` |
| HEAD | `cb603be` — *"fix: 구현 감사 15건 반영 + 실측으로 드러난 3건 추가 수정"* |
| 미커밋 변경 | 4파일 (아래) |
| 신규 untracked | `docs/` 아래 4파일 |

> **주의:** 세션 시작 시점의 `git status`는 `main` + 대량 미커밋이었는데, 세션 중에 `fix/audit-2026-08-12-reflection` 브랜치의 `cb603be`로 커밋된 상태가 됐다. 내가 커밋하지 않았다 — 훅이나 병렬 프로세스로 보인다. **다음 세션은 브랜치를 먼저 확인하라.**

### 미커밋 변경 (라운드 1의 수정 5건)

```
 M .omc/specs/plugin-shell.md                        (A-19, A-20)
 M skills/currency/SKILL.md                          (A-17)
 M skills/platform-watch/SKILL.md                    (A-18)
 M skills/platform-watch/references/report-format.md (A-16)
```

### 신규 파일 (untracked)

| 파일 | 내용 |
| --- | --- |
| `docs/audit-ledger.md` | **감사 원장.** append-only. A-01~A-20 판정 + 라운드 2 수렴 주장(거짓 — 정정 필요) |
| `docs/review-round2-2026-08-18.md` | **리뷰어 리포트 전문.** REJECTED 판정 + N-1~N-4 + 대조 범위. 다음 세션의 1차 입력 |
| `docs/loop-prd-snapshot.json` | 이 루프의 PRD(US-001~US-006). 세션 state는 사라지므로 스냅샷을 여기 남겼다 |
| `docs/loop-confirm.md` | 이 파일 |

---

## 2. 루프의 판정 기준 (이걸 안 지키면 같은 실수를 반복한다)

원 지시가 못박은 것 — **이것 밖은 개선사항이 아니다:**

- `.omc/specs/*.md` (스펙 원본 4개) — **각 스펙의 `## Acceptance Criteria` 절이 가장 검증 가능한 축이다**
- `CLAUDE.md` (3스킬 구조, `platform-watch` → `currency` 단방향 핸드오프)
- `seed/rn-currency-SKILL.md` (리포트 문체·구조 기준)
- `shared/constants.md`, `shared/lockstep-sets.md` (공유 상수 일관성)

라운드 절차:

1. `skills/**/SKILL.md` + `references/*.md` 전체를 스펙과 대조
2. 발견 각 건에 `구현 file:line` + `스펙 file:line + 원문 인용`을 붙인다. **인용을 못 붙이면 폐기한다(= 취향 문제)**
3. 살아남은 건만 `docs/audit-ledger.md`에 append
4. 수정 반영
5. **리뷰어에게 재점검 위임 — 같은 컨텍스트에서 자가 승인 금지**

종료 조건: 한 라운드에서 스펙 인용 가능한 신규 발견 0건 / ledger에 이미 판정된 항목 재발견 금지 / 최대 5라운드.

문서화하지 않는 것: 스펙에 없는 신규 기능 제안 · 문체 취향 · 리팩터링 아이디어.

**현재 소진한 라운드: 3개(0·1·2). 리뷰어가 라운드 2를 기각했으므로 다음은 라운드 3이고, 상한 5까지 2라운드 남았다.**

---

## 3. 다음 세션이 할 일 — 리뷰어 지시 6건

`docs/review-round2-2026-08-18.md:265`의 REJECTED 사유를 그대로 옮긴다. **(1)~(3)이 실제 결함이고 (4)~(5)는 원장 정정, (6)이 절차다.**

### (1) N-2 — `currency` degrade 12의 `handoff_path` 파급 (신뢰도 HIGH · **라운드 1이 만든 회귀**)

`skills/currency/SKILL.md:131`(A-17이 추가한 줄)의 마지막 문장:

> *"상수를 못 읽어 비교 자체가 불가능하면 degrade 12로 가고 스키마 판정만 `확인 못 함`으로 둔다 — **하한은 그대로 적용한다.**"*

**문제:** degrade 12는 `shared/constants.md`가 `Glob` 폴백까지 실패한 상태다. 그 상태에서는 `handoff_schema_version`뿐 아니라 **`handoff_path`도 못 읽으므로 핸드오프 파일을 애초에 열 수 없다.** 따라서 "하한은 그대로 적용한다"는 실행 불가능하거나 경로 하드코딩을 요구하는데 `plugin-shell.md:47`이 그걸 금지한다. 생산자 쪽(`skills/platform-watch/SKILL.md:135`)은 같은 파급을 한 문장으로 처리해 뒀는데 소비자 쪽에 그 대응이 없다.

**고칠 곳:** `skills/currency/SKILL.md:131` 마지막 문장을 교체 + degrade 표 12행(`:258`)의 「결과」 칸에 파급 명시. 리뷰어 제안 문안:

> *"상수를 못 읽으면 `handoff_path`도 못 읽으므로 **핸드오프 자체를 열 수 없다.** 이때는 하한 없이 계산하되 사유를 파일 부재와 구분해 `플랫폼 하한 미반영 (핸드오프 경로 미상 — 상수 도달 실패)`로 적는다. **경로를 지어내지 마라.**"*

### (2) N-1 — 핸드오프 파일 레벨 `scope` 기록 규칙 부재 (신뢰도 HIGH)

**스펙:** `.omc/specs/deep-interview-platform-watch.md:295` *"파일 레벨 `scope`에 이번에 실제 조회된 슬러그를 적는다"* · AC `:625` *"좁힌 실행 후 파일 레벨 `scope`에 이번에 실제 조회된 슬러그가 기록된다"*

**구현:** `scope` 문자열이 `skills/platform-watch/**` 전체에서 단 한 곳 — `references/report-format.md:122`의 예시 `scope: 전체`뿐. §3 «규칙» 12줄에도, `SKILL.md:149`(좁힌 실행 병합)에도 없다.

**왜 결함인가:** 좁힌 실행에서 `전체`를 그대로 복사하면 **좁혀 돌린 실행이 전수라고 주장하는 핸드오프**가 나온다. 항목별 `stale`과 달리 파일 레벨의 이 거짓말은 `currency`가 감지할 수단이 없다(`deep-interview-currency.md:203` — 신선도 임계값을 발명하지 않기로 했다).

**고칠 곳:** `skills/platform-watch/references/report-format.md` §3 «규칙»에 한 줄 추가.

### (3) N-3 — 스펙 자신의 리포트 예시가 자기 AC의 반례 (신뢰도 HIGH)

`.omc/specs/deep-interview-platform-watch.md:472`:

```
✅ D-247 · android/16kb-page-size — 정렬 확인됨      [무변화]
```

같은 파일 AC `:552`가 *"2차가 `없음`인 항목은 리포트에 `이중화 없음`이 병기된다"*를 요구하고 `watch-targets.md:57`이 그 슬러그의 2차를 `없음`으로 확정했다. **A-16이 구현 쪽에서 고친 것과 같은 슬러그·같은 블록의 쌍둥이 반례가 스펙에 남아 있다.**

**고칠 곳:** `:472`에 `· 이중화 없음` 병기, 또는 그 예시가 2026-08-18 실측 이전 산물임을 주석으로 명시.

### (4) 원장 줄 번호 정정 — A-16 수정이 만든 +2 시프트 미반영

`docs/audit-ledger.md:19`가 *"근거 file:line은 **현재 트리 기준**"*이라 선언했는데 3곳이 HEAD 기준이다:

| 원장 위치 | 현재 표기 | 고쳐야 할 값 |
| --- | --- | --- |
| A-07 | `pw/references/report-format.md:140-146` | `:142-148` |
| A-07 | `pw/references/report-format.md:159-162` | `:161-164` |
| A-18·A-19 | `pw/references/report-format.md:108` | `:110` |

> 이 세션에서 `skills/currency/SKILL.md`와 `.omc/specs/plugin-shell.md`의 시프트는 이미 정정했다. **`platform-watch/references/report-format.md`만 놓쳤다.**

### (5) A-20의 근거 문장 교체 — 없는 형제 스펙 요구를 인용했다

원장 `docs/audit-ledger.md:59`가 *"두 건 다 다른 스펙 파일이 구현 쪽을 요구한 것"*이라 적었으나, §1에 추가한 3줄 중 **1줄만 형제 스펙 근거가 있다:**

| 추가한 줄 | 형제 스펙이 요구하나 |
| --- | --- |
| `platform-watch/references/cadence.md` | **요구한다** — `deep-interview-platform-watch.md:706` |
| `platform-watch/references/report-format.md` | **요구하지 않는다** — 어느 스펙도 이름으로 부르지 않는다 |
| `rehearsal/references/report-format.md` | **요구하지 않는다** — 인용한 `deep-interview-rn-rehearsal.md:594`는 *경로 규칙*이지 파일 존재 요구가 아니다 |

**결론(레이아웃 갱신) 자체는 기각 대상이 아니다** — `plugin-shell.md:182`가 참조 파일의 물리 구성을 **구현 재량**으로 위임했기 때문이다. 고칠 것은 **근거 문장**이다: `deep-interview-rn-rehearsal.md:594` 인용을 빼고 `plugin-shell.md:182` + `deep-interview-rn-rehearsal.md:587`/`deep-interview-currency.md:751`(*"`references/*.md` 지연 로드 패턴을 그대로 따른다"*)로 교체.

### (6) 절차 — 원장 갱신 후 라운드 3

- N-1·N-2·N-3을 **A-21·A-22·A-23**으로 원장에 append (append-only 원칙 유지 — 기존 행을 지우지 말고 라운드 3 절을 새로 연다)
- 「라운드 2 — 신규 발견 0」 절을 **「신규 3건 — 리뷰어 적발」**로 정정
- 「종료」 절의 *"미해결 잔여: 없음"* 정정
- 수정 반영 후 **다시 독립 리뷰어에게 위임** (자가 승인 금지)

---

## 4. 함정 — 이걸 모르면 같은 데서 또 막힌다

### 4-1. 서브에이전트가 리포트 본문을 통째로 잃는다

이 세션에서 **두 번** 발생했다. `oh-my-claudecode:architect`에 위임했더니 256k 토큰·24 도구호출을 쓰고 반환값이 `"대기 중."` 한 줄. 재전송하니 `"REJECTED. 완료."` 한 줄 — 근거 0.

**해법(실제로 통했다):** 리포트를 **파일로 Write하게 하고 반환은 한 줄로** 시킨다.

> 최종 리포트를 `<경로>`에 Write하라. 반환 텍스트는 `WROTE: <경로> | 판정: … | 신규발견 N건` 한 줄이면 된다. 앞선 리뷰어가 본문을 통째로 잃었으므로 파일이 정본이다.

`oh-my-claudecode:critic` + 파일 출력 조합으로 288k 토큰·46 도구호출에 32KB 리포트가 정상 회수됐다. **다음 세션도 이 방식을 쓸 것.**

### 4-2. 마크다운 파일을 고치면 아래 줄 번호가 전부 밀린다

이 repo는 실행 코드가 없고 전부 명세다. 원장이 `file:line`으로 근거를 대므로 **수정할 때마다 원장의 줄 번호가 썩는다.** 리뷰어가 잡아낸 (4)번이 정확히 그거다.

**규칙: 파일을 고친 직후 그 파일을 인용한 원장 행을 즉시 재확인한다.** `sed -n '<n>p' <file>`로 한 줄씩 찍어보면 된다.

### 4-3. `python - <<'PY'` 히어독이 이 환경에서 안 돈다

Windows Store 파이썬 스텁에 막혀 `Python`만 출력하고 스크립트가 실행되지 않았다. 실패가 조용하다. **`sed -i`를 써라.**

### 4-4. 스펙을 고칠 때는 순환 논증을 경계하라

A-19·A-20에서 구현이 아니라 **스펙**을 고쳤다. 정당한 경우가 있다(형제 스펙이 구현 쪽을 요구하는데 `plugin-shell.md`만 뒤처진 A-19). 하지만 A-20처럼 *"구현이 그렇게 되어 있으니 스펙을 맞춘다"*가 섞이면 감사가 무의미해진다. **판단 근거를 원장에 적을 때 그 근거가 실제로 스펙에 있는지 grep으로 확인하라.**

---

## 5. 참고 — 이 repo 구조 (다시 읽지 않아도 되게)

```
.omc/specs/          스펙 원본 4개 (deep-interview-{platform-watch,currency,rn-rehearsal}.md + plugin-shell.md)
                     각 파일의 ## Acceptance Criteria 절이 대조 축
skills/
  platform-watch/    SKILL.md + references/{watch-targets,report-format,cadence}.md
  currency/          SKILL.md + references/{report-format,sources,cadence}.md
  rehearsal/         SKILL.md + references/{report-format,log-patterns}.md
shared/              constants.md (16키) · lockstep-sets.md
seed/                포팅 원본 (rn-currency 단일 스킬 시절) — 리포트 문체·구조 기준
docs/                감사 산출물 (아래)
```

핸드오프: `platform-watch` ──파일──▶ `currency` ──커맨드 블록──▶ `rehearsal`. **단방향, 역방향 의존 없음.**

### 리뷰어가 확인해준 것 (다시 안 해도 됨)

- 라운드 0의 15건 중 **13건은 줄 번호·인용문·폐쇄 관계 전부 성립** (틀린 건 위 (4)의 3곳뿐)
- 라운드 1의 A-16·A-17·A-18·A-19는 **진짜 결함** — 인용이 원문 그대로 있고 논리가 도달한다. 취향을 스펙으로 포장한 건 없다
- A-16의 `이중화 없음` 꼬리표가 **등급 4값·마킹 3값 어휘 제약을 깨지 않는다** (AC `:526`·`:564`·`:565`로 확인)
- `deep-interview-rn-rehearsal.md` AC 전수(69항) **적발 0** — rehearsal AC는 `disallowed-tools`를 요구하지 않으므로 그 지적을 폐기한 건 옳다
- `plugin-shell.md` §2 16행 = `shared/constants.md` 16키 **정확히 일치**
- seed 포팅 수정 10건(`report-format.md` 7 + `cadence.md` 3) **전부 반영돼 있다**

---

## 6. 재개 방법

```
/oh-my-claudecode:ralph  (원 지시 그대로 재투입)
```

재개 직후 순서:

1. `docs/review-round2-2026-08-18.md` 정독 — 이게 라운드 3의 입력이다
2. `docs/audit-ledger.md` 로 판정 이력 확인 (A-01~A-20 재발견 금지)
3. `git status` · `git rev-parse --abbrev-ref HEAD` 로 브랜치·미커밋 확인
4. 위 §3의 (1)~(6)을 순서대로 반영
5. **파일 출력 방식**으로 리뷰어 재위임 (§4-1)

PRD는 `docs/loop-prd-snapshot.json`에 있다. 현재 상태: **US-001~US-004 사실상 완료, US-005(리뷰어 재점검)에서 반려, US-006(수렴) 미충족.**
