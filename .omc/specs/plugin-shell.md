# Plugin Shell Spec — `rn-upgrade-kit`

세 스킬 스펙(`deep-interview-platform-watch.md` · `deep-interview-currency.md` · `deep-interview-rn-rehearsal.md`)이 **의존하지만 어느 스펙도 소유하지 않는** 플러그인 레벨 산출물의 정본.

- Generated: 2026-08-09
- 출처: 스펙 3개 리뷰(§A~§E)의 D·C·E 항목
- 이 파일은 인터뷰 산물이 아니다. 세 스펙이 참조만 하고 정의하지 않은 것을 모은 것이다.

---

## 1. 디렉터리 레이아웃

```
rn-upgrade-kit/
  .claude-plugin/
    plugin.json
  skills/
    platform-watch/
      SKILL.md
      references/
        watch-targets.md          ← enum 정본 (슬러그·URL·읽기 지시·platform)
    currency/
      SKILL.md
      references/
        report-format.md          ← seed 포팅 + 7개 수정
        cadence.md                ← seed 포팅 + 3개 수정
        sources.md                ← SM·Callstack 문서 URL, 릴리즈 노트 태그 URL 조립 규칙
    rehearsal/
      SKILL.md
      references/
        log-patterns.md           ← T2 로그 스캔 패턴 정본
  shared/
    constants.md                  ← 3스킬 공용 상수 (중립 지대)
  README.md
```

### `shared/`가 필요한 이유

스킬별 `references/`는 **소유자가 하나**다. 보존 상한 N·등급 임계일·핸드오프 경로는 **둘 이상의 스킬이 같은 값을 봐야 하는** 값이라 어느 스킬 폴더에 넣어도 남의 집이다 — 핸드오프 파일을 `handoff/` 중립 지대에 둔 논리와 동일하다(`platform-watch` 라운드 9).

- 스킬 본문에서 상대 경로로 참조한다: `../../shared/constants.md`.
- `skills/` 하위에 두지 않는다 — 그 아래 디렉터리는 스킬로 해석된다.
- **하드코딩 금지 대상:** 아래 표의 모든 값. 스킬 본문에 숫자를 적지 않고 이 파일을 Read한다.

---

## 2. `shared/constants.md` — 키 정본

| 키 | 값 | 소비자 | 근거 |
| --- | --- | --- | --- |
| `handoff_path` | `.rn-upgrade-kit/handoff/platform-requirements.md` | platform-watch(쓰기) · currency(읽기) | 양쪽에 각각 적으면 한쪽만 바뀌어 조용히 끊긴다 (platform-watch 라운드 9b) |
| `handoff_schema_version` | `1` | 동일 | currency의 `스키마 불일치` degrade가 판별 가능해지려면 필요 (§A1) |
| `report_retention_n` | `12` | platform-watch · currency | 같은 매체(마크다운 수 KB). 기능적 하한 2 — currency 델타가 직전 리포트에 걸려 있다 |
| `artifact_retention_n` | `3` | rehearsal | 매체가 다르다(수십 MB) — 성격에서 파생된 정당한 차이 |
| `grade_threshold_days` | `90` | platform-watch (등급 · `urgency` 산정) | 임의 기준. targetSdk 대응은 RN 업그레이드를 동반할 수 있어 사용자가 늘릴 수 있어야 한다 |
| `soak_minor_days` | `14` | currency (게이트 3) | seed §3 계승 |
| `soak_patch_days` | `7` | currency (게이트 3) | seed §3 계승 |
| `target_staleness_warn_days` | `14` | rehearsal (`# 산정 시각` 경과 경고) | 권장 버전은 soak·churn 산물이라 빨리 썩는다. 거부가 아니라 경고 |
| `boot_survival_seconds` | `60` | rehearsal (T2 통과 조건 1) | rehearsal §T2 |
| `url_candidate_limit` | `3` | platform-watch (URL 이동 의심 후보) | platform-watch 라운드 5c |

- **값 변경은 이 파일 한 곳에서만.** 스킬 본문·`references/*`에 같은 숫자를 복제하지 않는다.
- `grade_threshold_days`는 `platform-watch`만 소비한다. currency는 그 값을 다시 계산하지 않고 핸드오프 `urgency` 필드를 읽는다 (§A2 — `deep-interview-currency.md` §핸드오프).

---

## 3. `plugin.json`

```json
{
  "name": "rn-upgrade-kit",
  "description": "React Native 업그레이드 3종 세트 — 플랫폼 정책 마감 감사(platform-watch), 패키지 최신성·권장 버전 산정(currency), 격리 worktree 리허설·채택(rehearsal). 앞 둘은 advisory, 마지막만 게이트 통과 시 전용 브랜치를 남긴다.",
  "version": "0.1.0",
  "author": { "name": "eeennsu" }
}
```

- `version`은 semver. 초기 `0.1.0`.
- 스킬은 `skills/` 자동 발견에 맡긴다 — 매니페스트에 나열하지 않는다.

---

## 4. `README.md` — 필수 절

세 스펙이 README를 **6곳에서 의존**한다. 아래 절이 빠지면 그 스펙 항목들이 불통과다.

### 4.1 호스트 지원 매트릭스 — **거부 사유 포함**

| 호스트 | `platform-watch` | `currency` | `rehearsal` |
| --- | --- | --- | --- |
| macOS | ✅ | ✅ | ✅ |
| Linux | ✅ | ✅ | android만 (`T2/ios` = `미실행 (macOS 필요)`) |
| Windows | ✅ | ✅ | **실행 거부** |

고정 문구:

> `rehearsal`: POSIX 전용 — **네이티브 빌드를 실제 실행하기 때문**이다. 검증 못 한 실행 경로를 사실로 쓰지 않는다.
> `platform-watch`: 전 호스트 — 웹 조회와 텍스트 파일 읽기만 한다. 유닉스 유틸·셸 문법 의존 0.
> `currency`: 전 호스트 — 조회·파일 읽기 + registry 조회용 `node -e` 한 줄. 대상이 RN 프로젝트이므로 node는 항상 존재한다.
>
> **Windows에서도 iOS 항목은 판정된다.** `Podfile`·`project.pbxproj`·`xcconfig`는 repo 안 텍스트라 Xcode 없이 읽힌다 — **판정 가능한 것과 빌드 가능한 것은 별개다.**

스킬별 차이가 임의가 아니라 **실행 유무에서 나온다**는 걸 보여야 사용자가 규칙을 기억한다 (platform-watch 라운드 7c).

### 4.2 `.gitignore` 안내 — 붙여넣을 한 줄

세 스킬 모두 `.gitignore`를 **수정하지 않는다.** README가 한 줄을 제시하고 사용자가 결정한다:

```
.rn-upgrade-kit/
```

> 리포트 이력을 커밋하고 싶으면 이 줄을 넣지 않으면 된다. 기본값을 바꾸지 않고도 양쪽 가치를 얻는다.

### 4.3 CI 디스패치 안내 — 문서로만

`rehearsal`은 CI를 호출하지 않는다(비목표). Linux 호스트에서 `T2/ios`를 검증하고 싶은 사용자를 위한 **수동 워크플로 예시**를 README에 싣는다 — `gh workflow run`·폴링·리모트 push는 전부 스킬 밖이다.

### 4.4 3스킬 관계도 · 실행 순서

```
platform-watch  ──파일──▶  currency  ──커맨드 블록──▶  rehearsal
   (날짜 축)                (registry 축)              (실행 축)
   advisory                 advisory                  게이트 통과 시 브랜치
```

- 단방향. 역방향 의존 없음.
- `platform-watch`를 한 번도 안 돌려도 `currency`는 동작한다 (`플랫폼 하한 미반영`).
- `currency` 없이 `rehearsal`을 직접 호출해도 된다 — 목표 버전은 인자로만 받는다.

### 4.5 산출물 경로

```
.rn-upgrade-kit/
  platform-watch/reports/YYYY-MM-DD.md
  platform-watch/state.json
  handoff/platform-requirements.md
  currency/reports/YYYY-MM-DD.md
  rehearsal/reports/YYYY-MM-DD-<target>.md
  rehearsal/artifacts/YYYY-MM-DD-<target>/
```

### 4.6 설치 · 호출

```
/rn-upgrade-kit:platform-watch [--platform android|ios] [--target <슬러그>]
/rn-upgrade-kit:currency [--track core|lib] [--target <pkg>] | platform
/rn-upgrade-kit:rehearsal <pkg@ver>... [--platform android|ios]
```

---

## 5. 미해결 위임 (구현 재량)

- `references/watch-targets.md`의 enum 초기 URL 실측 — 스펙은 슬러그만 확정했다
- `references/log-patterns.md`의 T2 로그 패턴 목록
- `references/sources.md`의 SM·Callstack 문서 URL과 릴리즈 노트 태그 URL 조립 규칙(모노레포 접두사 변형)
- `shared/constants.md`의 물리 포맷(마크다운 표 / YAML frontmatter) — 스킬이 Read해서 값을 뽑을 수 있으면 된다
