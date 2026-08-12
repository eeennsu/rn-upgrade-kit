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
- **전체 로그는 `artifacts/`에 남기고 리포트에는 매칭 줄만 인용한다.**

## 4. 이 파일이 스킬 본문 밖에 있는 이유

패턴 목록은 RN 버전·OS 버전에 따라 낡는다. **낡은 패턴이 조용히 안 걸리는 것**이 이 스킬의 실패 모드이므로, 수정 지점이 한 곳에 모여 있어야 한다. 새 실패 모양을 만나면 여기에 추가하고 이유를 한 줄 남겨라.
