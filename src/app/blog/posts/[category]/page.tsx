import CategoryVerticalList from '@/components/common/CategoryVerticalList';
import BlogPosts from '@/components/posts/BlogPosts';
import { getAllPosts, getAllPostsPath, getCategoryList } from '@/utils/post-utils';

interface Params {
	params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
	const category = await getCategoryList();

	return category.categoryNameList.map(categoryName => ({ category: categoryName.label }));
}

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
		</section>
	);
};

export default PostsPageWithCategory;
