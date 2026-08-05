import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import CategoryHorizontalList from '@/components/common/CategoryHorizontalList';
import CategoryVerticalList from '@/components/common/CategoryVerticalList';
import JsonLd from '@/components/common/JsonLd';
import BlogPosts from '@/components/posts/BlogPosts';
import type { ListPageParams } from '@/types/page.types';
import { toPageNumber } from '@/utils/pagination';
import { getAllPosts, getAllPostsPath, getCategoryList } from '@/utils/post-utils';
import { buildAlternates, buildBlogJsonLd, buildBreadcrumbJsonLd } from '@/utils/seo';
import { parseViewType, VIEW_TYPE_COOKIE } from '@/utils/view-type';

export const metadata: Metadata = {
	alternates: buildAlternates('/blog/posts'),
};

// searchParams를 읽으면 이 라우트는 요청 시점에 렌더된다.
// 정적 생성이면 빌드 때 만든 1페이지 HTML이 ?page=2에도 그대로 나가 화면이 한 번 바뀐다.
const BlogPostsPage = async ({ searchParams }: ListPageParams) => {
	const { q, page } = await searchParams;
	// 뷰 타입도 쿠키라 서버가 읽는다. localStorage였다면 리스트 뷰가 한 번 그려졌다가 카드 뷰로 바뀐다.
	const viewType = parseViewType((await cookies()).get(VIEW_TYPE_COOKIE)?.value);
	const postsPaths = getAllPostsPath();
	const posts = await getAllPosts(postsPaths);
	const categoryData = await getCategoryList();

	return (
		<section className="mx-auto max-w-6xl px-5 py-8 md:py-14">
			<JsonLd data={buildBlogJsonLd(posts)} />
			<JsonLd data={buildBreadcrumbJsonLd([{ name: '전체 글', path: '/blog/posts' }])} />
			<header className="mb-5">
				<h2 className="text-2xl font-bold tracking-tight md:text-3xl">전체 글</h2>
				<p className="mt-1 text-sm text-muted-foreground">총 {posts.length}개의 글</p>
			</header>
			<CategoryHorizontalList categoryData={categoryData} />
			<div className="mt-6 flex gap-6 lg:gap-10">
				<CategoryVerticalList categoryData={categoryData} />
				<BlogPosts posts={posts} initialQuery={q ?? ''} initialPage={toPageNumber(page)} initialViewType={viewType} />
			</div>
		</section>
	);
};

export default BlogPostsPage;
