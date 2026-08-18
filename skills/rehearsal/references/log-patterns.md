# rehearsal — T2 부팅 신호 · 로그 스캔 패턴

T2 실행 중에만 필요하다.

## 1. 첫 프레임 렌더 신호

**"프로세스가 살아 있다"와 "화면이 그려졌다"는 다르다.** 크래시 없이 흰 화면만 띄우는 실패가 실재하므로 생존만으로 통과시키지 않는다.

### Android

우선순위 순으로 시도하고, **하나라도 관측되면 신호 확보**로 친다.

| # | 신호 | 확인 |
| - | --- | --- |
| 1 | 프레임 카운트 > 0 | `adb shell dumpsys gfxinfo <applicationId>` — `Total frames rendered` 값 |
| 2 | Choreographer 첫 프레임 | logcat `Choreographer` 태그의 `Skipped ... frames` 또는 `ViewRootImpl` 첫 draw |
| 3 | RN 초기화 완료 | logcat `ReactNativeJS` 태그의 첫 정상 출력 (`Running "…" with …`) |

- 셋 다 못 얻으면 **`실패`가 아니라 관측 실패다** — T2 판정을 `미실행`으로 내리지 말고 `실패` + 사유(`첫 프레임 신호 관측 실패`)로 남긴다. **못 본 것과 안 그려진 것을 구분할 수 없으므로 보수적으로 실패다.**

### iOS

| # | 신호 | 확인 |
| - | --- | --- |
| 1 | RN 브리지/Fabric 마운트 | `xcrun simctl spawn booted log stream --predicate 'processImagePath CONTAINS "<앱이름>"'`에서 RN 초기화 로그 |
| 2 | 앱 상태 foreground 유지 | `xcrun simctl listapps` + 프로세스 생존 |

## 2. 로그 스캔 — 실패 패턴

아래 중 **하나라도 걸리면 T2 실패**다. 매칭된 줄을 리포트에 발췌로 인용한다.

### Android (logcat)

| 패턴 | 의미 |
| --- | --- |
| `FATAL EXCEPTION` | 크래시 |
| `ANR in <applicationId>` | 응답 없음 |
| `ReactNativeJS.*(Error\|error:)` | JS 레벨 에러 |
| `AndroidRuntime.*E ` | 런타임 치명 에러 |
| `libc.*Fatal signal` | 네이티브 크래시 |
| `dlopen failed` | 네이티브 로드 실패 (16KB 정렬·ABI 문제에서 자주 나온다) |

### iOS (simctl log)

| 패턴 | 의미 |
| --- | --- |
| `Fatal error:` | Swift 치명 에러 |
| `*** Terminating app due to uncaught exception` | ObjC 예외 |
| `RCTFatal` | RN 치명 에러 |
| `Thread \d+: signal SIGABRT` | 크래시 |

## 3. 스캔 규칙

- **부팅 전 로그를 섞지 마라.** 앱 실행 직전에 `adb logcat -c`로 버퍼를 비우고, iOS는 스트림 시작 시각 이후만 읽는다.
- **경고는 게이트가 아니다.** `W/` 레벨·deprecation 경고는 실패 사유가 아니다 — 잡으면 거의 모든 실행이 실패로 나온다.
- **서드파티 SDK의 자체 에러 로그**(분석·크래시 리포터 초기화 실패 등)는 위 패턴에 안 걸리면 통과다. 이 스킬은 **RN 스택의 회귀**를 본다.
- **전체 로그는 `artifacts/`에 남기고 리포트에는 매칭 줄만 인용한다.** 쓰기가 실패해도 판정은 바뀌지 않는다 — 매칭 줄은 이미 관측된 사실이다. 처리는 `../SKILL.md` §8.
- **부팅과 로그 스캔은 한 단계로 묶여 `step_timeout_boot_seconds` 상한 안에서 돈다**(`../../../shared/constants.md`). 초과하면 `실패 (타임아웃 step_timeout_boot_seconds)`다 — 위 «셋 다 못 얻음»의 `실패 (첫 프레임 신호 관측 실패)`와 **사유를 합치지 마라.** 앞은 기다리다 끊은 것이고 뒤는 끝까지 봤는데 신호가 없던 것이라, 독자가 할 일이 다르다(상한 조정 대 실제 회귀 조사).
- **`boot_survival_seconds`(통과 조건)는 `step_timeout_boot_seconds`(상한) 안에서 세어진다.** 생존 카운트를 상한 밖으로 밀지 마라 — 밀면 이미 끊긴 실행을 통과로 적게 된다.

## 4. 스크린샷과 이 파일의 관계

수집 커맨드·장수는 `../SKILL.md` §4에 있다. 여기서 정하는 건 **시점 하나**다: **`boot_survival_seconds` 생존 확인 직후**에 찍는다.

- 그 전에 찍으면 스플래시가 찍힌다 — 증거물이 §1의 첫 프레임 신호와 어긋난 화면을 남기고, 리포트를 읽는 사람이 "부팅 실패인데 통과라고 적혔다"로 읽는다.
- **수집 실패는 로그 스캔 결과를 바꾸지 않는다.** 스크린샷은 판정에 쓰이지 않으므로 T2 판정도, 이 파일의 어떤 규칙도 건드리지 않는다.

## 5. 이 파일이 스킬 본문 밖에 있는 이유

패턴 목록은 RN 버전·OS 버전에 따라 낡는다. **낡은 패턴이 조용히 안 걸리는 것**이 이 스킬의 실패 모드이므로, 수정 지점이 한 곳에 모여 있어야 한다. 새 실패 모양을 만나면 여기에 추가하고 이유를 한 줄 남겨라.
