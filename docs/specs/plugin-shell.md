# Plugin Shell Spec — `rn-upgrade-kit`

세 스킬 스펙(`platform-watch.md` · `currency.md` · `rehearsal.md`)이 **의존하지만 어느 스펙도 소유하지 않는** 플러그인 레벨 산출물의 정본.

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
        watch-targets.md          ← enum 정본 (슬러그·platform·URL 2단·교차·실측·읽기 지시)
        report-format.md          ← 리포트 4블록 · state.json 스키마 · 핸드오프 스키마 정본
        cadence.md                ← 실행 타이밍 (`platform-watch.md` §미확정)
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
        report-format.md          ← 리포트 구조 · 경로/`<target>` · 재현 블록 · 채택 절 정본
  shared/
    constants.md                  ← 3스킬 공용 상수 (중립 지대)
    lockstep-sets.md              ← 짝으로만 올려야 하는 패키지 집합 (신설 — 2026-08-18)
    expo.md                       ← Expo 유형 판별 · SDK 조회 · SDK 정합 (신설 — 2026-09-24)
  README.md
```

> **정정 (2026-09-24 · Agent Skills 자족화):** 현재 트리는 위 레이아웃에 다음이 더해진다.
>
> ```
> rn-upgrade-kit/
>   .claude-plugin/
>     plugin.json                 ← 정본 매니페스트
>     marketplace.json            ← 마켓플레이스 (source "./")
>   plugin.json                   ← Agent Plugins 1.0 매니페스트 — 생성물
>   LICENSE                       ← MIT
>   skills/<스킬>/
>     LICENSE                     ← 루트 LICENSE 사본 — 생성물
>     references/constants.md     ← shared/ 사본 — 생성물 (세 스킬)
>     references/lockstep-sets.md ← shared/ 사본 — 생성물 (currency · rehearsal)
>     references/expo.md          ← shared/ 사본 — 생성물 (세 스킬 · 2026-09-24 추가)
>   scripts/sync.mjs              ← 사본·루트 매니페스트 생성 + --check
>   .github/workflows/sync-check.yml ← CI: node scripts/sync.mjs --check
>   docs/specs/                   ← 설계 정본 (이 파일 포함)
> ```
>
> 생성물은 직접 고치지 않는다 — 정본(`shared/`·`LICENSE`·`.claude-plugin/plugin.json`)을 고치고 `node scripts/sync.mjs`를 돌린다.

### `shared/`가 필요한 이유

스킬별 `references/`는 **소유자가 하나**다. 보존 상한 N·등급 임계일·핸드오프 경로는 **둘 이상의 스킬이 같은 값을 봐야 하는** 값이라 어느 스킬 폴더에 넣어도 남의 집이다 — 핸드오프 파일을 `handoff/` 중립 지대에 둔 논리와 동일하다(`platform-watch` 라운드 9).

- ~~스킬 본문에서 상대 경로로 참조한다: `../../shared/constants.md`.~~ → **스킬은 자기 폴더의 사본 `references/<파일>`을 읽는다** (아래 정정).
- `skills/` 하위에 두지 않는다 — 그 아래 디렉터리는 스킬로 해석된다.
- **하드코딩 금지 대상:** 아래 표의 모든 값. 스킬 본문에 숫자를 적지 않고 이 파일을 Read한다.

> **정정 (2026-09-24 · Agent Skills 자족화):** 스킬이 플러그인으로만 설치되지 않게 됐다. Agent Skills 표준 폴더라 `npx skills`·스킬 단위 업로드로 **스킬 폴더 하나만** 설치되는 경로가 생겼고, 그 경로에는 `../../shared/`가 없다. 그래서 **정본은 `shared/`에 그대로 두고, 각 스킬 폴더의 `references/`에 사본을 둔다.** 사본은 `scripts/sync.mjs`가 만든다. `--check`는 CI(`.github/workflows/sync-check.yml`)에서 세 가지를 검사한다 — 사본이 정본과 어긋나는지, 스킬 본문이 폴더 밖(`../../`)을 가리키는지, frontmatter가 엄격한 YAML 파서에서 깨지는지.
>
> 위 *"스킬별 `references/`는 소유자가 하나라 공유물을 담을 수 없다"*는 **정본의 위치**에 대해서는 여전히 참이다. 사본은 공유물을 소유하는 게 아니라 배달하는 것이다. **사본을 직접 고치지 않는다** — 설치본에는 CI 검사가 없어서, 한 사본만 고치면 스킬끼리 다른 값을 보는 드리프트가 조용히 생긴다.

### `shared/lockstep-sets.md` — 두 번째 공유물 (신설 · 2026-08-18)

**짝으로만 올려야 하는 패키지 집합의 정본.** `currency` 게이트 6과 `rehearsal` 인자 검증 3이 **같은 목록을 봐야** 하므로 상수와 같은 중립 지대에 있다 — 양쪽 스킬에 각각 적으면 한쪽만 늘어나고, 그러면 `currency`가 권장한 세트를 `rehearsal`이 `짝 누락`으로 거부하거나 그 반대가 된다. `handoff_path`를 한 곳에 고정한 논리와 같다.

- **확정 세트**(게이트 6의 판정 근거)와 **잠정 후보**(감지 규칙 3신호 → 제안만)를 2단으로 가른다. 감지가 휴리스틱이라 오탐이 있고, 오탐으로 실행을 거부하면 사용자에게 우회 수단이 없기 때문이다.
- 도달 실패 처리는 이 파일이 직접 정의한다 — `currency`는 게이트 6만 `확인 못 함`, `rehearsal`은 인자 검증 3만 미실행. **양쪽 다 조용히 통과시키지 않는다.**
- **«설치된 것»의 정의도 이 파일이 가진다** (2026-09-24 · 감사). 세트 구성원 중 정본 `package.json`의 `dependencies`·`devDependencies`에 **직접 선언된 것만** 센다. 전이 의존을 세면 PM 호이스팅에 따라 세트가 달라져 두 스킬이 다른 세트를 요구한다. 계기: 2026-08-31에 RN 코어 세트가 `@react-native/*`(대개 devDependencies)로 늘었는데, `currency`는 devDependencies를 대상에서 빼고 있었다 — 목록은 한 곳에 있어도 **무엇을 세트 구성원으로 세는가**가 두 곳에 있으면 같은 어긋남이 난다.

### `shared/expo.md` — 세 번째 공유물 (신설 · 2026-09-24 · Expo 대응)

**Expo 프로젝트 규칙의 정본.** 세 스킬이 같은 판정을 봐야 한다. 한 스킬이 CNG로 읽고 다른 스킬이 bare로 읽으면 `platform-watch`가 넘긴 `current`와 `rehearsal`이 검증한 트리가 다른 프로젝트를 가리킨다. SDK 정합을 `currency`와 `rehearsal`이 각자 적으면 `currency`가 낸 SDK 블록을 `rehearsal`이 `정합 누락`으로 거부한다. `lockstep-sets.md`를 한 곳에 둔 것과 같은 이유다.

- 담는 것: 프로젝트 유형(RN · Expo bare · Expo CNG, 플랫폼마다) 판별 규칙과 가진 도구별 판별 수단, SDK 식별, app config를 평가하지 않고 읽는 법, 조회 출처와 `node -e` 원라이너(양쪽 셸 실측 포함), SDK 정합 판정, 도달 실패 처리.
- **담지 않는 것: 버전 값.** SDK↔RN 대응, SDK별 기본값, "SDK N 이상이면 X" 문턱은 이 파일에도 없다 — 매 실행 조회한다. 적으면 다음 SDK가 나오는 날 낡는다. `currency`의 «매핑표를 보유하지 않는다»를 세 스킬로 넓힌 것이다(사용자 원칙 — bare RN 경로도 같다).
- 도달 실패는 스킬마다 다르게 처리하고, 그 차이를 이 파일이 직접 정의한다. advisory 둘은 Expo 판정만 `확인 못 함`으로 두고, `rehearsal`은 Expo 프로젝트면 실행을 거부한다. CNG 판별이 실행 파라미터라서다. **Expo가 아닌 프로젝트는 영향이 없다.**

### `shared/constants.md` — «이 파일에 도달하는 법» 절 (신설 · 2026-08-18)

**상대경로 해석 기준이 스킬 파일 위치라는 보장이 없다** — 호출 시점의 작업 디렉토리는 사용자 RN 프로젝트다. 그래서 상수 파일 자신이 도달 절차를 정의한다: ① 스킬 로드 시점에 주어지는 자기 `SKILL.md` 절대경로에서 플러그인 루트를 파생해 `<루트>/shared/constants.md`를 Read한다 — 상대경로 `../../shared/…` 표기는 이 파생의 축약이지 작업 디렉토리 기준이 아니다. ② 실패 시 `Glob` `**/rn-upgrade-kit/shared/constants.md` 폴백. ③ 둘 다 실패하면 **숫자를 지어내지 말고** 세 스킬 공통의 `상수 도달 실패` degrade로 간다.

> **정정 (2026-08-29):** ②의 `Glob` 폴백은 **작업 디렉토리(사용자 RN 프로젝트) 기준으로 검색하므로, 플러그인이 그 트리 안에 있을 때(로컬 개발·`--plugin-dir`)만 잡는다.** 설치본(`~/.claude/plugins/**` 계열)은 프로젝트 트리 밖이라 이 폴백이 영영 못 찾는다 — 원안은 이 한계를 적지 않아 폴백을 일반 해법처럼 읽게 했고, 그러면 `상수 도달 실패` degrade의 빈도를 과소평가하게 된다. 실효 방어선은 ①이다 — 그래서 ①을 "상대경로 Read"가 아니라 "스킬 파일 절대경로에서 파생"으로 명시했다.

> **정정 (2026-09-24 · Agent Skills 자족화):** 도달 절차가 사본 기준으로 바뀌었다. ① 자기 `SKILL.md`의 폴더(스킬 루트)를 기준으로 `references/constants.md`를 절대경로로 풀어 Read한다 — 플러그인 루트를 파생하는 단계가 없어졌다. ② `Glob` 폴백은 `**/<자기 스킬 이름>/references/constants.md`다. 2026-08-29 정정이 적은 한계(작업 디렉토리 기준이라 전역 설치본은 못 찾는다)는 그대로다. ③ 추정 기본값 금지도 그대로다. 절차의 정본 서술은 `shared/constants.md`의 «이 파일에 도달하는 법»이다.

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
| `enum_promotion_min_count` | `2` | platform-watch (`[미분류]` enum 승격 후보 제안) | `platform-watch.md` §미확정 해소(2026-08-12). 1회 관측은 우연일 수 있고 그걸로 참조 파일을 고치라고 하면 제안이 소음이 된다 — **소음이면 사용자가 올릴 수 있어야 하므로 상수다.** 소비자가 하나뿐인데도 여기 있는 건 `grade_threshold_days`와 같은 이유다 |
| `worktree_path_template` | `/tmp/rn-rehearsal-<target>-<base_sha7>` | rehearsal (worktree 생성 경로) | 신설 2026-08-18. 경로가 재현 블록·수동 정리 커맨드·충돌 판정 **세 곳에 동시에** 박힌다 — 참조 파일 예시에만 있으면 예시가 사실상의 정본이 되고, 예시를 고칠 때 나머지 둘이 안 따라온다. `<base_sha7>`은 같은 타깃을 **다른 base에서** 돌릴 때의 충돌을 없앤다 |
| `step_timeout_install_seconds` | `1800` | rehearsal (T1 의존성 설치) | 신설 2026-08-18 |
| `step_timeout_check_seconds` | `900` | rehearsal (T1 타입체크·테스트) | 신설 2026-08-18 |
| `step_timeout_build_seconds` | `2700` | rehearsal (T2 네이티브 빌드 · `pod install` · Expo CNG의 `expo prebuild`) | 신설 2026-08-18. prebuild 추가 2026-09-24 — 새 상수를 두지 않는다, 같은 T2 준비 단계다 |
| `step_timeout_boot_seconds` | `600` | rehearsal (T2 부팅 + 로그 스캔) | 신설 2026-08-18 |

- **타임아웃이 티어가 아니라 단계 단위인 이유**는 멈추는 지점이 단계마다 다르기 때문이다. Gradle 빌드의 45분과 `pod install`이 네트워크에서 멈춘 45분은 같은 상한을 쓸 수 없다. **`boot_survival_seconds`(통과 조건)와 `step_timeout_boot_seconds`(상한)를 같게 만들면 "60초 생존"을 관측할 시간 자체가 없다** — 둘은 다른 축이다.
- **값 변경은 이 파일 한 곳에서만.** 스킬 본문·`references/*`에 같은 숫자를 복제하지 않는다.
- `grade_threshold_days`는 `platform-watch`만 소비한다. currency는 그 값을 다시 계산하지 않고 핸드오프 `urgency` 필드를 읽는다 (§A2 — `currency.md` §핸드오프).

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

> **정정 (2026-09-24 · Agent Skills 자족화):** 필드가 늘었다 — `homepage`·`repository`·`license`(`MIT`)·`keywords`. 정본은 `.claude-plugin/plugin.json`이다. 루트 `plugin.json`(Agent Plugins 1.0 매니페스트)은 `scripts/sync.mjs`가 이식 가능한 필드만 옮겨 만드는 생성물이다 — 그 스키마가 루트에 `additionalProperties: false`라서다. 마켓플레이스 매니페스트 `.claude-plugin/marketplace.json`(source `./`)이 추가됐다.
>
> 스킬 frontmatter도 바뀌었다. `license`·`compatibility`가 붙었고, `argument-hint` 값은 따옴표로 감싼다 — 엄격한 YAML 파서에서 `[`로 시작하는 평문 값이 frontmatter 전체를 죽이기 때문이다. `user-invocable`은 뺐다(기본값과 같은 `true`였다). 세 스킬 스펙의 frontmatter 예시·Technical Context는 인터뷰 시점 초안이라 이 정정이 우선한다. `argument-hint`·`disallowed-tools`는 Agent Skills 스펙에 없는 Claude Code 확장 필드라 `skills-ref validate`는 실패한다 — 의도된 것이다(README «Claude Code 밖에서 달라지는 것»).

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
> (2026-09-24 · Expo 대응: `currency`의 `node -e`는 registry·Expo API 원문 조회 용도로 넓어졌다. 용도는 여전히 "원문 채널 조회" 하나다. 고정 문구의 "registry 조회용"은 README에서 "registry·Expo API 조회용"으로 쓴다.)
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

### 4.7 프로젝트 전제 — Expo 지원 범위 (2026-09-24 추가)

README의 전제 절은 **"Expo 미사용"을 지우고** 지원 범위를 적는다.

- RN · Expo bare · Expo managed(CNG) 셋을 플랫폼마다 감지한다.
- SDK↔RN 대응과 SDK 기본값은 실행할 때 조회한다 — 스킬에 적혀 있지 않다.
- `currency`는 새 SDK를 권장하지 않는다. 🟡로 알리고 SDK 업그레이드 리허설 블록을 준다.
- `rehearsal`은 CNG 플랫폼에서 T2를 `expo prebuild`로 시작한다. EAS Build는 부르지 않는다.
- `app.config.js`·`.ts`는 평가하지 않는다. 식으로 된 값은 `확인 못 함`이다.
- Expo 경로는 **실행 검증 전**이다.

---

## 5. 미해결 위임 (구현 재량)

- ~~`references/watch-targets.md`의 enum 초기 URL 실측 — 스펙은 슬러그만 확정했다~~ → **해소됨 (2026-08-18 · URL 14개 전수 조회.** 2차 URL 2개가 404였고, 그 결과로 `실측`·`교차` 필드와 2차 독립성 3단계가 스키마에 들어갔다 — `docs/specs/platform-watch.md` §2단 URL)
- `references/log-patterns.md`의 T2 로그 패턴 목록
- `references/sources.md`의 SM·Callstack 문서 URL과 릴리즈 노트 태그 URL 조립 규칙(모노레포 접두사 변형)
- `shared/constants.md`의 물리 포맷(마크다운 표 / YAML frontmatter) — 스킬이 Read해서 값을 뽑을 수 있으면 된다

---

## 구현 감사 반영 — 2026-08-18

`docs/audit-2026-08-12.md`(git 태그 `audit-2026-08`)가 이 파일의 소관(공유물·플러그인 레벨 규약)에서 연 구멍들이다. 위 §1·§2·§5의 해당 자리도 같이 고쳐 뒀다.

- **`shared/lockstep-sets.md`를 신설한다.** 근거: **두 스킬이 같은 목록을 봐야 하는 두 번째 공유물**이 생겼다 — `currency` 게이트 6과 `rehearsal` 인자 검증 3. `shared/`가 존재하는 이유(*"둘 이상의 스킬이 같은 값을 봐야 하는 값은 어느 스킬 폴더에 넣어도 남의 집"*)가 숫자에만 적용될 이유가 없다. 목록이 두 곳이면 한쪽만 늘어나고, 그러면 `currency`가 권장한 세트를 `rehearsal`이 `짝 누락`으로 거부한다. 확정 세트만 판정 근거이고 감지 규칙이 잡은 잠정 후보는 제안까지만 간다 — 휴리스틱 오탐이 실행 거부가 되면 우회 수단이 없다.
- **`shared/constants.md`에 «이 파일에 도달하는 법» 절을 신설한다.** 근거: 이 스펙은 *"스킬 본문에서 상대 경로로 참조한다"*고만 적고 **그 상대경로가 무엇 기준으로 풀리는지 확인하지 않았다.** 호출 시점의 작업 디렉토리는 사용자 RN 프로젝트다. 도달 실패 시 `Glob` 폴백, 둘 다 실패하면 `상수 도달 실패` degrade로 가고 **추정 기본값을 쓰지 않는다** — 드리프트를 막으려고 둔 파일이 못 읽혔을 때 "흔한 값"으로 때우면 드리프트를 대신 만들어낸다.
- **상수 5개를 신설한다** — `worktree_path_template` · `step_timeout_{install,check,build,boot}_seconds`. worktree 경로는 **재현 블록·수동 정리 커맨드·충돌 판정 세 곳에 동시에** 박히므로 참조 파일 예시에 두면 예시가 사실상의 정본이 된다. 타임아웃이 단계 단위인 건 멈추는 지점이 단계마다 다르기 때문이고, `boot_survival_seconds`(통과 조건)와 `step_timeout_boot_seconds`(상한)는 **다른 축이라 같은 값이 될 수 없다.**
- **`allowed-tools`는 제한 수단이 아니다 — 감사 #8은 절반이 기각, 절반이 승격이다.** 공식 문서 확인: *"It does not restrict which tools are available: every tool remains callable"* (https://code.claude.com/docs/en/skills «Pre-approve tools for a skill»). 구분자는 **공백·콤마·YAML 리스트 전부 유효**하므로 *"공백 구분이라 파싱이 깨져 제한이 무효화된다"*는 우려는 **기각**이다. 대신 더 큰 문제가 드러났다 — **파싱이 되든 안 되든 그 필드는 원래 아무것도 막지 않는다.** 세 스펙이 *"규칙을 도구 목록으로 강제한다"*고 적은 자리가 **전부 명목뿐이었고**, 실제 강제 수단은 `disallowed-tools`다. 구현은 `platform-watch`에 `Bash Edit`, `currency`에 `WebSearch Edit`을 신설해 그 자리를 메웠다. **"목록에 없으니 못 쓴다"를 근거로 설계를 세우지 마라** — 그 문장 위에 세운 제약은 전부 무근거다.
