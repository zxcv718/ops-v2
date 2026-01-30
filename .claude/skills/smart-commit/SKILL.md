---
name: smart-commit
description: 커밋, 푸시, PR 생성/업데이트. "커밋해줘", "변경사항 올려줘", "PR 만들어줘", "push 해줘" 등의 요청에 사용
allowed-tools: Read, Bash(git:*), Bash(gh:*)
---

# Smart Commit & PR

> **참고:** 커밋 컨벤션은 `CLAUDE.md`를 따릅니다.
> **언어:** 모든 결과 보고 및 PR 본문은 **한글**로 작성합니다.

## 사전 검증 옵션

### 커밋 전 코드 리뷰 (권장)

`--review` 플래그와 함께 사용 시 커밋 전 자동 리뷰:

```bash
/smart-commit --review   # 리뷰 후 커밋
/smart-commit            # 바로 커밋 (기본)
```

**--review 플래그 사용 시 흐름:**

```
1. 변경사항 분석 (git diff)
      ↓
2. /code-review 스킬 호출 ← 반드시 Skill 도구로 호출
      ↓
3. 리뷰 결과 확인
   ├── 치명적 이슈 있음 → 커밋 중단, 수정 권고
   └── 치명적 이슈 없음 → 4단계로 진행
      ↓
4. 커밋 진행
```

> **중요**: `--review` 플래그 사용 시 반드시 `Skill` 도구로 `/code-review`를 호출해야 합니다.
> 치명적 이슈가 1건이라도 있으면 커밋을 중단하고 사용자에게 수정을 권고합니다.

---

## 0. 브랜치 전략 준수 확인 (필수!)

**직접 push 금지 브랜치**: `main`, `dev`

| 현재 브랜치 | push 가능? | 조치 |
|------------|-----------|------|
| `main` | 금지 | "main에 직접 push할 수 없습니다. feature 브랜치를 생성하세요." 안내 후 중단 |
| `dev` | 금지 | "dev에 직접 push할 수 없습니다. feature 브랜치를 생성하세요." 안내 후 중단 |
| `feature/*`, `fix/*`, `hotfix/*` | 허용 | 계속 진행 |

## 1. 현재 상태 및 변경사항 확인

```bash
git status
git diff --stat
git diff --staged --stat
```

- 변경사항이 없으면 "커밋할 내용이 없습니다" 안내 후 4단계로 건너뛰기

## 2. 스테이징 및 커밋

**변경사항이 있는 경우에만 실행**:

```bash
git add .
git commit -m "<type>(<scope>): <한글 설명>"
```

**커밋 메시지 규칙**:
- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `docs`: 문서 변경
- `chore`: 설정/빌드 변경

**금지 사항**:
- 커밋 메시지에 AI/Claude 관련 문구 포함 금지

## 3. Rebase (필수!)

> 🔴 **push 전에 반드시 origin/dev 최신 변경사항을 rebase**

```bash
git fetch origin dev
git rebase origin/dev
```

- rebase 충돌 발생 시: 충돌 해결 후 `git rebase --continue`
- rebase 실패 시: 사용자에게 상황 보고 후 중단

## 4. Push

```bash
git push origin $CURRENT_BRANCH
```

- rebase 후 force push 필요 시: `git push origin $CURRENT_BRANCH --force`

## 5. Target Branch 결정

> ⚠️ **중요**: 이 프로젝트의 모든 PR은 **`dev`** 브랜치로 생성합니다.

| 현재 브랜치 패턴 | Target Branch |
|----------------|---------------|
| `feature/*` | **`dev`** |
| `fix/*` | **`dev`** |
| `hotfix/*` | **`dev`** |
| 기타 | **`dev`** |

🔴 **main 브랜치로 PR 생성 금지** - dev → main 머지는 릴리즈 담당자만 수행

## 6. PR 존재 여부 확인

```bash
PR_URL=$(gh pr view --json url,state --jq 'select(.state == "OPEN") | .url' 2>/dev/null || echo "")
```

- URL 있음 → PR 업데이트
- 비어있음 → PR 신규 생성

## 6-A. PR 신규 생성

1. 브랜치명에서 이슈 번호 추출
2. PR 본문 작성 (한글)
3. `gh pr create --base dev`

## 6-B. 기존 PR 업데이트

1. 변경 내역 분석
2. `gh pr edit` 로 본문 업데이트

## 7. 최종 보고

| 항목 | 값 |
|------|-----|
| 브랜치 | `$CURRENT_BRANCH` |
| 커밋 | O / X |
| Rebase | O / X (origin/dev 기준) |
| PR 상태 | 신규 생성 / 업데이트 / 변경없음 |
| PR URL | `<URL>` |
