import markdownToTxt from 'markdown-to-txt';

import CustomMDXRemote from '@/components/common/CustomMDXRemote';
import Comments from '@/components/postDetail/Comments';
import PostDetailHeader from '@/components/postDetail/PostDetailHeader';
import Toc from '@/components/postDetail/Toc';
import { getAllPosts, getAllPostsPath, getHeaderNavigationList, getPostDetail } from '@/utils/post-utils';
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
		openGraph: {
			title: `${post.frontmatter.title}`,
			description: `${description}`,
			images: [`/images/${category}/${slug}/thumbnail.png`],
		},
	};
};

const PostDetailPage = async ({ params }: Params) => {
	const { category, slug } = await params;
	const { source, frontmatter } = await getPostDetail(category, slug);

	const headerNavigationList = getHeaderNavigationList(source);

	return (
		<>
			<PostDetailHeader frontmatter={frontmatter} />
			<article className="mx-auto max-w-3xl px-5 transition xl:sticky xl:left-[80%] xl:top-60 xl:mx-0 xl:max-w-72">
				<Toc headerNavigationList={headerNavigationList} />
			</article>
			<section className="mx-auto max-w-3xl px-5 pb-20 pt-10 xl:-mt-60">
				<CustomMDXRemote source={source} />
				<Comments />
			</section>
		</>
	);
};

export default PostDetailPage;
