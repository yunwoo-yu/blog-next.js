import { existsSync, readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { globSync } from 'glob';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';

import type { CompileMdxTypes, HeadingTypes, PostListTypes } from '@/types/common.types';

const PATH = `${process.cwd()}/src/mdx`;
const DEFAULT_THUMBNAIL = '/images/og_thumbnail.png';

const LOCAL_IMAGE_PATTERN = /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i;

const isLocalImagePath = (value: string) => value.startsWith('/images/') && LOCAL_IMAGE_PATTERN.test(value);

const stripCodeBlocks = (source: string) => source.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '');

const hasPublicAsset = (publicPath: string) => existsSync(join(process.cwd(), 'public', publicPath.replace(/^\//, '')));

export const getGeneratedThumbnailPath = (category: string, slug: string) =>
	`/images/${category}/${slug}/thumbnail.png`;

export const extractFirstLocalImage = (source: string) => {
	const sourceWithoutCode = stripCodeBlocks(source);
	const markdownImages = [...sourceWithoutCode.matchAll(/!\[[^\]]*]\(\s*<?([^)\s>]+)>?(?:\s+['"][^'"]*['"])?\s*\)/g)];
	const htmlImages = [...sourceWithoutCode.matchAll(/<img\b[^>]*\bsrc=(['"])(.*?)\1[^>]*>/g)];

	return [
		...markdownImages.map(match => ({ index: match.index, src: match[1] })),
		...htmlImages.map(match => ({ index: match.index, src: match[2] })),
	]
		.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
		.find(image => isLocalImagePath(image.src))?.src;
};

export const resolvePostThumbnail = ({
	thumbnail,
	source,
	category,
	slug,
	exists = hasPublicAsset,
}: {
	thumbnail?: string;
	source: string;
	category: string;
	slug: string;
	exists?: (publicPath: string) => boolean;
}) => {
	const explicitThumbnail = thumbnail?.trim();

	if (explicitThumbnail) return explicitThumbnail;

	const firstImage = extractFirstLocalImage(source);

	if (firstImage) return firstImage;

	const generatedThumbnail = getGeneratedThumbnailPath(category, slug);

	return exists(generatedThumbnail) ? generatedThumbnail : DEFAULT_THUMBNAIL;
};

/**
 * 목록에는 frontmatter만 필요한데 compileMDX는 본문까지 전부 컴파일한다.
 * 목록 페이지가 요청마다 렌더되므로 next-mdx-remote가 내부적으로 쓰는 파서를 직접 불러 쓴다.
 * (같은 파서라 파싱 결과가 달라질 여지가 없다.)
 */
const parseFrontmatter = (source: string, context?: { category: string; slug: string }) => {
	const file = new VFile(source);

	matter(file);

	const frontmatter = normalizeFrontmatter((file.data.matter ?? {}) as CompileMdxTypes);

	if (!context) return frontmatter;

	return {
		...frontmatter,
		thumbnail: resolvePostThumbnail({ thumbnail: frontmatter.thumbnail, source, ...context }),
	};
};

/** 배포된 환경에서 mdx 파일은 바뀌지 않는다. 개발 중에는 수정이 바로 보이도록 캐시하지 않는다. */
const frontmatterCache = process.env.NODE_ENV === 'production' ? new Map<string, CompileMdxTypes>() : null;

const readFrontmatter = (postPath: string, context: { category: string; slug: string }) => {
	const cached = frontmatterCache?.get(postPath);

	if (cached) return cached;

	const parsed = parseFrontmatter(readFileSync(postPath, 'utf-8'), context);

	frontmatterCache?.set(postPath, parsed);

	return parsed;
};

/**
 * YAML은 `tags: [Blog, 2025]`의 2025를 숫자로 읽는다. 타입 선언은 string[]이라
 * 그대로 두면 toLowerCase/localeCompare 같은 문자열 연산에서 터진다. 파싱 경계에서 맞춰 둔다.
 */
export const normalizeFrontmatter = (frontmatter: CompileMdxTypes): CompileMdxTypes => ({
	...frontmatter,
	thumbnail: frontmatter.thumbnail ?? '',
	tags: (frontmatter.tags ?? []).map(String),
});

export const getAllPostsPath = (category?: string) => {
	return globSync(`${PATH}/${category ? category : '**'}/**/*.mdx`);
};

export const getPostDetail = async (category: string, slug: string) => {
	// join 이 ../ 를 정리하므로, 정리된 결과가 mdx 루트 안에 있는지까지 확인한다.
	const postPath = join(PATH, category, slug, 'index.mdx');

	// 없는 주소에서 readFileSync 가 그대로 던지면 404 가 아니라 500 이 된다.
	// 호출부가 notFound() 로 넘길 수 있게 null 을 돌려준다.
	if (!postPath.startsWith(`${PATH}/`) || !existsSync(postPath)) return null;

	const source = readFileSync(postPath, 'utf-8');
	const deleteFrontmatterSource = source.replace(/---[\s\S]*?---/, '');

	return { source: deleteFrontmatterSource, frontmatter: parseFrontmatter(source, { category, slug }) };
};

export const getAllPosts = async (postPaths: string[]): Promise<PostListTypes[]> => {
	const posts = postPaths.map(postPath => {
		const [category, slug] = postPath.split('/').slice(-3);

		return { frontmatter: readFrontmatter(postPath, { category, slug }), category, slug };
	});

	return posts.sort((a, b) => (a.frontmatter.createdAt > b.frontmatter.createdAt ? -1 : 1));
};

export const getCategoryList = async () => {
	const dirCategory = await readdir(PATH, { withFileTypes: true });
	let allCount = 0;

	const categoryNameList = dirCategory.map(category => {
		const postLength = getAllPostsPath(category.name).length;

		allCount += postLength;

		return { label: category.name, count: postLength };
	});

	return { categoryNameList, allCount };
};

/** 태그별 글 수를 세어 많은 순, 같으면 이름 순으로 정렬한다. */
export const countTags = (posts: PostListTypes[]) => {
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.frontmatter.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return [...counts.entries()]
		.map(([label, count]) => ({ label, count }))
		.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
};

/** 태그는 대소문자를 구분하지 않고 매칭한다. URL로 오갈 때 표기가 흔들리기 때문이다. */
export const getPostsByTag = (posts: PostListTypes[], tag: string) => {
	const target = tag.toLowerCase();

	return posts.filter(post => post.frontmatter.tags.some(postTag => postTag.toLowerCase() === target));
};

/**
 * 최신순으로 정렬된 목록에서 현재 글의 앞뒤 글을 찾는다.
 * 목록이 최신순이므로 인덱스가 클수록 오래된 글이다.
 */
export const getAdjacentPosts = (posts: PostListTypes[], category: string, slug: string) => {
	const currentIndex = posts.findIndex(post => post.category === category && post.slug === slug);

	if (currentIndex === -1) return { older: null, newer: null };

	return {
		older: posts[currentIndex + 1] ?? null,
		newer: posts[currentIndex - 1] ?? null,
	};
};

/** 한국어 기준 분당 500자로 읽기 시간을 추정한다. 코드 블록과 마크다운 문법은 제외한다. */
export const getReadingTime = (source: string) => {
	const CHARS_PER_MINUTE = 500;

	const plainText = source
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`[^`]*`/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[#*_~>|-]/g, '')
		.replace(/\s+/g, '');

	return Math.max(1, Math.ceil(plainText.length / CHARS_PER_MINUTE));
};

export const getHeaderNavigationList = (source: string) => {
	const regex = /^(##|###) (.*$)/gim;
	const headingList = source.match(regex);
	const result: HeadingTypes[] = [];
	let currentSection: null | HeadingTypes = null;

	const parseHref = (text: string) => {
		return text
			.replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
			.replace(/\p{Emoji_Presentation}/gu, '')
			.replace(/[[\]:!@#$/%^&*()+=,.]/g, '')
			.replace(/ /g, '-')
			.replace(/\?/g, '')
			.toLowerCase();
	};

	headingList?.forEach(heading => {
		if (heading.startsWith('## ')) {
			const textH2 = heading.replace('## ', '');

			currentSection = {
				text: textH2,
				href: `#${parseHref(textH2)}`,
				children: [],
			};

			result.push(currentSection);
		}

		if (heading.startsWith('### ')) {
			const textH3 = heading.replace('### ', '');

			if (currentSection?.children) {
				currentSection.children.push({
					text: textH3,
					href: `#${parseHref(textH3)}`,
				});
			} else {
				result.push({
					text: textH3,
					href: `#${parseHref(textH3)}`,
				});
			}
		}
	});

	return result;
};
