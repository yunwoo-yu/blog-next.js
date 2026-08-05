import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import CategoryHorizontalList from '@/components/common/CategoryHorizontalList';
import CategoryVerticalList from '@/components/common/CategoryVerticalList';
import JsonLd from '@/components/common/JsonLd';
import BlogPosts from '@/components/posts/BlogPosts';
import type { ListPageParams } from '@/types/page.types';
import { toPageNumber } from '@/utils/pagination';
import { getAllPosts, getAllPostsPath, getCategoryList } from '@/utils/post-utils';
import { buildAlternates, buildBreadcrumbJsonLd } from '@/utils/seo';
import { parseViewType, VIEW_TYPE_COOKIE } from '@/utils/view-type';

interface Params extends ListPageParams {
	params: Promise<{ category: string }>;
}

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
	const { category } = await params;

	return {
		title: `Ycow Blog - ${category}`,
		description: `Ycow Blog ${category} 카테고리 글 목록`,
		alternates: buildAlternates(`/blog/posts/${category}`),
		openGraph: {
			type: 'website',
			url: `/blog/posts/${category}`,
			title: `Ycow Blog - ${category}`,
			description: `Ycow Blog ${category} 카테고리 글 목록`,
		},
	};
};

export const generateStaticParams = async () => {
	const category = await getCategoryList();

	return category.categoryNameList.map(categoryName => ({ category: categoryName.label }));
};

const PostsPageWithCategory = async ({ params, searchParams }: Params) => {
	const { category } = await params;
	const { q, page } = await searchParams;
	const viewType = parseViewType((await cookies()).get(VIEW_TYPE_COOKIE)?.value);
	const postsPaths = getAllPostsPath(category);
	const posts = await getAllPosts(postsPaths);
	const categoryData = await getCategoryList();

	return (
		<section className="mx-auto max-w-6xl px-5 py-8 md:py-14">
			<JsonLd
				data={buildBreadcrumbJsonLd([
					{ name: '전체 글', path: '/blog/posts' },
					{ name: category, path: `/blog/posts/${category}` },
				])}
			/>
			<header className="mb-5">
				<h2 className="text-2xl font-bold tracking-tight md:text-3xl">{category}</h2>
				<p className="mt-1 text-sm text-muted-foreground">총 {posts.length}개의 글</p>
			</header>
			<CategoryHorizontalList categoryData={categoryData} category={category} />
			<div className="mt-6 flex gap-6 lg:gap-10">
				<CategoryVerticalList categoryData={categoryData} category={category} />
				<BlogPosts posts={posts} initialQuery={q ?? ''} initialPage={toPageNumber(page)} initialViewType={viewType} />
			</div>
		</section>
	);
};

export default PostsPageWithCategory;
