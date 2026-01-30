# ops-api

OPS 백엔드 API 서버 (NestJS + Prisma + Bun)

## 요구사항

- Bun 1.x
- PostgreSQL 16.x
- Redis 7.x

## 설치

```bash
bun install
```

## 개발

```bash
# 개발 서버 (watch mode)
bun run start:dev

# 서버 실행
bun run start

# 프로덕션 빌드 후 실행
bun run build
bun run start:prod
```

## 테스트

```bash
# 단위 테스트
bun test

# 테스트 (watch mode)
bun test --watch

# 커버리지
bun test --coverage

# E2E 테스트
bun test test/
```

## 린트 & 포맷

```bash
# ESLint
bun run lint

# Prettier
bun run format
```

## 폴더 구조

```
src/
├── config/       # 환경 설정
├── common/       # 공통 모듈 (Guards, Filters, Interceptors, etc.)
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── modules/      # 도메인 모듈
```

## 환경 변수

`.env.example` 참조

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Runtime | Bun |
| Framework | NestJS 11 |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache | Redis |
| Test | Bun Test |
