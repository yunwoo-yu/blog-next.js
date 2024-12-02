import CategoryVerticalList from '@/components/common/CategoryVerticalList';
import KakaoAdFit from '@/components/common/KakaoAdFit';
import BlogPosts from '@/components/posts/BlogPosts';
import { getAllPosts, getAllPostsPath, getCategoryList } from '@/utils/post-utils';

const BlogPostsPage = async () => {
	const postsPaths = getAllPostsPath();
	const posts = await getAllPosts(postsPaths);
	const categoryData = await getCategoryList();

	return (
		<section className="relative mx-auto flex max-w-6xl gap-5 px-5 py-20">
			<h1 className="sr-only">Ycow Blog</h1>
			<CategoryVerticalList categoryData={categoryData} />
			<BlogPosts posts={posts} />
			<KakaoAdFit unit="DAN-Cj5MxJWs7glmj6ft" width="160" height="600" />
		</section>
	);
};

export default BlogPostsPage;
