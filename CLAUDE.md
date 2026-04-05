# blog-next

## Stack

Next.js 16 | React 19 | TypeScript 5 | Biome 2 | Yarn

## Architecture

- **Routing**: App Router (`src/app/`)
- **Content**: MDX (`src/mdx/{category}/{slug}/index.mdx`)
- **UI**: shadcn/ui (new-york), Tailwind CSS 3
- **Path alias**: `@/*` = `./src/*`

## Code Style (Biome)

- 탭 인덴트, 싱글쿼트, 세미콜론 always
- `arrowParentheses: asNeeded`, 줄폭 120
- biome 제외: `src/utils/utils.ts`, `src/components/ui`

## Commands

```bash
yarn dev            # 개발 서버 (Turbopack)
yarn build          # 프로덕션 빌드
yarn test           # 테스트 (vitest run)
yarn test:watch     # 테스트 워치 모드
yarn lint           # biome check --fix .
yarn format         # biome format --fix .
```

## TDD Pipeline

```
/spec → /red → /green ↔ /verify → /refactor → /verify → /commit
```

### 턴 규칙

- `/red`: `*.test.ts(x)` 파일만 생성/수정. 프로덕션 코드 절대 건드리지 않음
- `/green`: 프로덕션 코드만 수정. 테스트 파일 절대 건드리지 않음
- 산출물이 행동을 결정한다

### Verification Gates (`/verify`)

1. `tsc --noEmit`
2. `vitest run`
3. `biome check .`

세 게이트 모두 통과해야 다음 단계 진행.

## Test Convention

- **Runner**: Vitest (globals 활성화)
- **위치**: co-located (`foo.test.ts` next to `foo.ts`)
- **Hooks/Components**: `@testing-library/react`
- **Environment**: 기본 `node`, DOM 필요 시 `// @vitest-environment jsdom` pragma
