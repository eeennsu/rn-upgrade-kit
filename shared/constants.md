# rn-upgrade-kit — 공용 상수

세 스킬이 **같은 값을 봐야 하는** 상수의 정본. 스킬 본문·`references/*`에 숫자를 복제하지 마라 — 한쪽만 바뀌는 드리프트가 이 파일이 존재하는 이유다.

## 이 파일에 도달하는 법

스킬은 **자기 파일 위치 기준** 상대경로로 Read한다 — `SKILL.md`에서 `../../shared/constants.md`, `references/*.md`에서 `../../../shared/constants.md`.

- **상대경로 해석 기준이 스킬 파일 위치라는 보장은 없다.** 호출 시점의 작업 디렉토리는 사용자 RN 프로젝트다. 위 상대경로는 **스킬 로드 시 주어진 자기 `SKILL.md` 절대경로에서 플러그인 루트를 파생해 절대경로로 풀어 Read하라**는 뜻이다 — 작업 디렉토리 기준으로 풀면 실패한다.
- 그 Read가 실패하면 **`Glob`으로 `**/rn-upgrade-kit/shared/constants.md`를 찾아 그 경로로 다시 Read한다.** 단 **`Glob`은 작업 디렉토리 기준이라 플러그인이 사용자 프로젝트 트리 안에 있을 때(로컬 개발)만 잡는다** — 설치본(`~/.claude/plugins/**` 계열)은 이 폴백이 못 찾는다. 폴백이 있으니 degrade가 드물 거라고 가정하지 마라 — 실효 방어선은 첫 Read다.
- **둘 다 실패하면 숫자를 지어내지 마라.** 세 스킬 전부 `상수 도달 실패` degrade 경로를 가진다 — 상수에 기대는 판정만 `확인 못 함`으로 두고, 그 사실을 리포트 헤더에 적고, 나머지 리포트는 정상 산출한다. 이 파일의 존재 이유가 *"한쪽만 바뀌는 드리프트 방지"*인데 못 읽었을 때 추정값을 쓰면 드리프트를 막는 대신 **만들어낸다.**
- **추정값 금지의 범위**: 보존 상한·등급 임계일·soak 일수·타임아웃·`boot_survival_seconds` 전부. "흔한 기본값"으로 때우지 마라.

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
| `worktree_path_template` | `/tmp/rn-rehearsal-<target>-<base_sha7>` | rehearsal (worktree 생성 경로) |
| `step_timeout_install_seconds` | `1800` | rehearsal (T1 의존성 설치) |
| `step_timeout_check_seconds` | `900` | rehearsal (T1 타입체크·테스트) |
| `step_timeout_build_seconds` | `2700` | rehearsal (T2 네이티브 빌드 · `pod install`) |
| `step_timeout_boot_seconds` | `600` | rehearsal (T2 부팅 + 로그 스캔) |

## 왜 여기 있나

- **`report_retention_n`이 12이고 `artifact_retention_n`이 3인 건 실수가 아니다.** 두 advisory 스킬은 마크다운 수 KB를 쌓고 rehearsal은 실행당 수십 MB를 쌓는다 — 매체가 다르므로 성격에서 파생된 정당한 차이다. 두 advisory 스킬끼리는 **반드시 같아야** 한다.
- **`report_retention_n`에는 기능적 하한 2가 있다.** currency는 델타 표기를 직전 리포트 파일에서 뽑는다 — 1이면 델타 줄이 영구히 빈다.
- **`grade_threshold_days`는 platform-watch만 소비한다.** currency는 이 값을 다시 계산하지 않고 핸드오프의 `urgency` 필드를 읽는다. 재료를 가진 쪽이 계산해 넘긴다.
- **`handoff_path`가 여기 있는 이유**는 소유자와 독자가 다르기 때문이다. 양쪽 스킬에 각각 적으면 나중에 한쪽만 바뀌어 조용히 끊긴다.
- **`target_staleness_warn_days`가 `soak_minor_days`와 같은 14인 건 우연이 아니다.** 권장 버전이 한 soak 주기만큼 묵었으면 그 사이 새 stable이 나왔을 수 있다.
- **`worktree_path_template`이 여기 있는 이유**는 경로가 리포트 재현 블록·수동 정리 커맨드·충돌 판정 **세 곳에 동시에** 박히기 때문이다. 참조 파일 예시에만 있으면 예시가 사실상의 정본이 되고, 예시를 고칠 때 나머지 둘이 따라오지 않는다. `<base_sha7>`은 장식이 아니다 — 같은 타깃을 **다른 base에서** 동시에 돌릴 때 충돌하지 않게 하려는 것이고, 남는 충돌(같은 타깃·같은 base)은 진짜 충돌이라 rehearsal이 거부한다.
- **타임아웃이 티어가 아니라 단계 단위인 이유**는 멈추는 지점이 단계마다 다르기 때문이다. Gradle 빌드의 45분과 `pod install`이 네트워크에서 멈춘 45분은 같은 상한을 쓸 수 없다. **`boot_survival_seconds`(60)는 통과 조건이고 `step_timeout_boot_seconds`(600)는 상한이다** — 둘을 같게 만들면 "60초 생존"을 관측할 시간 자체가 없다.

## 항목별 덮어쓰기

`grade_threshold_days`만 항목별로 덮어쓸 수 있다 — `skills/platform-watch/references/watch-targets.md`의 항목 필드. 나머지는 전역이다.
