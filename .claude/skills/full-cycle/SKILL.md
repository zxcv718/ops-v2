---
name: full-cycle
description: 전체 개발 사이클 자동화 (Issue → PR). "전체 사이클", "이슈부터 PR까지", "풀사이클", "#12 구현해줘" 등의 요청에 사용
allowed-tools: Read, Write, Edit, Bash(git:*), Bash(gh:*), Bash(npm:*), Glob, Grep, Task, TaskCreate, TaskUpdate, TaskList, AskUserQuestion
---

# Full Cycle - 전체 개발 사이클 자동화

> **목적**: GitHub Issue 선택 → 구현 → PR 생성까지 자동화
> **언어**: 모든 결과는 **한글**로 보고

---

## 전체 워크플로우

```
┌─────────────────────────────────────────────────────────────────────┐
│                        /full-cycle #이슈번호                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Phase 1: /start-work                                               │
│  └── GitHub Issue 확인 → dev에서 브랜치 생성                         │
│                                                                     │
│  Phase 2: T-shirt Sizing                                            │
│  ├── S: 직접 TDD 구현                                               │
│  └── M/L: /supervisor 호출 (Tasks + subagents)                      │
│                                                                     │
│  Phase 3: /quality-gate                                             │
│  └── 빌드, 테스트, 커버리지, lint 체크                               │
│                                                                     │
│  Phase 4: /smart-commit --review                                    │
│  └── /code-review 호출 → 커밋 → rebase → push → PR 생성             │
│      (치명적 이슈 시 중단)                                           │
│                                                                     │
│  Phase 5: 완료 보고                                                  │
│  └── PR URL, 변경 파일 목록, 코드 리뷰 결과                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: 이슈 선택 & 브랜치 생성

### 1.1 이슈 확인

이슈 번호가 없으면 열린 이슈 목록 표시:

```bash
gh issue list --state open --json number,title,labels --limit 20
```

이슈 번호가 있으면 상세 조회:

```bash
gh issue view $ISSUE_NUM --json number,title,body,labels
```

### 1.2 브랜치 생성

```bash
git checkout dev
git pull origin dev
git checkout -b feature/${ISSUE_NUM}-<short-description>
```

### 1.3 보고

```
## Phase 1: 브랜치 생성 완료

| 항목 | 값 |
|------|-----|
| 이슈 | #${ISSUE_NUM} - ${TITLE} |
| 브랜치 | feature/${ISSUE_NUM}-<desc> |
| Base | dev |
```

---

## Phase 2: 구현

### 2.1 T-shirt Sizing

이슈 내용 분석하여 규모 판단:

| 규모 | 정의 | 처리 방식 |
|------|------|----------|
| **S** | 단순 수정 (1-2 파일) | 직접 TDD 구현 |
| **M** | 신규 컴포넌트 (3-5 파일) | `/supervisor` 호출 |
| **L** | 아키텍처 변경 (5+ 파일) | `/supervisor` 호출 |

### 2.2 S 규모: 직접 TDD 구현

```
TDD Cycle:
1. RED: 테스트 작성 → 실패 확인
2. GREEN: 최소 코드로 통과
3. REFACTOR: 코드 개선

반복...
```

### 2.3 M/L 규모: /supervisor 호출

```
/supervisor 자동 호출:
1. Plan 작성
2. Claude Tasks 생성 (의존성 포함)
3. 사용자 승인
4. subagents 병렬 실행
5. 결과 통합
```

---

## Phase 3: 품질 검증

### 3.1 /quality-gate 실행

```
/quality-gate 체크 항목:
✅ 빌드 성공
✅ 테스트 통과
✅ 커버리지 80%+
✅ ESLint 0 warning
✅ any 타입 없음
✅ console.log 없음
```

### 3.2 실패 시

품질 게이트 실패하면 **Phase 2로 돌아가서 수정**

```
Quality Gate 실패 항목:
- ESLint: 3건 (수정 필요)
- console.log: 1건 발견

→ 수정 후 다시 /quality-gate 실행
```

---

## Phase 4: 커밋 & PR

### 4.1 /smart-commit --review 실행

```
/smart-commit --review 흐름:

1. /code-review 스킬 호출 (시니어 개발자 관점 리뷰)
   ├── 치명적 이슈 → 커밋 중단, Phase 2로 돌아가 수정
   └── 치명적 이슈 없음 → 계속 진행
         ↓
2. git add + commit
         ↓
3. git fetch origin dev && git rebase origin/dev
         ↓
4. git push
         ↓
5. gh pr create --base dev
```

> **중요**: `--review` 플래그는 `/code-review` 스킬을 내부적으로 호출합니다.
> 치명적 이슈 발견 시 커밋이 중단되며, 수정 후 다시 시도해야 합니다.

### 4.2 PR 생성

```bash
gh pr create --base dev --title "feat(notification): 알림 기능 추가" --body "$(cat <<'EOF'
## Summary
- 알림 Entity 및 API 구현
- 알림 UI 컴포넌트 추가

## Related Issue
Closes #${ISSUE_NUM}

## Test Plan
- [ ] 알림 생성 테스트
- [ ] 알림 목록 조회 테스트
- [ ] UI 렌더링 확인
EOF
)"
```

---

## Phase 5: 완료 보고

```
## Full Cycle 완료

### GitHub
| 항목 | 값 |
|------|-----|
| Issue | #${ISSUE_NUM} - ${TITLE} |
| Branch | feature/${ISSUE_NUM}-<desc> |
| PR | #${PR_NUM} - ${PR_URL} |

### 변경 파일
- ops-api/src/notification/notification.entity.ts
- ops-api/src/notification/notification.service.ts
- ops-api/src/notification/notification.controller.ts
- ops-web/src/components/notification/NotificationList.tsx

### 검증 결과
| 항목 | 상태 |
|------|------|
| 빌드 | ✅ |
| 테스트 | ✅ (15 passed) |
| 커버리지 | ✅ (85%) |
| Quality Gate | ✅ PASS |
| Code Review | ✅ 치명적 0건, 경고 N건 |

### Tasks
4/4 완료
✓ #1 Entity 정의
✓ #2 Service 구현
✓ #3 Controller 구현
✓ #4 UI 컴포넌트

---
PR 리뷰 후 머지하세요: ${PR_URL}
```

---

## 사용법

```bash
# 특정 이슈로 시작
/full-cycle #12

# 이슈 목록에서 선택
/full-cycle

# 자동으로 가장 낮은 번호 이슈 선택
/full-cycle --auto
```

---

## 주의사항

1. **한 번에 하나의 이슈만** - 완료 후 다음 이슈
2. **TDD 필수** (API) - 테스트 없으면 진행 불가
3. **Quality Gate 통과 필수** - 실패 시 PR 생성 안 함
4. **PR base는 dev** - main 직접 PR 금지
5. **rebase 필수** - push 전 origin/dev와 동기화
