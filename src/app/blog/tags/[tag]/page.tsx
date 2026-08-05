import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import JsonLd from '@/components/common/JsonLd';
import TagLink from '@/components/common/TagLink';
import BlogPosts from '@/components/posts/BlogPosts';
import type { ListPageParams } from '@/types/page.types';
import { toPageNumber } from '@/utils/pagination';
import { countTags, getAllPosts, getAllPostsPath, getPostsByTag } from '@/utils/post-utils';
import { buildAlternates, buildBreadcrumbJsonLd } from '@/utils/seo';
import { parseViewType, VIEW_TYPE_COOKIE } from '@/utils/view-type';

interface Params extends ListPageParams {
	params: Promise<{ tag: string }>;
}

const loadTagPosts = async (rawTag: string) => {
	const tag = decodeURIComponent(rawTag);
	const allPosts = await getAllPosts(getAllPostsPath());

	return { tag, allPosts, posts: getPostsByTag(allPosts, tag) };
};

export const generateStaticParams = async () => {
	const posts = await getAllPosts(getAllPostsPath());

	return countTags(posts).map(({ label }) => ({ tag: label }));
};

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
	const { tag } = await params;
	const decodedTag = decodeURIComponent(tag);
	const title = `Ycow Blog - #${decodedTag}`;
	const description = `${decodedTag} 태그가 달린 글 목록`;

	return {
		title,
		description,
		alternates: buildAlternates(`/blog/tags/${encodeURIComponent(decodedTag)}`),
		openGraph: { type: 'website', title, description },
	};
};

const TagPage = async ({ params, searchParams }: Params) => {
	const { tag: rawTag } = await params;
	const { q, page } = await searchParams;
	const viewType = parseViewType((await cookies()).get(VIEW_TYPE_COOKIE)?.value);
	const { tag, allPosts, posts } = await loadTagPosts(rawTag);

	if (!posts.length) notFound();

	// 함께 자주 붙는 태그를 곁들여 다음 탐색 경로를 만든다.
	const relatedTags = countTags(posts)
		.filter(({ label }) => label.toLowerCase() !== tag.toLowerCase())
		.slice(0, 8);

	return (
		<section className="mx-auto max-w-6xl px-5 py-8 md:py-14">
			<JsonLd
				data={buildBreadcrumbJsonLd([
					{ name: '전체 글', path: '/blog/posts' },
					{ name: `#${tag}`, path: `/blog/tags/${encodeURIComponent(tag)}` },
				])}
			/>
			<header className="mb-5">
				<p className="text-sm text-muted-foreground">태그</p>
				<h2 className="mt-1 text-2xl font-bold tracking-tight text-destructive md:text-3xl">#{tag}</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					총 {posts.length}개의 글 · 전체 {allPosts.length}개 중
				</p>
			</header>
			{relatedTags.length ? (
				<nav aria-label="함께 쓰인 태그" className="-mx-5 mb-6 md:mx-0">
					<ul className="flex gap-2 overflow-x-auto px-5 pb-1 text-sm scrollbar-hide md:flex-wrap md:px-0">
						{relatedTags.map(({ label, count }) => (
							<li key={label} className="whitespace-nowrap rounded-full border border-border px-3 py-1.5">
								<TagLink tag={label} className="text-muted-foreground hover:text-destructive" />
								<span className="ml-1 text-xs text-muted-foreground">{count}</span>
							</li>
						))}
					</ul>
				</nav>
			) : null}
			<BlogPosts posts={posts} initialQuery={q ?? ''} initialPage={toPageNumber(page)} initialViewType={viewType} />
		</section>
	);
};

export default TagPage;
