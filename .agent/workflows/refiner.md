---
description: 버그 수정, 리팩토링, 성능 최적화. 빌드 에러 수정, 대규모 리팩토링 시 사용.
---

# Refiner (연마가)

> **역할**: 버그 수정, 리팩토링, 성능 최적화
> **참조**: `@.claude/skills/implement/SKILL.md` (Ralph Loop 섹션)

---

## Ralph Loop 활용

반복적 수정이 필요한 대규모 작업에 사용:

```bash
# 빌드 성공까지 반복
/ralph-loop "ops-api 빌드 에러 수정. <promise>BUILD SUCCESS</promise> 출력" --max-iterations 15

# 타입 에러 전체 수정
/ralph-loop "any 타입을 적절한 타입으로 변경. <promise>NO ANY</promise>" --max-iterations 20

# console.log 제거
/ralph-loop "console.log를 Logger로 변경. <promise>NO CONSOLE</promise>" --max-iterations 10
```

---

## Ralph Loop 적합성

### ✅ 적합한 작업
- 빌드 에러 수정 (여러 파일)
- 대규모 리팩토링 (타입, 로깅 등)
- 테스트 통과까지 반복 수정
- 코드 스타일 일괄 변경

### ❌ 부적합한 작업
- 신규 기능 구현 (설계 판단 필요)
- 1-2개 파일 수정
- 요구사항이 불명확한 작업

---

## 버그 수정 Workflow

```
1. 에러 로그/증상 분석
      ↓
2. 원인 파악 (grep, 로그 확인)
      ↓
3. 수정 적용
      ↓
4. 빌드 확인
      ↓ FAIL → 3으로 돌아가기
5. 테스트 확인
      ↓ FAIL → 3으로 돌아가기
6. ✅ 완료
```

---

## 리팩토링 체크리스트

- [ ] 기존 동작 유지 확인 (테스트 통과)
- [ ] 기존 패턴과 일관성 유지
- [ ] 불필요한 변경 최소화
- [ ] 변경 이유 문서화

---

## 성능 최적화 체크리스트

- [ ] 병목 지점 식별
- [ ] Before 측정값 기록
- [ ] 최적화 적용
- [ ] After 측정값 기록
- [ ] `.portfolio/`에 개선 기록

---

## 일반적인 수정 패턴

### TypeScript 타입 에러
```typescript
// Before: any 타입
const data: any = await fetch(...);

// After: 명시적 타입
interface ResponseData { id: string; name: string; }
const data: ResponseData = await fetch(...);
```

### 로깅 변경
```typescript
// Before: console.log
console.log('debug', data);

// After: NestJS Logger
this.logger.log(`Processing data=${JSON.stringify(data)}`);
```
