# Plugin Shell Spec — `rn-upgrade-kit`

세 스킬 스펙(`deep-interview-platform-watch.md` · `deep-interview-currency.md` · `deep-interview-rn-rehearsal.md`)이 **의존하지만 어느 스펙도 소유하지 않는** 플러그인 레벨 산출물의 정본.

- Generated: 2026-08-09
- 출처: 스펙 3개 리뷰(§A~§E)의 D·C·E 항목
- 이 파일은 인터뷰 산물이 아니다. 세 스펙이 참조만 하고 정의하지 않은 것을 모은 것이다.

---

## 1. 디렉터리 레이아웃

```
rn-upgrade-kit/
  .claude-plugin/
    plugin.json
  skills/
    platform-watch/
      SKILL.md
      references/
        watch-targets.md          ← enum 정본 (슬러그·URL·읽기 지시·platform)
    currency/
      SKILL.md
      references/
        report-format.md          ← seed 포팅 + 7개 수정
        cadence.md                ← seed 포팅 + 3개 수정
        sources.md                ← SM·Callstack 문서 URL, 릴리즈 노트 태그 URL 조립 규칙
    rehearsal/
      SKILL.md
      references/
        log-patterns.md           ← T2 로그 스캔 패턴 정본
  shared/
    constants.md                  ← 3스킬 공용 상수 (중립 지대)
    lockstep-sets.md              ← 짝으로만 올려야 하는 패키지 집합 (신설 — 2026-08-18)
  README.md
```

### `shared/`가 필요한 이유

스킬별 `references/`는 **소유자가 하나**다. 보존 상한 N·등급 임계일·핸드오프 경로는 **둘 이상의 스킬이 같은 값을 봐야 하는** 값이라 어느 스킬 폴더에 넣어도 남의 집이다 — 핸드오프 파일을 `handoff/` 중립 지대에 둔 논리와 동일하다(`platform-watch` 라운드 9).

- 스킬 본문에서 상대 경로로 참조한다: `../../shared/constants.md`.
- `skills/` 하위에 두지 않는다 — 그 아래 디렉터리는 스킬로 해석된다.
- **하드코딩 금지 대상:** 아래 표의 모든 값. 스킬 본문에 숫자를 적지 않고 이 파일을 Read한다.

### `shared/lockstep-sets.md` — 두 번째 공유물 (신설 · 2026-08-18)

**짝으로만 올려야 하는 패키지 집합의 정본.** `currency` 게이트 6과 `rehearsal` 인자 검증 3이 **같은 목록을 봐야** 하므로 상수와 같은 중립 지대에 있다 — 양쪽 스킬에 각각 적으면 한쪽만 늘어나고, 그러면 `currency`가 권장한 세트를 `rehearsal`이 `짝 누락`으로 거부하거나 그 반대가 된다. `handoff_path`를 한 곳에 고정한 논리와 같다.

- **확정 세트**(게이트 6의 판정 근거)와 **잠정 후보**(감지 규칙 3신호 → 제안만)를 2단으로 가른다. 감지가 휴리스틱이라 오탐이 있고, 오탐으로 실행을 거부하면 사용자에게 우회 수단이 없기 때문이다.
- 도달 실패 처리는 이 파일이 직접 정의한다 — `currency`는 게이트 6만 `확인 못 함`, `rehearsal`은 인자 검증 3만 미실행. **양쪽 다 조용히 통과시키지 않는다.**

### `shared/constants.md` — «이 파일에 도달하는 법» 절 (신설 · 2026-08-18)

**상대경로 해석 기준이 스킬 파일 위치라는 보장이 없다** — 호출 시점의 작업 디렉토리는 사용자 RN 프로젝트다. 그래서 상수 파일 자신이 도달 절차를 정의한다: 첫 Read 실패 시 **`Glob`으로 `**/rn-upgrade-kit/shared/constants.md` 폴백**, 둘 다 실패하면 **숫자를 지어내지 말고** 세 스킬 공통의 `상수 도달 실패` degrade로 간다.

> **추정 기본값 금지가 이 절의 핵심이다.** 이 파일의 존재 이유가 *"한쪽만 바뀌는 드리프트 방지"*인데, 못 읽었을 때 "흔한 기본값"으로 때우면 드리프트를 막는 대신 **만들어낸다.** 범위는 보존 상한·등급 임계일·soak 일수·타임아웃·`boot_survival_seconds` 전부다.

---

## 2. `shared/constants.md` — 키 정본

| 키 | 값 | 소비자 | 근거 |
| --- | --- | --- | --- |
| `handoff_path` | `.rn-upgrade-kit/handoff/platform-requirements.md` | platform-watch(쓰기) · currency(읽기) | 양쪽에 각각 적으면 한쪽만 바뀌어 조용히 끊긴다 (platform-watch 라운드 9b) |
| `handoff_schema_version` | `1` | 동일 | currency의 `스키마 불일치` degrade가 판별 가능해지려면 필요 (§A1) |
| `report_retention_n` | `12` | platform-watch · currency | 같은 매체(마크다운 수 KB). 기능적 하한 2 — currency 델타가 직전 리포트에 걸려 있다 |
| `artifact_retention_n` | `3` | rehearsal | 매체가 다르다(수십 MB) — 성격에서 파생된 정당한 차이 |
| `grade_threshold_days` | `90` | platform-watch (등급 · `urgency` 산정) | 임의 기준. targetSdk 대응은 RN 업그레이드를 동반할 수 있어 사용자가 늘릴 수 있어야 한다 |
| `soak_minor_days` | `14` | currency (게이트 3) | seed §3 계승 |
| `soak_patch_days` | `7` | currency (게이트 3) | seed §3 계승 |
| `target_staleness_warn_days` | `14` | rehearsal (`# 산정 시각` 경과 경고) | 권장 버전은 soak·churn 산물이라 빨리 썩는다. 거부가 아니라 경고 |
| `boot_survival_seconds` | `60` | rehearsal (T2 통과 조건 1) | rehearsal §T2 |
| `url_candidate_limit` | `3` | platform-watch (URL 이동 의심 후보) | platform-watch 라운드 5c |
| `worktree_path_template` | `/tmp/rn-rehearsal-<target>-<base_sha7>` | rehearsal (worktree 생성 경로) | 신설 2026-08-18. 경로가 재현 블록·수동 정리 커맨드·충돌 판정 **세 곳에 동시에** 박힌다 — 참조 파일 예시에만 있으면 예시가 사실상의 정본이 되고, 예시를 고칠 때 나머지 둘이 안 따라온다. `<base_sha7>`은 같은 타깃을 **다른 base에서** 돌릴 때의 충돌을 없앤다 |
| `step_timeout_install_seconds` | `1800` | rehearsal (T1 의존성 설치) | 신설 2026-08-18 |
| `step_timeout_check_seconds` | `900` | rehearsal (T1 타입체크·테스트) | 신설 2026-08-18 |
| `step_timeout_build_seconds` | `2700` | rehearsal (T2 네이티브 빌드 · `pod install`) | 신설 2026-08-18 |
| `step_timeout_boot_seconds` | `600` | rehearsal (T2 부팅 + 로그 스캔) | 신설 2026-08-18 |

- **타임아웃이 티어가 아니라 단계 단위인 이유**는 멈추는 지점이 단계마다 다르기 때문이다. Gradle 빌드의 45분과 `pod install`이 네트워크에서 멈춘 45분은 같은 상한을 쓸 수 없다. **`boot_survival_seconds`(통과 조건)와 `step_timeout_boot_seconds`(상한)를 같게 만들면 "60초 생존"을 관측할 시간 자체가 없다** — 둘은 다른 축이다.
- **값 변경은 이 파일 한 곳에서만.** 스킬 본문·`references/*`에 같은 숫자를 복제하지 않는다.
- `grade_threshold_days`는 `platform-watch`만 소비한다. currency는 그 값을 다시 계산하지 않고 핸드오프 `urgency` 필드를 읽는다 (§A2 — `deep-interview-currency.md` §핸드오프).

---

## 3. `plugin.json`

```json
{
  "name": "rn-upgrade-kit",
  "description": "React Native 업그레이드 3종 세트 — 플랫폼 정책 마감 감사(platform-watch), 패키지 최신성·권장 버전 산정(currency), 격리 worktree 리허설·채택(rehearsal). 앞 둘은 advisory, 마지막만 게이트 통과 시 전용 브랜치를 남긴다.",
  "version": "0.1.0",
  "author": { "name": "eeennsu" }
}
```

- `version`은 semver. 초기 `0.1.0`.
- 스킬은 `skills/` 자동 발견에 맡긴다 — 매니페스트에 나열하지 않는다.

---

## 4. `README.md` — 필수 절

세 스펙이 README를 **6곳에서 의존**한다. 아래 절이 빠지면 그 스펙 항목들이 불통과다.

### 4.1 호스트 지원 매트릭스 — **거부 사유 포함**

| 호스트 | `platform-watch` | `currency` | `rehearsal` |
| --- | --- | --- | --- |
| macOS | ✅ | ✅ | ✅ |
| Linux | ✅ | ✅ | android만 (`T2/ios` = `미실행 (macOS 필요)`) |
| Windows | ✅ | ✅ | **실행 거부** |

고정 문구:

> `rehearsal`: POSIX 전용 — **네이티브 빌드를 실제 실행하기 때문**이다. 검증 못 한 실행 경로를 사실로 쓰지 않는다.
> `platform-watch`: 전 호스트 — 웹 조회와 텍스트 파일 읽기만 한다. 유닉스 유틸·셸 문법 의존 0.
> `currency`: 전 호스트 — 조회·파일 읽기 + registry 조회용 `node -e` 한 줄. 대상이 RN 프로젝트이므로 node는 항상 존재한다.
>
> **Windows에서도 iOS 항목은 판정된다.** `Podfile`·`project.pbxproj`·`xcconfig`는 repo 안 텍스트라 Xcode 없이 읽힌다 — **판정 가능한 것과 빌드 가능한 것은 별개다.**

스킬별 차이가 임의가 아니라 **실행 유무에서 나온다**는 걸 보여야 사용자가 규칙을 기억한다 (platform-watch 라운드 7c).

### 4.2 `.gitignore` 안내 — 붙여넣을 한 줄

세 스킬 모두 `.gitignore`를 **수정하지 않는다.** README가 한 줄을 제시하고 사용자가 결정한다:

```
.rn-upgrade-kit/
```

> 리포트 이력을 커밋하고 싶으면 이 줄을 넣지 않으면 된다. 기본값을 바꾸지 않고도 양쪽 가치를 얻는다.

### 4.3 CI 디스패치 안내 — 문서로만

`rehearsal`은 CI를 호출하지 않는다(비목표). Linux 호스트에서 `T2/ios`를 검증하고 싶은 사용자를 위한 **수동 워크플로 예시**를 README에 싣는다 — `gh workflow run`·폴링·리모트 push는 전부 스킬 밖이다.

### 4.4 3스킬 관계도 · 실행 순서

```
platform-watch  ──파일──▶  currency  ──커맨드 블록──▶  rehearsal
   (날짜 축)                (registry 축)              (실행 축)
   advisory                 advisory                  게이트 통과 시 브랜치
```

- 단방향. 역방향 의존 없음.
- `platform-watch`를 한 번도 안 돌려도 `currency`는 동작한다 (`플랫폼 하한 미반영`).
- `currency` 없이 `rehearsal`을 직접 호출해도 된다 — 목표 버전은 인자로만 받는다.

### 4.5 산출물 경로

```
.rn-upgrade-kit/
  platform-watch/reports/YYYY-MM-DD.md
  platform-watch/state.json
  handoff/platform-requirements.md
  currency/reports/YYYY-MM-DD.md
  rehearsal/reports/YYYY-MM-DD-<target>.md
  rehearsal/artifacts/YYYY-MM-DD-<target>/
```

### 4.6 설치 · 호출

```
/rn-upgrade-kit:platform-watch [--platform android|ios] [--target <슬러그>]
/rn-upgrade-kit:currency [--track core|lib] [--target <pkg>] | platform
/rn-upgrade-kit:rehearsal <pkg@ver>... [--platform android|ios]
```

---

## 5. 미해결 위임 (구현 재량)

- ~~`references/watch-targets.md`의 enum 초기 URL 실측 — 스펙은 슬러그만 확정했다~~ → **해소됨 (2026-08-18 · URL 14개 전수 조회.** 2차 URL 2개가 404였고, 그 결과로 `실측`·`교차` 필드와 2차 독립성 3단계가 스키마에 들어갔다 — `.omc/specs/deep-interview-platform-watch.md` §2단 URL)
- `references/log-patterns.md`의 T2 로그 패턴 목록
- `references/sources.md`의 SM·Callstack 문서 URL과 릴리즈 노트 태그 URL 조립 규칙(모노레포 접두사 변형)
- `shared/constants.md`의 물리 포맷(마크다운 표 / YAML frontmatter) — 스킬이 Read해서 값을 뽑을 수 있으면 된다

---

## 구현 감사 반영 — 2026-08-18

`docs/audit-2026-08-12.md`가 이 파일의 소관(공유물·플러그인 레벨 규약)에서 연 구멍들이다. 위 §1·§2·§5의 해당 자리도 같이 고쳐 뒀다.

- **`shared/lockstep-sets.md`를 신설한다.** 근거: **두 스킬이 같은 목록을 봐야 하는 두 번째 공유물**이 생겼다 — `currency` 게이트 6과 `rehearsal` 인자 검증 3. `shared/`가 존재하는 이유(*"둘 이상의 스킬이 같은 값을 봐야 하는 값은 어느 스킬 폴더에 넣어도 남의 집"*)가 숫자에만 적용될 이유가 없다. 목록이 두 곳이면 한쪽만 늘어나고, 그러면 `currency`가 권장한 세트를 `rehearsal`이 `짝 누락`으로 거부한다. 확정 세트만 판정 근거이고 감지 규칙이 잡은 잠정 후보는 제안까지만 간다 — 휴리스틱 오탐이 실행 거부가 되면 우회 수단이 없다.
- **`shared/constants.md`에 «이 파일에 도달하는 법» 절을 신설한다.** 근거: 이 스펙은 *"스킬 본문에서 상대 경로로 참조한다"*고만 적고 **그 상대경로가 무엇 기준으로 풀리는지 확인하지 않았다.** 호출 시점의 작업 디렉토리는 사용자 RN 프로젝트다. 도달 실패 시 `Glob` 폴백, 둘 다 실패하면 `상수 도달 실패` degrade로 가고 **추정 기본값을 쓰지 않는다** — 드리프트를 막으려고 둔 파일이 못 읽혔을 때 "흔한 값"으로 때우면 드리프트를 대신 만들어낸다.
- **상수 5개를 신설한다** — `worktree_path_template` · `step_timeout_{install,check,build,boot}_seconds`. worktree 경로는 **재현 블록·수동 정리 커맨드·충돌 판정 세 곳에 동시에** 박히므로 참조 파일 예시에 두면 예시가 사실상의 정본이 된다. 타임아웃이 단계 단위인 건 멈추는 지점이 단계마다 다르기 때문이고, `boot_survival_seconds`(통과 조건)와 `step_timeout_boot_seconds`(상한)는 **다른 축이라 같은 값이 될 수 없다.**
- **`allowed-tools`는 제한 수단이 아니다 — 감사 #8은 절반이 기각, 절반이 승격이다.** 공식 문서 확인: *"It does not restrict which tools are available: every tool remains callable"* (https://code.claude.com/docs/en/skills «Pre-approve tools for a skill»). 구분자는 **공백·콤마·YAML 리스트 전부 유효**하므로 *"공백 구분이라 파싱이 깨져 제한이 무효화된다"*는 우려는 **기각**이다. 대신 더 큰 문제가 드러났다 — **파싱이 되든 안 되든 그 필드는 원래 아무것도 막지 않는다.** 세 스펙이 *"규칙을 도구 목록으로 강제한다"*고 적은 자리가 **전부 명목뿐이었고**, 실제 강제 수단은 `disallowed-tools`다. 구현은 `platform-watch`에 `Bash Edit`, `currency`에 `WebSearch Edit`을 신설해 그 자리를 메웠다. **"목록에 없으니 못 쓴다"를 근거로 설계를 세우지 마라** — 그 문장 위에 세운 제약은 전부 무근거다.
