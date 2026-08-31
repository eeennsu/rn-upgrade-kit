# 실행 검증 — `rehearsal` 첫 실측 (2026-08-31)

원장 `docs/audit-ledger.md`가 *"이 세션으로 닫을 수 없는 유일한 축"*으로 남겨둔 **실행 검증 0**을 닫는 기록이다.
지금까지의 감사 7라운드는 전부 명세 대조였다. 이 문서는 **스킬을 실제 RN 프로젝트에서 돌려서** 나온 것만 담는다.

## 실행 조건

| 축 | 값 |
| --- | --- |
| 대상 | `woka_app` @ `v2.0.5` (`b768f6eb8d5362b3746bf2461b26271b57fa0997`) |
| 실행 위치 | 사용자 레포를 건드리지 않기 위해 같은 커밋을 스크래치로 clone 후 그 위에서 실행 |
| 타깃 | `react-native@0.85.3` `react@19.2.8` (코어 세트만) |
| 현재 | RN 0.81.1 / react 19.1.0 / reanimated 4.3.1 / worklets 0.8.3 |
| 호스트 | macOS 26.2 · Xcode 26.3 · CocoaPods 1.16.2 · Android SDK+emulator 존재 · node v20.19.0 · pnpm 10.8.0 |
| 도달 티어 | T1 실행 · T2/android 실행 · T2/ios·T3 미실행(앞 티어 실패) |
| 리포트 | 스크래치의 `.rn-upgrade-kit/rehearsal/reports/2026-08-31-0.85.3.md` |

**스킬은 `--plugin-dir`로 로드하지 않았다.** 세 스킬은 전부 마크다운 절차서이므로, `SKILL.md`와
`shared/*` · `references/*`를 지시대로 읽어 그 절차를 손으로 집행했다. 이 방식이 오히려 목적에 맞다 —
절차가 **어디서 집행 불가능해지는지**가 그대로 드러난다.

---

## 판정 요약

**스킬은 이 프로젝트에서 T1을 「통과」로 냈고, 그 통과는 거짓이다.** 정정 판정은 T1 실패(신규 타입 에러 2건)다.
그리고 T2/android는 **인자 검증 3이 잡았어야 할 불완전한 타깃 세트** 때문에 28초 만에 죽었다.

발견 10건. 치명 1 · 최대 1 · 높음 3 · 중간 3 · 낮음 2.

---

## F-9 (치명) — 조건부 베이스라인이 거짓 통과를 만든다

**위치:** `skills/rehearsal/SKILL.md` §2 «베이스라인 — 조건부 대조군»

§2 절차를 문자 그대로 밟은 실측:

```
1) 업그레이드 후  pnpm tsc --noEmit          → 17 errors
2) git checkout -- package.json pnpm-lock.yaml
3) pnpm install --frozen-lockfile            → exit=1
     ERR_PNPM_LOCKFILE_CONFIG_MISMATCH  Cannot proceed with the frozen installation.
     The current "patchedDependencies" configuration doesn't match the value found in the lockfile
4) pnpm tsc --noEmit                         → 17 errors
     (node_modules는 여전히 react-native 0.85.3 — 3)이 실패했으므로 아무것도 안 바뀌었다)
5) 델타 = 신규 0 / 기존 17
6) §2: "신규 에러 0이면 T1은 통과다"          → T1 통과
```

**업그레이드된 트리를 자기 자신과 비교해 통과가 나왔다.** §2 «캐시» 절이
*"stale 산물이 만드는 거짓 통과가 이 스킬이 가장 싫어하는 실패 모드다"*라고 적어둔 바로 그 자리를,
같은 §2의 베이스라인 절차가 만든다.

올바르게 다시 재면(`--no-frozen-lockfile`로 실제 되돌림) 진짜 델타는:

```
신규 2 / 기존 15
src/features/explore/ui/markers/ClusterMarker.android.tsx(53,29): error TS2551:
  Property 'absoluteFillObject' does not exist on type 'typeof StyleSheet'.
src/features/explore/ui/markers/ClusterMarker.ios.tsx(56,29): error TS2551: (동일)
```

즉 **정답은 T1 실패**다. RN 0.85에서 `StyleSheet.absoluteFillObject` 타입이 사라진 실제 회귀다.

### 고칠 것

1. 베이스라인의 install은 `--frozen-lockfile`이 **아니다.** lockfile을 되돌리는 것이 목적이므로
   PM별 「되돌림 설치」 커맨드를 따로 정의한다 (pnpm `--no-frozen-lockfile` / npm `install` / yarn `install` / bun `install`).
2. **베이스라인 install이 실패하면 델타를 계산하지 않는다.** `베이스라인: 미측정 (install 실패: <사유>)`로 적고
   **T1 판정은 실패 그대로 둔다.** 지금은 실패 처리 절 자체가 없어 조용히 다음 측정으로 넘어간다.
3. 베이스라인 측정 뒤 **업그레이드 상태를 복원하는 단계**를 명시한다 (→ F-8).

---

## F-7 (최대) — gitignore된 필수 파일이 worktree에 없고, 스킬에 대응 절이 없다

**위치:** `skills/rehearsal/SKILL.md` §0 «작업 트리 검증» · §1 «환경 전제 탐지»

`git worktree add`는 **커밋된 것만** 가져간다. woka_app의 `config/`(dev|beta|pro + `config.json`)는
`.gitignore:75`에 있어 worktree에 존재하지 않는다. `tsconfig.json:40`의 `"@config": ["config/config.json"]`이 깨진다.

실측: T1 타입체크 17건 중 **15건이 이 부재 탓**이다 (`Cannot find module '@config'`).

T1은 조건부 베이스라인이 델타로 흡수하므로 판정 자체는 살아남는다. 문제는 둘:

- **비용:** 이 프로젝트에서는 베이스라인이 **매 실행 발동**한다. §2의 *"통과 시 비용 0"*이 성립하지 않는다.
- **T2에는 베이스라인이 없다.** `google-services.json`·keystore·`config.json` 같은 커밋 외 파일이 없는 트리에서
  네이티브 빌드가 죽으면 스킬은 그걸 `실패`(=업그레이드 회귀)로 적는다. §1이
  *"환경 부재와 업그레이드 회귀를 리포트 독자가 못 가린다"*며 막겠다고 선언한 오분류가 T2에서 그대로 열려 있다.

> 이번 실행에서 T2/android는 다른 이유(F-4)로 먼저 죽어 이 오분류가 실제로 발생하진 않았다.
> **관측이 아니라 구조적 위험으로 적는다.**

### 고칠 것

§0에 절을 하나 신설한다. worktree 생성 직후 **원본 작업 트리에는 있으나 worktree에는 없는 gitignored 경로**를 모아
리포트 헤더에 고정 줄로 싣는다:

```
커밋 외 파일: worktree 미포함 N개 — config/, android/local.properties, ...
```

그리고 T2가 실패했을 때 이 목록을 실패 해석에 병기한다. **거부는 하지 않는다** — 대부분의 RN 프로젝트가 이 상태다.

---

## F-4 (높음) — lockstep 「RN 코어」 세트가 실제 RN 릴리즈 반경보다 좁다

**위치:** `shared/lockstep-sets.md` «확정 세트»

확정 세트가 `react-native` + `react` 둘뿐이라, 아래가 구버전에 고정된 채 **인자 검증 3을 통과했다**:

```
@react-native/babel-preset      0.81.1
@react-native/codegen           0.81.1
@react-native/gradle-plugin     0.81.1
@react-native/metro-config      0.81.1
@react-native/eslint-config     0.81.1
@react-native-community/cli(+platform-android/ios)  20.0.2
```

**그 결과가 T2/android 실패다:**

```
FAILURE: Build failed with an exception.
> Could not find com.facebook.react:hermes-android:0.85.3.
```

실측 근거:

| 관측 | 값 |
| --- | --- |
| maven central `hermes-android/0.85.3/*.pom` | **404** |
| maven central `hermes-android/0.81.1/*.pom` | 200 |
| `android/settings.gradle:1` | `pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }` |
| 설치된 `@react-native/gradle-plugin` | 0.81.1 |
| `react-native@0.85.3`의 peerDependencies | `"@react-native/jest-preset": "0.85.3"` (한 버전 고정) |

RN 0.85용 아티팩트 좌표를 0.81 gradle 플러그인이 배선하지 못한다.
**게이트가 잡았어야 할 불완전한 세트가 통과한 뒤, 리포트 독자에게는 「업그레이드 회귀」로 보이는 실패가 났다.**
이건 `lockstep-sets.md` 서두가 *"짝 하나만 올리는 사고"*라고 부른 바로 그것이다.

### 고칠 것

확정 세트에 행을 하나 추가한다:

| 세트 | 구성원 | 근거 |
| --- | --- | --- |
| RN 툴체인 | `@react-native/*` 전체 (`babel-preset`·`metro-config`·`gradle-plugin`·`codegen`·`eslint-config`·`jest-preset`·`typescript-config`·`js-polyfills` …) · `@react-native-community/cli*` | RN 릴리즈와 같은 버전으로 배포된다. `react-native`의 peerDeps가 `@react-native/jest-preset`을 한 버전으로 고정하고, `android/settings.gradle`이 `@react-native/gradle-plugin`을 `includeBuild`한다 |

`@react-native-community/cli`는 버전 축이 달라(20.x) 「RN과 같은 버전」 규칙이 안 맞는다 —
**RN 릴리즈 노트가 지정한 CLI 버전**을 따르도록 근거 칸에 명시한다.

기존의 *"세트 구성원 중 프로젝트에 설치된 것만 대상"* 규칙이 그대로 적용되므로 추가 예외는 필요 없다.

---

## F-2 (높음) — 업그레이드를 실제로 적용하는 단계가 SKILL.md에 없다

**위치:** `skills/rehearsal/SKILL.md` §1 «티어 모델» · §2 «PM 감지»

§1의 T1 정의는 *"worktree 생성 → PM 감지 → 의존성 설치 → 패치 재적용 → 타입체크 → 테스트"*다.
**목표 버전 세트를 적용하는 단계가 없다.**

그리고 §2 PM 표의 설치 커맨드는 `pnpm install --frozen-lockfile`인데, frozen은 정의상 lockfile 갱신을 거부하므로
**그 커맨드만으로는 업그레이드가 원리상 불가능하다.**

실제 적용 커맨드(`pnpm add <pkg>@<ver> …`)는 `references/report-format.md`의 재현 블록 **「예시」에만** 등장한다.
같은 문제가 타입체크에도 있다 — woka_app엔 `typecheck` 스크립트가 없고, `pnpm tsc --noEmit`은 오직 그 예시에만 있다.

**규범이 예시에만 있다.** 구현자가 예시를 정본으로 삼아야만 동작한다.

### 고칠 것

- §1 T1 정의에 「**버전 세트 적용**」을 `PM 감지`와 `의존성 설치` 사이에 넣는다.
- §2 PM 표에 「적용」 열을 추가한다: pnpm `pnpm add` / npm `npm install <pkg>@<ver>` / yarn `yarn up` / bun `bun add`.
- `--frozen-lockfile`은 **적용 이후 재현성 검증용**임을 한 줄로 못박는다.
- 타입체크 커맨드를 §2 본문에 싣는다 (프로젝트 스크립트 우선, 없으면 `<pm> tsc --noEmit`).

---

## F-1 (높음) — dirty 게이트가 멀티환경 RN 프로젝트를 상시 차단한다

**위치:** `skills/rehearsal/SKILL.md` §0 «작업 트리 검증 — dirty tree»

woka_app은 `pnpm set-ios-dev|beta|pro` fastlane 스크립트가
`ios/GoogleService-Info.plist` · `ios/woka_app.xcodeproj/project.pbxproj` · `ios/woka_app/Info.plist` ·
`ios/woka_app/woka_app.entitlements`를 덮어쓴다. 실측한 실제 diff가 `com.wonderround.woka-app-dev → -beta` 치환이다.

즉 **평상시 `ios/**`가 항상 dirty**이고, 스킬 규칙상 결과는 `실행 거부 — 작업 트리 dirty`다.
dev/beta/pro 환경을 파일 치환으로 전환하는 RN 프로젝트에서 이 스킬은 사실상 절대 실행되지 않는다.

**규칙 자체는 옳다** — `git worktree add`가 커밋된 것만 가져가므로 그 변경은 검증에서 빠지는 게 맞다.
문제는 사용자에게 **우회 경로를 알려주지 않는다**는 것뿐이다.

### 고칠 것

거부 문구에 한 줄만 붙인다:

```
실행 거부 — 작업 트리 dirty: <경로 목록>
  → 커밋하거나 `git stash -u` 후 재실행하라. worktree는 커밋된 트리만 가져가므로
    이 변경은 어차피 검증에 포함되지 않는다.
```

---

## F-5 (중간) — PM 설정의 절대경로로 worktree 격리가 뚫린다

**위치:** `skills/rehearsal/SKILL.md` §2 «캐시» · §5 «worktree 수명»

woka_app의 `pnpm-workspace.yaml` `patchedDependencies` 4건 중 **3건이 절대경로**다:

```yaml
patchedDependencies:
  '@baronha/react-native-multiple-image-picker': /Users/wonderround/Documents/Git/woka_app/patches/....patch
  react-native-screens:                          /Users/wonderround/Documents/Git/woka_app/patches/....patch
  '@mj-studio/react-native-naver-map@2.6.7':     /Users/wonderround/Documents/Git/woka_app/patches/....patch
  '@gorhom/bottom-sheet@5.2.6':                  patches/....patch          ← 이것만 상대경로
```

worktree(`/tmp/rn-rehearsal-…`)에서 install해도 이 3건은 **사용자 원본 레포에서** 읽힌다.
실측: 패치는 4/4 적용됐고 pnpm이 `patch_hash`를 붙여 저장했다 — **조용히 성공했다.**

*"우리 프로젝트에서 이 업그레이드를 시도했다"*가 참이려면 패치 소스도 `base_sha` 시점의 것이어야 하는데 보장이 없다.
리허설이 도는 수십 분 동안 사용자가 원본 `patches/`를 고치면 검증 대상이 조용히 바뀐다.
이 절대경로가 F-9의 `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`를 일으킨 직접 원인이기도 하다.

### 고칠 것

§0에 한 줄 검사를 넣는다. worktree의 PM 설정 파일에서 **worktree 밖을 가리키는 절대경로**가 발견되면
헤더에 표기한다 (거부는 하지 않는다):

```
격리 누수: pnpm-workspace.yaml patchedDependencies 3건이 worktree 밖 절대경로를 참조한다
```

---

## F-3 (중간) — 단계 타임아웃을 macOS에서 강제할 수단이 없다

**위치:** `skills/rehearsal/SKILL.md` §1 «단계 타임아웃»

`step_timeout_install_seconds` 외 4종이 계약인데, **강제 방법이 어디에도 정의돼 있지 않다.**
그리고 macOS 기본 환경엔 `timeout`도 `gtimeout`도 없다 — 실측으로 둘 다 `command not found`.

`rehearsal`은 macOS·Linux 전용이고 macOS가 주 호스트다. **계약이 주 호스트에서 무근거다.**
(이번 실행은 `perl -e 'alarm shift; exec @ARGV' <초> <커맨드>`로 우회했다.)

### 고칠 것

§1 «단계 타임아웃»에 래퍼를 못박는다. `perl`은 macOS·Linux 양쪽 기본 탑재라 추가 의존이 없다:

```sh
perl -e 'alarm shift; exec @ARGV' <초> <커맨드>
```

`references/report-format.md` 재현 블록 규칙 7(*"`timeout` 래퍼를 두르지 마라"*)은 그대로 유효하다 —
그 규칙이 가리키는 게 이 래퍼이므로, 두 자리가 같은 것을 말한다는 걸 한 줄로 연결한다.

---

## F-8 (중간) — 베이스라인 측정 후 업그레이드 복원 절차가 없다

**위치:** `skills/rehearsal/SKILL.md` §2 «베이스라인 — 조건부 대조군»

*"실패하면 그때만 같은 worktree를 업그레이드 전 상태로 되돌려 재측정한다"*에서 끝난다.
되돌린 채로 T2에 들어가면 **업그레이드 안 된 트리를 빌드한다.** 지시가 없어 구현자가 알아서 되돌려야 하고,
안 하면 T2·T3 전체가 조용히 거짓 관측이 된다.

또 §2는 이 경로의 비용을 *"통과 시 비용 0. 실패했을 때만 지불한다"*로 적는데,
실제 비용은 **install 2회 추가**(되돌림 + 복원)다. 1회가 아니다.

### 고칠 것

F-9 패치와 같은 자리에 두 줄: 복원 단계 명시 + 비용 문구를 `install 2회 추가`로 정정.

---

## F-6 (낮음) — 패치 개수의 분모가 정의돼 있지 않다

**위치:** `skills/rehearsal/SKILL.md` §2 «패치 재적용 실패» · `references/report-format.md` 구조 예시

woka_app은 `patches/`에 파일 5개, `pnpm-workspace.yaml` 등록은 4건이다
(`react-native-render-html.patch`가 고아). 리포트 예시의 `패치: 3/3 적용` 표기는
분모가 **등록분**인지 **파일 수**인지 말하지 않고, §2는 hunk 실패만 다뤄 미등록 패치는 관측 대상이 아니다.

### 고칠 것

분모를 「PM에 등록된 패치 수」로 못박고, 등록되지 않은 `patches/` 파일이 있으면 헤더에 한 줄 적는다.

---

## F-10 (낮음) — 리허설 전체의 시간 상한이 없다

**위치:** `skills/rehearsal/SKILL.md` §1 «단계 타임아웃»

상한이 **단계 단위로만** 있다. 각 단계가 상한 아래에 머물면서 전체가 길어지는 경로를 막는 것이 없다
(`install 1800 + check 900×2 + build 2700×2 + boot 600×2` = 최악 3시간 이상, 여기에 베이스라인의 install 2회가 더 붙는다).

이번 실행은 전 단계가 빨라(15s / 1s / 7s / 28s) 문제가 드러나지 않았다. **관측이 아니라 산술로 적는다.**

### 고칠 것

`shared/constants.md`에 `run_timeout_seconds` 한 줄을 추가하거나, 상한 없음을 §1에 명시적으로 선언한다.
지금은 **둘 다 아니라서** 구현자가 판단할 근거가 없다.

---

## 우선순위

| 순위 | 발견 | 고치는 파일 |
| --- | --- | --- |
| 1 | F-9 거짓 통과 | `skills/rehearsal/SKILL.md` §2 |
| 2 | F-4 lockstep 구멍 | `shared/lockstep-sets.md` |
| 3 | F-2 적용 단계 부재 | `skills/rehearsal/SKILL.md` §1·§2 |
| 4 | F-7 커밋 외 파일 | `skills/rehearsal/SKILL.md` §0 + `references/report-format.md` 헤더 |
| 5 | F-8 복원 절차 | F-9와 같은 자리 |
| 6 | F-3 타임아웃 강제 수단 | `skills/rehearsal/SKILL.md` §1 |
| 7 | F-1 dirty 우회 안내 | `skills/rehearsal/SKILL.md` §0 |
| 8 | F-5 격리 누수 표기 | `skills/rehearsal/SKILL.md` §0 |
| 9 | F-6 패치 분모 | `skills/rehearsal/SKILL.md` §2 |
| 10 | F-10 전체 상한 | `shared/constants.md` |

**1·2·3을 고치기 전에는 이 플러그인으로 릴리즈하지 않는 게 맞다.**
F-9는 스킬이 존재하는 이유(거짓 통과 방지)를 정면으로 무너뜨리고, F-4는 게이트가 자기 계약을 못 지킨 경우이며,
F-2는 절차서만 읽은 구현자가 업그레이드를 아예 적용하지 못하게 한다.

---

## 이 문서가 보증하지 않는 것

- **T2/ios · T3 전 구간 미검증.** T1이 실패해 수직 fail-fast에 걸렸다.
  `references/log-patterns.md`의 iOS 신호·스크린샷 수집·`boot_survival_seconds` 판정은
  **한 줄도 실행되지 않았다.** T2/android도 부팅 단계 이전(빌드 의존성 해결)에서 죽었으므로
  **로그 스캔 패턴 전체가 미검증**이다.
- **§6 채택 경로 미검증.** 게이트 4개 중 1·3이 막혀 채택 절이 실행되지 않았다.
  브랜치 생성·커밋 메시지·base 신선도 경고는 전부 미관측이다.
- **자매 스킬 2개(`platform-watch`·`currency`) 미실행.** 이 문서는 `rehearsal` 한 축만 닫는다.
- **PM 1종(pnpm)만 관측.** npm·yarn·bun 경로는 미검증이다.
- 한 프로젝트·한 타깃·한 호스트의 1회 실행이다. 일반화하지 마라.
