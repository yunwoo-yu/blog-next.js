import type { PostListTypes } from '@/types/common.types';

/**
 * 제목·설명·태그·카테고리를 대상으로 대소문자 구분 없이 부분 일치 검색한다.
 * post-utils는 node:fs에 의존해 클라이언트에서 못 쓰므로 검색 로직은 여기 따로 둔다.
 */
export const filterPostsByQuery = (posts: PostListTypes[], query: string) => {
	const keyword = query.trim().toLowerCase();

	if (!keyword) return posts;

	return posts.filter(post => {
		const haystack = [post.frontmatter.title, post.frontmatter.description, post.category, ...post.frontmatter.tags]
			.join(' ')
			.toLowerCase();

		return haystack.includes(keyword);
	});
};
