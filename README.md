# rn-upgrade-kit

React Native 업그레이드 3종 세트. **앞 둘은 advisory이고 마지막만 게이트 통과 시 브랜치를 남긴다.**

```
platform-watch  ──파일──▶  currency  ──커맨드 블록──▶  rehearsal
   (날짜 축)                (registry 축)              (실행 축)
   advisory                 advisory                  게이트 통과 시 브랜치
```

| 스킬 | 답하는 질문 |
| --- | --- |
| `platform-watch` | 언제까지 무엇을 해야 하고, 지금 그게 됐나 |
| `currency` | 최신이 몇이냐가 아니라 — **지금 뭘로 올려야 하나** |
| `rehearsal` | 안전한가가 아니라 — **어디까지 갔고 어디서 멈췄나** |

- **단방향이다. 역방향 의존이 없다.**
- `platform-watch`를 한 번도 안 돌려도 `currency`는 동작한다 (`플랫폼 하한 미반영`).
- `currency` 없이 `rehearsal`을 직접 호출해도 된다 — 목표 버전은 인자로만 받는다.

## 설치

세 스킬은 [Agent Skills](https://agentskills.io) 표준 폴더(`skills/<이름>/SKILL.md`)라 Claude Code 밖의 에이전트에도 설치된다. **세 스킬을 같이 설치하라** — `currency`는 `platform-watch`의 핸드오프를 하한으로 읽는다.

### Claude Code — 플러그인

```
/plugin marketplace add eeennsu/rn-upgrade-kit
/plugin install rn-upgrade-kit@rn-upgrade-kit
```

로컬 테스트는 `claude --plugin-dir /path/to/rn-upgrade-kit`.

### 다른 에이전트 — Agent Skills

Codex · Cursor · Gemini CLI · GitHub Copilot 등 Agent Skills를 읽는 에이전트에는 [`skills` CLI](https://github.com/vercel-labs/skills)로 설치한다.

```bash
npx skills add eeennsu/rn-upgrade-kit                     # 스킬·에이전트를 대화형으로 고른다
npx skills add eeennsu/rn-upgrade-kit -s '*' -a codex -a cursor
```

- 기본은 프로젝트 단위 설치다. 사용자 전역은 `-g`.
- CLI 없이 `skills/<이름>/` 폴더를 에이전트의 스킬 디렉토리에 통째로 복사해도 된다. **각 스킬 폴더는 자기 안에서 닫혀 있다** — 공용 상수도 폴더 안 `references/`에 사본으로 들어 있다.
- 루트 `plugin.json`은 [Agent Plugins 1.0](https://agent-plugins.org) 매니페스트다. 이 표준을 읽는 클라이언트는 repo를 플러그인으로 인식한다. 설치 방법은 클라이언트마다 다르다.

## 호출

```
/rn-upgrade-kit:platform-watch [--platform android|ios] [--target <슬러그>]
/rn-upgrade-kit:currency [--track core|lib] [--target <pkg>] | platform
/rn-upgrade-kit:rehearsal <pkg@ver>... [--platform android|ios]
```

인자는 **전부 좁히기 전용**이다. 기본값은 항상 전체이고 넓히는 방향의 인자는 없다 — 기본값이 항상 가장 많이 검증하는 쪽에 선다.

위 이름은 Claude Code 플러그인 기준이다. `skills` CLI로 Claude Code에 설치하면 접두어 없이 `/currency`이고, 다른 에이전트는 각자의 호출 방식을 따른다 — 스킬 설명에 적힌 표현("RN 최신성", "targetSdk 마감", "업그레이드 리허설" 등)으로 요청해도 트리거된다.

## Claude Code 밖에서 달라지는 것

세 스킬은 Claude Code 기준으로 설계했다. 다른 에이전트에서도 돌지만 아래가 달라진다.

- **도구 제한이 한 겹 준다.** `currency`(WebSearch·Edit 금지)와 `platform-watch`(Bash·Edit 금지)는 본문 금지 문장 + frontmatter `disallowed-tools` 두 겹으로 막는데, `disallowed-tools`를 강제하는 건 Claude Code뿐이다. 다른 에이전트에서는 본문 문장만 남는다. `platform-watch`의 "셸을 호출하지 않는다"가 구조적 사실인 것도 Claude Code에서만이다.
- **본문은 Claude Code 도구 이름으로 쓰여 있다** (`Read` · `Write` · `Glob` · `WebFetch` · `Agent`). 판정 재료를 `WebFetch` 대신 `node -e` 원문에서 뽑는 규칙은 Claude Code의 `WebFetch`가 요약 모델을 거친다는 실측에서 나왔다 — 원문을 주는 fetch 도구에서는 과한 제약일 뿐 틀리지는 않는다. 조회 분담도 `Agent`(서브에이전트) 기준이다.
- **`skills-ref validate`는 실패한다 — 의도된 것이다.** Claude Code 확장 필드(`argument-hint` · `disallowed-tools`)가 스펙에 없어서다. `metadata`로 옮기면 검증은 통과하지만 Claude Code가 도구 제한을 걸지 못한다. 대신 frontmatter가 **엄격한 YAML 파서에서 깨지지 않는 것**은 `scripts/sync.mjs`가 검사한다 — 깨지면 Claude Code 밖에서는 스킬이 아예 안 보인다.

## 호스트 지원

| 호스트 | `platform-watch` | `currency` | `rehearsal` |
| --- | --- | --- | --- |
| macOS | ✅ | ✅ | ✅ |
| Linux | ✅ | ✅ | android만 (`T2/ios` = `미실행 (macOS 필요)`) |
| Windows | ✅ | ✅ | **실행 거부** |

**차이는 임의가 아니라 실행 유무에서 나온다:**

- **`rehearsal`: POSIX 전용 — 네이티브 빌드를 실제 실행하기 때문이다.** RN 빌드·CocoaPods·에뮬레이터 제어·worktree 폐기가 전부 Windows에서 별도 경로를 요구하고, 그 경로는 유지보수자가 검증할 수 없다. *검증 못 한 실행 경로를 사실로 쓰지 않는다*는 원칙과 정면 충돌한다.
- **`platform-watch`: 전 호스트 — 웹 조회와 텍스트 파일 읽기만 한다.** 셸을 호출하지 않는다.
- **`currency`: 전 호스트 — 조회·파일 읽기 + registry 조회용 `node -e` 한 줄.** 대상이 RN 프로젝트이므로 node는 항상 존재한다. **커맨드는 `$`·백틱·`!`이 없는 한 줄로 고정돼 있고, PowerShell 5.1과 Git Bash에서 같은 출력이 나오는 것을 실측했다**(2026-09-24 · Windows 11 · 현행 원라이너 기준 — 현재 major 라인 전체 · peer 전체 판). 이 표의 `currency` ✅는 그 실측에 기대고 있다.

> **`node -e`가 실패해도 리포트는 나온다. 대신 그 사실이 헤더에 박힌다.** soak·churn 게이트 2개가 판정에서 빠지고 헤더에 `soak·churn 게이트 전면 미확인`이 실린다 — **게이트 둘이 죽은 리포트와 정상 리포트가 겉보기에 같으면 안 되기 때문이다.** 위 표의 ✅는 *"돈다"*는 뜻이지 *"게이트가 전부 산다"*는 보장이 아니다.

> **Windows에서도 iOS 항목은 판정된다.** `Podfile`·`project.pbxproj`·`xcconfig`는 repo 안 텍스트라 Xcode 없이 읽힌다 — **판정 가능한 것과 빌드 가능한 것은 별개다.** "윈도우니 iOS는 스킵되겠지"라고 오해하면 미충족을 놓친다.

## 산출물

```
.rn-upgrade-kit/
  platform-watch/reports/YYYY-MM-DD.md
  platform-watch/state.json
  handoff/platform-requirements.md          ← 소유: platform-watch / 독자: currency
  currency/reports/YYYY-MM-DD.md
  rehearsal/reports/YYYY-MM-DD-<target>.md
  rehearsal/artifacts/YYYY-MM-DD-<target>/
```

**세 스킬 모두 `.gitignore`를 수정하지 않는다.** 무시하고 싶으면 이 한 줄을 직접 넣어라:

```
.rn-upgrade-kit/
```

리포트 이력을 커밋하고 싶으면 **넣지 않으면 된다.** 기본값을 바꾸지 않고도 양쪽 가치를 얻는다.

## 전제

- New Architecture (`newArchEnabled=true` · Hermes · Nitro Modules · Reanimated 4)
- **Expo 미사용** — `expo-*` 대안을 제시하지 않는다
- 패키지 매니저 무관 (pnpm · npm · yarn · bun 4종)

## 설계 원칙

세 스킬이 공유하는 것:

- **어휘를 소수로 고정하고 직교 축을 분리한다.** `rehearsal` 판정 3값 + 오염 플래그, `platform-watch` 마킹 3값, `currency` 등급 4값 + 블록 표식.
- **항목은 목록에서 사라지지 않는다. 자리를 옮길 뿐이다.** degrade 경로가 전부 이 원칙에서 파생된다.
- **낙관 편향 금지.** 저정밀 날짜는 초일 기준, 설정값 충돌은 가장 낮은 값, boolean 충돌은 `확인 못 함`.
- **환각 금지.** 근거 링크 없는 주장은 리포트에 실리지 않는다. 확인 못 한 건 `확인 못 함`으로 분리한다.
- **압력을 관리하지 말고 경로를 없앤다.** 핸드오프 스키마에 `rn_floor` 필드를 두지 않고, 네이티브 값은 소유자 하나가 읽어 넘긴다.

## CI에서 iOS 검증하기 (스킬 밖)

`rehearsal`은 **CI를 호출하지 않는다.** Linux 호스트에서 `T2/ios`를 보고 싶으면 리포트의 재현 블록을 macOS 러너에서 수동으로 돌려라.

```yaml
# .github/workflows/rn-rehearsal-ios.yml (예시 — 사용자가 관리)
on: workflow_dispatch
jobs:
  ios:
    runs-on: macos-15
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: cd ios && pod install
      - run: xcodebuild -workspace ios/App.xcworkspace -scheme App -sdk iphonesimulator
```

`gh workflow run`·폴링·리모트 push는 전부 스킬 밖이다 — 검증 못 한 경로를 스킬이 사실로 쓰지 않기 위함이다.

## 구성

| 경로 | 내용 |
| --- | --- |
| `skills/*/SKILL.md` | 스킬 3개 |
| `skills/*/references/*.md` | 지연 로드 참조 — 조회가 끝난 뒤에만 Read |
| `skills/*/references/{constants,lockstep-sets}.md` | `shared/` 사본 — **직접 고치지 마라** (`scripts/sync.mjs`가 생성) |
| `shared/constants.md` | 3스킬 공용 상수 정본 (보존 상한 · 임계일 · 핸드오프 경로 · worktree 경로 · 단계 타임아웃) |
| `shared/lockstep-sets.md` | 짝으로만 올려야 하는 패키지 집합 정본 — `currency` 게이트 6과 `rehearsal` 인자 검증이 **같은 목록을 본다** |
| `skills/*/LICENSE` | 루트 `LICENSE` 사본 — 스킬 폴더만 설치돼도 고지가 따라가게 |
| `scripts/sync.mjs` | `shared/`·`LICENSE` → 스킬별 사본, `.claude-plugin/plugin.json` → 루트 `plugin.json` 생성 + 스킬 검사. `--check`는 CI |
| `.claude-plugin/` | Claude Code 플러그인 · 마켓플레이스 매니페스트 |
| `plugin.json` | Agent Plugins 1.0 매니페스트 — 생성물 |
| `docs/specs/*.md` | 설계 정본 (스킬별 스펙 3개 + plugin shell) |
| `seed/` | 포팅 원본 (`rn-currency` 단일 스킬 시절) |

**상수를 스킬 본문에 하드코딩하지 마라.** `shared/constants.md`가 존재하는 이유는 두 advisory 스킬이 같은 보존 상한을 봐야 하고, 한쪽만 바뀌는 드리프트가 실제 실패 모드이기 때문이다. 같은 이유로 lockstep 세트도 `shared/`에 있다 — `currency`가 권장한 세트를 `rehearsal`이 "짝 누락"으로 거부하는 건 목록이 두 곳에 있을 때 반드시 오는 결말이다.

**정본은 `shared/` 하나이고, 스킬마다 사본을 둔다.** 스킬 폴더 하나만 설치되는 경로(`npx skills` · 스킬 단위 업로드)에서 스킬 밖 파일은 따라오지 않기 때문이다. `shared/`를 고쳤으면 `node scripts/sync.mjs`를 돌린다 — 사본이 정본과 어긋나거나 스킬이 자기 폴더 밖을 가리키면 `--check`(CI)가 막는다.

**`allowed-tools`는 도구를 막지 못한다.** 그 필드는 승인 스킵(pre-approve)이지 제한이 아니다 — 목록에 없는 도구도 여전히 호출 가능하다. 그래서 세 스킬의 도구 규칙은 **본문의 금지 문장 + `disallowed-tools`** 두 겹으로 되어 있다. "`allowed-tools`에 없으니 못 쓴다"는 근거로 설계를 세우지 마라.

## 라이선스

MIT — [LICENSE](LICENSE).
