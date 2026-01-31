# Claude Code 워크플로우 개선 제안서

> **작성일**: 2025-01-31
> **참조 문서**: [Kurly Tech Blog - Claude Code를 활용한 예측 가능한 바이브 코딩 전략](https://helloworld.kurly.com/blog/vibe-coding-with-claude-code/)
> **현재 버전**: Claude Code (Opus 4.5)

---

## 1. 현황 분석

### 1.1 현재 워크플로우의 강점

| 강점 | 설명 |
|------|------|
| **자동화 수준** | `/full-cycle`로 Issue → PR까지 원스톱 처리 |
| **품질 게이트** | 10가지 체크 항목으로 품질 보장 |
| **TDD 강제** | Service 레이어 TDD 필수화 |
| **역할 분리** | Architect/Stylist/Auditor/Refiner 명확한 분업 |
| **Tasks 활용** | 의존성 기반 작업 관리 |

### 1.2 식별된 문제점

```
┌─────────────────────────────────────────────────────────────┐
│                    현재 워크플로우 문제                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [자동화 효율] ◄──────────────► [예측 가능성/제어권]        │
│       ▲                                                     │
│       │ 현재 위치                                           │
│       │                                                     │
│  문제:                                                      │
│  • 중간 검증 포인트 부족 → 오류 중첩                        │
│  • Plan 승인이 형식적 → 방향 수정 기회 상실                 │
│  • 컨텍스트 분리 부족 → Lost in the Middle                  │
│  • 패턴 검사 부재 → 구버전 방식 회귀                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 개선 원칙

블로그 문서의 핵심 철학을 수용합니다:

> **"LLM의 한계를 근본적으로 해결하려 하지 말고, 외부 시스템으로 보완하라"**

### 적용 원칙

| 원칙 | 적용 방안 |
|------|----------|
| **점진성** | 한 번에 전체 실행 → 체크포인트 기반 단계 실행 |
| **명확성** | 암묵적 규칙 → 계층적 CLAUDE.md로 명시 |
| **경계 정의** | "금지" 목록 → "필수 + NOT TO DO" 쌍으로 |
| **컨텍스트 관리** | 단일 CLAUDE.md → 도메인별 분리 |

---

## 3. 개선안

### 3.1 계층적 CLAUDE.md 도입 (우선순위 1)

**현재**:
```
/home/ilim/ops-v2/
└── CLAUDE.md                    # 모든 규칙이 한 파일에
```

**개선**:
```
/home/ilim/ops-v2/
├── CLAUDE.md                    # 공통 규칙 (간결화)
├── ops-api/CLAUDE.md            # NestJS 특화
├── ops-web/CLAUDE.md            # Next.js 특화
└── ops-agent/CLAUDE.md          # Python/LiveKit 특화
```

**효과**:
- Lost in the Middle 완화: 작업 중인 디렉토리의 규칙만 로드
- 학습 데이터 편향 보완: 각 스택별 최신 패턴 명시
- 유지보수 용이: 변경 범위 축소

**ops-api/CLAUDE.md 예시**:
```markdown
# ops-api 규칙

## 필수 패턴
- Controller → Service → Repository 계층 준수
- Entity 직접 반환 금지, DTO로 변환
- Logger 사용 (console.log 대신)
- Swagger 데코레이터 필수

## NOT TO DO
- Controller에서 비즈니스 로직 작성
- any 타입 사용
- 동기 함수에서 DB 호출
- 테스트 없이 Service 작성

## 참조
- 상세 가이드: `@.agent/workflows/architect.md`
```

---

### 3.2 체크포인트 시스템 도입 (우선순위 2)

**현재 `/full-cycle` 흐름**:
```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 (연속 실행)
```

**개선된 흐름**:
```
Phase 1: /start-work
    ↓
    ✅ 체크포인트 #1: "브랜치 생성 완료"
    ├─ [자동 진행] (기본)
    └─ [확인 요청] (--interactive 옵션)
    ↓
Phase 2: 구현
    ↓
    ✅ 체크포인트 #2: "구현 완료 - 변경 파일 목록"
    ├─ [자동 진행] (기본)
    └─ [확인 요청] (--interactive 옵션)
    ↓
Phase 3: /quality-gate
    ↓
    ✅ 체크포인트 #3: "품질 체크 결과"
    ├─ PASS → Phase 4 진행
    └─ FAIL → 중단 + 수정 안내
    ↓
Phase 4~5: 커밋/PR/완료
```

**구현 방안**:
```markdown
## /full-cycle 옵션 추가

| 옵션 | 동작 |
|------|------|
| (기본) | 체크포인트에서 결과 출력 후 자동 진행 |
| `--interactive` | 각 체크포인트에서 사용자 확인 요청 |
| `--stop-at <phase>` | 특정 Phase에서 중단 |
```

**효과**:
- 오류 중첩 방지: 각 단계 결과 확인 가능
- 제어권 강화: 필요시 개입 가능
- 기존 효율성 유지: 기본값은 자동 진행

---

### 3.3 Extended Thinking 트리거 포인트 (우선순위 3)

**적용 대상**:

| 상황 | 트리거 방법 |
|------|------------|
| T-shirt Sizing (S/M/L 판단) | `/supervisor`에서 자동 |
| 아키텍처 결정 | Architect subagent 시작 시 |
| 버그 원인 분석 | `/bug-hunter` 실행 시 |
| 복잡한 리팩토링 | `/refiner`에서 변경 범위 클 때 |

**구현 방안**:
- 각 Skill의 프롬프트에 "Think step by step" 또는 Extended Thinking 유도 문구 추가
- 복잡도 임계값 초과 시 자동 트리거

---

### 3.4 패턴 검사 스킬 추가 (우선순위 4)

**신규 스킬**: `/pattern-check`

```markdown
# /pattern-check

## 목적
프로젝트 컨벤션 준수 여부 검사 (학습 데이터 편향 보완)

## 검사 항목

### ops-api (NestJS)
| 패턴 | 검사 방법 |
|------|----------|
| DTO 변환 | Controller 반환값이 Entity가 아닌지 |
| Logger 사용 | console.log/warn/error 없음 |
| DI 패턴 | constructor injection 사용 |
| Swagger | @ApiOperation, @ApiResponse 존재 |

### ops-web (Next.js)
| 패턴 | 검사 방법 |
|------|----------|
| Server/Client 분리 | 'use client' 적절한 위치 |
| App Router | pages/ 대신 app/ 사용 |
| Image 최적화 | next/image 사용 |

### ops-agent (Python)
| 패턴 | 검사 방법 |
|------|----------|
| Type hints | 함수 시그니처에 타입 명시 |
| async/await | 비동기 패턴 일관성 |
| LiveKit 패턴 | Agent 클래스 구조 준수 |

## 실행 시점
- /quality-gate 내부에서 자동 호출
- 수동 실행: /pattern-check ops-api
```

---

### 3.5 경계 조건 명시 강화 (우선순위 5)

**각 Skill에 NOT TO DO 섹션 추가**:

```markdown
## /tdd

### 적용 대상
- Service (비즈니스 로직) ✅

### NOT TO DO
- Entity, DTO, Module에 TDD 적용 ❌
- Mock 없이 실제 DB/외부 API 호출 ❌
- 테스트 파일에 console.log 남기기 ❌
- 하나의 테스트에 여러 기능 검증 ❌
```

```markdown
## /supervisor

### 역할
- T-shirt Sizing, Plan 작성, Tasks 생성

### NOT TO DO
- S 규모를 M/L로 과대평가 ❌
- 의존성 없는 Task를 blockedBy로 연결 ❌
- 한 subagent에 불균형한 작업량 할당 ❌
- Plan 없이 바로 subagent 실행 ❌
```

---

### 3.6 Compact 전략 명시 (우선순위 6)

**Compact 권장 시점**:

| 시점 | 이유 |
|------|------|
| `/supervisor` 실행 전 | 깨끗한 컨텍스트로 Plan 작성 |
| 긴 에러 로그 출력 후 | 불필요한 스택트레이스 제거 |
| subagent 3개 이상 완료 후 | 누적된 출력 정리 |
| 세션 30분 이상 경과 | 컨텍스트 오염 방지 |

**구현**: `/full-cycle`과 `/supervisor`에 자동 Compact 로직 추가

---

### 3.7 subagent 롤백 전략 (우선순위 7)

**현재**: subagent 실패 시 명확한 복구 없음

**개선**:
```
subagent 시작 전
    ↓
git stash push -m "checkpoint-task-{id}"
    ↓
작업 실행
    ↓
├─ 성공 → git stash drop
└─ 실패 → git stash pop + Task 상태 rollback
```

**효과**: 부분 실패 시 다른 작업 결과 보존

---

### 3.8 긍정 표현 우선 (우선순위 8)

**CLAUDE.md 리팩토링**:

| Before | After |
|--------|-------|
| `console.log` 금지 | Logger 사용 필수 |
| Entity 직접 반환 금지 | DTO로 변환하여 반환 |
| any 타입 금지 | 구체적 타입 명시 필수 |
| main/dev 직접 push 금지 | feature/* 브랜치에서 PR 생성 |

---

## 4. 구현 로드맵

### Phase A: 기반 정비 (1-2일)

```
□ 3.1 계층적 CLAUDE.md 생성
  ├── ops-api/CLAUDE.md
  ├── ops-web/CLAUDE.md
  └── ops-agent/CLAUDE.md

□ 3.8 기존 CLAUDE.md 긍정 표현으로 리팩토링

□ 3.5 각 Skill에 NOT TO DO 섹션 추가
```

### Phase B: 워크플로우 개선 (2-3일)

```
□ 3.2 /full-cycle에 체크포인트 시스템 추가
  ├── --interactive 옵션
  └── --stop-at 옵션

□ 3.3 Extended Thinking 트리거 포인트 추가
  ├── /supervisor
  ├── /bug-hunter
  └── Architect subagent
```

### Phase C: 검증 강화 (1-2일)

```
□ 3.4 /pattern-check 스킬 신규 생성

□ 3.6 Compact 전략 /supervisor에 통합

□ /quality-gate에 /pattern-check 연동
```

### Phase D: 안정성 (선택)

```
□ 3.7 subagent 롤백 전략 구현
  └── git stash 기반 checkpoint
```

---

## 5. 예상 효과

### Before vs After

| 지표 | Before | After |
|------|--------|-------|
| 오류 중첩 발생 | 잦음 | 체크포인트에서 조기 발견 |
| 구버전 패턴 회귀 | 가끔 | /pattern-check로 방지 |
| 컨텍스트 오염 | 긴 세션에서 발생 | Compact 전략으로 관리 |
| 사용자 제어권 | 낮음 | --interactive로 선택 가능 |
| 자동화 효율 | 높음 | 유지 (기본값 자동 진행) |

### 트레이드오프

| 얻는 것 | 잃는 것 |
|---------|---------|
| 예측 가능성 향상 | 약간의 추가 설정 시간 |
| 오류 조기 발견 | 체크포인트에서 대기 시간 (--interactive) |
| 패턴 일관성 | /pattern-check 실행 시간 |

---

## 6. 결론

### 핵심 변경사항 요약

1. **계층적 CLAUDE.md**: 도메인별 규칙 분리로 컨텍스트 최적화
2. **체크포인트 시스템**: 자동화와 제어권의 균형
3. **패턴 검사 자동화**: 학습 데이터 편향 보완
4. **명시적 경계 정의**: NOT TO DO로 모호성 제거

### 권장 순서

```
즉시 적용 (낮은 비용, 높은 효과)
├── 3.1 계층적 CLAUDE.md
├── 3.5 NOT TO DO 섹션
└── 3.8 긍정 표현 전환

단기 적용 (중간 비용, 높은 효과)
├── 3.2 체크포인트 시스템
├── 3.3 Extended Thinking
└── 3.4 /pattern-check

선택 적용 (높은 비용, 중간 효과)
└── 3.7 subagent 롤백
```

---

## 부록: 참조 자료

- [Kurly Tech Blog 원문](https://helloworld.kurly.com/blog/vibe-coding-with-claude-code/)
- 현재 워크플로우 분석: `.claude/skills/` 전체
- OPS Remake Plan: `/home/ilim/ops/OPS_REMAKE_PLAN.md`
