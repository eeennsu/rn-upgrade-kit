# rn-upgrade-kit

Claude Code 플러그인 `rn-upgrade-kit`의 소스 repo. 스킬은 Agent Skills 표준 폴더라 다른 에이전트에도 `npx skills`로 설치된다 — **스킬 폴더 하나만 복사돼도 동작해야 한다.**

## 스킬 3개

| 스킬 | 역할 | 축 |
| --- | --- | --- |
| `platform-watch` | 플랫폼 정책 추적. 웹 조회 전용 | 날짜 |
| `currency` | 패키지 최신성 + 권장 버전 산정 | registry |
| `rehearsal` | 격리 worktree에서 RN 업그레이드 실제 실행·판정·채택 | — |

## 핸드오프

`platform-watch` → `currency` 단방향. `platform-watch`가 "RN 하한 요구"를 파일로 남기고, `currency`의 권장 버전 게이트가 그걸 하한으로 읽는다.

## 위치

- 스펙: `docs/specs/`
- 포트 원본: `seed/rn-currency-SKILL.md`
- 공용 상수·lockstep 세트 정본: `shared/` — 스킬별 `references/`의 같은 이름 파일은 사본이다

세 스킬의 리포트 문체·구조 기준은 seed 파일이다.

## 고친 뒤

`shared/`·`LICENSE`·`.claude-plugin/plugin.json`을 고쳤으면 `node scripts/sync.mjs`로 사본과 루트 `plugin.json`을 다시 만든다. 사본·루트 `plugin.json`은 직접 고치지 않는다. 스킬 본문에서 스킬 폴더 밖(`../../`)을 가리키지 않는다 — `node scripts/sync.mjs --check`가 잡고 CI에서 돈다.
