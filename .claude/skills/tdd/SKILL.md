---
name: tdd
description: TDD 사이클 (Red-Green-Refactor) 강제. "TDD로 구현해줘", "테스트 먼저", "TDD 시작" 등의 요청에 사용
allowed-tools: Read, Write, Edit, Bash(npm:test), Bash(npm:run), Bash(bun:*), Glob, Grep
---

# TDD - Automated Test-Driven Development

> **원칙**: 테스트 먼저, 코드는 테스트를 통과시키기 위한 최소한만
> **언어**: 모든 결과는 **한글**로 보고
> **모드**: Automated (각 단계 자동 실행, 실패 시 중단)

## 사용법

```
/tdd "기능명"
/tdd "Guardian 생성 API"
/tdd "Ward 목록 조회"
```

---

## Automated TDD 사이클

```
┌────────────────────────────────────────────────────────────┐
│                    /tdd "기능명"                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. 테스트 케이스 분석                                      │
│     └── 기능을 테스트 케이스로 분해                         │
│                                                            │
│  2. Cycle Loop (각 테스트 케이스마다)                       │
│     ┌─────────────────────────────────────────────────┐    │
│     │  RED: 테스트 작성 → 실행 → 실패 확인              │    │
│     │       └── 실패 안 하면? → 테스트 수정             │    │
│     │                                                   │    │
│     │  GREEN: 최소 코드 작성 → 실행 → 통과 확인         │    │
│     │         └── 통과 안 하면? → 코드 수정             │    │
│     │                                                   │    │
│     │  REFACTOR: 코드 개선 → 실행 → 통과 유지 확인      │    │
│     │            └── 실패하면? → 롤백                   │    │
│     └─────────────────────────────────────────────────┘    │
│                         ↓                                  │
│  3. 완료 보고                                              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Step 1: 테스트 케이스 분석

기능 요구사항을 테스트 케이스로 분해:

```
기능: "Guardian 생성 API"

테스트 케이스:
1. 정상 생성 - Guardian 생성 성공
2. 중복 확인 - 이미 존재하는 userId로 생성 시 에러
3. 필수값 검증 - userId 없으면 에러
```

---

## Step 2: TDD Cycle (반복)

### 2.1 RED: 테스트 작성 → 실패 확인

```typescript
// ops-api/src/modules/guardian/guardian.service.spec.ts
import { createMockGuardian, createMockPrismaService } from '../../../test/factories/index.js';

describe('GuardianService', () => {
  it('should create guardian successfully', async () => {
    // Given
    const dto = { userId: 'user-1', phoneNumber: '010-1234-5678' };

    // When
    const result = await service.create(dto);

    // Then
    expect(result.userId).toBe('user-1');
  });
});
```

**실행**:
```bash
cd ops-api && bun test --testPathPattern=guardian.service
```

**확인**:
- ❌ 실패해야 함 (아직 구현 안 됨)
- ✅ 통과하면? → 테스트가 잘못됨, 수정 필요

---

### 2.2 GREEN: 최소 코드 → 통과 확인

```typescript
// guardian.service.ts
async create(dto: CreateGuardianDto): Promise<Guardian> {
  return this.prisma.guardian.create({
    data: dto,
  });
}
```

**실행**:
```bash
cd ops-api && bun test --testPathPattern=guardian.service
```

**확인**:
- ✅ 통과해야 함
- ❌ 실패하면? → 코드 수정

---

### 2.3 REFACTOR: 개선 → 통과 유지

```typescript
// 개선: 에러 처리 추가
async create(dto: CreateGuardianDto): Promise<Guardian> {
  const existing = await this.prisma.guardian.findUnique({
    where: { userId: dto.userId },
  });

  if (existing) {
    throw new ConflictException('Guardian already exists');
  }

  return this.prisma.guardian.create({ data: dto });
}
```

**실행**:
```bash
cd ops-api && bun test --testPathPattern=guardian.service
```

**확인**:
- ✅ 여전히 통과해야 함
- ❌ 실패하면? → 리팩토링 롤백

---

## Step 3: 완료 보고

```
## TDD 완료: Guardian 생성 API

### 테스트 케이스
| # | 케이스 | 상태 |
|---|--------|------|
| 1 | 정상 생성 | ✅ |
| 2 | 중복 에러 | ✅ |
| 3 | 필수값 검증 | ✅ |

### TDD Cycles
- Cycle 1: create() 기본 구현
- Cycle 2: 중복 체크 추가
- Cycle 3: DTO 검증 추가

### 파일
- guardian.service.spec.ts (3 tests)
- guardian.service.ts (create method)

### 커버리지
- GuardianService: 100%
```

---

## 자동 실행 규칙

1. **RED 실패 필수**: 테스트가 통과하면 진행 중단, 테스트 수정
2. **GREEN 통과 필수**: 코드가 실패하면 진행 중단, 코드 수정
3. **REFACTOR 통과 유지**: 실패하면 롤백

---

## Mock Factory 사용 (필수)

```typescript
import {
  createMockUser,
  createMockGuardian,
  createMockWard,
  createMockCall,
} from '../../../test/factories/index.js';

import {
  createMockPrismaService,
  createMockJwtService,
} from '../../../test/utils/test-helper.js';
```

---

## 테스트 명명 규칙

```typescript
describe('ClassName', () => {
  describe('methodName', () => {
    it('should 성공 동작', () => {});
    it('should throw Error when 실패 조건', () => {});
    it('should return null when 조건', () => {});
  });
});
```
