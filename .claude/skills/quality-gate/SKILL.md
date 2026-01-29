---
name: quality-gate
description: PR 전 품질 게이트 체크. "품질 체크", "PR 전 검사", "quality gate", "코드 품질" 등의 요청에 사용
allowed-tools: Read, Bash(npm:*), Bash(grep:*), Glob, Grep
---

# Quality Gate - PR 전 품질 체크

> **목적**: PR 생성 전 코드 품질 기준 충족 확인
> **언어**: 모든 결과는 **한글**로 보고

## 체크 항목

| # | 항목 | 기준 | 필수 |
|---|------|------|------|
| 1 | 빌드 성공 | `npm run build` 통과 | ✅ |
| 2 | 테스트 통과 | `npm test` 통과 | ✅ |
| 3 | 테스트 커버리지 | 80% 이상 | ⚠️ |
| 4 | TypeScript strict | 타입 에러 0 | ✅ |
| 5 | ESLint | warning 0 | ✅ |
| 6 | any 타입 없음 | 검색 결과 0 | ✅ |
| 7 | console.log 없음 | 검색 결과 0 | ✅ |
| 8 | TODO/FIXME 확인 | 목록 출력 | ⚠️ |

---

## 실행 순서

### Step 1: 빌드 체크

```bash
cd ops-api && npm run build
cd ops-web && npm run build
```

### Step 2: 테스트 체크

```bash
cd ops-api && npm test
cd ops-web && npm test
```

### Step 3: 커버리지 체크

```bash
cd ops-api && npm test -- --coverage
```

### Step 4: Lint 체크

```bash
cd ops-api && npm run lint
cd ops-web && npm run lint
```

### Step 5: 금지 패턴 검색

**any 타입**:
```bash
grep -r ": any" --include="*.ts" --include="*.tsx" ops-api/src ops-web/src
```

**console.log**:
```bash
grep -r "console.log" --include="*.ts" --include="*.tsx" ops-api/src ops-web/src
```

**TODO/FIXME**:
```bash
grep -rn "TODO\|FIXME" --include="*.ts" --include="*.tsx" ops-api/src ops-web/src
```

---

## 사용법

```
/quality-gate              # 체크만
/quality-gate --fix        # 자동 수정 시도
/quality-gate --report     # 상세 리포트
```

---

## 결과 보고 형식

```
## Quality Gate 결과

| 항목 | 상태 | 상세 |
|------|------|------|
| 빌드 | ✅ | ops-api, ops-web 통과 |
| 테스트 | ✅ | 42 passed, 0 failed |
| 커버리지 | ⚠️ | 75% (기준: 80%) |
| TypeScript | ✅ | 에러 0 |
| ESLint | ❌ | warning 3건 |
| any 타입 | ✅ | 발견 0 |
| console.log | ❌ | 발견 2건 |
| TODO/FIXME | ⚠️ | 5건 (확인 필요) |

### 실패 상세

**ESLint (3건)**:
- `src/user/user.service.ts:42` - unused variable
- ...

**console.log (2건)**:
- `src/auth/auth.controller.ts:15`
- ...

---
**결과**: ❌ FAIL (2개 필수 항목 실패)
**조치**: ESLint, console.log 수정 필요
```

---

## --fix 옵션

자동 수정 가능한 항목:

| 항목 | 자동 수정 |
|------|----------|
| ESLint | `npm run lint -- --fix` |
| console.log | Logger로 교체 제안 |
| any 타입 | 타입 추론 제안 |

---

## 통과 기준

```
✅ PASS 조건:
- 필수 항목 전체 통과
- 경고 항목은 확인만 (blocking 아님)

❌ FAIL 조건:
- 필수 항목 1개 이상 실패
```
