# blog-next

<!--
레포 지시문의 단일 원천. `CLAUDE.md` 가 이 파일을 @import 한다. 수정은 항상 여기서.
글로벌 규칙(~/.agents/AGENTS.md)은 자동으로 함께 적용되므로 여기엔 프로젝트 고유 내용만 쓴다.
-->

## 무엇인가

MDX 로 글을 쓰는 개인 개발 블로그(ycow-dev.com). 글은 레포 안 `src/mdx/` 에 파일로 있고
DB·CMS 는 없다. 글 상세는 빌드 시 정적 생성하고, 목록·카테고리·태그 페이지는 검색어와
페이지 번호를 서버가 읽어야 해서 요청 시점에 렌더한다.

## Stack

Next.js 16 | React 19 | TypeScript 5 | Biome 2 | Yarn

## Architecture

- **Routing**: App Router (`src/app/`)
- **Content**: MDX (`src/mdx/{category}/{slug}/index.mdx`) — 규칙: `.agents/rules/mdx.md`
- **UI**: shadcn/ui (new-york), Tailwind CSS 3
- **Path alias**: `@/*` = `./src/*`

## Code Style

`biome.json` 이 단일 원천이다. `yarn lint` 가 자동 적용하므로 값을 여기 옮겨 적지 않는다.

## Commands

```bash
yarn dev            # 개발 서버 (Turbopack)
yarn build          # 프로덕션 빌드
yarn test           # 테스트 (vitest run)
yarn test:watch     # 테스트 워치 모드
yarn thumbnail:generate # 누락 썸네일 생성
yarn thumbnail:verify   # 썸네일 경로/이미지 검증
yarn prepush        # push 전 하네스
yarn lint           # biome check --fix .
yarn format         # biome format --fix .
```

## 검증

코드 변경 후 아래를 통과해야 완료로 본다.

```bash
yarn prepush   # tsc --noEmit → vitest run → thumbnail:verify → biome check .
```

`.githooks/pre-push` 가 push 전에 같은 것을 돌린다(활성화: `git config core.hooksPath .githooks`).
개별로 돌릴 때도 네 개를 모두 통과시킨다 — 썸네일 검증은 글을 추가·수정했을 때만 실패한다.

단일 테스트: `yarn vitest run src/utils/post-utils.test.ts`

## Test Convention

- **Runner**: Vitest (globals 활성화)
- **위치**: co-located (`foo.test.ts` next to `foo.ts`)
- **Hooks/Components**: `@testing-library/react`
- **Environment**: 기본 `node`, DOM 필요 시 `// @vitest-environment jsdom` pragma

## TDD Pipeline

```
/tdd-spec → ┌─ /tdd-red → /tdd-green ─┐ → /tdd-refactor → /tdd-verify → /commit
            └──── 슬라이스마다 반복 ◀──┘
```

`/tdd-cycle` 이 위 흐름을 한 번에 돈다. `/tdd-refactor` 와 `/tdd-verify` 는
슬라이스가 전부 끝난 뒤 마지막에 한 번만 돈다.

### 턴 규칙

- `/tdd-red`: `*.test.ts(x)` 파일만 생성/수정. 프로덕션 코드 절대 건드리지 않음
- `/tdd-green`: 프로덕션 코드만 수정. 테스트 파일 절대 건드리지 않음
- 산출물이 행동을 결정한다
