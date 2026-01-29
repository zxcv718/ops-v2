---
description: 개발 환경 Docker 관리. 코드 수정 후 빠른 반영, 캐시 정리 필요 시 사용.
---

# Dev Workflow (개발 환경 관리)

> **목적**: Docker 컨테이너 효율적 관리, 빌드 시간 최소화

---

## 💡 빠른 참조

| 상황 | 명령어 | 예상 시간 |
|------|--------|----------|
| 코드만 수정 | `./scripts/smart-dev.sh --restart` | ~10초 |
| 패키지 수정 | `./scripts/smart-dev.sh --packages` | ~2분 |
| 전체 재빌드 | `./scripts/smart-dev.sh --rebuild` | ~5분 |
| 디스크 정리 | `./scripts/docker-cache-clean.sh` | ~30초 |

---

## Smart Dev Script

### 자동 감지 모드 (권장)
```bash
./scripts/smart-dev.sh
```
- Dockerfile 변경 → 전체 재빌드
- requirements.txt 변경 → 증분 패키지 설치
- 코드만 변경 → 컨테이너 재시작

### 명시적 모드
```bash
# 코드 변경만 (빠름)
./scripts/smart-dev.sh --restart

# 패키지 업데이트
./scripts/smart-dev.sh --packages

# 전체 재빌드 (캐시 사용)
./scripts/smart-dev.sh --rebuild

# 전체 재빌드 (캐시 무시)
./scripts/smart-dev.sh --force

# 상태 확인
./scripts/smart-dev.sh --status
```

### 타겟 지정
```bash
./scripts/smart-dev.sh --agent --restart  # agent만
./scripts/smart-dev.sh --api --restart    # api만
```

---

## Docker Cache Clean

### 자동 정리
```bash
./scripts/docker-cache-clean.sh
```
디스크 사용률 기반 자동 레벨 결정:
- 80% 미만: 정리 불필요
- 80-90%: Level 1 (기본)
- 90-95%: Level 2 (중간)
- 95%+: Level 3 (전체)

### 레벨별 정리
```bash
# Level 1: 중지된 컨테이너, dangling 이미지
./scripts/docker-cache-clean.sh --level 1

# Level 2: + 미사용 이미지 (24시간 이상)
./scripts/docker-cache-clean.sh --level 2

# Level 3: + 빌더 캐시, 네트워크
./scripts/docker-cache-clean.sh --level 3
```

### 목표 용량 확보
```bash
# 5GB 확보 목표
./scripts/docker-cache-clean.sh --target 5G
```

### 미리보기
```bash
./scripts/docker-cache-clean.sh --dry-run
```

---

## 일반적인 시나리오

### 1. 코드 수정 후 테스트
```bash
# 가장 빠른 방법
./scripts/smart-dev.sh --restart
```

### 2. 새 패키지 추가 후
```bash
# requirements.txt 수정 후
./scripts/smart-dev.sh --packages
```

### 3. 디스크 부족 경고 시
```bash
# 먼저 상황 파악
./scripts/docker-cache-clean.sh --dry-run

# 정리 실행
./scripts/docker-cache-clean.sh --target 5G
```

### 4. 완전히 새로 시작
```bash
# 캐시 정리 후 재빌드
./scripts/docker-cache-clean.sh --force
./scripts/smart-dev.sh --force
```

---

## 주의사항

- `--force` 정리 시 DB 볼륨은 보존됨
- 증분 패키지 설치는 실행 중인 컨테이너에서만 동작
- 자동 감지는 `.dev-cache/` 디렉토리에 해시 저장
