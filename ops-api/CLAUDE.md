# ops-api 규칙

> **기술 스택**: NestJS + Prisma + PostgreSQL
> **상세 문서**: `/home/ilim/ops/OPS_REMAKE_PLAN.md` 섹션 4

---

## 필수 패턴

### 아키텍처
- **DDD 4계층** (Call 도메인): `domain/` → `application/` → `infrastructure/` → `interface/`
- **Feature 기반** (단순 CRUD): `controller` → `service` → `repository`
- **DIP**: 외부 서비스는 Interface로 추상화 (`shared/interfaces/`)

### 코드 규칙
- Logger 사용 (`@nestjs/common`의 Logger)
- Entity는 DTO로 변환하여 반환
- Controller는 라우팅만, 비즈니스 로직은 Service에
- 구체적 타입 명시 (제네릭 포함)
- Swagger 데코레이터 필수 (`@ApiOperation`, `@ApiResponse`, `@ApiTags`)

### TDD (Service 필수)
```
1. RED: 실패하는 테스트 먼저 작성
2. GREEN: 최소 코드로 통과
3. REFACTOR: 코드 개선 (테스트 유지)
```

### Mock Factory 사용
```typescript
import { createMockUser, createMockGuardian } from '../../../test/factories/index.js';
```

---

## NOT TO DO

- Controller에서 Repository 직접 호출
- Service에서 Response 객체 직접 반환
- `any` 타입 사용
- `console.log` 사용
- Entity를 Controller에서 직접 반환
- 테스트 없이 Service 코드 작성
- God Object 패턴 (DbService 같은)
- 동기 함수에서 DB 호출

---

## 디렉토리 구조

```
src/
├── call/                      # DDD (복잡한 도메인)
│   ├── domain/
│   │   ├── call.aggregate.ts
│   │   ├── call.repository.ts      # Interface
│   │   └── call.events.ts
│   ├── application/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── sagas/
│   ├── infrastructure/
│   │   └── prisma-call.repository.ts
│   └── interface/
│       └── call.controller.ts
│
├── ward/                      # Feature (단순 CRUD)
│   ├── ward.controller.ts
│   ├── ward.service.ts
│   ├── ward.repository.interface.ts
│   ├── ward.repository.ts
│   └── dto/
│
├── shared/interfaces/         # 외부 서비스 추상화
│   ├── room.service.interface.ts
│   ├── push.service.interface.ts
│   └── ai.service.interface.ts
│
└── infrastructure/            # 구현체
    ├── livekit/
    ├── apns/
    └── bedrock/
```

---

## 테스트 구조

```
test/
├── factories/                 # Mock 객체 생성
│   ├── user.factory.ts
│   ├── call.factory.ts
│   └── index.ts
├── unit/
│   └── *.service.spec.ts
├── integration/
│   └── *.controller.spec.ts
└── e2e/
    └── *.e2e-spec.ts
```

---

## 명령어

```bash
npm run build          # 빌드
npm test               # 단위 테스트
npm run test:e2e       # E2E 테스트
npm run test:cov       # 커버리지
npx prisma generate    # Prisma 클라이언트 생성
npx prisma migrate dev # 마이그레이션
```

---

## 품질 기준

- 테스트 커버리지 80% 이상
- 모든 `.service.ts`에 대응하는 `.service.spec.ts` 존재
- TypeScript strict mode
- ESLint warning 0
