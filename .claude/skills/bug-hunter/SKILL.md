---
name: bug-hunter
description: 코드베이스에서 버그 패턴 탐지. "버그 찾아줘", "코드 분석", "bug hunter", "문제점 찾기" 등의 요청에 사용
allowed-tools: Read, Glob, Grep, Bash(grep:*)
---

# Bug Hunter - 버그 패턴 탐지

> **목적**: 코드베이스에서 잠재적 버그 패턴 자동 탐지
> **언어**: 모든 결과는 **한글**로 보고
> **Extended Thinking**: 각 발견 항목의 심각도와 영향 범위를 깊이 분석하세요.

## 탐지 패턴

| # | 패턴 | 심각도 | 설명 |
|---|------|--------|------|
| 1 | Fire-and-forget async | 🔴 Critical | await 없는 비동기 호출 |
| 2 | Empty catch block | 🔴 Critical | 에러 무시 |
| 3 | any 타입 | 🟠 High | 타입 안전성 손실 |
| 4 | console.log | 🟠 High | 프로덕션 로그 누출 |
| 5 | Memory leak | 🟠 High | setInterval 미정리 |
| 6 | Null 미처리 | 🟡 Medium | Optional chaining 누락 |
| 7 | Magic number | 🟡 Medium | 하드코딩된 숫자 |
| 8 | 중복 코드 | 🔵 Low | DRY 위반 |

---

## 사용법

```
/bug-hunter                          # 전체 스캔
/bug-hunter ops-api                  # ops-api만
/bug-hunter ops-web --pattern "any"  # 특정 패턴만
/bug-hunter --critical               # Critical만
```

---

## 탐지 방법

### 1. Fire-and-forget Async (🔴 Critical)

```bash
# Promise 반환 함수 호출인데 await 없는 경우
grep -rn "this\.\w\+\.\w\+(" --include="*.ts" | grep -v "await\|return\|const\|let"
```

**문제 코드**:
```typescript
// ❌ 결과를 기다리지 않음
this.emailService.send(user.email);

// ✅ 수정
await this.emailService.send(user.email);
```

### 2. Empty Catch Block (🔴 Critical)

```bash
grep -rn "catch.*{" --include="*.ts" -A 1 | grep -B 1 "^--$\|^\s*}$"
```

**문제 코드**:
```typescript
// ❌ 에러 무시
try {
  await riskyOperation();
} catch (e) {
}

// ✅ 수정
try {
  await riskyOperation();
} catch (e) {
  this.logger.error('Operation failed', e);
  throw e;
}
```

### 3. any 타입 (🟠 High)

```bash
grep -rn ": any\|: any\[\]\|as any" --include="*.ts" --include="*.tsx"
```

### 4. console.log (🟠 High)

```bash
grep -rn "console\.\(log\|error\|warn\|debug\)" --include="*.ts" --include="*.tsx"
```

### 5. Memory Leak - setInterval (🟠 High)

```bash
grep -rn "setInterval\|setTimeout" --include="*.ts" | grep -v "clearInterval\|clearTimeout"
```

**문제 코드**:
```typescript
// ❌ 정리 안 함
setInterval(() => this.poll(), 1000);

// ✅ 수정
const intervalId = setInterval(() => this.poll(), 1000);
// cleanup에서 clearInterval(intervalId);
```

### 6. Null 미처리 (🟡 Medium)

```bash
grep -rn "\.\w\+\.\w\+" --include="*.ts" | grep -v "?\.\|&&\|if.*null\|if.*undefined"
```

---

## 결과 보고 형식

```
## Bug Hunter 스캔 결과

**대상**: ops-api
**스캔 시간**: 2026-01-29 23:00:00

### 요약

| 심각도 | 발견 |
|--------|------|
| 🔴 Critical | 2건 |
| 🟠 High | 5건 |
| 🟡 Medium | 8건 |
| 🔵 Low | 3건 |

---

### 🔴 Critical (즉시 수정 필요)

**1. Fire-and-forget async**
- `src/notification/notification.service.ts:42`
  ```typescript
  this.emailService.send(user.email);  // await 누락
  ```
  **수정**: `await this.emailService.send(user.email);`

**2. Empty catch block**
- `src/auth/auth.service.ts:87`
  ```typescript
  catch (e) { }  // 에러 무시
  ```
  **수정**: Logger로 기록 또는 re-throw

---

### 🟠 High

**1. any 타입 (3건)**
- `src/user/user.service.ts:15` - `: any`
- `src/call/call.handler.ts:23` - `as any`
- ...

**2. console.log (2건)**
- `src/auth/auth.controller.ts:8`
- ...

---

### 수정 우선순위

1. 🔴 Critical → 즉시
2. 🟠 High → PR 전
3. 🟡 Medium → 다음 스프린트
4. 🔵 Low → 백로그
```

---

## 제외 설정

`.bug-hunter-ignore` 파일로 제외 가능:

```
# 테스트 파일 제외
**/*.spec.ts
**/*.test.ts
__tests__/**

# 특정 패턴 제외
# @bug-hunter-ignore: any
```
