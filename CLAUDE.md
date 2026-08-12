# rn-upgrade-kit

Claude Code 플러그인 `rn-upgrade-kit`의 소스 repo.

## 스킬 3개

| 스킬 | 역할 | 축 |
| --- | --- | --- |
| `platform-watch` | 플랫폼 정책 추적. 웹 조회 전용 | 날짜 |
| `currency` | 패키지 최신성 + 권장 버전 산정 | registry |
| `rehearsal` | 격리 worktree에서 RN 업그레이드 실제 실행·판정·채택 | — |

## 핸드오프

`platform-watch` → `currency` 단방향. `platform-watch`가 "RN 하한 요구"를 파일로 남기고, `currency`의 권장 버전 게이트가 그걸 하한으로 읽는다.

## 위치

- 스펙: `.omc/specs/`
- 포트 원본: `seed/rn-currency-SKILL.md`

세 스킬의 리포트 문체·구조 기준은 seed 파일이다.
