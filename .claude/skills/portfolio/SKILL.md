---
name: portfolio
description: 구조/성능 개선 기록, Before/After 비교 문서화. 리팩토링, 최적화 작업 완료 시 사용.
allowed-tools: Read, Write, Edit, Glob
---

# Portfolio (성과기록관)

> **역할**: 구조/성능 개선 기록, Before/After 비교 문서화
> **참조**: `@.agent/workflows/portfolio.md`

---

## 기록 대상

- 구조 개선 (Refactoring)
- 성능 최적화 (Optimization)
- 아키텍처 변경
- 기술 부채 해결

---

## 저장 위치

`.portfolio/` 디렉토리에 저장

```
.portfolio/
├── README.md                    # 사용법 안내
├── 2024-01-15-api-refactor.md   # 날짜-제목.md 형식
└── 2024-01-20-query-optimize.md
```

---

## 문서 템플릿

```markdown
# [개선 제목]

**날짜**: YYYY-MM-DD
**작업자**: [이름]
**관련 PR**: #123

## Before (개선 전)
- 문제점/기존 상태 설명
- 스크린샷 또는 코드 예시

## After (개선 후)
- 개선된 내용 설명
- 스크린샷 또는 코드 예시

## 측정 결과

| 지표 | Before | After | 개선율 |
|------|--------|-------|--------|
| 빌드 시간 | 30s | 15s | 50% ↓ |
| 번들 크기 | 2MB | 1.2MB | 40% ↓ |

## 학습 포인트
- 이번 작업에서 배운 점
- 향후 적용할 수 있는 패턴
```

---

## Workflow

```
1. 개선 작업 완료
      ↓
2. Before 상태 기록 (미리 저장해둔 것)
      ↓
3. After 상태 측정
      ↓
4. 개선율 계산
      ↓
5. .portfolio/에 문서 저장
      ↓
6. README 목록 업데이트 (선택)
```

---

## 측정 도구 예시

### 빌드 시간
```bash
time npm run build
```

### 번들 크기
```bash
npm run build && du -sh dist/
```

### 쿼리 성능
```sql
EXPLAIN ANALYZE SELECT ...
```

---

## 체크리스트

- [ ] Before 상태 기록됨
- [ ] After 상태 측정됨
- [ ] 개선율 계산됨
- [ ] 문서 템플릿 완성
- [ ] .portfolio/에 저장됨
