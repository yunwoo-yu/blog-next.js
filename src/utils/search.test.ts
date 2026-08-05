import type { PostListTypes } from '@/types/common.types';

import { filterPostsByQuery } from './search';

const createPost = (
	slug: string,
	overrides: Partial<PostListTypes['frontmatter']> = {},
	category = 'next',
): PostListTypes => ({
	category,
	slug,
	frontmatter: {
		title: '제목',
		createdAt: '2025-01-01',
		thumbnail: '',
		description: '설명',
		tags: [],
		...overrides,
	},
});

const posts = [
	createPost('a', { title: 'Tree Shaking(lodash)', description: '뭣? lodash가 CJS라이브러리?', tags: ['React'] }),
	createPost('b', { title: '2025년 회고', description: '2026년 목표', tags: ['Career'] }, 'career'),
	createPost('c', { title: 'Bubble Sort', description: '거품 정렬', tags: ['Algorithm', 'Sort'] }, 'cs'),
];

describe('filterPostsByQuery', () => {
	it('빈 검색어면 원본을 그대로 돌려준다', () => {
		expect(filterPostsByQuery(posts, '')).toBe(posts);
	});

	it('공백만 있는 검색어도 원본을 돌려준다', () => {
		expect(filterPostsByQuery(posts, '   ')).toBe(posts);
	});

	it('제목으로 찾는다', () => {
		expect(filterPostsByQuery(posts, 'bubble').map(p => p.slug)).toEqual(['c']);
	});

	it('대소문자를 구분하지 않는다', () => {
		expect(filterPostsByQuery(posts, 'TREE SHAKING').map(p => p.slug)).toEqual(['a']);
	});

	it('설명으로 찾는다', () => {
		expect(filterPostsByQuery(posts, '거품').map(p => p.slug)).toEqual(['c']);
	});

	it('태그로 찾는다', () => {
		expect(filterPostsByQuery(posts, 'algorithm').map(p => p.slug)).toEqual(['c']);
	});

	it('카테고리로 찾는다', () => {
		expect(filterPostsByQuery(posts, 'career').map(p => p.slug)).toEqual(['b']);
	});

	it('앞뒤 공백은 무시한다', () => {
		expect(filterPostsByQuery(posts, '  회고  ').map(p => p.slug)).toEqual(['b']);
	});

	it('일치하는 글이 없으면 빈 배열이다', () => {
		expect(filterPostsByQuery(posts, 'zzzz')).toEqual([]);
	});

	it('여러 글이 걸리면 원본 순서를 유지한다', () => {
		// 'o'는 lodash(a)와 Sort(c)에 걸린다
		expect(filterPostsByQuery(posts, 'o').map(p => p.slug)).toEqual(['a', 'c']);
	});
});
