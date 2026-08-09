# platform-watch — 추적 대상 enum

동일성 키의 정본. **여기 있는 슬러그가 키다** — URL·제목이 바뀌어도 키는 안 바뀐다.

## 항목 스키마

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `슬러그` | ✔ | 동일성 키. 한 번 정하면 바꾸지 않는다 — 바꾸면 그 항목이 `[신규]`로 오탐된다 |
| `platform` | ✔ | `android` \| `ios`. **`--platform` 필터가 읽는 값.** 슬러그 접두사에서 추론하지 않는다 — `play/*`가 안 풀린다 |
| `요구 항목` | ✔ | 무엇을 얼마로 맞춰야 하나 |
| `1차 URL` | ✔ | 공식 정책 본문 |
| `2차 URL` | ✔ | **요건은 독립성.** 1차의 미러나 같은 사이트 하위 경로면 같은 개편에 함께 죽어서 이중화가 아니다 — **다른 호스트 또는 다른 성격의 공식 페이지**여야 한다 |
| `현재값 읽기 지시` | ✔ | 프로젝트 어디를 어떻게 읽나 |
| `등급 임계일` | ✖ | 미지정 시 `../../../shared/constants.md`의 `grade_threshold_days` |

URL을 추가·수정할 때 **2차의 독립성 요건을 반드시 지켜라.** 지키지 않으면 §소스 도달의 2단 구조가 형태만 남는다.

## 항목

### `android/target-sdk`

- **platform:** android
- **요구:** Play 제출용 `targetSdk` 하한
- **1차:** https://developer.android.com/google/play/requirements/target-sdk
- **2차:** https://support.google.com/googleplay/android-developer/answer/11926878
- **현재값:** `android/build.gradle`의 `targetSdkVersion` 또는 `android/app/build.gradle`의 `targetSdk`. flavor 분기가 있으면 전부 병기하고 가장 낮은 값 기준으로 판정.

### `android/16kb-page-size`

- **platform:** android
- **요구:** 16KB page size 정렬
- **1차:** https://developer.android.com/guide/practices/page-sizes
- **2차:** https://support.google.com/googleplay/android-developer/answer/16513766
- **현재값:** AGP 버전(`android/build.gradle`의 classpath 또는 `gradle/libs.versions.toml`) + `android/gradle.properties`의 관련 플래그. 네이티브 `.so` 정렬은 빌드 산물이라 **읽지 않는다** — 읽을 수 있는 것만 읽고 나머지는 `현재값 확인 못 함`.

### `ios/min-deployment-target`

- **platform:** ios
- **요구:** Apple 최소 배포 타깃
- **1차:** https://developer.apple.com/support/xcode/
- **2차:** https://developer.apple.com/news/
- **현재값:** `ios/Podfile`의 `platform :ios, 'X.Y'` + `ios/*.xcodeproj/project.pbxproj`의 `IPHONEOS_DEPLOYMENT_TARGET` + `ios/*.xcconfig`. 셋이 갈리면 전부 병기, 가장 낮은 값 기준 판정.

### `ios/min-xcode`

- **platform:** ios
- **요구:** 심사 제출용 최소 Xcode / SDK 버전
- **1차:** https://developer.apple.com/support/xcode/
- **2차:** https://developer.apple.com/news/
- **현재값:** repo 안에서 읽을 수 있는 건 CI 설정(`.github/workflows/*.yml`의 `xcode-version`)뿐이다. 없으면 `현재값 확인 못 함 (경로 부재)` — **로컬 Xcode 버전을 셸로 확인하지 않는다.**

### `ios/privacyinfo-required`

- **platform:** ios
- **요구:** `PrivacyInfo.xcprivacy` 존재
- **1차:** https://developer.apple.com/documentation/bundleresources/privacy-manifest-files
- **2차:** https://developer.apple.com/news/
- **현재값:** `Glob`으로 `ios/**/PrivacyInfo.xcprivacy` 탐색. **존재 여부가 곧 현재값이다** — 있으면 충족, 없으면 미충족. 탐색 자체가 불가능한 경우에만 `확인 못 함`.

### `play/billing`

- **platform:** android
- **요구:** Play 결제 라이브러리 최소 버전
- **1차:** https://developer.android.com/google/play/billing/deprecation-faq
- **2차:** https://support.google.com/googleplay/android-developer/answer/13584340
- **현재값:** `package.json`의 결제 관련 패키지 버전 + `android/app/build.gradle`의 `com.android.billingclient` 의존. 결제 미사용이면 `현재값 확인 못 함`이 아니라 **`이미 충족`이 아니다** — 해당 없음을 판정할 근거가 없으므로 `현재값 확인 못 함 (경로 부재)`로 둔다.

### `play/data-safety`

- **platform:** android
- **요구:** 데이터 안전성 폼 요구 변경
- **1차:** https://support.google.com/googleplay/android-developer/answer/10787469
- **2차:** https://developer.android.com/guide/topics/data/collect-share
- **현재값:** **repo에서 읽을 수 없다** — Play Console 상태다. 항상 `현재값 확인 못 함 (경로 부재)`이고 마감만 표시한다. 빼지 않는다.

## 초기 목록의 한계

**위 URL은 실측되지 않았다.** 첫 실행에서 1차·2차가 죽어 있으면 §소스 도달의 수리 루프(`URL 이동 의심` → 이 파일 수정 → `--target`으로 해당 항목만 재확인)를 타라. 그게 이 파일이 스킬 본문 밖에 있는 이유다.
