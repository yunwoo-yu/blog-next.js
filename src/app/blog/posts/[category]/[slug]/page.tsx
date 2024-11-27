import CustomMDXRemote from '@/components/common/CustomMDXRemote';
import Comments from '@/components/postDetail/Comments';
import PostDetailHeader from '@/components/postDetail/PostDetailHeader';
import { getPostDetail } from '@/utils/post-utils';

interface Params {
	params: Promise<{ category: string; slug: string }>;
}

const PostDetailPage = async ({ params }: Params) => {
	const { category, slug } = await params;
	const { source, frontmatter } = await getPostDetail(category, slug);

	return (
		<>
			<PostDetailHeader frontmatter={frontmatter} />
			<section className="prose mx-auto max-w-4xl px-5 py-10 dark:prose-invert">
				<CustomMDXRemote source={source} />
				<Comments />
			</section>
		</>
	);
};

export default PostDetailPage;
