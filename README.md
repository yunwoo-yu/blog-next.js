# blog-next

프론트엔드 개발자 유윤우의 개인 블로그. → **[ycow-dev.com](https://www.ycow-dev.com)**

글은 DB나 CMS 없이 레포 안에 MDX 파일로 들어 있습니다. 글을 쓰는 일이 곧 커밋이고, 푸시하면 배포됩니다.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 3 · MDX · Biome 2 · Vitest

## 시작하기

```bash
yarn install
yarn dev
```

http://localhost:3000 에서 확인할 수 있습니다. `/` 는 글 목록으로 리다이렉트됩니다.

## 글 쓰기

`src/mdx/{카테고리}/{슬러그}/index.mdx` 를 만들면 끝입니다. 디렉토리 이름이 그대로 URL이 됩니다.

```
src/mdx/cs/heap_sort/index.mdx   →   /blog/posts/cs/heap_sort
```

```yaml
---
title: "Heap Sort (힙 정렬)"
createdAt: 2025-02-12
description: 목록과 공유 미리보기에 쓰이는 한 줄
tags: [Algorithm, Sort]
---
```

- `createdAt` 은 `YYYY-MM-DD` 고정입니다. 목록 정렬이 문자열 비교라 형식이 어긋나면 순서가 깨집니다.
- `thumbnail` 은 선택입니다. 생략하면 본문 첫 이미지 → 생성된 썸네일 → 기본 이미지 순으로 채워집니다.

썸네일이 없으면 만들고 검증합니다.

```bash
yarn thumbnail:generate   # 누락분을 제목·설명으로 그려 만든다 (sharp)
yarn thumbnail:verify     # 모든 글의 썸네일이 실제로 열리는지 확인
```

더 자세한 규칙은 [`.agents/rules/mdx.md`](.agents/rules/mdx.md) 에 있습니다.

## 렌더링 방식

글마다 성격이 달라 렌더 방식을 나눠 두었습니다.

| 경로 | 방식 | 이유 |
|---|---|---|
| `/blog/posts/[category]/[slug]` | 정적 생성 | 내용이 빌드 시점에 정해진다 |
| `/blog/posts`, `/blog/posts/[category]`, `/blog/tags/[tag]` | 동적 렌더 | 검색어·페이지 번호를 서버가 읽어야 한다 |
| `/resume`, `/privacy`, `/feed.xml`, `/sitemap.xml` | 정적 생성 | |

목록 페이지를 정적으로 두면 빌드 때 만든 1페이지 HTML이 `?page=2` 요청에도 그대로 나가서, 화면이 한 번 그려졌다가 바뀝니다. 서버가 쿼리스트링을 읽도록 동적 렌더로 두었습니다.

목록에는 frontmatter만 필요하므로 본문까지 컴파일하지 않고 `vfile-matter` 로 앞부분만 읽습니다.

## 구조

```
src/
├── app/                    App Router
│   ├── blog/posts/         글 목록·카테고리·상세
│   ├── blog/tags/          태그별 목록
│   └── feed.xml/           RSS
├── components/
│   ├── common/             헤더·푸터·테마·JSON-LD
│   ├── posts/              목록, 검색, 페이지네이션
│   └── postDetail/         목차, 진행 바, 이전·다음 글
├── hooks/                  목록 상태(검색·페이지·무한 스크롤)
├── utils/                  글 파싱, 검색, 페이징, SEO
└── mdx/                    글 (35편 / 6개 카테고리)

scripts/                    썸네일 생성·검증
.agents/rules/              경로별 상세 규칙
```

## 검증

변경 후 아래를 통과해야 합니다.

```bash
yarn prepush   # tsc --noEmit → vitest run → thumbnail:verify → biome check .
```

`.githooks/pre-push` 가 push 전에 같은 것을 돌립니다. 처음 클론했다면 한 번 켜 주세요.

```bash
git config core.hooksPath .githooks
```

## 명령어

```bash
yarn dev            # 개발 서버 (Turbopack)
yarn build          # 프로덕션 빌드
yarn start          # 빌드 결과 실행
yarn test           # 테스트
yarn test:watch     # 테스트 워치
yarn lint           # biome check --fix .
yarn format         # biome format --fix .
```

## 배포

Vercel에 연결되어 있어 `main` 에 푸시하면 배포됩니다.

---

에이전트(Claude Code, Codex 등)로 작업할 때의 지시문은 [`AGENTS.md`](AGENTS.md) 에 있습니다.
