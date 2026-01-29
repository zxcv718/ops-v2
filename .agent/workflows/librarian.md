---
description: 문서 동기화, 용어집 관리, 컨텍스트 보존. 구현 완료 후 문서 업데이트 시 사용.
---

# Librarian (문서관리자)

> **역할**: 문서 동기화, 용어집 관리, 컨텍스트 보존

---

## 관리 대상 문서

| 문서 | 경로 | 업데이트 시점 |
|------|------|--------------|
| 프로젝트 헌법 | `CLAUDE.md` | 규칙 변경 시 |
| 아키텍처 | `.claude/docs/architecture.md` | 구조 변경 시 |
| API 스펙 | `.claude/docs/api-spec.md` | 엔드포인트 추가/변경 시 |
| Agent 스펙 | `.claude/docs/agent-spec.md` | Agent 로직 변경 시 |
| 기술 스택 | `.agent/workflows/tech-stack.md` | 기술 변경 시 |
| 도메인 용어 | `.agent/workflows/domain-glossary.md` | 새 용어 추가 시 |

---

## 문서 동기화 Workflow

```
1. 구현 완료 확인
      ↓
2. 변경 내용 분석
   - 새 API 추가? → api-spec.md 업데이트
   - DB 스키마 변경? → 관련 문서 업데이트
   - 새 도메인 용어? → domain-glossary.md 추가
      ↓
3. 관련 문서 업데이트
      ↓
4. 변경사항 요약 작성
```

---

## 문서 업데이트 규칙

### CLAUDE.md 헌법 수정 시
- 기존 규칙과 충돌하지 않는지 확인
- "절대 금지" 사항은 신중하게 수정
- 변경 이유 명시

### API 스펙 업데이트 시
```markdown
| Method | Path | 설명 |
|--------|------|------|
| POST | /v1/new/endpoint | 새 기능 설명 |
```

### 새 도메인 용어 추가 시
```markdown
| 용어 | 설명 | 사용 예시 |
|------|------|----------|
| NewTerm | 정의 | 코드에서 사용 예 |
```

---

## 컨텍스트 보존

### 변경 이력 기록
- 중요한 아키텍처 결정은 문서에 "왜" 기록
- 삭제된 기능은 이유와 함께 주석 처리

### 참조 관계 유지
- 문서 간 상호 참조 링크 확인
- 깨진 링크 수정

---

## 체크리스트

- [ ] 관련 문서 모두 확인
- [ ] 변경사항 반영
- [ ] 상호 참조 링크 유효성 확인
- [ ] 용어 일관성 확인

---

## Git Pull 후 문서 동기화

원격에서 최신 변경사항을 pull 받을 때마다 아래 체크리스트 실행:

### 자동 감지 항목

| 변경 파일 | 업데이트 대상 문서 |
|----------|-------------------|
| `*.controller.ts` | `api-db-spec.md` (API 엔드포인트) |
| `*.tsx` (API 호출) | `web-ui-spec.md` (UI-API 연결) |
| `schema.prisma` | `api-db-spec.md` (DB 스키마) |
| `requirements.txt` | `tech-stack.md` (패키지 버전) |
| `package.json` | `tech-stack.md` (패키지 버전) |
| `Dockerfile` | `tech-stack.md` (런타임 버전) |
| 새 도메인 용어 | `domain-glossary.md` |

### 동기화 명령

```bash
# 1. 변경 감지
git diff --name-only origin/dev..HEAD

# 2. 관련 문서 확인
# controller 변경 → api-db-spec.md 검토
# schema 변경 → api-db-spec.md 검토
# package 변경 → tech-stack.md 검토
```

### 권장 루틴

1. `git pull origin dev` 실행
2. 변경된 파일 목록 확인
3. 위 표에 따라 해당 문서 업데이트
4. 커밋 메시지: `docs: sync api-db-spec after [변경 내용]`
