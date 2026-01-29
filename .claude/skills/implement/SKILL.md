# 구현 체크리스트

> 코드 구현 작업 시 자동 적용되는 체크리스트

## Ralph Loop 활용 (대규모 작업)

반복적 수정이 필요한 대규모 작업에는 Ralph Loop 사용:

```bash
# 빌드 성공까지 반복
/ralph-loop "ops-api 빌드 에러 수정. <promise>BUILD SUCCESS</promise> 출력" --max-iterations 15

# 타입 에러 전체 수정
/ralph-loop "any 타입을 적절한 타입으로 변경. <promise>NO ANY</promise>" --max-iterations 20

# console.log 제거
/ralph-loop "console.log를 Logger로 변경. <promise>NO CONSOLE</promise>" --max-iterations 10
```

**적합한 작업:**
- 빌드 에러 수정 (여러 파일)
- 대규모 리팩토링 (타입, 로깅 등)
- 테스트 통과까지 반복 수정

**부적합한 작업:**
- 신규 기능 구현 (설계 판단 필요)
- 1-2개 파일 수정
- 요구사항이 불명확한 작업

---

## 시작 전 (필수)
1. [ ] 관련 파일 먼저 Read (수정할 파일, 참조할 파일)
2. [ ] 기존 코드 패턴 확인 (유사 기능이 있는지)
3. [ ] 영향 범위 파악 (어떤 파일들이 변경되는지)

## 구현 중 (필수 규칙)

### ops-api (NestJS)
- [ ] Controller → Service 분리
- [ ] Logger 사용 (console.log 금지)
- [ ] DTO 변환 (Entity 직접 반환 금지)
- [ ] 타입 명시 (any 금지)

### ops-web (Next.js)
- [ ] App Router 사용 (pages/ 금지)
- [ ] Server/Client Component 구분
- [ ] 'use client' 필요시만 추가

### ops-agent (Python)
- [ ] logger 사용 (print 금지)
- [ ] async/await 사용 (동기 requests 금지)
- [ ] 타입 힌트 추가

## 완료 후 (필수)
1. [ ] 빌드 확인
   - API: `cd /home/ubuntu/ops/ops-api && npm run build`
   - Web: `cd /home/ubuntu/ops/ops-web && npm run build`
2. [ ] 변경사항 요약 (무엇을 왜 변경했는지)

## 참조 문서
- 아키텍처: `@.claude/docs/architecture.md`
- API 스펙: `@.claude/docs/api-spec.md`
- Agent 스펙: `@.claude/docs/agent-spec.md`
- DB 스키마: `@ops-api/prisma/schema.prisma`

## 주의사항
- 기존 패턴과 일관성 유지
- 불필요한 리팩토링 금지 (요청된 것만 변경)
- 새 파일 생성 시 기존 구조 따르기
