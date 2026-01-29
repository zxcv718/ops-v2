---
name: livekit-help
description: LiveKit 문서 검색 및 솔루션 제공. "LiveKit 에러", "영상 품질", "Agent 구현", "SIP 연동" 등 LiveKit 관련 질문에 사용
allowed-tools: Read, Grep, Glob
---

# LiveKit 문서 참조 도우미

> **목적:** `livekit_docs/` 지식 베이스에서 관련 문서를 찾아 솔루션 제공

## 📖 문서 우선순위 체계

```
1. 🚨 knowledge_guidance.md (오해/오류 방지) - 항상 최우선 확인
   ↓
2. 📚 knowledge_base/*.md (공식 KB 문서)
   ↓
3. 💻 livekit-examples/ (실제 동작 코드)
   ↓
4. 🔧 livekit/ (소스 코드)
   ↓
5. 📄 doc/full-llm.txt (전체 문서)
```

## 1단계: 질문 분류

사용자 질문을 다음 카테고리로 분류:

| 카테고리 | 키워드 예시 | 주요 참조 경로 |
|---------|-----------|-------------|
| **에러/경고** | 에러, 오류, 경고, 실패, 안됨 | `knowledge_guidance.md` → `knowledge_base/` |
| **Agent 구현** | Agent, 음성, STT, TTS, 대화 | `livekit-examples/agent-*` → `knowledge_base/` |
| **영상통화 품질** | 품질, 화질, 끊김, 지연, 네트워크 | `knowledge_base/configuring_*`, `managing_*` |
| **SIP 통합** | SIP, 전화, 통화 | `knowledge_base/creating_sip_*` |
| **전사/번역** | 전사, 자막, 번역, transcript | `knowledge_base/how_to_capture_*` |
| **음성 감지** | 침묵, 발화, 감지, 인터럽션 | `knowledge_base/how_to_detect_*` |
| **연결 이슈** | 연결, connection, 네트워크 | `knowledge_base/diagnosing_*` |
| **iOS 구현** | iOS, Swift, 아이폰 | `livekit/client-sdk-swift/` → `livekit-examples/` |
| **가격/비용** | 가격, 비용, 요금 | `knowledge_base/understanding_and_estimating_pricing_*` |
| **배포** | 배포, deploy, AWS, Fargate | `knowledge_guidance.md` → `livekit-examples/agent-deployment/` |

## 2단계: 우선순위 문서 확인

### A. knowledge_guidance.md 최우선 확인

**항상 먼저 확인:**
```bash
# knowledge_guidance.md에서 키워드 검색
grep -i "<키워드>" livekit_docs/knowledge_guidance.md
```

**주요 확인 항목:**
- PyTorch 경고
- SSL 인증 오류
- BVC 관련
- AWS Fargate 경고
- Render.com 제약
- 세션 유지 방법

### B. knowledge_base/ 검색

```bash
# 파일명으로 검색
ls livekit_docs/knowledge_base/ | grep -i "<키워드>"

# 내용으로 검색 (파일명 반환)
grep -l -i "<키워드>" livekit_docs/knowledge_base/*.md

# 내용 직접 검색
grep -i "<키워드>" livekit_docs/knowledge_base/*.md
```

**주요 문서 카테고리:**
- `understanding_*`: 개념 설명
- `how_to_*`: 구현 가이드
- `creating_*`: 설정 가이드
- `diagnosing_*`: 디버깅
- `resolving_*`: 문제 해결

### C. livekit-examples/ 예제 검색

```bash
# iOS/Swift 예제
ls livekit_docs/livekit-examples/ | grep -i "swift\|ios\|flutter"

# Agent 예제
ls livekit_docs/livekit-examples/ | grep -i "agent"

# 특정 예제 확인
ls livekit_docs/livekit-examples/agent-starter-python/
```

**주요 예제:**
- `agent-starter-python/`: Python Agent 시작
- `agent-starter-swift/`: Swift/iOS Agent
- `agent-starter-node/`: Node.js Agent
- `voice-agent-workshop/`: Voice Agent 워크샵
- `livekit-sip-example/`: SIP 연동

## 3단계: 문서 읽기 및 솔루션 제공

### 관련 문서 찾았을 때:

1. **문서 읽기:**
   ```bash
   # 전체 읽기
   cat livekit_docs/knowledge_base/<파일명>.md

   # 특정 섹션 검색
   grep -A 10 -B 2 -i "<키워드>" livekit_docs/knowledge_base/<파일명>.md
   ```

2. **요약 제공:**
   - 문제 원인 설명
   - 해결 방법 (단계별)
   - 코드 예시 (있는 경우)
   - 주의사항

3. **추가 참조 제안:**
   - 관련 예제 코드 경로
   - 공식 문서 링크
   - 비슷한 문제 해결 문서

### 문서를 못 찾았을 때:

1. **대안 제시:**
   - 유사한 키워드로 재검색
   - 상위 카테고리 문서 제안
   - 공식 문서 링크 (https://docs.livekit.io)

2. **일반적인 해결책:**
   - LiveKit Slack 커뮤니티
   - GitHub Issues
   - 공식 지원 채널

## 4단계: iOS 프로젝트 적용 가이드

**Damso 프로젝트 컨텍스트:**
- MVVM 아키텍처
- Protocol 기반 설계
- Swift 5.9+
- LiveKitService 프로토콜 사용

**적용 시 주의사항:**
1. Protocol 먼저 정의
2. Service 레이어에 구현
3. ViewModel에서 사용
4. View는 ViewModel만 참조

## 출력 형식

### 📋 검색 결과 보고

```markdown
## LiveKit 문서 검색 결과

**질문:** [사용자 질문 요약]
**카테고리:** [분류된 카테고리]

### 🎯 관련 문서

1. **[문서 제목]** (`경로/파일명.md`)
   - 요약: [핵심 내용]
   - 솔루션: [해결 방법]

2. **[추가 문서]**
   - ...

### 💡 해결 방법

[단계별 가이드]

### 📝 코드 예시 (있는 경우)

[예제 코드]

### 🔗 추가 참조

- 예제 코드: `livekit_docs/livekit-examples/...`
- 공식 문서: https://docs.livekit.io/...
```

## ⚠️ 중요 체크리스트

- [ ] knowledge_guidance.md를 먼저 확인했는가?
- [ ] 관련 knowledge_base 문서를 찾았는가?
- [ ] 예제 코드가 있는 경우 경로를 제공했는가?
- [ ] Damso 프로젝트 아키텍처에 맞게 적용 가이드를 제공했는가?
- [ ] 추가 참조 자료를 안내했는가?

## 📞 추가 지원 안내

문서로 해결되지 않는 경우:
- **Slack**: `knowledge_base/slack_etiquette.md` 참조
- **질문 방법**: `knowledge_base/still_have_questions.md`
- **Agent 도움**: `knowledge_base/how_to_get_help_from_livekit_with_agents.md`
