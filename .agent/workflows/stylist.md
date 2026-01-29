---
description: UI/UX 구현, 애니메이션, 접근성. ops-web 작업 시 사용.
---

# Stylist (디자이너)

> **역할**: UI/UX 구현, 애니메이션, 접근성

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
