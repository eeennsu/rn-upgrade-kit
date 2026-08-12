# rehearsal — 리포트 · 경로 · 재현 블록

실행이 끝난 뒤에만 필요하다.

## 경로 · `<target>`

```
.rn-upgrade-kit/rehearsal/reports/YYYY-MM-DD-<target>.md
.rn-upgrade-kit/rehearsal/artifacts/YYYY-MM-DD-<target>/
```

### `<target>` — 실행 식별자

| 조건 | 값 |
| --- | --- |
| 세트에 `react-native`가 있음 | 그 버전 (`0.83.4`) |
| 없음 | 패키지명 사전순 첫 항목의 `<pkg>-<ver>` (`@`·`/`를 `-`로 치환) |

RN 우선인 이유: RN은 lockstep 반경이 가장 넓고 리허설의 사실상 주어다. **`<target>`은 식별자일 뿐 내용이 아니다** — 전체 세트는 리포트 헤더와 채택 커밋 메시지에 전부 실린다.

### 같은 날 · 같은 타깃 재실행

**리포트·artifacts 둘 다 덮어쓴다.** 시각 suffix를 붙이지 않는다 — 붙이면 보존 상한 계산이 "N개 실행"이 아니라 "N개 파일"로 흔들린다.

**덮어쓰기 전에 직전 artifacts를 지운다.** 두 실행의 로그가 한 디렉터리에 섞이면 어느 실행의 증거인지 못 가리고, 리포트가 인용하는 경로가 거짓이 된다.

### 보존

`artifacts/`는 최근 N개만 보존한다. N = `../../../shared/constants.md`의 `artifact_retention_n`. **정리한 개수를 리포트 말미에 한 줄로 보고한다.**

## 구조

````
# RN 업그레이드 리허설 — <현재> → <목표 세트 전체>
실행: <ISO 날짜> · 호스트: <macOS 15 / Linux> · PM: <pnpm> · 스코프: <전체 / --platform ios>
타깃 산정: 2026-08-09 (21일 경과)          ← 산정 시각 주석이 온 경우에만
base: a3f9c21

## 요약
T1         — 통과
T2/android — 통과
T2/ios     — 실패
T3/android — 통과 (스크린샷 1)
T3/ios     — 미실행 (앞 티어 실패)

## 판정 해석
> 이 리포트는 시도한 범위 안에서 관측된 사실만 담는다. 전 티어 통과는
> "업그레이드해도 된다"는 뜻이 아니라 "자동으로 검사 가능한 지점에서는
> 멈추지 않았다"는 뜻이다. 인증 이후 화면·런타임 회귀·실기기 동작·성능은
> 검사 범위 밖이다.

## 티어별 상세
### T1 — 통과
설치: pnpm install --frozen-lockfile (42s)
패치: 3/3 적용
타입체크: 0 errors
테스트: 128 passed

### T2/ios — 실패
xcodebuild 실패 — 발췌:
  ❌ error: module 'Foo' not found (Foo.swift:12)
전체 로그: .rn-upgrade-kit/rehearsal/artifacts/2026-08-30-0.83.4/ios-build.log

## 재현
```sh
# --- T1 ---
git worktree add /tmp/rn-rehearsal-0.83.4 a3f9c21
cd /tmp/rn-rehearsal-0.83.4
pnpm add react-native@0.83.4 react@19.2.0
pnpm install --frozen-lockfile
pnpm tsc --noEmit
pnpm test

# --- T2/android ---
cd android && ./gradlew assembleDebug

# --- T2/ios ---
cd ios && pod install
xcodebuild -workspace App.xcworkspace -scheme App -sdk iphonesimulator

# --- 정리 ---
cd - && git worktree remove --force /tmp/rn-rehearsal-0.83.4
```

## 채택
게이트: 미충족(T2/ios 실패) — 채택 옵션 미제시

## 정리
worktree 폐기: 성공
artifacts: 보존 3개, 자동 정리 1개
````

> 위 예시의 `3`은 값이 아니라 예시다 — 실제 보존 개수는 `../../../shared/constants.md`의 `artifact_retention_n`에서 온다.

- **요약 한 줄을 플랫폼별로 분리한다.** 한 플랫폼 통과를 전체 통과로 접지 않는다.
- 실패 상세는 **발췌문**으로 인용한다(상위 N줄). 전체 로그는 `artifacts/`에 있고 **경로만 적는다.**

## 재현 커맨드 시퀀스

**단일 복붙 블록 1개.** worktree는 이미 폐기됐으므로 **재현은 worktree 재생성부터** 시작한다.

1. **티어 경계는 블록 안 주석으로** 표시한다 (`# --- T1 ---`). 블록 분할의 실익을 파일 증가 없이 흡수한다.
2. **블록은 실패한 티어에서 끝난다.** 미실행 티어의 커맨드는 넣지 않는다.
3. **커맨드는 새로 작문하지 않고 실제 실행된 것에서 그대로 추출한다.** 작문하면 검증할 수 없는 커맨드를 싣게 된다 — 환각 금지 위반이다.
4. **셸은 POSIX 고정.** 감지·분기 없음.
5. 블록 말미에 정리 커맨드를 포함한다.
6. **채택한 실행이면 커밋·브랜치 생성 커맨드도 블록에 싣는다** — 정리 커맨드 **앞**에. 채택은 재현 가능해야 한다. 채택하지 않은 실행에는 넣지 않는다(3번의 연장 — 안 돌린 커맨드를 싣지 않는다).

## 채택 절 — 출력 형태

게이트 미충족이면 한 줄로 끝낸다:

```
## 채택
게이트: 미충족(T2/ios 실패) — 채택 옵션 미제시
```

충족하고 사용자가 채택했으면:

````
## 채택
채택함: rn-upgrade/0.83.4-a3f9c21
미검증: T2/ios · T3/ios (미실행 — macOS 필요)
검증 기준: a3f9c21

> 이 브랜치는 a3f9c21 위에서 검증됐다. 그 이후 커밋이 있으면
> 머지 결과는 검증된 트리가 아니다 — 재리허설을 권장한다.

```sh
git log --oneline a3f9c21..HEAD   # 비어 있지 않으면 위 경고 적용
git merge rn-upgrade/0.83.4-a3f9c21
```
````

충족했으나 사용자가 거절했으면 `채택 안 함 (사용자 선택)`, 브랜치가 이미 있으면 `채택 안 함 (동일 브랜치 존재: <이름>)`.

- **머지 커맨드를 단독으로 출력하지 마라.** 항상 `git log <base_sha>..HEAD` 선행 확인과 한 블록이다.
- **base 신선도 경고문은 base가 최신이어도 항상 출력한다.**

## worktree 폐기 실패

```
## 정리
worktree 폐기: 실패 — Gradle 데몬이 파일을 잡고 있음
수동 정리:
  git worktree remove --force /tmp/rn-rehearsal-0.83.4
  git worktree prune
```

**조용히 넘기면 "항상 폐기"라는 계약이 거짓말이 되고 누적 문제가 그대로 돌아온다.**
