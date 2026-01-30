# OPS v2 Project - 필수 규칙

> 상세 문서: `@.claude/docs/` 참조
> 기존 코드 참조: `/home/ilim/ops/` (ops-api, ops-web, ops-agent)

## 프로젝트 구조

| 저장소 | 기술 | 포트 |
|--------|------|------|
| ops-api | NestJS + Prisma + PostgreSQL | 3000 |
| ops-web | Next.js 16 (App Router) | 3001 |
| ops-agent | Python + LiveKit Agents | - |

## 절대 금지

- `main`/`dev` 직접 push 금지
- `console.log` 금지 → `Logger` 사용
- 커밋 메시지에 AI 표시 금지 (`Co-Authored-By: Claude` 등)
- `any` 타입 금지
- Entity 직접 반환 금지 → DTO 변환
- Controller에서 비즈니스 로직 금지
- **테스트 없이 API 코드 작성 금지 (TDD 필수)**

---

## 통합 워크플로우

### 기능 구현 흐름

```
/full-cycle #이슈번호
    ↓
1. /start-work (브랜치 생성)
    ↓
2. T-shirt Sizing
   ├── S: 직접 TDD 구현
   └── M/L: /supervisor 호출
           └── Claude Tasks 생성 (의존성)
           └── subagents 병렬 실행
    ↓
3. /quality-gate (품질 체크)
    ↓
4. /smart-commit --review (PR 생성)
    ↓
5. 완료 (GitHub Issue 자동 닫힘)
```

### 2-Layer 관리

| 레이어 | 도구 | 용도 |
|--------|------|------|
| 외부 | GitHub Issues + Projects | Epic/Feature 기록, PR 연결 |
| 내부 | Claude Tasks | subagent 의존성, 세션 연속성 |

---

## 개발 방법론

### TDD (API 필수)

```
/tdd "기능명"

1. RED: 실패하는 테스트 먼저
2. GREEN: 최소 코드로 통과
3. REFACTOR: 코드 개선
```

### 품질 체크 (PR 전 필수)

```
/quality-gate

체크 항목:
- 빌드 성공
- 테스트 통과
- 커버리지 80%+
- any 타입 없음
- console.log 없음
```

### 버그 탐지

```
/bug-hunter ops-api
```

### 레거시 리팩토링

```
/characterization-test "대상 코드"
```

---

## T-shirt Sizing

| 규모 | 정의 | 프로세스 |
|------|------|----------|
| **S** | 단순 수정 (1-2 파일) | 직접 TDD → 빌드 확인 |
| **M** | 신규 컴포넌트 (3-5 파일) | /supervisor → 1-2 subagent |
| **L** | 아키텍처 변경 (5+ 파일) | /supervisor → 2-4+ subagent |

---

## 필수 명령어

| 작업 | 명령어 |
|------|--------|
| API 빌드 | `cd /home/ilim/ops-v2/ops-api && npm run build` |
| Web 빌드 | `cd /home/ilim/ops-v2/ops-web && npm run build` |
| API 테스트 | `cd /home/ilim/ops-v2/ops-api && npm test` |
| Web 테스트 | `cd /home/ilim/ops-v2/ops-web && npm test` |

---

## Git 규칙

- PR base는 항상 `dev` (main 금지)
- 브랜치: `feature/<이슈번호>-<설명>`, `fix/<이슈번호>-<설명>`
- 커밋: `feat(scope): 설명`, `fix(scope): 설명`
- rebase 필수: push 전 `git rebase origin/dev`

### ⚠️ Git 저장소 루트 주의

```
/home/ilim/ops-v2/    ← .git 위치 (저장소 루트)
├── ops-api/
├── ops-web/
└── ops-agent/
```

**git 명령 실행 시 반드시 저장소 루트 기준 경로 사용**:
- ❌ `ops-api/` 에서 `git add ops-api/file.ts` → 경로 오류
- ✅ `ops-api/` 에서 `git add file.ts` (상대 경로)
- ✅ 루트에서 `git add ops-api/file.ts` (절대 경로)

---

## Skills 목록

### 워크플로우 (메인)

| Skill | 용도 | 언제 사용 |
|-------|------|----------|
| `/full-cycle` | Issue → PR 전체 자동화 | 기능 구현 시작 |
| `/supervisor` | 규모 판단 + Tasks + subagents | M/L 규모 구현 |
| `/start-work` | 이슈 선택 + 브랜치 생성 | 작업 시작 |
| `/smart-commit` | 커밋 + PR 생성 | 구현 완료 후 |

### 품질 관리

| Skill | 용도 | 언제 사용 |
|-------|------|----------|
| `/tdd` | TDD 사이클 강제 | API 구현 시 (필수) |
| `/quality-gate` | PR 전 품질 체크 | PR 생성 전 (필수) |
| `/bug-hunter` | 버그 패턴 탐지 | 코드 리뷰 시 |
| `/characterization-test` | 레거시 동작 캡처 | 리팩토링 전 |
| `/code-review` | 코드 리뷰 | PR 리뷰 시 |

### Subagent 역할

| Agent | 역할 | 참조 문서 |
|-------|------|----------|
| Architect | 백엔드 구현 (TDD 필수) | `@.agent/workflows/architect.md` |
| Stylist | 프론트엔드 구현 | `@.agent/workflows/stylist.md` |
| Auditor | 빌드/테스트 검증 | `@.agent/workflows/auditor.md` |
| Refiner | 버그 수정, 최적화 | `@.agent/workflows/refiner.md` |

---

## Claude Tasks 활용

### 세션 간 공유

```bash
# 같은 Task List로 여러 세션 실행
CLAUDE_CODE_TASK_LIST_ID=ops-feature-12 claude
```

### Tasks 예시

```
Tasks (2 done, 2 open)
✓ #1 Entity 정의
✓ #2 Service 구현
□ #3 Controller 구현 > blocked by #2
□ #4 UI 컴포넌트 > blocked by #3
```

---

## 참조 문서

- 기술 스택: `@.agent/workflows/tech-stack.md`
- 도메인 용어: `@.agent/workflows/domain-glossary.md`
- Remake 계획: `/home/ilim/ops/OPS_REMAKE_PLAN.md`
