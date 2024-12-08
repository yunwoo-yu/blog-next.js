import { MetadataRoute } from 'next';

import { BASE_URL } from '@/constant';
import { getAllPosts, getAllPostsPath, getCategoryList } from '@/utils/post-utils';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
	const postsPaths = getAllPostsPath();
	const posts = await getAllPosts(postsPaths);
	const categoryData = await getCategoryList();

	return [
		{
			url: BASE_URL,
			lastModified: new Date(),
		},
		{
			url: `${BASE_URL}/blog/posts`,
			lastModified: new Date(),
		},
		...categoryData.categoryNameList.map(category => ({
			url: `${BASE_URL}/blog/posts/${category.label}`,
			lastModified: new Date(),
		})),
		...posts.map(post => ({
			url: `${BASE_URL}/blog/posts/${post.category}/${post.slug}`,
			lastModified: new Date(),
		})),
	];
};

export default sitemap;
