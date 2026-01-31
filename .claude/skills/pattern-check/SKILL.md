---
name: pattern-check
description: 프로젝트 패턴 준수 여부 검사. "패턴 체크", "컨벤션 검사", "pattern check" 등의 요청에 사용
allowed-tools: Read, Glob, Grep
---

# Pattern Check - 프로젝트 패턴 준수 검사

> **목적**: 학습 데이터 편향 보완, 프로젝트 컨벤션 강제
> **언어**: 모든 결과는 **한글**로 보고

---

## 사용법

```bash
/pattern-check                    # 전체 검사
/pattern-check ops-api            # ops-api만
/pattern-check ops-web            # ops-web만
/pattern-check ops-agent          # ops-agent만
/pattern-check --quick            # 핵심 패턴만 빠르게
```

---

## ops-api 패턴 검사

### 1. 아키텍처 패턴

| 검사 항목 | 기대 | 검사 방법 |
|----------|------|----------|
| DDD 구조 (Call) | domain/, application/, infrastructure/ | Glob 확인 |
| Feature 구조 | controller, service, repository 존재 | Glob 확인 |
| Interface 분리 | shared/interfaces/ 존재 | Glob 확인 |

### 2. 코드 패턴

| 검사 항목 | 위반 패턴 | 검사 방법 |
|----------|----------|----------|
| DTO 변환 | Controller에서 Entity 직접 반환 | Grep: `return.*Entity` in controller |
| Logger 사용 | console.log 존재 | Grep: `console\.log` |
| DI 패턴 | new Service() 직접 생성 | Grep: `new \w+Service\(\)` |
| Swagger | @ApiOperation 누락 | Grep: `@Get\|@Post` without `@ApiOperation` |

### 3. 테스트 패턴

| 검사 항목 | 기대 | 검사 방법 |
|----------|------|----------|
| Service 테스트 | .service.ts → .service.spec.ts 존재 | Glob 매칭 |
| Mock Factory | test/factories/ 사용 | Grep: `createMock` |

---

## ops-web 패턴 검사

### 1. FSD 아키텍처

| 검사 항목 | 기대 | 검사 방법 |
|----------|------|----------|
| app/ 구조 | App Router 사용 | Glob: `app/**/page.tsx` |
| features/ 구조 | ui/, model/, api/ 존재 | Glob 확인 |
| entities/ 구조 | types.ts, lib.ts 존재 | Glob 확인 |
| shared/ 구조 | api/, ui/, lib/ 존재 | Glob 확인 |

### 2. 코드 패턴

| 검사 항목 | 위반 패턴 | 검사 방법 |
|----------|----------|----------|
| pages/ 사용 금지 | pages/ 디렉토리 존재 | Glob: `pages/**` |
| next/image | `<img` 태그 사용 | Grep: `<img` |
| Feature export | 내부 구현 직접 export | Grep in index.ts |

### 3. 의존성 규칙

| 검사 항목 | 위반 패턴 | 검사 방법 |
|----------|----------|----------|
| 역방향 의존 | entities에서 features import | Grep: `from '@/features` in entities/ |
| app 로직 | app/에서 직접 API 호출 | Grep: `fetch\|axios` in app/ |

---

## ops-agent 패턴 검사

### 1. SOLID 아키텍처

| 검사 항목 | 기대 | 검사 방법 |
|----------|------|----------|
| handlers/ 구조 | Presentation Layer | Glob 확인 |
| domain/ 구조 | 핵심 로직 + interfaces/ | Glob 확인 |
| adapters/ 구조 | 외부 연동 | Glob 확인 |

### 2. 코드 패턴

| 검사 항목 | 위반 패턴 | 검사 방법 |
|----------|----------|----------|
| print 사용 금지 | `print(` 존재 | Grep: `print\(` |
| Type hints | 함수에 타입 없음 | Grep: `def \w+\([^:]+\):` |
| Protocol 사용 | 직접 구현체 의존 | Grep: `from adapters` in domain/ |

### 3. 비동기 패턴

| 검사 항목 | 위반 패턴 | 검사 방법 |
|----------|----------|----------|
| Fire-and-forget | await 없는 코루틴 | Grep: `asyncio\|await` 없이 호출 |
| 동기 requests | `requests.get` 사용 | Grep: `requests\.(get\|post)` |

---

## 결과 보고 형식

```
## Pattern Check 결과

**대상**: {ops-api/ops-web/ops-agent}
**검사 시간**: {timestamp}

### 요약

| 영역 | 통과 | 위반 |
|------|------|------|
| 아키텍처 | 5/5 | 0 |
| 코드 패턴 | 3/4 | 1 |
| 테스트 | 2/2 | 0 |

---

### ❌ 위반 항목

**1. Swagger 데코레이터 누락**
- `src/user/user.controller.ts:23` - @Get 있지만 @ApiOperation 없음
- `src/ward/ward.controller.ts:15` - @Post 있지만 @ApiResponse 없음

**수정 방법**:
```typescript
@ApiOperation({ summary: '사용자 조회' })
@ApiResponse({ status: 200, type: UserDto })
@Get(':id')
```

---

### ✅ 통과 항목

- [x] DDD 구조 (Call 도메인)
- [x] Feature 구조 (Ward, User)
- [x] Logger 사용 (console.log 0건)
- [x] Service 테스트 파일 존재
- [x] Mock Factory 사용

---

**결론**: 1건 수정 필요
```

---

## /quality-gate 연동

`/quality-gate` 실행 시 자동으로 `/pattern-check --quick` 포함:

```
/quality-gate 체크 항목:
✅ 빌드 성공
✅ 테스트 통과
✅ 커버리지 80%+
✅ any 타입 없음
✅ console.log 없음
✅ Pattern Check 통과  ← 추가
```

---

## NOT TO DO

- 테스트 파일(.spec.ts, .test.ts)을 패턴 검사 대상에 포함
- node_modules, dist 등 빌드 산출물 검사
- 위반 심각도 무시하고 전부 동일 취급
- 자동 수정 없이 보고만 (가능하면 수정 제안)
