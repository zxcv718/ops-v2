# OPS v2 프로젝트 구조 명세

> **목적**: Remake 문서에 정의되지 않은 구조 보완
> **참조**: `/home/ilim/ops/OPS_REMAKE_PLAN.md`

---

## 1. .claude/ 디렉토리 구조

```
.claude/
├── settings.local.json          # 로컬 권한 설정 (gitignore)
├── docs/                         # 프로젝트 문서
│   ├── workflow-improvement-proposal.md
│   └── project-structure-spec.md  # 이 문서
└── skills/                       # Claude Code 스킬
    ├── full-cycle/
    │   └── SKILL.md
    ├── supervisor/
    │   └── SKILL.md
    ├── start-work/
    │   └── SKILL.md
    ├── smart-commit/
    │   └── SKILL.md
    ├── pick-issue/
    │   └── SKILL.md
    ├── tdd/
    │   └── SKILL.md
    ├── quality-gate/
    │   └── SKILL.md
    ├── pattern-check/
    │   └── SKILL.md
    ├── bug-hunter/
    │   └── SKILL.md
    ├── code-review/
    │   └── SKILL.md
    ├── architect/
    │   └── SKILL.md
    ├── stylist/
    │   └── SKILL.md
    ├── auditor/
    │   └── SKILL.md
    ├── refiner/
    │   └── SKILL.md
    ├── characterization-test/
    │   └── SKILL.md
    ├── implement/
    │   └── SKILL.md
    ├── librarian/
    │   └── SKILL.md
    ├── portfolio/
    │   └── SKILL.md
    └── livekit-help/
        └── SKILL.md
```

---

## 2. ops-api/test/ 디렉토리 구조

```
ops-api/test/
├── factories/                    # Mock 객체 생성
│   ├── user.factory.ts
│   │   └── createMockUser(overrides?)
│   ├── guardian.factory.ts
│   │   └── createMockGuardian(overrides?)
│   ├── ward.factory.ts
│   │   └── createMockWard(overrides?)
│   ├── call.factory.ts
│   │   └── createMockCall(overrides?)
│   └── index.ts                  # 모든 factory export
│
├── utils/
│   ├── test-helper.ts           # 테스트 유틸리티
│   │   ├── createMockPrismaService()
│   │   ├── createMockJwtService()
│   │   └── createMockConfigService()
│   └── test-database.ts         # 테스트 DB 설정
│
├── fixtures/
│   ├── users.json               # 테스트 데이터
│   └── calls.json
│
└── jest.config.js               # Jest 설정
```

### Factory 사용 예시

```typescript
import {
  createMockUser,
  createMockGuardian,
  createMockWard,
} from '../../../test/factories/index.js';

import {
  createMockPrismaService,
} from '../../../test/utils/test-helper.js';

describe('GuardianService', () => {
  const mockUser = createMockUser({ email: 'test@example.com' });
  const mockGuardian = createMockGuardian({ userId: mockUser.id });
});
```

---

## 3. .github/workflows/ 구조

```
.github/
├── workflows/
│   ├── ci.yml                   # PR 검증 (lint, test, build)
│   │   └── Triggers: pull_request to dev
│   │
│   ├── cd-dev.yml               # dev 브랜치 배포
│   │   └── Triggers: push to dev
│   │
│   ├── cd-prod.yml              # main 브랜치 배포
│   │   └── Triggers: push to main
│   │
│   └── release.yml              # 릴리스 태그 생성
│       └── Triggers: manual dispatch
│
├── CODEOWNERS                   # 코드 소유자
├── pull_request_template.md     # PR 템플릿
└── ISSUE_TEMPLATE/
    ├── bug_report.md
    └── feature_request.md
```

### ci.yml 예시

```yaml
name: CI

on:
  pull_request:
    branches: [dev]

jobs:
  lint-test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # ops-api
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: ops-api/package-lock.json

      - name: Install & Test API
        working-directory: ops-api
        run: |
          npm ci
          npm run lint
          npm test -- --coverage
          npm run build

      # ops-web
      - name: Install & Test Web
        working-directory: ops-web
        run: |
          npm ci
          npm run lint
          npm test
          npm run build

      # ops-agent
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install & Test Agent
        working-directory: ops-agent
        run: |
          pip install -r requirements.txt
          python -m pytest --cov
          python -m mypy agent/
```

---

## 4. 환경 설정 파일 목록

### ops-api

```
ops-api/
├── .env.example                 # 환경 변수 템플릿
├── .env.local                   # 로컬 개발 (gitignore)
├── .env.test                    # 테스트 환경
└── .env.production              # 프로덕션 (gitignore)
```

**.env.example**:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ops_dev"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# LiveKit
LIVEKIT_URL="wss://your-livekit-server"
LIVEKIT_API_KEY="your-api-key"
LIVEKIT_API_SECRET="your-api-secret"

# Redis
REDIS_URL="redis://localhost:6379"

# APNs
APNS_KEY_ID="your-key-id"
APNS_TEAM_ID="your-team-id"
APNS_BUNDLE_ID="com.yourapp.bundle"
```

### ops-web

```
ops-web/
├── .env.example
├── .env.local                   # 로컬 개발 (gitignore)
└── .env.production              # 프로덕션 (gitignore)
```

**.env.example**:
```env
# API
NEXT_PUBLIC_API_URL="http://localhost:3000"

# LiveKit
NEXT_PUBLIC_LIVEKIT_URL="wss://your-livekit-server"
```

### ops-agent

```
ops-agent/
├── .env.example
├── .env.local                   # 로컬 개발 (gitignore)
└── config.yaml                  # 에이전트 설정
```

**.env.example**:
```env
# API
OPS_API_URL="http://localhost:3000"
OPS_API_KEY="your-api-key"

# LiveKit
LIVEKIT_URL="wss://your-livekit-server"
LIVEKIT_API_KEY="your-api-key"
LIVEKIT_API_SECRET="your-api-secret"

# AI Services
VLLM_URL="http://localhost:8000"
AI_SERVER_URL="http://localhost:8001"

# Redis
REDIS_URL="redis://localhost:6379"
```

---

## 5. Git 관련 파일

```
/home/ilim/ops-v2/
├── .gitignore
├── .gitattributes
└── .git/
    └── hooks/                   # Git hooks (optional)
        ├── pre-commit           # lint-staged
        └── commit-msg           # commitlint
```

### .gitignore 주요 항목

```gitignore
# Dependencies
node_modules/
__pycache__/
.venv/

# Build outputs
dist/
.next/
*.pyc

# Environment
.env
.env.local
.env.production

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Test
coverage/
.pytest_cache/

# Claude Code
.claude/settings.local.json
```

---

## 6. 계층적 CLAUDE.md 위치

```
/home/ilim/ops-v2/
├── CLAUDE.md                    # 프로젝트 공통 규칙
├── ops-api/CLAUDE.md            # NestJS 특화 규칙
├── ops-web/CLAUDE.md            # Next.js 특화 규칙
└── ops-agent/CLAUDE.md          # Python/LiveKit 특화 규칙
```

---

## 참조

- **Remake 계획**: `/home/ilim/ops/OPS_REMAKE_PLAN.md`
- **ops-api 구조**: Remake 문서 섹션 4
- **ops-web 구조**: Remake 문서 섹션 5
- **ops-agent 구조**: Remake 문서 섹션 6
- **인프라 구조**: Remake 문서 섹션 3
