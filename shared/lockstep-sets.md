# rn-upgrade-kit — lockstep 세트

**짝으로만 올려야 하는 패키지 집합의 정본.** `currency` 게이트 6과 `rehearsal` 인자 검증 3이 **같은 목록을 봐야** 하므로 여기 있다 — 양쪽 스킬에 각각 적으면 한쪽만 늘어나고, 그러면 `currency`가 권장한 세트를 `rehearsal`이 "짝 누락"으로 거부하거나 그 반대가 된다.

도달 방법과 실패 시 처리는 `constants.md`의 «이 파일에 도달하는 법»과 같다. **못 읽으면 지어내지 마라** — 아래 «도달 실패» 참조.

## 확정 세트

| 세트 | 구성원 | 근거 |
| --- | --- | --- |
| RN 코어 | `react-native` · `react` | RN 릴리즈마다 대응 React 버전이 고정된다 |
| Reanimated | `react-native-reanimated` · `react-native-worklets` | v4에서 워클릿 런타임이 분리됐다 — 버전이 어긋나면 런타임에서 깨진다 |
| React Navigation | `@react-navigation/*` 전체 (`native` · `stack` · `bottom-tabs` · `drawer` · `native-stack` …) | 단일 모노레포에서 메이저를 함께 올린다 |

**세트 구성원 중 프로젝트에 설치된 것만** 대상이다. `@react-navigation/drawer`를 안 쓰면 그 짝을 요구하지 않는다 — 없는 패키지를 "누락"이라 부르지 않는다.

## 확정 목록에 없는 짝을 만났을 때 — 감지 규칙

목록이 고정이면 새 라이브러리가 짝 없이 조용히 권장되고 게이트가 그걸 못 잡는다. **그래서 이 파일은 목록이자 규칙이다.**

조회 중 아래 신호 중 **하나라도** 관측되면 **잠정 lockstep 후보**로 표시한다:

| # | 신호 | 어디서 보나 |
| - | --- | --- |
| 1 | 서로의 `peerDependencies`가 **범위가 아니라 한 버전대로** 고정 (`"react-native-worklets": "0.7.x"` 꼴) | `registry.npmjs.org/<pkg>/<ver>` 응답 |
| 2 | 같은 GitHub 모노레포에서 **한 태그로 함께 배포** | `skills/currency/references/sources.md`의 repo/태그 표 (`currency`만 해당 — `rehearsal`에는 이 파일이 없다) |
| 3 | 릴리즈 노트에 *"must be upgraded together"* · *"requires matching version of"* 류 문구 | 게이트 재료 수집 중 읽는 노트 |

- **잠정 후보는 확정 세트와 다르게 다룬다.** 확정 세트는 게이트 6의 **판정 근거**고, 잠정 후보는 **⚠ 표기 + 이 파일 추가 제안**이다. 감지 규칙은 휴리스틱이라 오탐이 있고, 오탐이 실행 거부로 이어지면 사용자가 막힌다.
- **제안 문구 고정**: `잠정 lockstep 후보: <pkg A> ↔ <pkg B> (신호 <#>) — shared/lockstep-sets.md 확정 목록에 추가 검토`.
- `rehearsal`은 **잠정 후보로 실행을 거부하지 않는다.** 거부는 확정 세트로만 한다 — 인자 검증은 사용자가 손으로 친 것을 막는 자리고, 휴리스틱으로 막으면 우회 수단이 없다.

## 도달 실패

이 파일을 못 읽으면:

- `currency`: 게이트 6을 `확인 못 함`으로 두고 권장 줄에 `⚠ lockstep 미확인`을 병기한다. **권장 자체를 막지는 않는다** — 다만 리포트의 rehearsal 커맨드 블록에는 `lockstep 세트 미확인 — 짝을 손으로 확인하라` 주석을 단다.
- `rehearsal`: 인자 검증 3을 **미실행**으로 두고 리포트 헤더에 `인자 검증 3 미실행 (lockstep 목록 도달 실패)`를 적는다. 거부하지 않는다 — 확인 못 한 것을 위반으로 취급하지 않는다.

양쪽 다 **조용히 통과시키지 않는다.** 조용히 넘기면 "짝 하나만 올리는 사고"를 막는다는 게이트의 계약이 거짓이 된다.
