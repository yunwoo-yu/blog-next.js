import type { MetadataRoute } from 'next';

import { BASE_URL } from '@/constant';
import { countTags, getAllPosts, getAllPostsPath, getCategoryList } from '@/utils/post-utils';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
	const postsPaths = getAllPostsPath();
	const posts = await getAllPosts(postsPaths);
	const categoryData = await getCategoryList();

	// 목록은 최신순이므로 첫 글의 작성일이 곧 블로그 전체의 마지막 갱신일이다.
	// 매 빌드마다 new Date()를 넣으면 실제로 바뀌지 않은 글까지 갱신됐다는 잘못된 신호를 준다.
	const latestPostDate = posts[0] ? new Date(posts[0].frontmatter.createdAt) : new Date();

	return [
		{
			url: BASE_URL,
			lastModified: latestPostDate,
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${BASE_URL}/blog/posts`,
			lastModified: latestPostDate,
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		...categoryData.categoryNameList.map(category => ({
			url: `${BASE_URL}/blog/posts/${category.label}`,
			lastModified: latestPostDate,
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		})),
		...countTags(posts).map(tag => ({
			url: `${BASE_URL}/blog/tags/${encodeURIComponent(tag.label)}`,
			lastModified: latestPostDate,
			changeFrequency: 'weekly' as const,
			priority: 0.5,
		})),
		...posts.map(post => ({
			url: `${BASE_URL}/blog/posts/${post.category}/${post.slug}`,
			lastModified: new Date(post.frontmatter.createdAt),
			changeFrequency: 'monthly' as const,
			priority: 0.8,
		})),
	];
};

export default sitemap;
