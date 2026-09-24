# rn-upgrade-kit — Expo 프로젝트 규칙

**세 스킬이 같은 판정을 봐야 하는 Expo 규칙의 정본.** 프로젝트가 Expo인지, 플랫폼마다 네이티브 디렉토리를 커밋하는지(bare)·생성하는지(CNG), SDK 정보를 어디서 조회하는지가 여기 있다. `platform-watch`·`currency`·`rehearsal`이 각자 적으면 한 스킬은 CNG로 읽고 다른 스킬은 bare로 읽는 어긋남이 난다.

사본·정본 관계와 도달 방법은 같은 폴더 `constants.md`의 «사본과 정본»·«이 파일에 도달하는 법»과 같다 — 정본은 repo의 `shared/expo.md`이고 세 스킬의 `references/expo.md`는 사본이다. **고칠 때는 정본에서 고친다.** 못 읽었을 때의 처리는 §7.

**이 파일에는 버전 값이 없다.** SDK↔RN 대응, SDK별 호환 범위, SDK 기본 targetSdk·배포 타깃은 전부 **실행할 때마다** §4의 출처에서 조회하고 근거 링크를 단다(§6). 아래에 보이는 숫자는 실측 기록이거나 예시이지 판정에 쓰는 값이 아니다.

## 1. 프로젝트 유형 — 세 가지, 플랫폼마다 판정

| 유형 | 조건 |
| --- | --- |
| **RN** (Expo 아님) | 정본 `package.json`의 `dependencies`에 `expo`가 없다 |
| **Expo bare** | `expo`가 있고, 그 플랫폼의 네이티브 디렉토리(`android/` · `ios/`)가 **커밋돼 있다** |
| **Expo CNG** | `expo`가 있고, 그 플랫폼의 네이티브 디렉토리가 **없거나 커밋돼 있지 않다** — 빌드 때 `expo prebuild`가 app config에서 생성한다 |

- **정본 `package.json`은 `currency` §1의 정의를 따른다** — `react-native`를 `dependencies`에 가진 것, 여럿이면 가장 얕은 경로. 네이티브 디렉토리와 app config는 그 파일이 있는 디렉토리(앱 루트)에서 찾는다. 단일 앱 레포에서는 레포 루트다.
- **플랫폼마다 따로 판정한다.** `android/`만 커밋하고 `ios/`는 생성하는 프로젝트도 있다. 헤더에는 두 플랫폼을 모두 적는다.
- CNG를 "커밋 여부"로 가르는 이유: EAS Build도 같은 기준을 쓴다 — 업로드된 소스에 네이티브 디렉토리가 없으면 prebuild를 돌린다. **로컬에 디렉토리가 있어도 커밋돼 있지 않으면 CNG다.** 그 디렉토리는 `npx expo run`·`prebuild`가 남긴 생성물이다.

### 판별 수단 — 가진 도구에 따라 다르다

**git을 쓰는 스킬(`rehearsal`)**: 검증 기준 커밋(`base_sha`)의 트리를 본다 — `git ls-tree --name-only <base_sha> -- <앱 루트>/android`가 비어 있지 않으면 android bare, 비었으면 CNG. ios도 같다. worktree는 그 커밋에서 만들어지므로 그 트리가 판정 기준이다.

**셸을 쓰지 않는 스킬(`platform-watch` · `currency`)**: `Glob`으로 디렉토리 존재를 보고, 앱 루트와 레포 루트의 `.gitignore`를 Read한다.

| 디렉토리 | `.gitignore` | 판정 |
| --- | --- | --- |
| 없음 | — | CNG |
| 있음 | 그 디렉토리를 무시하는 줄이 있다 (`/android` · `android` · `android/` · `/android/`) | CNG — 로컬 생성물 |
| 있음 | 무시하는 줄이 없다 | bare |
| 있음 | 글롭·부정(`!`) 패턴이 걸려 판정이 모호하다 | **유형 확인 못 함** |

- `.gitignore` 판별은 근사다 — 전역 excludes·`.git/info/exclude`는 보지 못한다. 그래서 **모호하면 추측하지 않고 `유형 확인 못 함`**으로 둔다.

### CNG 플랫폼의 로컬 네이티브 디렉토리는 읽지 않는다

prebuild 생성물은 **생성한 시점의 app config**를 반영한다. app config를 고친 뒤 다시 생성하지 않았으면 디렉토리 안 값은 낡았다. 그걸 현재값으로 읽으면 **낡은 생성물을 사실로 보고**하게 된다. CNG 플랫폼의 값은 §3의 app config와 SDK 기본값에서만 온다.

### 유형 확인 못 함

그 플랫폼에서 네이티브 파일이나 app config에 기대는 값을 **전부 `확인 못 함 (Expo 유형 판별 불가)`**으로 둔다. bare로 가정하면 생성물을 오독할 수 있고, CNG로 가정하면 커밋된 설정을 무시한다 — 어느 쪽 추측도 틀린 값을 사실로 적는 경로다.

### 리포트 헤더 — 한 줄

```
프로젝트: RN (Expo 아님)
프로젝트: Expo SDK 57 — android CNG · ios CNG
프로젝트: Expo SDK 57 — android bare · ios 유형 확인 못 함
```

> 위 `57`은 값이 아니라 예시다 — SDK는 §2로 식별한다.

## 2. SDK 식별

- **SDK = `expo` 버전의 major.** lockfile을 읽는 스킬(`currency` · `rehearsal`)은 설치 버전에서, lockfile을 읽지 않는 스킬(`platform-watch`)은 선언 범위의 하단에서 major를 뽑는다(`~57.0.25` → 57). SDK 식별에는 major만 필요하므로 선언 범위로 충분하다.
- 선언 범위가 major를 가르지 못하면(`*` · `latest` · `>=` · `workspace:` · `catalog:`) **`SDK 확인 못 함`**이다. SDK에 기대는 값(§3의 SDK 기본값 · §5 정합)만 `확인 못 함`이 되고 나머지 판정은 그대로 한다.
- §4 API에 넘기는 SDK 문자열은 `<major>.0.0`이다.

## 3. app config 읽기 — 평가하지 않는다

**파일**: 앱 루트의 `app.json` · `app.config.json` · `app.config.js` · `app.config.ts` (`.mjs`·`.cjs` 포함). 설정 객체는 `expo` 키 아래든 최상위든 받는다.

- **`app.json` · `app.config.json`은 JSON으로 읽는다.**
- **`app.config.js` · `.ts`는 평가하지 않는다.** `npx expo config`는 프로젝트 코드를 실행하고 셸이 필요하다 — `platform-watch`의 셸 의존 0이 깨지고, 설정 코드가 무엇을 하는지 모른 채 실행하게 된다. 텍스트로 Read해서:
  - 키가 **리터럴 값**으로 보이면 그 값을 쓴다.
  - 키가 **식**(변수 · 함수 호출 · `process.env`)으로 보이면 `확인 못 함 (app.config 동적 값)`.
  - 키가 **보이지 않으면** `app.json` 값 → 없으면 SDK 기본값으로 가되, `(app.config.* 정적 읽기 — 동적 덮어쓰기 미확인)`을 병기한다. `app.config`는 `app.json`을 받아 고쳐 돌려줄 수 있다 — 안 보인다는 게 안 고친다는 뜻은 아니다.

### 읽는 키 — 필요한 것만

전반 파싱이 아니다. 아래 키만 읽는다.

| 값 | 키 (먼저 찾는 순서) |
| --- | --- |
| targetSdk | `plugins`의 `expo-build-properties` 설정 → `android.targetSdkVersion` |
| iOS 배포 타깃 | `ios.deploymentTarget` → `plugins`의 `expo-build-properties` 설정 → `ios.deploymentTarget` |
| New Arch | `newArchEnabled` → `expo-build-properties`의 `android.newArchEnabled` · `ios.newArchEnabled` |
| JS 엔진 | `jsEngine` → `android.jsEngine` · `ios.jsEngine` |
| privacy manifest | `ios.privacyManifests` |

- **두 자리에 다른 값이 있으면 둘 다 병기한다.** 판정 규칙(가장 낮은 값 · boolean은 `확인 못 함`)은 각 스킬의 충돌 규칙을 그대로 따른다.
- **키가 없는 건 정상이다.** 대부분의 Expo 앱은 기본값을 쓴다 — 그때 값은 SDK 기본값이고, SDK 기본값은 §4에서 조회한다. 조회 출처가 없는 값(New Arch · JS 엔진)은 `미지정 (Expo SDK 기본값)`으로 표기하고 판정은 `확인 못 함`이다 — 기본값을 지어내지 않는다.

### bare 플랫폼에서 Expo가 값을 두는 자리

bare Expo는 네이티브 파일이 정본이지만, **리터럴이 `build.gradle`에 없는 것이 정상이다.** 기본값은 SDK 안에 있고, 덮어쓴 값은 prebuild가 쓰던 속성 파일에 있다.

| 값 | 먼저 볼 자리 | 없으면 |
| --- | --- | --- |
| targetSdk | `android/gradle.properties`의 `android.targetSdkVersion` → `build.gradle`의 리터럴 | SDK 기본값 (§4) |
| iOS 배포 타깃 | `ios/Podfile.properties.json`의 `ios.deploymentTarget` → `ios/Podfile`의 `platform :ios, <식> \|\| '<X.Y>'` 폴백 리터럴 → `project.pbxproj`·`xcconfig` | SDK 기본값 (§4) |

## 4. 조회 출처 — 실행할 때마다

| 재료 | 출처 | 채널 | 소비자 |
| --- | --- | --- | --- |
| SDK 목록 · SDK별 RN·React · 마이그레이션 노트 URL · 그 SDK의 `expo` 최고 stable | `api.expo.dev/v2/versions/latest` + `registry.npmjs.org/expo` | `node -e` **E1** | currency |
| SDK 호환 범위 (native-modules) | `api.expo.dev/v2/sdks/<n>.0.0/native-modules` → 폴백 `cdn.jsdelivr.net/npm/expo@<ver>/bundledNativeModules.json` | `node -e` **E2** → **E2′** | currency · rehearsal |
| SDK 기본 네이티브 값 (compileSdk · targetSdk · iOS · Xcode) | https://docs.expo.dev/versions/latest/ «Support for Android and iOS versions» 표 | WebFetch | platform-watch · currency (번역 근거) |
| EAS 빌드 이미지 → Xcode | https://docs.expo.dev/build-reference/infrastructure/ | WebFetch | platform-watch |

- **판정 재료는 원문 채널이 정본이다.** SDK 범위 문자열(`~57.0.4`) 하나가 요약되며 바뀌면 정합 판정이 조용히 틀린다 — 그래서 E1·E2는 `node -e`다(`currency` §2와 같은 이유). 셸이 없는 `platform-watch`는 문서 표만 쓰고, 표의 행을 **원문 그대로 인용**해 근거로 단다.
- **문서 표의 내용 검증**: 표 머리(`Expo SDK version` · `targetSdkVersion` · `iOS version` · `Xcode version`)와 프로젝트 SDK의 행이 있어야 한다. 머리가 없으면 도달 실패, 행이 없으면 `SDK 기본값 확인 못 함 (표에 SDK <n> 없음)`이다 — 표는 최근 SDK만 싣는다. **다른 SDK 행으로 대신하지 않는다.**

| 출처 | 실측 |
| --- | --- |
| E1 (`api.expo.dev/v2/versions/latest` + registry) | 2026-09-24 · 도달. 출시 전 SDK도 싣는다 — 프리뷰 SDK는 RN 열이 `-rc`이고 `expo` 최고 stable이 없다(`-`) |
| E2 (native-modules) | 2026-09-24 · 도달, SDK 하나에 123줄. 없는 SDK(99)는 `EMPTY` |
| E2′ (jsdelivr `bundledNativeModules.json`) | 2026-09-24 · 도달, 같은 SDK의 E2 목록과 **정렬 후 동일**. 없는 버전은 `HTTP 404` |
| SDK 기본값 표 | 2026-09-24 · 도달, 최근 4개 SDK 행 |
| EAS 인프라 | 2026-09-24 · 도달, SDK별 이미지명(`…-xcode-<X.Y>`)과 Xcode 표, 별칭(`auto` · `latest` · `sdk-<n>`) 설명 |

### `node -e` 원라이너 — `S`·`V`만 바꾼다

**E1 — SDK 목록.** `S` = 현재 SDK major.

```sh
node -e "const S=55;Promise.all([fetch('https://api.expo.dev/v2/versions/latest').then(r=>r.json()),fetch('https://registry.npmjs.org/expo').then(r=>r.json())]).then(([a,b])=>{const v=a.data.sdkVersions;const n=s=>s.split('.').map(Number);const c=(x,y)=>{const p=n(x),q=n(y);for(let i=0;i<3;i++){if(p[i]-q[i])return p[i]-q[i]}return 0};const st=Object.keys(b.versions).filter(x=>/-/.test(x)===false);Object.keys(v).filter(k=>n(k)[0]>=S).sort(c).forEach(k=>{const m=n(k)[0];const e=st.filter(x=>n(x)[0]===m).sort(c).pop()||'-';const x=v[k];console.log([k,x.facebookReactNativeVersion,x.facebookReactVersion,'expo '+e,x.releaseNoteUrl||'-'].join(' | '))})})"
```

출력: 현재 SDK 이상인 SDK마다 한 줄 — `<SDK> | <RN> | <React> | expo <그 SDK의 최고 stable 또는 -> | <마이그레이션 노트 URL 또는 ->`.

- **`expo -`인 SDK는 아직 나오지 않았다.** API는 프리뷰 SDK도 싣는다. **"다음 SDK"는 현재보다 큰 SDK 중 `expo` 열이 `-`가 아닌 가장 작은 것이다.**
- RN·React 열은 **그 SDK가 지금 고정하는 버전**이다. SDK 안의 패치가 나오면 바뀐다 — 매번 조회하는 이유다.

**E2 — SDK 호환 범위.** `S` = 조회할 SDK major.

```sh
node -e "const S=57;fetch('https://api.expo.dev/v2/sdks/'+S+'.0.0/native-modules').then(r=>r.ok?r.json().then(d=>{const a=d.data||[];if(a.length===0){console.log('EMPTY',S);return}a.forEach(m=>console.log(m.npmPackage+' | '+m.versionRange))}):console.log('HTTP',r.status,S))"
```

출력: 줄마다 `<패키지> | <versionRange>`. 목록이 없으면 `EMPTY <S>`, HTTP 실패면 `HTTP <코드> <S>` — 둘 다 E2′로 간다.

**E2′ — 폴백.** `V` = 그 SDK의 `expo` 정확 버전(현재 SDK면 설치 버전, 목표 SDK면 E1의 `expo` 열).

```sh
node -e "const V='57.0.25';fetch('https://cdn.jsdelivr.net/npm/expo@'+V+'/bundledNativeModules.json').then(r=>r.ok?r.json().then(d=>Object.keys(d).forEach(k=>console.log(k+' | '+d[k]))):console.log('HTTP',r.status,V))"
```

> 위 `55`·`57`·`57.0.25`는 값이 아니라 예시다.

- **한 줄로 쓰고 `$`·백틱·`!`을 넣지 않는다** — `currency` §2와 같은 이유(셸마다 확장 시점이 달라 커맨드가 셸마다 다른 것이 된다).
- **실측(2026-09-24 · Windows 11): 세 줄 모두 PowerShell 5.1과 Git Bash의 출력이 같다** — E1(`S=55`), E2(`S=57` · 없는 SDK `99`), E2′(`57.0.25` · 없는 `99.0.0`), BOM·줄바꿈 정규화 후 비교.
- **`S`·`V`만 바꾼다. 로직을 고치면 양쪽 셸을 다시 실측하고 위 날짜를 갱신한다.**
- `platform-watch`는 이 원라이너를 쓰지 않는다 — 셸을 호출하지 않는다.

## 5. SDK 정합 — `currency`·`rehearsal` 공용 판정

`npx expo install --check`가 보는 것과 같은 것을 **스킬이 직접** 본다 — 그 커맨드는 설치가 끝난 뒤에야 돌고, `--fix`는 버전을 스스로 골라 고친다(타깃 추측이다).

- **목표 SDK**: 세트(`rehearsal` 인자 · `currency` 블록)에 `expo@<ver>`가 있으면 그 major, 없으면 현재 SDK.
- **정합 대상**: 정본 `package.json`의 `dependencies`·`devDependencies`에 **직접 선언된** 패키지 중 목표 SDK 목록(E2)에 있는 것. 전이 의존은 세지 않는다 — `lockstep-sets.md`의 «설치된 것» 정의와 같다. `expo` 자신은 목록에 없다 — 목표 SDK를 정하는 쪽이다.
- **정합 판정**: 버전이 목표 SDK의 `versionRange`를 만족하는가.

| 범위 형태 | 만족 조건 |
| --- | --- |
| `x.y.z` (정확) | 같은 버전 |
| `~x.y.z` | `x.y`가 같고 `z` 이상 |
| `^x.y.z` | semver 정의대로 — `x ≥ 1`이면 `x`가 같고 `x.y.z` 이상, `0.y.z`면 `0.y`가 같고 `z` 이상, `0.0.z`면 같은 버전 |
| 그 밖 (`>=` · `\|\|` · 와일드카드 · 프리릴리즈 꼬리) | **판정 불가** — 그 패키지만 `SDK 정합 확인 못 함` |

### 규칙 둘

1. **세트에 든 정합 대상은 목표 SDK 범위를 만족해야 한다.**
2. **목표 SDK가 현재 SDK와 다르면, 세트에 없는 정합 대상은 현재 버전이 이미 목표 범위를 만족해야 한다.** 아니면 그 패키지가 세트에서 **누락**된 것이다 — SDK를 올리면서 그 패키지를 안 올리면 새 SDK가 고정하는 네이티브 모듈과 어긋난다.

- **목표 SDK가 현재 SDK와 같을 때 세트 밖의 기존 어긋남은 누락이 아니다.** 관측만 한다: `SDK 정합 어긋남 (기존): <pkg> <현재> — SDK <n> 범위 <range>`. 이번 업그레이드가 만든 어긋남이 아니므로, 거부하면 무관한 사정으로 리허설이 막힌다.
- **lockstep 세트와는 별개 규칙이다 — 둘 다 통과해야 한다.** RN 코어 세트의 `@react-native/*`는 SDK 목록에 없을 수 있지만, 직접 선언돼 있으면 lockstep 규칙대로 RN과 같은 번호로 동반한다(`lockstep-sets.md`).

### 조회 실패

E2와 E2′가 둘 다 실패하면 **지어내지 않고 조용히 통과시키지도 않는다.**

- `currency`: SDK 범위를 상한에 쓰지 않고 해당 대상 권장 줄에 `⚠ SDK 범위 미확인`을 병기한다. SDK 업그레이드 블록은 싣지 않고 사유를 적는다.
- `rehearsal`: 인자 검증 4를 `미실행`으로 두고 헤더에 `인자 검증 4 미실행 (Expo SDK 범위 조회 실패)`를 적는다 — 확인 못 한 것을 위반으로 취급하지 않는다.

## 6. 버전 값을 적지 않는다

- **이 파일 · 스킬 본문 · 참조 파일 어디에도** SDK↔RN 대응, SDK별 기본값, *"SDK N 이상이면 X"* 같은 문턱을 적지 않는다. 적으면 다음 SDK가 나오는 날 낡고, 환각 금지는 낡은 표를 근거로 삼는 걸 막지 못한다 — `currency`의 «매핑표를 보유하지 않는다»와 같은 원칙이다. bare RN 경로에도 같이 적용된다.
- 실측 칸의 숫자는 그날의 관측 기록이다. 판정에 쓰지 않는다.

## 7. 이 파일에 도달하지 못했을 때

Expo 여부는 `package.json`만 봐도 알 수 있지만, **판정 규칙은 이 파일에 있다.** 규칙 없이 Expo 프로젝트를 RN처럼 읽으면 CNG의 낡은 생성물을 현재값으로 읽는다.

- **Expo가 아닌 프로젝트는 영향이 없다.** 이 파일의 규칙은 Expo 프로젝트에만 걸린다.
- `platform-watch`: Expo 프로젝트면 네이티브 파일·app config에 기대는 현재값을 `확인 못 함 (Expo 규칙 도달 실패)`로 둔다. 마감·요구는 그대로 조회한다.
- `currency`: SDK 범위를 상한에 쓰지 않고(`⚠ SDK 범위 미확인`) SDK 업그레이드 블록을 싣지 않는다. 헤더에 `Expo 규칙 도달 실패 — SDK 판정 미적용`.
- `rehearsal`: Expo 프로젝트면 **실행 거부** — `실행 거부 — Expo 규칙 도달 실패: references/expo.md`. CNG 판별과 prebuild 여부가 실행 파라미터라서다. 모르고 돌리면 네이티브 디렉토리 없이 T2를 시작하고, 그 실패가 업그레이드 회귀처럼 보인다(`constants.md` 도달 실패가 거부인 이유와 같다).
