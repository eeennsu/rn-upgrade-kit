# rn-upgrade-kit

Claude Code 플러그인 `rn-upgrade-kit`의 소스 repo.

## 스킬 3개

| 스킬 | 역할 | 축 |
| --- | --- | --- |
| `platform-watch` | 플랫폼 정책 추적. 웹 조회 전용 | 날짜 |
| `currency` | 패키지 최신성 + 권장 버전 산정 | registry |
| `rehearsal` | 격리 worktree에서 RN 업그레이드 실제 실행·판정·채택 | — |

## 핸드오프

`platform-watch` → `currency` 단방향. `platform-watch`가 **플랫폼 요구 그 자체**(`targetSdk 36` 같은 네이티브 값·마감일·충족 여부)를 핸드오프 파일로 남기고, `currency`가 그것을 RN 버전으로 **번역해** 권장 버전 **범위의 하한**으로 쓴다.

두 가지를 혼동하지 마라 — 스펙이 이름을 붙여 죽인 실패 모드다:

- **핸드오프에 RN 버전은 없다.** `rn_floor` 계열 필드를 두지 않는다 — `platform-watch`에는 번역 재료(릴리즈 노트·registry·peer)가 설계상 없고, 재료 없는 쪽이 판정하면 그게 추측이다. 번역 주체는 `currency`다.
- **하한은 게이트가 아니다.** `currency`의 게이트 6개는 전부 하강 필터인데 하한은 반대 방향 제약이라, 7번째 게이트로 넣으면 하강 재시도 루프와 충돌한다. **범위 축에 둔다.**

## 위치

- 스펙: `.omc/specs/`
- 포트 원본: `seed/rn-currency-SKILL.md`

세 스킬의 리포트 문체·구조 기준은 seed 파일이다.
