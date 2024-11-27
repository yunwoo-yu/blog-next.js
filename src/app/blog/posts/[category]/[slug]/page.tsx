import markdownToTxt from 'markdown-to-txt';

import CustomMDXRemote from '@/components/common/CustomMDXRemote';
import Comments from '@/components/postDetail/Comments';
import PostDetailHeader from '@/components/postDetail/PostDetailHeader';
import { getAllPosts, getAllPostsPath, getPostDetail } from '@/utils/post-utils';
interface Params {
	params: Promise<{ category: string; slug: string }>;
}

export const generateStaticParams = async () => {
	const postsPaths = getAllPostsPath();
	const posts = await getAllPosts(postsPaths);

	return posts.map(post => ({ category: post.category, slug: post.slug }));
};

export const generateMetadata = async ({ params }: Params) => {
	const { category, slug } = await params;
	const post = await getPostDetail(category, slug);
	const description =
		markdownToTxt(post.source)
			.replace(/\s{2,}/gi, ' ')
			.slice(0, 160)
			.trim() + '...';

	return {
		title: `${post.frontmatter.title}`,
		description: `${description}`,
	};
};

const PostDetailPage = async ({ params }: Params) => {
	const { category, slug } = await params;
	const { source, frontmatter } = await getPostDetail(category, slug);

	return (
		<>
			<PostDetailHeader frontmatter={frontmatter} />
			<section className="prose mx-auto max-w-4xl px-5 pb-20 pt-10 dark:prose-invert">
				<CustomMDXRemote source={source} />
				<Comments />
			</section>
		</>
	);
};

export default PostDetailPage;
