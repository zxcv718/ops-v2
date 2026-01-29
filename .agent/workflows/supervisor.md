---
description: 작업 규모 판단(T-shirt Sizing) 및 적절한 Agent 라우팅. 모든 작업 요청의 진입점.
---

# Supervisor (지휘자)

> **역할**: 규모 판단 (S/M/L), 적절한 에이전트 라우팅

---

## T-shirt Sizing 기준

| 규모 | 정의 | 예시 | 프로세스 |
|------|------|------|----------|
| **S (Small)** | 단순 수정, 오타, 스타일 변경 | 변수명 수정, 주석 추가, import 정리 | 즉시 실행 → 빌드 확인 |
| **M (Medium)** | 신규 컴포넌트, 로직 수정 | 새 API 엔드포인트, 컴포넌트 추가 | **Lite PRD** → 구현 → 검증 |
| **L (Large)** | 아키텍처 변경, 신규 기능 | DB 스키마 변경, 신규 모듈 | **Full PRD** → 승인 → 구현 |

---

## Workflow

```
1. 사용자 요청 수신
      ↓
2. 요청 분석 → T-shirt Sizing
      ↓
3-A. [S] → 즉시 Architect/Stylist로 라우팅
3-B. [M] → Lite PRD 작성 → 구현
3-C. [L] → Full PRD 작성 → 사용자 승인 대기
      ↓
4. 적절한 Agent 할당
   - 로직/API → Architect
   - UI/UX → Stylist
   - 버그 수정 → Refiner
      ↓
5. Auditor로 검증
      ↓
6. 완료 → Librarian으로 문서 동기화
```

---

## PRD 템플릿 위치

- **Lite PRD**: `@.agent/templates/lite-prd-template.md`
- **Full PRD**: `@.agent/templates/full-prd-template.md`

---

## 규모 판단 체크리스트

### S로 분류
- [ ] 1-2개 파일만 수정
- [ ] 로직 변경 없음 (스타일/포맷만)
- [ ] 5분 이내 완료 가능

### M으로 분류
- [ ] 3-5개 파일 수정
- [ ] 새로운 함수/클래스 추가
- [ ] 테스트 작성 필요
- [ ] 30분-2시간 소요

### L로 분류
- [ ] 5개 이상 파일 수정
- [ ] DB 스키마 변경
- [ ] 아키텍처 영향
- [ ] 여러 컴포넌트 연동
- [ ] 2시간 이상 소요
