# OPS v2 Project - 필수 규칙

> **Source of Truth**: `/home/ilim/ops/OPS_REMAKE_PLAN.md`
> **도메인별 규칙**: 각 디렉토리의 `CLAUDE.md` 참조

---

## 프로젝트 구조

| 저장소 | 기술 | 포트 | 규칙 |
|--------|------|------|------|
| ops-api | NestJS + Prisma + PostgreSQL | 3000 | `ops-api/CLAUDE.md` |
| ops-web | Next.js 16 (App Router) | 3001 | `ops-web/CLAUDE.md` |
| ops-agent | Python + LiveKit Agents | - | `ops-agent/CLAUDE.md` |

---

## 핵심 원칙

### 필수 사항
- PR base는 `dev` 브랜치 사용
- Logger 사용 (NestJS Logger, Python logging)
- 구체적 타입 명시
- Entity → DTO 변환하여 반환
- Service 레이어 TDD 적용
- 커버리지 80% 이상 유지

### 워크플로우
```
/full-cycle #이슈번호
    ↓
1. /start-work (브랜치 생성)
    ↓
2. T-shirt Sizing → S: 직접 TDD / M,L: /supervisor
    ↓
3. /quality-gate (품질 체크)
    ↓
4. /smart-commit --review (PR 생성)
```

### T-shirt Sizing

| 규모 | 정의 | 프로세스 |
|------|------|----------|
| **S** | 1-2 파일 | 직접 TDD |
| **M** | 3-5 파일 | /supervisor → 1-2 subagent |
| **L** | 5+ 파일 | /supervisor → 2-4+ subagent |

---

## 컨텍스트 관리

### Compact 권장 시점
- `/supervisor` 실행 전: 깨끗한 상태로 Plan 작성
- 긴 에러 로그 출력 후: 불필요한 스택트레이스 제거
- subagent 3개 이상 완료 후: 누적 출력 정리
- 세션 30분 이상 경과 시

### 2-Layer 작업 관리

| 레이어 | 도구 | 용도 |
|--------|------|------|
| 외부 | GitHub Issues | Epic/Feature 기록, PR 연결 |
| 내부 | Claude Tasks | subagent 의존성, 세션 연속성 |

---

## Git 규칙

- 브랜치: `feature/<이슈번호>-<설명>`, `fix/<이슈번호>-<설명>`
- 커밋: `feat(scope): 설명`, `fix(scope): 설명`
- push 전 rebase: `git rebase origin/dev`

### 저장소 루트 주의
```
/home/ilim/ops-v2/    ← .git 위치
├── ops-api/
├── ops-web/
└── ops-agent/
```

---

## 필수 명령어

| 작업 | 명령어 |
|------|--------|
| API 빌드 | `cd /home/ilim/ops-v2/ops-api && npm run build` |
| Web 빌드 | `cd /home/ilim/ops-v2/ops-web && npm run build` |
| API 테스트 | `cd /home/ilim/ops-v2/ops-api && npm test` |
| Web 테스트 | `cd /home/ilim/ops-v2/ops-web && npm test` |

---

## Skills

### 워크플로우
| Skill | 용도 |
|-------|------|
| `/full-cycle` | Issue → PR 전체 자동화 |
| `/supervisor` | 규모 판단 + Tasks + subagents |
| `/start-work` | 브랜치 생성 |
| `/smart-commit` | 커밋 + PR |

### 품질
| Skill | 용도 |
|-------|------|
| `/tdd` | TDD 사이클 |
| `/quality-gate` | PR 전 품질 체크 |
| `/pattern-check` | 패턴 준수 검사 |
| `/bug-hunter` | 버그 패턴 탐지 |

### Subagent
| Agent | 역할 |
|-------|------|
| Architect | 백엔드 (TDD 필수) |
| Stylist | 프론트엔드 |
| Auditor | 검증 |
| Refiner | 수정/최적화 |

---

## 참조 문서

- **Remake 계획**: `/home/ilim/ops/OPS_REMAKE_PLAN.md`
- **도메인별 규칙**: `ops-api/CLAUDE.md`, `ops-web/CLAUDE.md`, `ops-agent/CLAUDE.md`
- **워크플로우 상세**: `.claude/docs/workflow-improvement-proposal.md`
