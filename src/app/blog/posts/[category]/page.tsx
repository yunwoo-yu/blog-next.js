import CategoryVerticalList from '@/components/common/CategoryVerticalList';
import KakaoAdFit from '@/components/common/KakaoAdFit';
import BlogPosts from '@/components/posts/BlogPosts';
import { getAllPosts, getAllPostsPath, getCategoryList } from '@/utils/post-utils';

interface Params {
	params: Promise<{ category: string }>;
}

export const generateMetadata = async ({ params }: Params) => {
	const { category } = await params;

	return {
		title: `Ycow Blog - ${category}`,
		description: `Ycow Blog ${category} 카테고리 글 목록`,
	};
};

export const generateStaticParams = async () => {
	const category = await getCategoryList();

	return category.categoryNameList.map(categoryName => ({ category: categoryName.label }));
};

const PostsPageWithCategory = async ({ params }: Params) => {
	const { category } = await params;
	const postsPaths = getAllPostsPath(category);
	const posts = await getAllPosts(postsPaths);
	const categoryData = await getCategoryList();

	return (
		<section className="relative mx-auto flex max-w-6xl gap-5 px-5 py-20">
			<h1 className="sr-only">Ycow Blog</h1>
			<CategoryVerticalList categoryData={categoryData} category={category} />
			<BlogPosts posts={posts} />
			<KakaoAdFit unit="DAN-Cj5MxJWs7glmj6ft" width="160" height="600" className="hidden md:block" />
		</section>
	);
};

export default PostsPageWithCategory;
