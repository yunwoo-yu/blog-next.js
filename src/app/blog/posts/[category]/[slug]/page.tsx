import type { Metadata } from 'next';

import AdSlot from '@/components/common/AdSlot';
import CustomMDXRemote from '@/components/common/CustomMDXRemote';
import JsonLd from '@/components/common/JsonLd';
import Comments from '@/components/postDetail/Comments';
import PostDetailHeader from '@/components/postDetail/PostDetailHeader';
import PostNavigation from '@/components/postDetail/PostNavigation';
import PostProgressScroll from '@/components/postDetail/PostProgressScroll';
import Toc from '@/components/postDetail/Toc';
import { META_AUTHOR_NAME } from '@/constant';
import {
	getAdjacentPosts,
	getAllPosts,
	getAllPostsPath,
	getHeaderNavigationList,
	getPostDetail,
	getReadingTime,
} from '@/utils/post-utils';
import { buildAlternates, buildBlogPostingJsonLd, buildBreadcrumbJsonLd, buildPostPath } from '@/utils/seo';

interface Params {
	params: Promise<{ category: string; slug: string }>;
}

export const generateStaticParams = async () => {
	const postsPaths = getAllPostsPath();
	const posts = await getAllPosts(postsPaths);

	return posts.map(post => ({ category: post.category, slug: post.slug }));
};

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
	const { category, slug } = await params;

	const post = await getPostDetail(category, slug);
	const description = `${post.source
		.replace(/```[\s\S]*?```/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[#*_~`>|-]/g, '')
		.replace(/\s{2,}/g, ' ')
		.trim()
		.slice(0, 160)}...`;

	// 경로를 조립하면 확장자가 png가 아닌 글(.jpg/.jpeg)에서 404가 난다. frontmatter의 실제 경로를 쓴다.
	const thumbnail = post.frontmatter.thumbnail;

	const dynamicMetadata: Metadata = {
		title: post.frontmatter.title,
		description,
		keywords: post.frontmatter.tags,
		alternates: buildAlternates(buildPostPath(category, slug)),
		openGraph: {
			type: 'article',
			url: buildPostPath(category, slug),
			title: post.frontmatter.title,
			description,
			publishedTime: post.frontmatter.createdAt,
			authors: [META_AUTHOR_NAME],
			tags: post.frontmatter.tags,
			images: [thumbnail],
		},
		twitter: {
			card: 'summary_large_image',
			title: post.frontmatter.title,
			description,
			images: [thumbnail],
		},
	};

	return dynamicMetadata;
};

const PostDetailPage = async ({ params }: Params) => {
	const { category, slug } = await params;
	const { source, frontmatter } = await getPostDetail(category, slug);
	const allPosts = await getAllPosts(getAllPostsPath());

	const headerNavigationList = getHeaderNavigationList(source);
	const { older, newer } = getAdjacentPosts(allPosts, category, slug);

	return (
		<>
			<JsonLd
				data={buildBlogPostingJsonLd({
					title: frontmatter.title,
					description: frontmatter.description,
					createdAt: frontmatter.createdAt,
					category,
					slug,
					thumbnail: frontmatter.thumbnail,
					tags: frontmatter.tags,
				})}
			/>
			<JsonLd
				data={buildBreadcrumbJsonLd([
					{ name: '전체 글', path: '/blog/posts' },
					{ name: category, path: `/blog/posts/${category}` },
					{ name: frontmatter.title, path: buildPostPath(category, slug) },
				])}
			/>
			<PostProgressScroll />
			<PostDetailHeader
				frontmatter={frontmatter}
				category={category}
				slug={slug}
				readingTime={getReadingTime(source)}
			/>
			<div className="mx-auto mt-6 max-w-3xl px-5 transition xl:fixed xl:left-[calc(50%+26rem)] xl:top-40 xl:mx-0 xl:mt-0 xl:w-72 xl:max-w-none">
				<Toc headerNavigationList={headerNavigationList} />
			</div>
			<section className="mx-auto max-w-3xl px-5 pb-20 pt-10">
				<CustomMDXRemote source={source} />
				<PostNavigation older={older} newer={newer} />
				<AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_POST_DETAIL} className="my-12" />
				<Comments />
			</section>
		</>
	);
};

export default PostDetailPage;
