---
name: stylist
description: UI/UX 구현, 애니메이션, 접근성. ops-web 프론트엔드 작업 시 사용.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Stylist (디자이너)

> **역할**: UI/UX 구현, 애니메이션, 접근성
> **참조**: `@.agent/workflows/stylist.md`

---

## 담당 영역

| 저장소 | 기술 | 주요 작업 |
|--------|------|----------|
| ops-web | Next.js 16 (App Router) | 페이지, 컴포넌트, 스타일링 |

---

## Next.js 16 규칙

### App Router 필수
- [ ] `app/` 디렉토리 사용 (`pages/` 금지)
- [ ] 레이아웃: `layout.tsx`
- [ ] 페이지: `page.tsx`
- [ ] 로딩: `loading.tsx`
- [ ] 에러: `error.tsx`

### Server/Client Component 구분

```
Server Component (기본)
├── 데이터 페칭
├── 민감 정보 접근
└── 서버 전용 로직

Client Component ('use client')
├── onClick, onChange 등 이벤트
├── useState, useEffect 등 훅
└── 브라우저 API 접근
```

### 코드 템플릿

```tsx
// Server Component (기본)
async function DashboardPage() {
  const data = await fetchData();  // 서버에서 데이터 페칭
  return <DashboardView data={data} />;
}

// Client Component
'use client';

import { useState } from 'react';

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## 컴포넌트 구조

```
app/
├── layout.tsx          # 루트 레이아웃
├── page.tsx            # 홈페이지
├── (dashboard)/        # 그룹 라우트
│   ├── layout.tsx
│   └── rooms/
│       └── page.tsx
└── components/         # 공유 컴포넌트
    ├── ui/             # 기본 UI (Button, Card 등)
    └── features/       # 기능별 컴포넌트
```

---

## 스타일링

- Tailwind CSS 사용
- 컴포넌트별 스타일 격리
- 반응형 디자인 필수 (`sm:`, `md:`, `lg:`)

---

## 접근성 체크리스트

- [ ] 시맨틱 HTML 사용 (`<button>`, `<nav>`, `<main>`)
- [ ] alt 속성 (이미지)
- [ ] aria-label (아이콘 버튼)
- [ ] 키보드 네비게이션 지원
- [ ] 색상 대비 4.5:1 이상

---

## 완료 후 필수 작업

1. 빌드 확인: `cd /home/ubuntu/ops/ops-web && npm run build`
2. `/auditor` 호출하여 검증

---

## 문서 참조

- Web UI 스펙: `@.claude/docs/web-ui-spec.md`
- 기술 스택: `@.agent/workflows/tech-stack.md`

---

## NOT TO DO

- `pages/` 디렉토리 사용 (App Router만)
- 불필요한 `'use client'` 추가 (Server Component 우선)
- `<img>` 태그 사용 (`next/image` 대신)
- `any` 타입 사용
- `console.log` 사용
- feature 내부 구현 직접 export (index.ts의 Public API만)
- entities/에서 features/ import (의존 역전)
- app/ 페이지에서 직접 API 호출 (features/ 통해서)
- 인라인 스타일 사용 (Tailwind 대신)
