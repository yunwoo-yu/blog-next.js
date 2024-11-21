import CategoryVerticalList from '@/components/common/CategoryVerticalList';
import PostList from '@/components/posts/PostList';
import { getAllPosts, getAllPostsPath } from '@/utils/post-utils';

const BlogPostsPage = async () => {
	const postsPaths = getAllPostsPath();
	const posts = await getAllPosts(postsPaths);

	return (
		<section className="mx-auto flex max-w-5xl px-5 pt-5">
			<CategoryVerticalList />
			<PostList posts={posts} />
		</section>
	);
};

export default BlogPostsPage;
