---
name: tdd
description: TDD 사이클 (Red-Green-Refactor) 강제. "TDD로 구현해줘", "테스트 먼저", "TDD 시작" 등의 요청에 사용
allowed-tools: Read, Write, Edit, Bash(npm:test), Bash(npm:run), Glob, Grep
---

# TDD - Test-Driven Development

> **원칙**: 테스트 먼저, 코드는 테스트를 통과시키기 위한 최소한만
> **언어**: 모든 결과는 **한글**로 보고

## 핵심 사이클

```
┌─────────────────────────────────────────────────────┐
│  RED → GREEN → REFACTOR → RED → GREEN → REFACTOR   │
│   ↑                                            │    │
│   └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## Phase 1: RED (실패하는 테스트 작성)

### 1.1 테스트 파일 생성/확인

```bash
# API (NestJS)
ops-api/src/{module}/__tests__/{feature}.spec.ts

# Web (Next.js)
ops-web/__tests__/{feature}.test.ts
```

### 1.2 테스트 작성 규칙

```typescript
describe('기능명', () => {
  it('should 동작 설명', async () => {
    // Given: 초기 상태

    // When: 동작 실행

    // Then: 결과 검증
    expect(result).toBe(expected);
  });
});
```

### 1.3 테스트 실행 - 반드시 실패 확인

```bash
cd ops-api && npm test -- --testPathPattern={feature}
```

**실패 확인 필수**: 테스트가 통과하면 잘못된 테스트임

---

## Phase 2: GREEN (최소 코드로 통과)

### 2.1 규칙

- **최소한의 코드만** 작성
- 하드코딩 OK (나중에 리팩토링)
- 다른 테스트 케이스 생각 X (지금 테스트만 통과)

### 2.2 테스트 실행 - 통과 확인

```bash
npm test -- --testPathPattern={feature}
```

**통과해야 다음 단계**

---

## Phase 3: REFACTOR (코드 개선)

### 3.1 규칙

- 테스트는 **계속 통과** 상태 유지
- 중복 제거
- 네이밍 개선
- 구조 개선

### 3.2 리팩토링 후 테스트

```bash
npm test -- --testPathPattern={feature}
```

**여전히 통과해야 함**

---

## 다음 사이클

```
Phase 1 완료 → Phase 2 완료 → Phase 3 완료
                                    ↓
                              다음 테스트 케이스
                                    ↓
                            Phase 1 (RED) 시작
```

---

## 사용법

```
/tdd "사용자 로그인 기능"
/tdd "알림 생성 API"
```

## 진행 보고 형식

각 사이클 완료 시:

```
## TDD Cycle #1

### RED
- 테스트: `it('should create notification')`
- 상태: ❌ 실패 (expected)

### GREEN
- 구현: `NotificationService.create()`
- 상태: ✅ 통과

### REFACTOR
- 변경: 중복 코드 추출
- 상태: ✅ 통과 유지

---
다음 테스트 케이스로 진행?
```

---

## 금지 사항

1. ❌ 테스트 없이 코드 작성
2. ❌ 한 번에 여러 테스트 작성
3. ❌ RED 단계에서 테스트 통과
4. ❌ REFACTOR에서 테스트 실패
5. ❌ 다음 기능 미리 구현
