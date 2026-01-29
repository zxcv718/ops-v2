---
name: characterization-test
description: 기존 코드의 현재 동작을 테스트로 캡처. "레거시 테스트", "동작 캡처", "characterization test", "기존 코드 테스트" 등의 요청에 사용
allowed-tools: Read, Write, Edit, Bash(npm:test), Glob, Grep
---

# Characterization Test - 레거시 코드 동작 캡처

> **목적**: 리팩토링 전, 기존 코드의 현재 동작을 테스트로 고정
> **언어**: 모든 결과는 **한글**로 보고

## 개념

```
기존 코드 (동작은 하지만 구조가 복잡)
         ↓
Characterization Test 작성 (현재 동작 캡처)
         ↓
리팩토링 (테스트가 안전망 역할)
         ↓
테스트 통과 = 동작 보존 확인
```

**TDD와 차이점**:
- TDD: 원하는 동작 → 테스트 → 구현
- Characterization: 기존 동작 관찰 → 테스트 작성 → 리팩토링

---

## 사용법

```
/characterization-test "UserService.validateUser"
/characterization-test "src/call/call.handler.ts"
/characterization-test ops-api/src/notification
```

---

## Workflow

### Step 1: 대상 코드 분석

```
1. 코드 읽기
2. 입력/출력 파악
3. 분기 조건 파악
4. 외부 의존성 파악
```

### Step 2: 테스트 케이스 도출

**관찰 기반**:
```
입력 A → 출력 X
입력 B → 출력 Y
입력 C → 예외 발생
```

### Step 3: 테스트 작성

```typescript
describe('UserService.validateUser (Characterization)', () => {
  // 현재 동작을 그대로 캡처
  it('should return true when email is valid', () => {
    const result = service.validateUser({ email: 'test@test.com' });
    expect(result).toBe(true);  // 현재 동작 기준
  });

  it('should throw when email is empty', () => {
    expect(() => service.validateUser({ email: '' }))
      .toThrow('Invalid email');  // 현재 동작 기준
  });
});
```

### Step 4: 테스트 실행 - 통과 확인

```bash
npm test -- --testPathPattern={feature}
```

**반드시 통과해야 함** (현재 동작 캡처이므로)

### Step 5: 리팩토링 시작

테스트가 안전망 역할 → 자유롭게 리팩토링

---

## 테스트 작성 가이드

### 명명 규칙

```typescript
// 파일명
{original-file}.characterization.spec.ts

// describe 블록
describe('{ClassName}.{methodName} (Characterization)', () => {
```

### 필수 케이스

| 케이스 | 설명 |
|--------|------|
| Happy path | 정상 입력 → 정상 출력 |
| Edge cases | 경계값 (0, null, empty) |
| Error cases | 예외 발생 상황 |
| Side effects | DB 저장, 이벤트 발생 등 |

### Mock 전략

```typescript
// 외부 의존성은 Mock
const mockRepository = {
  findOne: jest.fn().mockResolvedValue({ id: 1, name: 'test' }),
};

// 내부 로직은 실제 실행
const service = new UserService(mockRepository);
```

---

## 결과 보고 형식

```
## Characterization Test 결과

**대상**: `UserService.validateUser`
**파일**: `src/user/user.service.ts:42-78`

### 분석 결과

**입력 파라미터**:
- `user: { email: string, name?: string }`

**출력**:
- 성공: `boolean`
- 실패: `ValidationException`

**분기 조건**:
1. email 비어있음 → 예외
2. email 형식 불일치 → 예외
3. name 없음 → true (optional)
4. 정상 → true

### 작성된 테스트

| # | 케이스 | 입력 | 예상 출력 | 상태 |
|---|--------|------|----------|------|
| 1 | 정상 이메일 | `test@test.com` | `true` | ✅ |
| 2 | 빈 이메일 | `''` | `ValidationException` | ✅ |
| 3 | 잘못된 형식 | `invalid` | `ValidationException` | ✅ |
| 4 | name 없음 | `{email: 'a@b.com'}` | `true` | ✅ |

**테스트 파일**: `user.service.characterization.spec.ts`
**커버리지**: 해당 메서드 100%

---
리팩토링 진행해도 안전합니다.
```

---

## 주의사항

1. **현재 동작 그대로** 캡처 (버그도 캡처됨)
2. **버그 발견 시** 별도 이슈로 기록, 테스트는 현재 동작 기준
3. **리팩토링 후** 테스트 실패 = 동작 변경됨 (의도적인지 확인)
4. **리팩토링 완료 후** Characterization 테스트를 일반 테스트로 변환
