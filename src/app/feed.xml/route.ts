import { META_DESCRIPTION } from '@/constant';
import { getAllPosts, getAllPostsPath } from '@/utils/post-utils';
import { buildRssXml } from '@/utils/seo';

export const dynamic = 'force-static';

export const GET = async () => {
	const posts = await getAllPosts(getAllPostsPath());

	return new Response(buildRssXml(posts, META_DESCRIPTION), {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600',
		},
	});
};
