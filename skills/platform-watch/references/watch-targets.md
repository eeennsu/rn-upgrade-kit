# platform-watch — 추적 대상 enum

동일성 키의 정본. **여기 있는 슬러그가 키다** — URL·제목이 바뀌어도 키는 안 바뀐다.

## 항목 스키마

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `슬러그` | ✔ | 동일성 키. 한 번 정하면 바꾸지 않는다 — 바꾸면 그 항목이 `[신규]`로 오탐된다 |
| `platform` | ✔ | `android` \| `ios`. **`--platform` 필터가 읽는 값.** 슬러그 접두사에서 추론하지 않는다 — `play/*`가 안 풀린다 |
| `요구 항목` | ✔ | 무엇을 얼마로 맞춰야 하나 |
| `1차 URL` | ✔ | 공식 정책 본문 |
| `2차 URL` | ✔ | 독립 이중화. 만족시킬 페이지가 없으면 **`없음 (<사유>)`**을 명시적으로 적는다 — 아래 «2차의 독립성» |
| `교차` | ✖ | 이 항목의 2차가 **다른 항목의 1차**와 같을 때, 그 슬러그를 적는다. 비워두지 말고 명시한다 |
| `실측` | ✔ | 마지막으로 URL 도달을 확인한 날짜와 결과. 확인 안 했으면 `미실측` |
| `현재값 읽기 지시` | ✔ | 프로젝트 어디를 어떻게 읽나 |
| `등급 임계일` | ✖ | 미지정 시 `../../../shared/constants.md`의 `grade_threshold_days` |

### 2차의 독립성 — 세 단계로 갈린다

**요건은 "1차가 죽어도 이 사실을 다른 데서 확인할 수 있다"이지 "URL이 두 개 있다"가 아니다.** 아래 순서로 강도가 떨어지고, **낮은 단계를 쓸 때는 그 사실을 항목에 적어야 한다.**

| 강도 | 조건 | 표기 |
| --- | --- | --- |
| ① 완전 | **다른 호스트**의 공식 페이지 | 추가 표기 없음 |
| ② 부분 | 같은 호스트지만 **다른 성격의 페이지** (정책 표 ↔ 릴리즈 노트 ↔ 제출 도움말) | 같은 섹션이면 사유를 항목에 적는다 |
| ③ 교차 | 다른 항목의 **1차**를 2차로 쓴다 | `교차:` 필드에 그 슬러그를 적는다 |
| ✖ 없음 | 요건을 만족할 페이지를 못 찾았다 | `없음 (<사유>)` |

두 가지 금지는 그대로다:

- **여러 항목이 같은 2차 URL을 공유하지 않는다.** 공유하면 페이지 하나가 죽을 때 항목 여럿의 이중화가 동시에 사라져 요건이 막으려던 것이 그대로 일어난다.
- **1차의 미러나 1차와 같은 페이지를 2차로 쓰지 않는다.** 같은 개편에 함께 죽어서 이중화가 아니다.

**③ 교차를 금지가 아니라 표기 대상으로 둔 이유**는 공급자가 그 요건을 두 페이지에만 싣는 경우가 실제로 있기 때문이다(Apple의 iOS 버전 요건). 없는 독립성을 URL을 하나 더 적어서 만들어낼 수는 없다 — **만들 수 없으면 드러낸다.** 교차 페이지가 죽으면 두 항목이 동시에 단일 소스로 떨어지고, 그건 degrade 5(소스 도달 실패)보다 먼저 오는 상태다.

**✖ 없음을 허용한 이유**도 같다. 2차를 필수로 두고 아무 URL이나 채우면 스키마는 만족하지만 이중화는 없고, **없다는 사실만 안 보이게 된다.** 2차가 없는 항목은 1차가 죽는 순간 바로 `확인 못 함`이므로, 리포트에서 그 항목에 `이중화 없음`을 병기한다.

URL을 추가·수정할 때는 **2차를 고르기 전에 이미 다른 항목이 쓰는 페이지인지 먼저 본다.** 1차 목록과 2차 목록 양쪽을 봐야 한다 — 2차끼리만 비교하면 ③ 교차를 못 잡는다.

## 항목

### `android/target-sdk`

- **platform:** android
- **요구:** Play 제출용 `targetSdk` 하한
- **1차:** https://developer.android.com/google/play/requirements/target-sdk
- **2차:** https://support.google.com/googleplay/android-developer/answer/11926878 — ① 다른 호스트
- **실측:** 2026-08-18 · 1차·2차 모두 도달, 요구 내용 일치
- **현재값:** `android/build.gradle`의 `targetSdkVersion` 또는 `android/app/build.gradle`의 `targetSdk`. flavor 분기가 있으면 전부 병기하고 가장 낮은 값 기준으로 판정.

### `android/16kb-page-size`

- **platform:** android
- **요구:** 16KB page size 정렬
- **1차:** https://developer.android.com/guide/practices/page-sizes
- **2차:** **없음** (후보 3개가 전부 실측에서 탈락 — Play Console 도움말 `answer/16513766` 404 · `source.android.com/docs/core/architecture/16kb-page-size` 404 · AGP 릴리즈 노트는 도달하나 16KB 요구를 싣지 않음)
- **실측:** 2026-08-18 · 1차 도달, 요구 내용 일치 (마감 2027-02-01 명시). **2차 없음 — 리포트에 `이중화 없음` 병기 대상**
- **현재값:** AGP 버전(`android/build.gradle`의 classpath 또는 `gradle/libs.versions.toml`) + `android/gradle.properties`의 관련 플래그. 네이티브 `.so` 정렬은 빌드 산물이라 **읽지 않는다** — 읽을 수 있는 것만 읽고 나머지는 `현재값 확인 못 함`.

### `ios/min-deployment-target`

- **platform:** ios
- **요구:** Apple 최소 배포 타깃
- **1차:** https://developer.apple.com/news/upcoming-requirements/
- **2차:** https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds — ② 같은 호스트·다른 성격(제출 도움말)
- **실측:** 2026-08-18 · 1차·2차 모두 도달. 1차에 `2026-04-28부터 Xcode 26 + OS 26 SDK 빌드 필수` 명시, 2차에 업로드 요건 Xcode 버전표 존재
- **현재값:** `ios/Podfile`의 `platform :ios, 'X.Y'` + `ios/*.xcodeproj/project.pbxproj`의 `IPHONEOS_DEPLOYMENT_TARGET` + `ios/*.xcconfig`. 셋이 갈리면 전부 병기, 가장 낮은 값 기준 판정.

### `ios/min-xcode`

- **platform:** ios
- **요구:** 심사 제출용 최소 Xcode / SDK 버전
- **1차:** https://developer.apple.com/support/xcode/
- **2차:** https://developer.apple.com/news/upcoming-requirements/ — ③ 교차
- **교차:** `ios/min-deployment-target` (그 항목의 1차다). Apple이 iOS 버전 요건을 이 두 페이지에만 싣는다 — 세 번째 독립 페이지를 실측에서 못 찾았다. **`upcoming-requirements`가 죽으면 이 항목과 `ios/min-deployment-target`이 동시에 단일 소스로 떨어진다.**
- **실측:** 2026-08-18 · 1차·2차 모두 도달. 1차에 Xcode 26.6 안정판·27 beta 및 배포 타깃 정보 존재
- **현재값:** repo 안에서 읽을 수 있는 건 CI 설정(`.github/workflows/*.yml`의 `xcode-version`)뿐이다. 없으면 `현재값 확인 못 함 (경로 부재)` — **로컬 Xcode 버전을 셸로 확인하지 않는다.**

### `ios/privacyinfo-required`

- **platform:** ios
- **요구:** `PrivacyInfo.xcprivacy` 존재
- **1차:** https://developer.apple.com/support/third-party-SDK-requirements/
- **2차:** https://developer.apple.com/documentation/bundleresources/privacy-manifest-files — ② 같은 호스트·다른 성격(규범 문서)
- **실측:** 2026-08-18 · 1차 도달(80+ SDK 목록 확인). **2차는 JS 렌더링 페이지라 본문 회수 실패** — 도달은 하나 WebFetch로 내용을 못 읽는다. 그래서 규범 문서를 1차가 아니라 2차에 뒀다: **읽을 수 있는 쪽이 1차여야 한다.** 2차 도달 실패가 잦으면 degrade 5로 간다
- **현재값:** `Glob`으로 `ios/**/PrivacyInfo.xcprivacy` 탐색. **존재 여부가 곧 현재값이다** — 있으면 충족, 없으면 미충족. 탐색 자체가 불가능한 경우에만 `확인 못 함`.

### `play/billing`

- **platform:** android
- **요구:** Play 결제 라이브러리 최소 버전
- **1차:** https://developer.android.com/google/play/billing/deprecation-faq
- **2차:** https://developer.android.com/google/play/billing/release-notes — ② 같은 호스트·다른 성격(릴리즈 노트). **같은 섹션(`/google/play/billing/`)이라 섹션 개편에는 함께 죽는다** — 다른 호스트 후보(Play Console 도움말 `answer/13584340`)가 404라 대체가 없었다
- **실측:** 2026-08-18 · 1차·2차 모두 도달. 양쪽 다 `2026-08-31까지 Billing Library v8 이상, 연장 2026-11-01` 명시 — 두 페이지가 같은 값을 말하는 것까지 확인
- **현재값:** `package.json`의 결제 관련 패키지 버전 + `android/app/build.gradle`의 `com.android.billingclient` 의존. 결제 미사용이면 `현재값 확인 못 함`이 아니라 **`이미 충족`이 아니다** — 해당 없음을 판정할 근거가 없으므로 `현재값 확인 못 함 (경로 부재)`로 둔다.

### `play/data-safety`

- **platform:** android
- **요구:** 데이터 안전성 폼 요구 변경
- **1차:** https://support.google.com/googleplay/android-developer/answer/10787469
- **2차:** https://developer.android.com/guide/topics/data/collect-share — ① 다른 호스트
- **실측:** 2026-08-18 · 1차·2차 모두 도달. 1차는 상시 의무이고 **날짜 표기가 삭제돼 있다** — D-day 미계산 대상(degrade 3)
- **현재값:** **repo에서 읽을 수 없다** — Play Console 상태다. 항상 `현재값 확인 못 함 (경로 부재)`이고 마감만 표시한다. 빼지 않는다.

## 실측 이력

**2026-08-18 · 14개 URL 전수 조회.** 그 전까지 이 파일의 URL은 한 번도 실측되지 않았고, 그 사실만 아래에 적혀 있었다. 조회에서 나온 것:

| 발견 | 조치 |
| --- | --- |
| `support.google.com/.../16513766` (16KB 2차) **404** | 대체 후보 2개도 탈락 → `2차: 없음` |
| `support.google.com/.../13584340` (billing 2차) **404** | Billing 릴리즈 노트로 교체 (② 강도) |
| iOS 두 항목이 같은 두 페이지를 **맞바꿔** 쓰고 있었다 | `upload-builds` 투입 + 남은 겹침을 `교차:` 필드로 명시 |
| `documentation/bundleresources/privacy-manifest-files`는 **JS 렌더링이라 본문 회수 실패** | 1차·2차를 맞바꿔 읽히는 쪽을 1차로 |

**404 두 건이 초기 목록 7항목 중 2항목의 이중화를 이미 죽여 놓은 상태였다.** 실측 없이 스키마만 지켜도 이중화가 성립하지 않는다는 뜻이다 — `실측` 필드가 스키마에 들어간 이유다.

URL이 죽으면 §소스 도달의 수리 루프(`URL 이동 의심` → 이 파일 수정 → `--target`으로 해당 항목만 재확인)를 타라. 그게 이 파일이 스킬 본문 밖에 있는 이유다. **고칠 때 `실측` 필드도 같이 갱신한다** — 안 하면 다음 사람이 이 표를 믿는다.
