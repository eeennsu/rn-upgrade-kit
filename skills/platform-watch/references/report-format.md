# platform-watch — 리포트 · 상태 · 핸드오프 포맷

조회(SKILL.md §0~§4)가 끝난 뒤에만 필요하다.

## 1. 리포트

### 경로

`.rn-upgrade-kit/platform-watch/reports/YYYY-MM-DD.md`

- **날짜는 컨텍스트 현재 날짜 단일 소스에서 파생한다.** 파일명과 본문 헤더가 같은 값에서 나와야 한다. **rename으로 날짜를 갱신하지 마라** — 갱신하려면 다시 실행해 새로 쓴다.
- **같은 날 재실행이면 덮어쓴다.** 시각 suffix를 붙이지 않는다 — 붙이면 보존 상한 계산이 "12일"이 아니라 "12파일"로 흔들린다. 스코프를 좁혀 돌렸어도 파일을 쪼개지 않는다(헤더의 스코프 줄이 그 사실을 담는다).
- **보존 상한** = `../../../shared/constants.md`의 `report_retention_n`. 초과분 자동 정리하고 **정리한 개수를 리포트 말미에 한 줄로 보고한다** — 조용히 지우면 사용자가 사라진 파일을 찾다 헤맨다.

### 4블록 구조

| 블록 | 정렬 | 등급 |
| --- | --- | --- |
| 1. 미충족 | D-day 오름차순 | 🔴 🟠 |
| 2. 확인 못 함 | D-day 정렬 축 **밖** | ⚠ |
| 3. 이미 충족 | 하단 별도 블록 | ✅ |
| 4. 미조회 (사용자 지정 스코프) | 별도 블록 | 없음 |

- **✅를 미충족과 같은 정렬에 섞지 마라.** 섞으면 D-day 오름차순이 "급한 것 먼저"를 못 지킨다.
- **✅ 항목도 빼지 마라.** "점검했는데 통과"와 "점검 안 함"은 구분돼야 한다.
- **블록 4를 ⚠와 절대 섞지 마라.** ⚠는 사용자가 할 일이 있는 상태이고 미조회는 없다. 항목이 많으면 슬러그 나열 한 줄로 압축해도 된다.

### 포맷

```
# 플랫폼 마감 감사 — 2026-08-16
호스트: Windows 11 · 직전 실행: 2026-08-09 · 스코프: 전체

## 미충족
🔴 D-113 · android/target-sdk · targetSdk ≥ 36        [무변화]
   현재: 35 (android/build.gradle)
   원문: "August 31, 2026" · 근거: https://developer.android.com/…

🟠 D-478 · ios/min-deployment-target · iOS ≥ 15.1     [변경 D-485→D-478]
   현재: 충돌 — Podfile 14.0 / project.pbxproj 15.0 → 14.0 기준 판정
   원문: "starting April 2027" (월 단위 — D-day 미계산, 정렬 초일 기준)
   근거: https://developer.apple.com/…

## 확인 못 함
⚠ play/data-safety — 마감일 확인 못 함 (소스 도달 실패)
   1차 support.google.com/…  404
   2차 play.google.com/console/…  404
   URL 이동 의심 — 후보: support.google.com/googleplay/android-developer/answer/…
   → references/watch-targets.md 수정 필요

⚠ ios/privacyinfo-required — 현재값 확인 못 함 (경로 부재)
   마감: 2026-05-01 (확정) · 근거: https://developer.apple.com/…
   → ios/ 하위에서 PrivacyInfo.xcprivacy 경로를 찾지 못함

## 이미 충족
✅ D-247 · android/16kb-page-size — 정렬 확인됨      [무변화]

## 미조회 (사용자 지정 스코프)
(없음)

## enum 승격 후보
· "Play 신규 정책 X" — 2회 연속 [미분류]로 관측됨

## 정리
핸드오프: .rn-upgrade-kit/handoff/platform-requirements.md 갱신 (일부 항목 stale 없음)
리포트 보존 12개, 자동 정리 1개
```

- 각 항목에 **슬러그를 함께 출력한다.**
- **근거 링크 없는 마감일·요구사항 주장은 리포트에 실리지 않는다.**

## 2. 상태 파일

`.rn-upgrade-kit/platform-watch/state.json` — 덮어쓰기 1개, **표기 전용**.

```json
{
  "schema_version": 1,
  "last_run": "2026-08-16",
  "entries": {
    "android/target-sdk": { "requires": "36", "deadline": "2026-08-31", "last_seen": "2026-08-16" }
  }
}
```

- **어떤 판정에도 입력으로 쓰지 않는다.** 등급·충족 여부·날짜 전부 이번 실행의 조회에서 나온다.
- `schema_version`이 다르거나 파싱 실패면 **델타 마킹만 생략**하고 전수 리포트는 정상 산출한다.
- **좁힌 실행은 병합한다.** 조회된 슬러그만 갱신하고 미조회 슬러그의 이전 엔트리는 보존한다 — 덮어쓰면 다음 전수 실행에서 `[신규]`로 오탐된다.

## 3. 핸드오프 파일

경로는 `../../../shared/constants.md`의 `handoff_path`. **소유자는 이 스킬, 독자는 `currency`. 단방향이다** — `currency`의 산출물을 읽지 않는다.

```markdown
---
schema_version: 1
generated: 2026-08-16
scope: 전체
---

## android/target-sdk
- requires: targetSdk ≥ 36
- deadline: 2026-08-31 (확정)
- urgency: 임박
- current: 35 (android/build.gradle)
- status: 미충족
- source: https://developer.android.com/…

## ios/min-deployment-target
- requires: iOS ≥ 15.1
- deadline: 2027-04 (저정밀 — 정렬 초일 2027-04-01)
- urgency: 여유
- current: 충돌 — Podfile 14.0 / project.pbxproj 15.0 → 14.0
- status: 미충족
- source: https://developer.apple.com/…
- stale: 2026-08-09
```

### 규칙

- **`rn_floor` 계열 필드는 아예 없어야 한다.** 필드가 있으면 채우려는 압력이 생긴다. **이 파일에 RN 버전을 언급하지 않는다.**
- **미충족만 싣지 말고 전수로 싣는다.** 충족 여부는 `status`로 구분한다 — `currency`가 "이미 충족"을 알면 하한 계산에서 제외 근거로 쓴다. 비용은 0이다.
- **`urgency`는 SKILL.md §4 등급의 🔴/🟠 분기와 같은 함수·같은 임계일에서 나온다.** 같은 항목이 리포트 🔴인데 핸드오프 `여유`인 상태는 발생할 수 없다.
  - `임박` = D-day ≤ 임계일 / `여유` = 초과 / `판정 불가` = D-day 미계산
- **`stale`은 이번 실행에서 조회되지 않은 항목에만 붙인다.** 값 = 마지막으로 조회된 날짜. `currency`는 `stale` 항목의 값도 그대로 쓴다 — 표기용이지 판정용이 아니다.
- **좁힌 실행은 병합한다.** 미조회 항목을 삭제하거나 값을 비우지 마라 — `currency`가 하한과 `current`를 조용히 잃는다.

### `currency` 쪽 계약 (참고 — 여기서 강제하지 않는다)

1. 이 파일을 읽어 권장 버전 **범위의 하한**으로 쓴다.
2. 번역(`targetSdk 36 → RN 0.7x`)의 **근거 링크를 자기 리포트에 남긴다.**
3. 근거를 못 찾으면 하한을 만들지 말고 `번역 확인 못 함`으로 남긴다.
4. 파일이 없으면 하한 없이 계산하고 `플랫폼 하한 미반영`을 적는다.
5. `current`는 `currency` 스냅샷 헤더의 `targetSdk`·iOS min의 **유일한 공급원**이다.
6. `urgency`는 정책 하한 항목의 🔴/🟠 분기의 **유일한 공급원**이다.
