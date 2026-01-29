---
name: start-work
description: 이슈 기반 작업 시작. "이슈 작업 시작", "새 기능 구현 시작", "브랜치 만들어줘", "#8 작업 시작" 등의 요청에 사용
allowed-tools: Read, Bash(git:*), Bash(gh:*), Glob, Grep
---

# Start Work - 이슈 작업 시작

> **참고:** 브랜치 전략은 `CLAUDE.md`를 따릅니다.
> **언어:** 모든 결과는 **한글**로 보고합니다.

## 0. 현재 상태 확인

```bash
git status
git branch --show-current
```

**변경사항이 있는 경우**: 먼저 커밋하거나 stash 할 것을 안내 후 **중단**

## 1. 이슈 목록 조회 (인자 없이 실행 시)

```bash
gh issue list --state open --json number,title,labels --limit 20
```

**출력 형식**:
```
열린 이슈 목록:
#8  [Feature] 사용자 모델 정의
#9  [Feature] 카카오 로그인
...
```

## 2. 이슈 상세 조회 (이슈 번호 있을 때)

```bash
gh issue view $ISSUE_NUM --json number,title,body,labels
```

## 3. 브랜치 생성

```bash
git checkout dev
git pull origin dev
git checkout -b feature/${ISSUE_NUM}-<short-description>
```

**브랜치 네이밍 규칙**:
- Feature: `feature/{issue-number}-{short-desc}`
- Bug fix: `fix/{issue-number}-{short-desc}`
- Hotfix: `hotfix/{short-desc}`

## 4. 작업 컨텍스트 로드

이슈 본문 분석:
1. **구현 범위**: 어떤 파일/기능을 만들어야 하는지
2. **의존성**: 이전 이슈에서 만든 것 중 필요한 것
3. **테스트 요구사항**: 어떤 테스트가 필요한지

## 5. 최종 보고

| 항목 | 값 |
|------|-----|
| 이슈 번호 | `#${ISSUE_NUM}` |
| 이슈 제목 | `<title>` |
| 생성된 브랜치 | `feature/${ISSUE_NUM}-<desc>` |
| Base 브랜치 | `dev` |
| 다음 단계 | 구현 시작 |
