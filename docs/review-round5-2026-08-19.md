# 라운드 5 독립 재점검 — rn-upgrade-kit 감사 원장

검토자: critic (독립 라운드 · 앞선 세 리뷰어와 다른 컨텍스트) · 검토일: 2026-08-19
대상: `docs/audit-ledger.md` «라운드 5» 절(`:162-192`) + «종료» 절(`:196-237`) + 그 근거가 된 `skills/platform-watch/references/watch-targets.md` 변경 12줄
입력: `docs/review-closing-2026-08-19.md`(판정 APPROVED)가 남긴 **잔여 3항** — 그 3항이 라운드 5의 계약이다
판정 기준: `.omc/specs/*.md` 4개(각 파일 `## Acceptance Criteria` 우선) · `CLAUDE.md` · `seed/rn-currency-SKILL.md` · `shared/constants.md` · `shared/lockstep-sets.md`

**결론 요약: A-29는 진짜 결함이고 PARTIAL은 정직한 처리다 — 두 URL을 직접 열어 확인했다. 원장 좌표는 기계 전수 216건에서 범위 부적중 0이고, 수치(29 / CLOSED 27 / PARTIAL 1 / REJECTED 1)는 전부 참이다. `rehearsal` AC는 내가 67항을 전수로 다시 대조했고 「적발 0」은 실질적으로 참이다.**

**그러나 판정은 REJECTED다.** 라운드 5가 자기 손으로 세운 검사 기준 — *"도달했다는 것과 그 페이지가 이 항목의 재료를 싣는다는 것은 다르다"*(`watch-targets.md:130`) — 을 **형제 항목 하나에 적용하지 않았고, 그 항목을 「요구 내용 일치」로 인증했다.** 실제 페이지를 열어 확인한 결과 거짓이다. 여기에 「AC 73항」이라는 존재하지 않는 수치가 원장 네 자리에 박혔다(실제 67항). **이 루프가 네 번 연속 당한 「자기 수정의 파급을 못 좇는 것」이 다섯 번째로 반복됐다** — 이번엔 자기가 방금 발명한 검사 기준을 옆 항목에 못 들고 간 형태다.

---

## (1) 잔여 2 — 「`rehearsal` AC 전수, 적발 0」이 참인가

원장 `:171`·`:186`·`:208`·`:227` 네 자리가 *"AC **73항** 전수 재대조 수행 — 적발 0"*을 주장한다. **라운드 2·3·4가 전부 검증 없는 「0건」 주장으로 기각당한 자리**라 전수로 다시 했다.

### 1-a. 실질 판정 — **「적발 0」은 참이다**

`.omc/specs/deep-interview-rn-rehearsal.md`의 `## Acceptance Criteria`(`:490-564`)를 **한 항씩** `skills/rehearsal/SKILL.md`(367줄) · `references/report-format.md`(197줄) · `references/log-patterns.md`(70줄)와 대조했다. 대조 결과 대응 자리가 없는 AC는 **없다.** 표본이 아니라 전수다.

밀도가 높은 자리만 추려 대응표를 남긴다(나머지는 아래 «대조 범위»에 목록으로 있다):

| AC | 구현 대응 | 판정 |
| --- | --- | --- |
| `:493` 존재 확인이 `node -e`이고 `WebFetch` 코드 경로 부재 | `SKILL.md:39`·`:45-53` | 대응 |
| `:494` `node -e` 실패 시 거부 아님 + 헤더 문구 | `SKILL.md:55` · `report-format.md:112` | 대응 |
| `:497` `lockstep-sets.md` 도달 실패 시 거부 아님 | `SKILL.md:62` · `report-format.md:113` | 대응 |
| `:503` `미실행 (macOS 필요)` ↔ `미실행 (사용자 지정 스코프)` **서로 다른 문구** | `SKILL.md:115`·`:116`·`:131` | 대응 |
| `:509` 패치 hunk 실패 시 관측을 **버리지 않는다** | `SKILL.md:159`·`:183-186` | 대응 |
| `:510` 판정 어휘 3값 · 4번째 부재 | `SKILL.md:17`·`:122`·`:156`·`:328` | 대응 |
| `:512` 4종 lockfile PM·패치 메커니즘 감지 | `SKILL.md:171-176` | 대응 |
| `:515` 보존 상한 초과 자동 정리 + **정리 개수 보고** | `SKILL.md:248` · `report-format.md:29`·`:95` | 대응 |
| `:516`·`:517` 재현 블록 POSIX 단일·티어 경계 주석·실패 티어에서 종료·작문 부재 | `report-format.md:122-131` | 대응 |
| `:522` 게이트 3(베이스라인 미측정) | `SKILL.md:276` · `report-format.md:110` | 대응 |
| `:528` 브랜치명에 `base_sha` 포함 | `SKILL.md:303` · `report-format.md:146` | 대응 |
| `:541` 동일 브랜치 존재 시 force·suffix 코드 경로 부재 | `SKILL.md:295` · `report-format.md:160` | 대응 |
| `:542` 상수 3종 하드코딩 부재 | `SKILL.md:92`·`:212`·`:237` · `report-format.md:29` | 대응 |
| `:551` 채택 커밋 메시지에 `검증 기준`·`베이스라인`·`미검증` | `report-format.md:171`·`:174`·`:175` | 대응 |
| `:553` 고아 디렉토리 prune 후 삭제 · 등록 시 실행 거부 | `SKILL.md:254-257` · `report-format.md:115` | 대응 |
| `:556` 네 단계 상한, 초과는 `실패`이지 `미실행` 아님 | `SKILL.md:144-147`·`:149` | 대응 |
| `:557` `boot_survival_seconds` ⊂ `step_timeout_boot_seconds` | `SKILL.md:151` · `log-patterns.md:59` | 대응 |
| `:558` 재현 블록 `timeout` 래퍼 부재 + 주석 | `SKILL.md:152` · `report-format.md:130` | 대응 |
| `:559`·`:560` T3 스크린샷 커맨드·장수·시점 / 수집 실패가 T2를 안 바꿈 | `SKILL.md:232-239` · `log-patterns.md:63-66` | 대응 |
| `:561` 상수 도달 실패 = **실행 거부** (자매 스킬과 다름) | `SKILL.md:332`·`:337-344` | 대응 |
| `:562` 쓰기 순서 채택 커밋 → `artifacts/` → 리포트 | `SKILL.md:350` | 대응 |
| `:564` degrade 흔적이 헤더에 남는다 | `report-format.md:112-114`·`:118` | 대응 |

**라운드 2·3·4의 「0건」과 이번 「0건」은 다르다.** 앞의 셋은 대조 절 자체가 없거나(라운드 4) 대조하지 않은 축을 표에 올렸다(라운드 3). 이번 건은 내가 독립으로 전수해서 같은 결론에 도달했다. **잔여 2의 실질은 해소된 것으로 인정한다.**

### 1-b. N-12. 「73항」은 존재하지 않는 수치다 — `docs/audit-ledger.md:171`·`:186`·`:208`·`:227`

기계 계수:

```
awk 'NR>=490 && NR<=566 && /^- \[ \]/' .omc/specs/deep-interview-rn-rehearsal.md | wc -l  →  67
grep -c '^- \[ \]' .omc/specs/deep-interview-rn-rehearsal.md                              →  67
```

파일 전체에 `- [ ]` 는 **67개**이고 그 전부가 `:490-564` 안에 있다(구간 밖 0개). 내역: `:492-531` 40항 + `:535-543` 9항(«스킬 표면·식별자») + `:547-564` 18항(«구현 감사 반영») = **67**.

**73은 어디에서도 나오지 않는다.** 같은 원장 `:126`은 이 축을 *"AC 전수(**69항**)"*라 적었다 — 둘 다 틀렸고 서로도 다르다. 원장 `:19`가 *"각 건의 근거 file:line은 **현재 트리 기준**이다"*라고 선언한 파일에서, 전수를 주장하는 절의 분모가 실측과 6 어긋난다.

**이것이 「적발 0」을 거짓으로 만들지는 않는다**(1-a에서 실질을 확인했다). 무너지는 것은 **주장의 검증 가능성**이다 — 분모를 못 맞추는 전수 주장은 다음 리뷰어가 재현할 수 없고, 이 루프가 세 번 기각당한 이유가 정확히 그것이다.

### 1-c. N-13. «보증하지 않는 축»의 취소선이 실제로 한 일보다 넓다 — `docs/audit-ledger.md:227`

`:227`이 *"~~**`rehearsal`**~~ → **라운드 5가 보증한다.** AC 73항 전수 재대조, 적발 0"*으로 축 **전체**의 취소선을 그었다. 그러나 라운드 5가 실제로 돈 것은 **AC 축**뿐이다(`:186` 대조 축 표가 스스로 그렇게 적는다). AC가 아닌 스펙 본문 — §미확정 해소·§구현 감사 반영·Ontology — 은 대조되지 않았고, 거기에 실제로 미착륙 결정이 하나 남아 있다(아래 N-16). **AC 전수 ≠ `rehearsal` 축 보증이다.**

---

## (2) A-29가 진짜 결함인가 · PARTIAL이 정직한가 — **둘 다 그렇다**

라운드 5의 관측을 믿지 않고 두 URL을 직접 `WebFetch`로 열었다.

### 2-a. 1차 — `developer.apple.com/news/upcoming-requirements/`

페이지가 싣는 요구 문장 전문(회수한 그대로):

> *"Apps uploaded to App Store Connect must be built with **Xcode 26 or later** using an **SDK for iOS 26**, iPadOS 26, tvOS 26, visionOS 26, or watchOS 26."* (2026-04-28 발효)
> *"Apps uploaded to App Store Connect must be built with Xcode 15 for iOS 17…"* (2024-04-29)
> *"iOS and iPadOS apps submitted to the App Store must be built with Xcode 14.1 and the iOS 16.1 SDK or later…"* (2023-04-25)

**세 문장 전부 Xcode 버전 + SDK 버전 축이다. 최소 배포 타깃(앱이 지원해야 하는 최저 iOS 버전) 값은 페이지에 없다.**

### 2-b. 2차 — `developer.apple.com/help/app-store-connect/manage-builds/upload-builds`

업로드용 Xcode 버전표(타깃 유형별 `Built using Xcode 16 or later` / `Uploaded using Xcode 6 or later` 등)와 *"Starting in 2026, you'll be required to use Xcode 14 or later to upload your app to App Store Connect."* 뿐이다. **최소 배포 타깃 값 언급 없음.**

### 2-c. 판정

`watch-targets.md:64`가 이 항목의 «요구»를 *"Apple 최소 배포 타깃"*으로 정의하고 `.omc/specs/deep-interview-platform-watch.md:76`이 enum 정의에서 같은 문자열을 쓴다. 두 URL 어디에도 그 재료가 없으므로 —

> `.omc/specs/deep-interview-platform-watch.md:554` AC — *"HTTP 200이어도 해당 항목의 재료를 못 찾으면 실패로 취급되고 2차로 넘어간다"*
> 같은 파일 `:556` AC — *"1차·2차 모두 실패 시 항목이 리포트에서 사라지지 않고 `확인 못 함 (소스 도달 실패)`로 남는다"*
> `skills/platform-watch/SKILL.md:58` — *"**"1차 실패"에 내용 실패를 포함한다.** HTTP 200이어도 그 페이지에서 해당 항목이 요구하는 재료(임계값·날짜 문구)를 못 찾으면 실패로 취급하고 2차로 넘어간다"*

— **A-29는 진짜 결함이다.** 이전 실측 기록이 *"1차·2차 모두 도달"*로 적어 이 항목이 영구 degrade 5 상태인 것을 덮고 있었다는 진단도 그대로 맞다.

**PARTIAL도 정직한 처리다.** 회피가 아닌 근거:

- 사유가 **검증 가능하다.** 재료가 실재하는 페이지(`developer.apple.com/support/xcode/`)가 `ios/min-xcode`의 1차인 것은 `watch-targets.md:77`에서 확인된다. 이 파일의 독립성 스키마는 `:25-28` 4단계이고 ③ 교차는 `:14`가 *"이 항목의 2차가 **다른 항목의 1차**와 같을 때"*로만 정의한다 — **1차끼리의 겹침을 적을 자리가 실제로 없다.** 스키마를 직접 읽어 확인했다.
- URL 재선정이 감사 재량 밖이라는 주장도 맞다. `.omc/specs/deep-interview-platform-watch.md:702` — *"enum 초기 목록의 정확한 슬러그 문자열과 1차·2차 URL (참조 파일 `references/watch-targets.md`)"* 이 §«구현자에게 남기는 미확정 (설계 재량)» 목록에 있다. 같은 목록 `:705`가 *"소스 «내용 실패» 판정의 구체적 검사 기준"*까지 미확정으로 남겨 둔 상태다.
- **사실이 두 곳에 다 적혔다** — 참조 파일(`watch-targets.md:67-70`)과 원장(`:176`·`:210`) 양쪽. 숨기고 닫은 게 아니다.

**감사가 결정 못 하는 축을 결정하지 않고 드러낸 것은 이 원장이 A-16·A-23·A-27에서 지켜온 원칙과 같다. PARTIAL 유지에 이견 없다.**

---

## (3) 나머지 11개 URL의 실측이 사실인가 — **1건 거짓**

`watch-targets.md`의 URL은 7항목 × (1차 + 2차) 중 ③ 교차로 한 쌍이 겹쳐 **정확히 12개 고유 URL**이다. 원장 `:187`의 「12개」는 참이다. 표본 4개를 직접 열었다.

### 3-a. 참으로 확인된 것

| 항목 | 파일이 적은 실측 | 실제 페이지 | 판정 |
| --- | --- | --- | --- |
| `android/target-sdk` (`:49`) | *"양쪽 다 `targetSdk ≥ 36` · 마감 `2026-08-31` · 연장 `2026-11-01`"* | 1차가 *"New apps and app updates: Must target Android 16 (API level 36) or higher"* · *"Primary deadline: August 31, 2026 / Extension deadline: November 1, 2026"* | **일치** |
| `play/billing` 1차 (`:98`) | 버전별 표 `v7 → 2026-08-31 / v8 → 2027-08-31` | 표 실재. 열 이름이 *"New app and update deadline"*이고 `7 → August 31, 2026`, `8 → August 31, 2027` | **일치** |
| `play/billing` 2차 (`:98`) | *"양쪽 다 2026-08-31까지 Billing Library v8 이상, 연장 2026-11-01"* | 배너 *"By Aug 31, 2026, all new apps and updates to existing apps must use Billing Library version 8 or later. … request an extension until Nov 1, 2026."* | **일치** |

**`play/billing` 폐기 판단은 옳다.** 라운드 5는 표와 배너가 *"모순이 아니다 — 표는 각 버전의 폐기 기한이고 배너는 현재 최소 요구"*라며 폐기했다. 1차 페이지가 그 열을 직접 정의한다: *"**New app and update deadline**: By this date, all new apps and updates to existing apps must use the specified version or later."* 즉 `7 → 2026-08-31`은 *"2026-08-31부터 v7이 하한"*이 아니라 **v7의 수명이 그날 끝난다**는 뜻이고, 같은 페이지가 스스로 *"By August 31, 2026 … must use Billing Library version 8 or later"*로 정리한다. **두 문서는 같은 사실을 말한다. 폐기가 맞다.**

### 3-b. N-11. `ios/min-xcode`의 1차가 그 항목의 «요구» 재료를 싣지 않는다 — `skills/platform-watch/references/watch-targets.md:80` **[신뢰도 HIGH · 실측 확인]**

원장 `:187`이 *"나머지 11개는 도달·내용 모두 첫 실측과 동일"*이라 적고 `watch-targets.md:80`이 그 항목을 **`요구 내용 일치`**로 인증했다. **거짓이다.**

**항목의 «요구»** — `watch-targets.md:76`: *"심사 제출용 최소 Xcode / SDK 버전"*
**1차** — `watch-targets.md:77`: `https://developer.apple.com/support/xcode/`

이 페이지를 두 번 열었다(두 번째는 정책 문장만 겨냥해서). 회수 결과:

> **"This page does not state a policy requirement for minimum Xcode version or minimum SDK version required to submit/upload an app for App Store review. The page is purely a compatibility and capability reference table."**

페이지가 싣는 것은 Xcode 버전별 능력표뿐이고, 자기 Legend가 각 열을 그렇게 정의한다:

> *"**Deployment Target:** The OS range supported by this version of Xcode for uploading apps to App Store Connect."*
> *"**SDK:** The version of SDKs included in this version of Xcode."*

**«심사 제출용 최소 Xcode/SDK»라는 정책 문장이 이 페이지에 없다.** 그 요구를 싣는 것은 이 항목의 **2차**(`upcoming-requirements` — *"must be built with Xcode 26 or later using an SDK for iOS 26"*)다.

`skills/platform-watch/SKILL.md:58`과 AC `:554`를 그대로 적용하면 **`ios/min-xcode`의 1차는 매 실행 내용 실패로 판정되고 항상 2차로 넘어간다.** 파급 두 가지:

1. **`watch-targets.md:12`가 1차 URL을 *"공식 정책 **본문**"*으로 규정한다.** 능력 참조표는 정책 본문이 아니다 — 이 항목은 스키마 필수 필드를 형식만 채운 상태다.
2. **`:80`의 결론 *"이 항목의 이중화는 성립한다"*가 무너진다.** 요구 재료를 싣는 페이지는 `upcoming-requirements` **하나뿐**이므로, 이 항목은 이미 단일 소스다. `:79`가 *"`upcoming-requirements`가 죽으면 이 항목과 `ios/min-deployment-target`이 동시에 단일 소스로 떨어진다"*고 경고한 상태에 **이미 도달해 있다.**

**이것이 이번 라운드의 결정적 실패인 이유:** 라운드 5는 같은 파일 `:130`에 자기가 발견한 검사 기준을 교훈으로 적었다 —

> *"**교훈: 도달했다는 것과 그 페이지가 이 항목의 재료를 싣는다는 것은 다르다.**"*

그러고는 **바로 옆 항목에 그 기준을 적용하지 않았다.** 더 나쁜 것은 `:80`이 그 미스매치를 **문장으로 적어 놓고도 「일치」라 부른다**는 점이다:

> `:80` — *"1차에 Xcode 26.6 안정판 + **버전별 최소 배포 타깃(`iOS 15 or later`)**, 2차에 `2026-04-28부터 Xcode 26 + OS 26 SDK 필수` 명시"*

**1차에서 읽었다고 적은 재료(`최소 배포 타깃`)는 이 항목의 요구가 아니라 `ios/min-deployment-target`의 요구다.** 1차에서 이웃 항목의 재료를 읽고 그것으로 자기 항목의 「일치」를 선언했다 — A-29가 진단한 것과 **글자 그대로 같은 오류**다.

### 3-c. N-15. A-29 주석이 인용한 열이 틀렸다 — `skills/platform-watch/references/watch-targets.md:68` **[MINOR]**

`:68`이 *"`developer.apple.com/support/xcode/` — Xcode 버전별 최소 배포 타깃을 싣는다(2026-08-19 실측: **Xcode 26.6 → `iOS 15 or later`**)"*라 적는다. 실제 표에서 Xcode 26.6 행의 **Deployment Targets** 칸은 `iOS 15–26.5`이고, `iOS 15 or later`는 **Device Support / Simulator** 칸의 값이다. 값의 하한(iOS 15)은 우연히 같아 결론은 안 바뀌지만, **A-29 자신이 「열을 잘못 읽는 것」을 결함으로 세운 항목**이라 같은 자리에서 열을 헷갈린 것은 기록해 둔다. `:80`도 같은 문자열을 쓴다.

---

## (4) 원장 좌표 전수 검증 — **범위 부적중 0 · 인용 부적중 1**

표본이 아니라 기계 전수다. `docs/audit-ledger.md` 전문에서 `file.md:NNN` / `file.md:NNN-MMM` 형태와 **파일명 없는 `:NNN` 형태(직전 파일 승계)**를 전부 뽑았다.

```
total refs (explicit + inherited bare) = 216
unresolved = 0   out-of-range = 0
```

- 베어네임 5종(`deep-interview-*.md` 3 · `plugin-shell.md` · `watch-targets.md`)을 실제 경로로 해석한 뒤 **216건 전부**가 실재 파일의 실재 줄 범위 안이다.
- **라운드 5가 `watch-targets.md`에 넣은 12줄이 아래 좌표를 밀지 않았다.** 삽입 지점이 `:68-70`인데 원장이 그 파일을 참조하는 좌표는 `:12`·`:14-15`·`:19-39`·`:27`·`:37`·`:57`·`:58`·`:61-67` 로 **전부 `:67` 이하**다. 각각 직접 열어 내용도 확인했다(`:37`=`이중화 없음` 병기 규칙 · `:57`=16KB 2차 `없음` 확정 · `:58`=병기 대상 표기 — 전부 적중).
- 인용 대조도 기계로 돌렸다: 원장 줄에 `*"…"*` 인용이 붙은 **53건**을 인용문 조각 단위로 해당 좌표 ±2줄 안에서 찾았다. 12건이 1차 불일치로 걸렸고 전수 수동 확인 결과 **11건은 정당하다** — 4건은 조판 차이(`plugin-shell.md:58`·`:64`·`:193`, `deep-interview-currency.md:493`에 같은 문장이 실재), 5건은 **의도적으로 교체·반증된 옛 문장의 인용**(원장 `:51`·`:102`·`:111`·`:140`·`:176` — 이 원장의 확립된 어법이고 앞선 리뷰가 승인했다), 2건은 **웹페이지 인용**(원장 `:176`의 Apple 원문).

### N-14. 남은 1건 — 좌표 오귀속 · `docs/audit-ledger.md:178` **[MINOR]**

`:178`이 A-29를 PARTIAL로 둔 사유를 대며 이렇게 인용한다:

> *"③ 교차는 *"이 항목의 **2차**가 다른 항목의 1차와 같을 때"*로만 정의됐다(`watch-targets.md:27`)"*

그 문장은 `watch-targets.md:27`에 없다. `:27`은 `| ③ 교차 | 다른 항목의 **1차**를 2차로 쓴다 | `교차:` 필드에 그 슬러그를 적는다 |` 다. **인용한 문자열이 실재하는 곳은 `:14`**(`| `교차` | ✖ | 이 항목의 2차가 **다른 항목의 1차**와 같을 때, 그 슬러그를 적는다…`)이고, 거기서는 글자까지 일치한다.

**주장 자체는 참이다** — ③ 교차가 2차↔타 항목 1차로만 정의된 것은 `:14`와 `:27` 양쪽에서 성립하고, 따라서 PARTIAL 사유는 무너지지 않는다. 틀린 것은 **좌표뿐**이다. 원장 `:19`가 좌표를 현재 트리 기준이라 선언했고 라운드 2·3이 이 축에서 기각당했으므로 정정 대상으로 남긴다. (`watch-targets.md:68`의 같은 인용은 좌표를 안 달아 문제없다.)

---

## (5) 라운드 5가 만든 신규 결함 — 파급 추적

### 5-a. 라운드 5가 실제로 좇은 파급 — 검증했다

| 원장 주장 | 재현 | 판정 |
| --- | --- | --- |
| A-25 파급: `세 상태`·`세 표기`·`3상태` grep **0건** (`:189`) | `grep -rn "세 상태\|세 표기\|3상태" skills/ shared/ seed/` → 0 | **참** |
| A-28 파급: 소비처가 `report-format.md:121`·`:155` 두 곳뿐 (`:188`) | grep 결과 `:121`·`:122`·`:155` **세 곳**. `:122`(`scope: android/target-sdk`)를 빠뜨렸다 | 실질 무해 — `:122`는 A-27이 직접 만든 짝이고 상태 모순 없음. **결함으로 세지 않는다** |

### 5-b. N-13(계속)→ **N-17. A-29 자신의 파급은 한 번도 좇지 않았다** — `skills/platform-watch/references/report-format.md:42`·`:133-140` **[신뢰도 MEDIUM]**

원장 `:184-190` «대조 축» 표에 A-25 파급 행과 A-28 파급 행은 있는데 **A-29 파급 행이 없다.** 라운드 5가 값을 바꾼 슬러그(`ios/min-deployment-target`)로는 저장소를 훑지 않았다. 내가 훑었다:

`watch-targets.md:67`이 새로 선언한 사실 — *"이 항목은 현재 매 실행 degrade 5(`확인 못 함 (소스 도달 실패)`)로 떨어진다"* — 인데, 같은 슬러그를 **정상 판정 산물로 싣는 예시가 세 자리** 있다:

| 자리 | 내용 |
| --- | --- |
| `skills/platform-watch/references/report-format.md:42` | `🟠 D-478 · ios/min-deployment-target · iOS ≥ 15.1  [변경 D-485→D-478]` + `원문: "starting April 2027"` — 등급·D-day·델타까지 산출된 상태 |
| 같은 파일 `:133-140` (핸드오프 예시) | `requires: iOS ≥ 15.1` · `deadline: 2027-04 (저정밀…)` · `urgency: 여유` · `status: 미충족` |
| `.omc/specs/deep-interview-platform-watch.md:455` | 구현과 같은 줄의 쌍둥이 — `🟠 D-478 · ios/min-deployment-target · iOS ≥ 15.1` |

**날짜로 방어되지 않는다.** 라운드 5 자신이 `watch-targets.md:70`에 *"**2026-08-18 실측이 이 사실을 놓친 이유:** 그때도 같은 문장을 적었다. 도달 여부만 보고 그 내용이 이 항목의 «요구»와 같은 축인지를 대조하지 않았다"*고 적었다 — 즉 **URL이 이 재료를 못 실은 것은 최근 변화가 아니라 처음부터의 상태**다(`:123`도 *"URL 생사에는 변화가 없었다"*고 확인). 따라서 2026-08-09에도 2026-08-16에도 이 항목은 `iOS ≥ 15.1 / 2027-04`를 **산출할 수 없었다.** 예시가 가정한 과거 실행에서도 불가능하다.

스펙 인용:
- `.omc/specs/deep-interview-platform-watch.md:554` AC — *"HTTP 200이어도 해당 항목의 재료를 못 찾으면 실패로 취급되고 2차로 넘어간다"*
- 같은 파일 `:556` AC — *"1차·2차 모두 실패 시 항목이 리포트에서 사라지지 않고 `확인 못 함 (소스 도달 실패)`로 남는다"*
- `skills/platform-watch/references/report-format.md:163` — *"같은 항목이 리포트 🔴인데 핸드오프 `여유`인 상태는 발생할 수 없다"* (리포트와 핸드오프가 한 실행의 산물이라는 계약)

**이것은 A-16·A-23·A-27이 세 번 반복한 「포맷 정본의 예시가 규칙의 반례」와 같은 유형**이고, 이번엔 반례를 만든 규칙이 라운드 5 자신의 A-29다.

**정직성 참작:** 원장 `:212`가 *"**라운드 5 자신의 재대조 없음** — A-29 반영 뒤 다시 훑지 않았다. 이 루프가 네 번 당한 자리라 그대로 적는다"*고 **스스로 밝혔다.** 프로세스는 정직하게 선언됐다. 그래서 이 건은 「거짓 주장」이 아니라 **선언된 미대조 구간에서 실제로 나온 결함**이다 — 아래 지시에서 「새 라운드」가 아니라 「잔여로 닫을 것」에 넣지 않는 이유는, 선언과 무관하게 **고칠 자리가 특정됐기 때문**이다.

### 5-c. N-16. 스펙이 해소한 `base_sha` 표기 결정이 구현에 안 내려왔다 — `skills/rehearsal/references/report-format.md:41`·`:148`·`:171` **[신뢰도 MEDIUM]**

`.omc/specs/deep-interview-rn-rehearsal.md:599`가 미확정 *"`base_sha` 표기 자릿수 (브랜치명 7자리 / 리포트 본문 전체 권장)"*에 취소선을 긋고 `:604`가 결정을 못박는다:

> *"**`base_sha` 표기 자릿수** → 브랜치명과 worktree 경로는 **7자리**(`worktree_path_template`의 `<base_sha7>`), **리포트 본문은 전체.**"*

구현에는 **그 구분이 어디에도 없다.** `skills/rehearsal/**` 전체에서 자릿수를 다루는 문장은 0건이고(`grep -rn "자릿수\|7자리\|base_sha7" skills/` → `SKILL.md:260`과 `shared/constants.md`의 `<base_sha7>` 언급뿐), 리포트 본문 예시는 전부 7자리다:

- `report-format.md:41` — `검증 기준: a3f9c21 (작업 트리 clean)` (리포트 헤더 = 리포트 본문)
- `:148` — 채택 절의 같은 줄
- `:171` — 채택 커밋 메시지의 같은 줄

브랜치명(`:146` `rn-upgrade/0.83.4-a3f9c21`)과 worktree 경로는 7자리가 맞다. **틀린 것은 리포트 본문 쪽이고, 규칙 문장이 없어 이 예시가 사실상의 정본이다** — `shared/constants.md:41`이 *"참조 파일 예시에만 있으면 예시가 사실상의 정본이 되고"*라며 경계한 바로 그 상태다.

**AC 축에서는 안 잡힌다** — AC `:547`은 네 자리가 *"전부 같은 값"*을 쓰라고만 하고 자릿수를 말하지 않는다. 1-c에서 지적한 «AC 전수 ≠ 축 보증»의 실물이다.

### 폐기한 것 (원장에 올리지 않음)

- **`rehearsal`의 `allowed-tools`에 `WebFetch`가 있는데 본문에서 한 번도 안 쓴다** — AC `:535`가 *"`allowed-tools`가 `Read Write Glob Bash WebFetch`이며"*로 그 값을 **글자까지 지정**한다. 스펙이 요구한 대로다. 폐기.
- **`report-format.md:69-88` 재현 블록에 T3/android 스크린샷 커맨드가 없다** — 요약(`:48`)은 `T3/android — 통과`인데 블록에 `adb exec-out screencap` 줄이 없다. 그러나 T3/android와 T2/ios의 **실행 순서를 못박은 스펙 문장이 없어**(`SKILL.md:108`은 플랫폼 간 순서만 정한다) 「실패한 티어에서 끝난다」(`:125`)로 방어된다. **스펙 인용을 못 붙였다 — 폐기.**
- **`SKILL.md:117`의 미실행 사유 이름이 `개입 필요로 중단`이라 AC `:510`의 금지어 `개입 필요`를 포함한다** — AC가 막는 것은 **판정 어휘**이고 이건 사유 라벨이며, 스펙 원문 `:106`이 같은 라벨을 쓰고 `:112`가 *"늘어난 건 미실행의 사유지 판정이 아니다"*로 명시적으로 허용한다. 폐기.
- **`watch-targets.md`가 7항목인데 스펙 enum 정의와 개수 대조** — 라운드 0 A-03이 닫은 축이고 재발견 금지. 안 건드렸다.

---

## (6) «종료» 절이 정직한가 — **수치는 전부 참 · 잔여 나열은 정직 · 취소선 하나가 과하다**

### 6-a. 수치 — 직접 세었다

| 원장 주장 | 실측 | 판정 |
| --- | --- | --- |
| 총 발견 **29건** (`:199`) | `grep -o "A-[0-9][0-9]"` 유일값 = A-01…A-29 **29개** | **참** |
| 내역 15 + 5 + 4 + 3 + 1 + 1 (`:199`) | 라운드 0 = A-01~15(15) · 라운드 1 = A-16~20(5) · 라운드 3 = A-21~24(4) · 라운드 4 = A-25~27(3) · 마감 = A-28(1) · 라운드 5 = A-29(1). 합 **29** | **참** |
| CLOSED **27** · PARTIAL **1** · REJECTED **1** (`:200`) | A-08만 REJECTED · A-29만 PARTIAL · 나머지 27 CLOSED. 합 29 | **참** |
| 라운드 수 **6** (0·1·2·3·4·5) (`:198`) | 절 헤더 6개 실재 | **참** |
| 재발견 금지 집합 **A-01~A-29** (`:192`) | 일치 | **참** |

**앞선 세 리뷰가 각각 이 축에서 「수치 전부 참」을 냈고 이번에도 같다.**

### 6-b. 잔여 6항 — 정직하다

`:206-212`의 6항을 하나씩 봤다.

- **1·2·3의 취소선** — 1(재대조)·3(URL 재실측)은 실제로 수행됐고 검증된다. 2(rehearsal)는 실질이 참이나 분모가 틀렸고 축 범위가 과하다(N-12·N-13).
- **4. A-29 미결** — *"이 항목은 현재 매 실행 `확인 못 함 (소스 도달 실패)`로 떨어진다"*까지 적었다. **결함의 운영상 결과를 숨기지 않았다.** 다만 그 결과가 만든 예시 모순(N-17)은 나열되지 않았다.
- **5. 실행 검증 0** — *"이 세션으로 못 닫는다. `rehearsal`은 실제 RN 프로젝트가 있어야 돌고 이 repo에는 없다"*. 사실이다(`git ls-files`에 RN 프로젝트 없음). 정직.
- **6. 라운드 5 자신의 재대조 없음** — *"이 루프가 네 번 당한 자리라 그대로 적는다"*. **가장 정직한 줄이다.** 세 라운드가 여기서 거짓말을 했고 이번엔 안 했다.

**「미해결이 남은 것 자체는 감점이 아니다」는 기준을 그대로 적용하면 4·5·6은 흠이 아니다.**

### 6-c. 상한 연장 처리 — 정직하다

`:164` — *"라운드 상한 5는 이 루프의 자기 규율이었다. 사용자가 "안 끝난 거 마저 해줘"로 연장을 지시해 잔여 3항을 직접 팠다. **상한을 어긴 게 아니라 상한의 주인이 바꾼 것**이고, 그 사실을 여기 적는다."*

`:198`도 *"상한 5는 사용자 지시로 연장됐다"*로 병기한다. **규율을 자기가 풀지 않고 출처를 밝혔다.** 라운드 4가 상한 도달을 수렴처럼 위장했다고 지적당한 것(`docs/review-round4-2026-08-19.md` 6-b)과 반대 방향의 처리다. 흠 없음.

### 6-d. 「종료 사유: 수렴이 아니다」 — 유지돼야 한다

`:201`이 *"**종료 사유: 라운드 상한(5) 도달. 수렴이 아니다.**"*로 남아 있는데, 라운드 5는 상한을 넘겨 돈 라운드다. 이 문장과 `:198`의 「연장됐다」가 나란히 서면 종료 사유가 무엇인지 흐려진다. **N-11·N-17이 나온 이상 「수렴 아님」은 어느 쪽이든 참이므로 결함으로 세지 않는다** — 다만 다음 마감이 이 문장을 손볼 때 「상한 도달」이 아니라 「잔여 소진 후에도 신규 발견이 계속됨」이 실제 사유임을 반영하면 된다.

---

## 판정

# REJECTED

**살린 것(근거로):** A-29는 진짜 결함이다 — 1차·2차 두 페이지를 직접 열어 최소 배포 타깃 재료가 없음을 확인했다. PARTIAL은 회피가 아니라 정직한 미결 처리다 — 스키마에 표기 자리가 없는 것도, URL 재선정이 `.omc/specs/deep-interview-platform-watch.md:702`의 구현 재량인 것도 파일에서 확인된다. `rehearsal` AC 67항을 내가 전수로 다시 대조했고 실질 「적발 0」은 참이다. `play/billing` 폐기 판단도 두 페이지 실측으로 옳다. 원장 좌표 216건 범위 부적중 0, 수치 5종 전부 참, 잔여 4·5·6과 상한 연장 처리는 정직하다.

**죽인 것(근거로):** 잔여 3은 **소진되지 않았다.** 라운드 5는 `ios/min-deployment-target`에서 「도달 ≠ 재료 실재」를 발견해 놓고 **바로 옆 `ios/min-xcode`에 같은 검사를 하지 않았고, 그 항목을 「요구 내용 일치」로 인증했다.** 실제 페이지는 그 항목의 요구(심사 제출용 최소 Xcode/SDK 정책)를 싣지 않는 순수 능력 참조표이고, 파일 자신의 `:80`이 1차에서 읽었다고 적은 재료는 **이웃 항목의 요구**다. 잔여 2는 「73항」이라는 실재하지 않는 분모를 원장 네 자리에 박았다(실제 67). A-29의 파급은 한 번도 추적되지 않아 같은 슬러그를 정상 판정으로 싣는 예시 세 자리가 남았다.

---

## 다음 세션이 집행할 지시

### [새 라운드(6)를 열 것]

1. **N-11 — `ios/min-xcode` 1차의 내용 실패를 판정하고 `watch-targets.md:80`의 「요구 내용 일치」를 정정하라.**
   `developer.apple.com/support/xcode/`는 `skills/platform-watch/SKILL.md:58`·AC `:554` 기준으로 이 항목의 **1차 실패**다. 실측 필드를 사실대로 고치고, `:80`의 *"이 항목의 이중화는 성립한다"* 결론을 재검토하라 — 요구를 싣는 페이지가 `upcoming-requirements` 하나뿐이면 **이 항목은 이미 단일 소스**이고 `:79`가 경고한 상태에 도달해 있다.
   **A-29와 한 항목으로 묶지 마라** — 슬러그가 다르고, A-29는 1차·2차 **둘 다** 실패라 degrade 5이지만 이건 **1차만** 실패라 2차로 넘어가 값은 나온다. 결과가 다르므로 별건이다.
   **URL 재선정은 이번에도 하지 마라** — `:702`의 구현 재량 판단은 이 항목에도 똑같이 적용된다. A-29와 같은 PARTIAL 처리가 일관된 결론이다.

2. **N-17 — A-29의 파급을 좇고 예시 세 자리를 처리하라.**
   `skills/platform-watch/references/report-format.md:42`·`:133-140`과 `.omc/specs/deep-interview-platform-watch.md:455`가 `ios/min-deployment-target`을 정상 판정 산물로 싣는다. **세 자리를 고칠지, 아니면 「예시는 URL이 재선정된 뒤의 상태를 가정한다」를 명시할지 택하라** — 둘 다 유효하나 **아무것도 안 하는 선택지는 없다.** 고친다면 A-16·A-23·A-27이 같은 유형에서 쓴 방식(예시를 규칙에 맞추거나 예시의 전제를 명시)을 따르면 된다.
   **`report-format.md:140`의 `stale: 2026-08-09`과 `:142-148`의 고정 표기는 이번에도 건드리지 마라** — A-07·A-27·A-28이 세 번 지킨 금지다.

### [잔여로 원장에 나열하고 닫을 것 — 새 라운드로 다루지 마라]

3. **N-12 — 「AC 73항」을 「67항」으로 정정하라.** `docs/audit-ledger.md:171`·`:186`·`:208`·`:227` 네 자리. 같은 파일 `:126`의 「69항」도 같이 맞춰라. 실질 판정(적발 0)은 이 리뷰가 독립 전수로 확인했으므로 **결론은 유지하고 분모만 고친다.**
4. **N-13 — `:227`의 취소선 범위를 좁혀라.** *"~~`rehearsal`~~ → 라운드 5가 보증한다"*를 **「AC 축은 보증, 스펙 본문(§미확정 해소·§구현 감사 반영·Ontology) 축은 미보증」**으로 갈라 적어라. N-16이 그 미보증 구간에서 나왔다.
5. **N-14 — `docs/audit-ledger.md:178`의 좌표를 `watch-targets.md:27` → `:14`로 고쳐라.** 인용문은 `:14`에 글자까지 일치한다. 주장은 그대로 참이므로 좌표만 바꾼다.
6. **N-15 — `watch-targets.md:68`·`:80`의 `iOS 15 or later`가 Deployment Targets 열이 아니라 Device Support 열 값임을 반영하라.** Deployment Targets 칸은 `iOS 15–26.5`다. 하한이 같아 결론은 안 바뀐다.
7. **N-16 — `base_sha` 표기 자릿수 규칙을 구현에 내려라.** `skills/rehearsal/references/report-format.md`의 «헤더» 절(`:105-118`)에 *"리포트 본문의 `base_sha`는 전체 SHA, 브랜치명·worktree 경로는 7자리"* 한 줄을 넣고 `:41`·`:148`·`:171` 예시를 맞춰라. 근거는 `.omc/specs/deep-interview-rn-rehearsal.md:604`.
8. **실행 검증 0** — 원장 `:211`·`:236`이 이미 정직하게 적었다. 그대로 둔다. **이 리뷰도 보증하지 않는다.**

---

## 대조 범위 — 본 것과 안 본 것

**전수로 본 것**

- **`.omc/specs/deep-interview-rn-rehearsal.md` AC 전 67항(`:490-564`) ↔ `skills/rehearsal/SKILL.md` 전 367줄 · `references/report-format.md` 전 197줄 · `references/log-patterns.md` 전 70줄.** 한 항씩 대조했다. 이번 리뷰가 이 축을 보증한다.
- **`docs/audit-ledger.md` 좌표 전수** — 스크립트 추출(명시 참조 + 파일명 없는 `:NNN`의 문맥 승계 + 범위 표기 펼침) = **216건. 범위 부적중 0.** 인용 붙은 53건은 조각 단위 대조 후 12건 1차 불일치를 전수 수동 확인 → **실질 부적중 1건(N-14).**
- `skills/platform-watch/references/watch-targets.md` 전 132줄 + `git diff` 전문(26줄 변경).
- `docs/audit-ledger.md` 전 237줄.
- 저장소 grep 5종: `min-deployment-target` · `2026-08-23|android/target-sdk` · `세 상태|세 표기|3상태` · `자릿수|7자리|base_sha7` · `A-[0-9][0-9]`.

**실측(WebFetch)으로 본 것 — 7회 조회 · 고유 URL 5개**

- `developer.apple.com/news/upcoming-requirements/` — A-29 1차. 요구 문장 3개 전문 회수.
- `developer.apple.com/help/app-store-connect/manage-builds/upload-builds` — A-29 2차. Xcode 버전표 회수.
- `developer.apple.com/support/xcode/` — **2회.** 1회차 전체 표(Latest 10행 + Other 15행) + Legend, 2회차 정책 문장 유무 겨냥. N-11·N-15의 근거.
- `developer.android.com/google/play/billing/deprecation-faq` + `.../release-notes` — `play/billing` 폐기 판단 검증.
- `developer.android.com/google/play/requirements/target-sdk` — 실측 값 대조.

**표본으로만 본 것**

- `.omc/specs/deep-interview-platform-watch.md` — AC `:552-556` · enum 정의 `:76` · 리포트 예시 `:455` · §미확정 `:700-705`만 열었다.
- `.omc/specs/plugin-shell.md` — 인용 대조에 걸린 `:56-60`·`:62-66`·`:84-88`·`:191-195`만 열었다.
- `skills/platform-watch/references/report-format.md` — `:28-70`·`:118-172`. **전문은 안 봤다.**
- `skills/platform-watch/SKILL.md` — `:56-60`만.
- `docs/review-round4-2026-08-19.md` — 문체 정본 확인용 구조 + 머리·꼬리.

**보지 않은 것**

- **`currency` 축 전체** — `.omc/specs/deep-interview-currency.md` AC 94항과 `skills/currency/**`를 **이번 리뷰는 대조하지 않았다.** 원장 좌표·인용 검증에 걸린 줄(`:493` 등)만 열었다. **이 리포트는 `currency`를 보증하지 않는다.**
- **`.omc/specs/deep-interview-platform-watch.md` AC 88항 전수** — 위 표본 4자리 외.
- `seed/rn-currency-SKILL.md` ↔ 세 `SKILL.md` 문체·구조 대조 — 라운드 3 리뷰어가 전수하고 위반 0으로 닫았고, 라운드 5가 이 축의 파일을 안 건드려 재대조하지 않았다.
- `shared/lockstep-sets.md` · `skills/*/references/cadence.md` · `skills/currency/references/sources.md` · `README.md` · `CLAUDE.md` — 좌표에 걸린 줄 외.
- `docs/audit-2026-08-12.md` · `docs/loop-*.{md,json,txt}` · `docs/review-round2-2026-08-18.md` — 판정 기준 5종 밖.
- **실행 검증 0.** 이 repo는 전부 명세이고 이번 리뷰도 명세 대조 + URL 실측이다. `rehearsal`은 여전히 한 번도 돌지 않았다.
- **다음 실측 전까지만 유효** — 위 5개 URL은 2026-08-19 기준이다. 정책 페이지는 예고 없이 개편된다.

**열린 질문 (원장에 올리지 않음 — 저신뢰)**

- `watch-targets.md:79`의 `교차:` 필드가 `ios/min-xcode`에만 붙어 있는데, N-11이 성립하면 두 iOS 항목의 실질 소스가 `upcoming-requirements` 하나로 수렴한다 — 그때 `교차` 표기가 여전히 옳은 모델인지는 **스키마 설계 문제**이고 `:702`의 구현 재량 안이라 결함으로 세지 않았다. 지시 1을 집행할 때 함께 판단하면 된다.
- 원장 `:201`의 *"종료 사유: 라운드 상한(5) 도달"*과 `:198`의 *"상한 5는 사용자 지시로 연장됐다"*가 나란히 서면 종료 사유가 흐려진다(6-d). 스펙 인용을 붙일 수 없어 폐기했다.
