# ops-web 규칙

> **기술 스택**: Next.js 16 (App Router) + Tailwind CSS + Zustand
> **상세 문서**: `/home/ilim/ops/OPS_REMAKE_PLAN.md` 섹션 5

---

## 필수 패턴

### Feature-Sliced Design (FSD)
```
app/        → features/     → entities/    → shared/
(라우팅만)    (비즈니스)      (도메인 모델)   (인프라)
```

**Dependency Rule**: 상위 레이어는 하위만 의존, 역방향 금지

### 코드 규칙
- `app/` 페이지는 Feature 조합만, 로직 없음
- Feature는 `index.ts`로 Public API만 export (ISP)
- Server Component 우선, 필요시만 `'use client'`
- `next/image` 사용 (img 태그 금지)
- API 호출은 `shared/api/` 클라이언트 사용

### 상태 관리
- 서버 상태: React Query (TanStack Query)
- 클라이언트 상태: Zustand (feature별 slice)

---

## NOT TO DO

- `app/` 페이지에서 직접 API 호출
- `features/`에서 다른 feature 직접 import (entities 통해 공유)
- `entities/`에서 `features/` import (의존 역전)
- `any` 타입 사용
- `console.log` 사용
- `<img>` 태그 사용 (`next/image` 대신)
- `pages/` 디렉토리 사용 (App Router만)
- Feature 내부 구현 직접 export

---

## 디렉토리 구조

```
src/
├── app/                       # Route Layer
│   ├── (dashboard)/
│   │   ├── calls/
│   │   │   └── page.tsx       # Feature 조합만
│   │   ├── wards/
│   │   └── layout.tsx
│   ├── api/                   # Route Handlers
│   └── layout.tsx
│
├── features/                  # Feature Layer
│   ├── calls/
│   │   ├── ui/               # 컴포넌트
│   │   ├── model/            # Zustand slice
│   │   ├── api/              # API 호출
│   │   ├── lib/              # 유틸리티
│   │   └── index.ts          # Public API
│   ├── wards/
│   ├── monitoring/
│   └── auth/
│
├── entities/                  # Entity Layer
│   ├── call/
│   │   ├── types.ts
│   │   └── lib.ts            # 순수 함수
│   ├── ward/
│   └── user/
│
└── shared/                    # Shared Layer
    ├── api/
    │   ├── client.interface.ts
    │   └── fetch-client.ts
    ├── ui/                    # 범용 컴포넌트
    │   ├── Button/
    │   ├── Modal/
    │   └── Table/
    └── lib/
        ├── logger.ts
        └── utils.ts
```

---

## Feature Public API 예시

```typescript
// features/calls/index.ts
export { CallList } from './ui/CallList';
export { CallDetail } from './ui/CallDetail';
export { useCallStore } from './model/useCallStore';
export type { CallListProps } from './ui/types';

// 내부 구현은 export 하지 않음
```

---

## 명령어

```bash
npm run dev            # 개발 서버 (3001)
npm run build          # 프로덕션 빌드
npm test               # 테스트
npm run lint           # ESLint
```

---

## 품질 기준

- TypeScript strict mode
- ESLint warning 0
- `any` 타입 0개
- `console.log` 0개
