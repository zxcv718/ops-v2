---
name: pick-issue
description: 열린 이슈 목록에서 선택하여 full-cycle 실행. "이슈 선택", "작업할 이슈", "뭐 할까" 등의 요청에 사용
allowed-tools: Bash(gh:*), AskUserQuestion, Skill
---

# Pick Issue - 이슈 선택 후 Full Cycle 실행

> **목적**: 열린 이슈 목록을 보여주고, 선택한 이슈로 /full-cycle 실행
> **언어**: 모든 결과는 **한글**로 보고

---

## Step 1: 열린 이슈 목록 조회

```bash
gh issue list --state open --json number,title,labels --jq '.[] | "#\(.number) \(.title)"'
```

## Step 2: 사용자에게 선택지 제공

조회된 이슈들을 `AskUserQuestion` 도구로 제공:

- **header**: "이슈 선택"
- **question**: "어떤 이슈를 작업할까요?"
- **multiSelect**: false
- **options**: 조회된 이슈들 (최대 4개, 나머지는 "Other"로 직접 입력)

### 옵션 형식

```
label: "#7 ops-api 인증 모듈 구현"
description: "JWT + 세션 기반 인증"
```

> **참고**: 이슈가 5개 이상이면 최근 4개만 표시하고, 나머지는 "Other"에서 번호 입력

## Step 3: 선택된 이슈로 /full-cycle 실행

사용자가 선택하면:

```
Skill 도구 호출:
  skill: "full-cycle"
  args: "#<선택된 이슈 번호>"
```

---

## 사용법

```
/pick-issue          # 이슈 선택 UI 표시
```

---

## 예시 흐름

```
1. /pick-issue 호출
       ↓
2. 열린 이슈 조회 (gh issue list)
       ↓
3. AskUserQuestion으로 선택지 표시:
   ┌─────────────────────────────────────┐
   │ 어떤 이슈를 작업할까요?              │
   │                                     │
   │ ○ #7 ops-api 인증 모듈 구현         │
   │ ○ #8 ops-api 핵심 도메인 Entity     │
   │ ○ #9 ops-api 보안 강화              │
   │ ○ Other (직접 입력)                 │
   └─────────────────────────────────────┘
       ↓
4. 선택 시 /full-cycle #7 자동 실행
```
