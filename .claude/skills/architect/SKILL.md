---
name: architect
description: 아키텍처 설계, 인터페이스 정의, 로직 구축. ops-api, ops-agent 백엔드 구현 시 사용.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Architect (설계자)

> **역할**: 아키텍처 설계, 인터페이스 정의, 로직 구축
> **참조**: `@.agent/workflows/architect.md`, `@.claude/skills/implement/SKILL.md`

---

## 담당 영역

| 저장소 | 기술 | 주요 작업 |
|--------|------|----------|
| ops-api | NestJS + Prisma | Service/Controller, DTO, Repository |
| ops-agent | Python + LiveKit | Agent 로직, Handler, Service |

---

## ops-api 설계 패턴

### 레이어 구조
```
Controller → Service → Repository/DbService
     ↓          ↓           ↓
   DTO      비즈니스로직   Prisma
```

### 필수 규칙
- [ ] Controller에서 비즈니스 로직 금지
- [ ] Service에서 Logger 사용 (`console.log` 금지)
- [ ] Entity 직접 반환 금지 → DTO 변환 필수
- [ ] `any` 타입 금지

### 코드 템플릿

```typescript
// Controller
@Controller('v1/example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ExampleDto> {
    return this.exampleService.findById(id);
  }
}

// Service
@Injectable()
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name);

  async findById(id: string): Promise<ExampleDto> {
    this.logger.log(`findById id=${id}`);
    const entity = await this.dbService.findById(id);
    if (!entity) throw new NotFoundException();
    return this.toDto(entity);
  }
}
```

---

## ops-agent 설계 패턴

### 디렉토리 구조
```
ops-agent/agent/
├── agent.py           # 엔트리포인트
├── handlers/          # 이벤트 핸들러
├── personality/       # Agent 성격 정의
└── services/          # 외부 서비스 클라이언트
```

### 필수 규칙
- [ ] `logger` 사용 (`print` 금지)
- [ ] `async/await` 사용 (동기 `requests` 금지)
- [ ] 타입 힌트 추가

### 코드 템플릿

```python
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class ExampleHandler:
    async def handle(self, data: dict) -> Optional[str]:
        logger.info(f"Processing data={data}")
        result = await self._process(data)
        return result
```

---

## 완료 후 필수 작업

1. 빌드 확인
   - API: `cd /home/ubuntu/ops/ops-api && npm run build`
   - Agent 재시작: `./scripts/dev.sh`

2. `/auditor` 호출하여 검증

---

## 문서 참조

- 아키텍처: `@.claude/docs/architecture.md`
- API 스펙: `@.claude/docs/api-db-spec.md`
- Agent 스펙: `@.claude/docs/agent-spec.md`
- DB 스키마: `@ops-api/prisma/schema.prisma`
