# 글 콘텐츠 규칙 (`src/mdx/**`)

글을 추가·수정하거나 `post-utils` / `scripts/thumbnail-*` 를 건드릴 때 읽는다.

## 경로

```
src/mdx/{category}/{slug}/index.mdx   →   /blog/posts/{category}/{slug}
```

디렉토리명이 그대로 URL 세그먼트가 된다. `{category}` 는 카테고리 목록에도 그 이름으로 노출된다.

## Frontmatter

```yaml
---
title: "제목"
createdAt: 2026-04-04
description: 목록과 og:description 에 쓰이는 한 줄
thumbnail: /images/next/loading_vs_suspense/thumbnail.png   # 선택
tags: [Next.js, React]
---
```

| 필드 | 필수 | 규칙 |
|---|---|---|
| `title` | O | |
| `createdAt` | O | **`YYYY-MM-DD` 고정.** 목록 정렬이 문자열 비교라 형식이 어긋나면 순서가 깨진다 |
| `description` | O | |
| `tags` | O | 없으면 `[]` |
| `thumbnail` | X | 생략하면 아래 폴백 체인이 돈다 |

### 함정 두 가지

**1. YAML 은 `tags: [Blog, 2025]` 의 `2025` 를 숫자로 읽는다.**
타입 선언은 `string[]` 인데 실제 값이 `number` 라 `toLowerCase()` · `localeCompare()` 에서 터진다.
`normalizeFrontmatter` 가 파싱 경계에서 문자열로 맞추므로, **정규화를 거친 값만 쓴다.**
frontmatter 를 직접 파싱하는 코드를 새로 만들지 말 것.

**2. `createdAt` 은 문자열이지만 YAML 파서에 따라 `Date` 가 될 수 있다.**
현재 파서(`vfile-matter`)는 문자열을 준다. 파서를 바꾸면 이 전제가 깨진다.

## 썸네일 폴백 체인

`resolvePostThumbnail` 이 위에서부터 순서대로 고른다.

1. frontmatter 의 `thumbnail`
2. 본문의 첫 로컬 이미지 (`/images/` 로 시작, 코드블록 안은 제외)
3. `/images/{category}/{slug}/thumbnail.png` — 파일이 실제로 있을 때만
4. `/images/og_thumbnail.png`

**경로를 조립하지 말 것.** 확장자가 `.png` / `.jpg` / `.jpeg` 로 제각각이라,
`thumbnail.png` 를 하드코딩하면 일부 글에서 OG 이미지가 404 가 된다(실제로 5건 있었다).
항상 `frontmatter.thumbnail` 을 쓴다.

## 검증

```bash
yarn thumbnail:verify     # 30개 글의 썸네일이 실제로 열리는지 확인. prepush 에 포함됨
yarn thumbnail:generate   # 누락분 생성 (sharp)
```

새 글을 추가하면 `thumbnail:verify` 가 통과하는지 확인한다. 실패하면 frontmatter 경로를
고치거나 `thumbnail:generate` 로 폴백 이미지를 만든다.

## 목차

`##` 과 `###` 만 목차에 잡힌다(`getHeaderNavigationList`). `#` 은 글 제목용이라 무시된다.
앵커 id 는 `rehype-slug` 가 만들고, 목차 링크는 같은 규칙을 직접 구현해 맞춘다 —
제목에 특수문자·이모지를 많이 쓰면 두 규칙이 어긋날 수 있다.
