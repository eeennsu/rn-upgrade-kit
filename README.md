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

```bash
# 로컬 테스트
claude --plugin-dir /path/to/rn-upgrade-kit
```

## 호출

```
/rn-upgrade-kit:platform-watch [--platform android|ios] [--target <슬러그>]
/rn-upgrade-kit:currency [--track core|lib] [--target <pkg>] | platform
/rn-upgrade-kit:rehearsal <pkg@ver>... [--platform android|ios]
```

인자는 **전부 좁히기 전용**이다. 기본값은 항상 전체이고 넓히는 방향의 인자는 없다 — 기본값이 항상 가장 많이 검증하는 쪽에 선다.

## 호스트 지원

| 호스트 | `platform-watch` | `currency` | `rehearsal` |
| --- | --- | --- | --- |
| macOS | ✅ | ✅ | ✅ |
| Linux | ✅ | ✅ | android만 (`T2/ios` = `미실행 (macOS 필요)`) |
| Windows | ✅ | ✅ | **실행 거부** |

**차이는 임의가 아니라 실행 유무에서 나온다:**

- **`rehearsal`: POSIX 전용 — 네이티브 빌드를 실제 실행하기 때문이다.** RN 빌드·CocoaPods·에뮬레이터 제어·worktree 폐기가 전부 Windows에서 별도 경로를 요구하고, 그 경로는 유지보수자가 검증할 수 없다. *검증 못 한 실행 경로를 사실로 쓰지 않는다*는 원칙과 정면 충돌한다.
- **`platform-watch`: 전 호스트 — 웹 조회와 텍스트 파일 읽기만 한다.** 셸을 호출하지 않는다.
- **`currency`: 전 호스트 — 조회·파일 읽기 + registry 조회용 `node -e` 한 줄.** 대상이 RN 프로젝트이므로 node는 항상 존재한다.

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
| `shared/constants.md` | 3스킬 공용 상수 (보존 상한 · 임계일 · 핸드오프 경로) |
| `.omc/specs/*.md` | 설계 정본 (deep interview 산출물 + plugin shell) |
| `seed/` | 포팅 원본 (`rn-currency` 단일 스킬 시절) |

**상수를 스킬 본문에 하드코딩하지 마라.** `shared/constants.md`가 존재하는 이유는 두 advisory 스킬이 같은 보존 상한을 봐야 하고, 한쪽만 바뀌는 드리프트가 실제 실패 모드이기 때문이다.
