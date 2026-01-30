# OPS 기술 스택

> 참조: `@.claude/docs/architecture.md`

---

## 서비스 구성

| 서비스 | 기술 | 포트 | 설명 |
|--------|------|------|------|
| ops-api | NestJS 11 + Prisma | 3000 | 백엔드 API 서버 |
| ops-web | Next.js 16 (App Router) | 3001 | 관리자 웹 UI |
| ops-agent | Python + LiveKit Agents | - | AI 음성 에이전트 |

---

## ops-api

| 레이어 | 기술 | 버전 |
|--------|------|------|
| Runtime | Bun | 1.x |
| Framework | NestJS | 11.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 16.x |
| Cache | Redis | 7.x |
| Language | TypeScript | 5.x |
| Test | Bun Test | (built-in) |

### 주요 의존성
- `@nestjs/jwt` - JWT 인증
- `livekit-server-sdk` - LiveKit API
- `@apns2/core` - Apple Push Notification

### 명령어
```bash
bun install    # 의존성 설치
bun run build  # 빌드
bun test       # 테스트
bun run start  # 서버 실행
```

---

## ops-web

| 레이어 | 기술 | 버전 |
|--------|------|------|
| Framework | Next.js | 16.x |
| React | React | 19.x |
| Styling | Tailwind CSS | 3.x |
| State | Zustand | 4.x |
| Language | TypeScript | 5.x |

### 주요 의존성
- `livekit-client` - LiveKit 클라이언트
- `socket.io-client` - 실시간 통신

---

## ops-agent

| 레이어 | 기술 | 버전 |
|--------|------|------|
| Runtime | Python | 3.11+ |
| Agent Framework | LiveKit Agents | 0.x |
| LLM | OpenAI / Anthropic | - |
| STT | AWS Transcribe | - |
| TTS | AWS Polly / ElevenLabs | - |

### 주요 의존성
- `livekit-agents` - LiveKit Agent SDK
- `aiohttp` - 비동기 HTTP
- `redis` - Redis 클라이언트

---

## 인프라

| 구성요소 | 기술 | 설명 |
|---------|------|------|
| Container | Docker / Docker Compose | 개발 환경 |
| Media Server | LiveKit SFU | 실시간 통신 |
| Push | APNs (VoIP + Alert) | iOS 푸시 알림 |
| Auth | JWT + Kakao OAuth | 인증 |

---

## 환경별 URL

| 환경 | ops-api | ops-web | LiveKit |
|------|---------|---------|---------|
| 개발 | localhost:3000 | localhost:3001 | ws://localhost:7880 |
| 운영 | (TBD) | (TBD) | (TBD) |
