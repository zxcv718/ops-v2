# ops-agent 규칙

> **기술 스택**: Python 3.11+ + LiveKit Agents SDK
> **상세 문서**: `/home/ilim/ops/OPS_REMAKE_PLAN.md` 섹션 6

---

## 필수 패턴

### SOLID 기반 아키텍처
```
handlers/    → domain/      → adapters/   → core/
(진입점)      (핵심 로직)     (외부 연동)    (설정)
```

### 코드 규칙
- Type hints 필수 (함수 시그니처, 변수)
- Protocol 사용하여 인터페이스 정의 (DIP)
- Strategy 패턴으로 Alert Handler 확장 (OCP)
- `logging` 모듈 사용 (`print` 금지)
- 비동기 함수는 `async/await` 일관성 유지

### Alert Handler (OCP)
```python
# 새 Alert 타입 추가 = 새 Handler 클래스 + registry.register()
# 기존 코드 수정 불필요
registry.register(NewAlertHandler())
```

---

## NOT TO DO

- `print()` 사용 (`logging` 대신)
- Type hints 생략
- Fire-and-forget 비동기 호출 (`await` 없이 코루틴 호출)
- 빈 `except` 블록 (에러 무시)
- 하드코딩된 설정값 (`core/config.py` 사용)
- `handlers/`에서 외부 API 직접 호출 (`adapters/` 통해)
- Protocol 없이 외부 서비스 의존

---

## 디렉토리 구조

```
agent/
├── handlers/                  # Presentation Layer
│   ├── voice_handler.py       # 음성 이벤트
│   ├── data_handler.py        # DataChannel
│   └── lifecycle_handler.py   # 연결/종료
│
├── domain/                    # Domain Layer
│   ├── alerts/                # Alert Strategy
│   │   ├── base.py           # AlertHandler ABC
│   │   ├── device_fall.py
│   │   ├── person_fall.py
│   │   ├── loud_voice.py
│   │   ├── emotion.py
│   │   └── registry.py
│   ├── conversation/
│   │   └── manager.py
│   └── interfaces/           # Port (Protocol)
│       ├── llm_client.py
│       ├── api_client.py
│       ├── tts_client.py
│       └── stt_client.py
│
├── adapters/                  # Infrastructure Layer
│   ├── vllm_client.py        # implements LLMClient
│   ├── ops_api_client.py     # implements APIClient
│   ├── ai_server_tts.py      # implements TTSClient
│   └── faster_whisper.py     # implements STTClient
│
├── core/                      # Shared
│   ├── config.py
│   ├── logger.py
│   └── di.py                 # DI 설정
│
└── main.py                   # 진입점
```

---

## Protocol 예시 (DIP)

```python
# domain/interfaces/llm_client.py
from typing import Protocol, AsyncIterator

class LLMClient(Protocol):
    async def generate(self, prompt: str) -> str: ...
    async def stream(self, prompt: str) -> AsyncIterator[str]: ...

# adapters/vllm_client.py
class VLLMClient:  # implements LLMClient
    async def generate(self, prompt: str) -> str:
        ...
```

---

## 테스트 구조

```
tests/
├── conftest.py               # Fixtures
├── unit/
│   ├── test_temporal_parser.py
│   ├── test_rag_client.py
│   ├── test_care_alert.py
│   └── test_keyword_detector.py
├── integration/
│   ├── test_livekit_integration.py
│   └── test_redis_pubsub.py
└── fixtures/
    ├── sample_transcripts.py
    └── mock_responses.py
```

---

## 명령어

```bash
python -m pytest               # 테스트
python -m pytest --cov         # 커버리지
python -m mypy agent/          # 타입 체크
python main.py                 # 실행
```

---

## 품질 기준

- mypy strict mode 통과
- pytest 커버리지 80% 이상
- `print()` 0개
- Fire-and-forget 비동기 호출 0개
