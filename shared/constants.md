# rn-upgrade-kit — 공용 상수

세 스킬이 **같은 값을 봐야 하는** 상수의 정본. 스킬 본문·`references/*`에 숫자를 복제하지 마라 — 한쪽만 바뀌는 드리프트가 이 파일이 존재하는 이유다.

스킬에서 상대 경로로 Read한다: `../../shared/constants.md`

## 값

| 키 | 값 | 소비자 |
| --- | --- | --- |
| `handoff_path` | `.rn-upgrade-kit/handoff/platform-requirements.md` | platform-watch(쓰기) · currency(읽기) |
| `handoff_schema_version` | `1` | platform-watch(쓰기) · currency(검증) |
| `report_retention_n` | `12` | platform-watch · currency |
| `artifact_retention_n` | `3` | rehearsal |
| `grade_threshold_days` | `90` | platform-watch (등급 · `urgency`) |
| `soak_minor_days` | `14` | currency (게이트 3) |
| `soak_patch_days` | `7` | currency (게이트 3) |
| `target_staleness_warn_days` | `14` | rehearsal (산정 시각 경과 경고) |
| `boot_survival_seconds` | `60` | rehearsal (T2 통과 조건 1) |
| `url_candidate_limit` | `3` | platform-watch (URL 이동 의심 후보) |
| `enum_promotion_min_count` | `2` | platform-watch (`[미분류]` enum 승격 후보 제안) |

## 왜 여기 있나

- **`report_retention_n`이 12이고 `artifact_retention_n`이 3인 건 실수가 아니다.** 두 advisory 스킬은 마크다운 수 KB를 쌓고 rehearsal은 실행당 수십 MB를 쌓는다 — 매체가 다르므로 성격에서 파생된 정당한 차이다. 두 advisory 스킬끼리는 **반드시 같아야** 한다.
- **`report_retention_n`에는 기능적 하한 2가 있다.** currency는 델타 표기를 직전 리포트 파일에서 뽑는다 — 1이면 델타 줄이 영구히 빈다.
- **`grade_threshold_days`는 platform-watch만 소비한다.** currency는 이 값을 다시 계산하지 않고 핸드오프의 `urgency` 필드를 읽는다. 재료를 가진 쪽이 계산해 넘긴다.
- **`handoff_path`가 여기 있는 이유**는 소유자와 독자가 다르기 때문이다. 양쪽 스킬에 각각 적으면 나중에 한쪽만 바뀌어 조용히 끊긴다.
- **`target_staleness_warn_days`가 `soak_minor_days`와 같은 14인 건 우연이 아니다.** 권장 버전이 한 soak 주기만큼 묵었으면 그 사이 새 stable이 나왔을 수 있다.

## 항목별 덮어쓰기

`grade_threshold_days`만 항목별로 덮어쓸 수 있다 — `skills/platform-watch/references/watch-targets.md`의 항목 필드. 나머지는 전역이다.
