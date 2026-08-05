import type { PostListTypes } from '@/types/common.types';

import {
	countTags,
	getAdjacentPosts,
	getHeaderNavigationList,
	getPostsByTag,
	getReadingTime,
	normalizeFrontmatter,
} from './post-utils';

describe('normalizeFrontmatter', () => {
	const base = { title: 't', createdAt: '2025-01-01', thumbnail: '', description: '' };

	it('YAML이 숫자로 읽은 태그를 문자열로 바꾼다', () => {
		// tags: [Blog, 2025] 는 2025를 number로 파싱한다
		const frontmatter = { ...base, tags: ['Blog', 2025] as unknown as string[] };

		expect(normalizeFrontmatter(frontmatter).tags).toEqual(['Blog', '2025']);
	});

	it('정규화한 태그로 문자열 연산이 가능하다', () => {
		const frontmatter = { ...base, tags: [2025] as unknown as string[] };

		expect(() => normalizeFrontmatter(frontmatter).tags[0].toLowerCase()).not.toThrow();
	});

	it('tags가 없으면 빈 배열로 채운다', () => {
		const frontmatter = { ...base, tags: undefined as unknown as string[] };

		expect(normalizeFrontmatter(frontmatter).tags).toEqual([]);
	});

	it('다른 필드는 건드리지 않는다', () => {
		const frontmatter = { ...base, createdAt: '2024-12-06', tags: ['Blog'] };

		expect(normalizeFrontmatter(frontmatter).createdAt).toBe('2024-12-06');
	});
});

const createPost = (category: string, slug: string, tags: string[] = []): PostListTypes => ({
	category,
	slug,
	frontmatter: { title: slug, createdAt: '2025-01-01', thumbnail: '', description: '', tags },
});

describe('countTags', () => {
	const posts = [
		createPost('next', 'a', ['React', 'Blog']),
		createPost('next', 'b', ['React']),
		createPost('cs', 'c', ['Algorithm', 'Blog']),
	];

	it('태그별 글 수를 센다', () => {
		expect(countTags(posts)).toContainEqual({ label: 'React', count: 2 });
		expect(countTags(posts)).toContainEqual({ label: 'Algorithm', count: 1 });
	});

	it('많은 순으로 정렬하고 동수면 이름 순으로 정렬한다', () => {
		expect(countTags(posts).map(t => t.label)).toEqual(['Blog', 'React', 'Algorithm']);
	});

	it('태그가 없으면 빈 배열이다', () => {
		expect(countTags([createPost('next', 'a')])).toEqual([]);
	});

	it('빈 목록이면 빈 배열이다', () => {
		expect(countTags([])).toEqual([]);
	});
});

describe('getPostsByTag', () => {
	const posts = [createPost('next', 'a', ['React']), createPost('cs', 'b', ['Algorithm']), createPost('next', 'c')];

	it('해당 태그를 가진 글만 남긴다', () => {
		expect(getPostsByTag(posts, 'React').map(p => p.slug)).toEqual(['a']);
	});

	it('대소문자를 구분하지 않는다', () => {
		expect(getPostsByTag(posts, 'react').map(p => p.slug)).toEqual(['a']);
	});

	it('일치하는 태그가 없으면 빈 배열이다', () => {
		expect(getPostsByTag(posts, 'Vue')).toEqual([]);
	});

	it('태그가 없는 글은 걸러진다', () => {
		expect(getPostsByTag(posts, '').map(p => p.slug)).toEqual([]);
	});
});

describe('getAdjacentPosts', () => {
	const posts = [createPost('next', 'a'), createPost('next', 'b'), createPost('react', 'c')];

	it('중간 글은 older와 newer를 모두 가진다', () => {
		const { older, newer } = getAdjacentPosts(posts, 'next', 'b');

		expect(newer?.slug).toBe('a');
		expect(older?.slug).toBe('c');
	});

	it('가장 최신 글은 newer가 null이다', () => {
		expect(getAdjacentPosts(posts, 'next', 'a').newer).toBeNull();
	});

	it('가장 오래된 글은 older가 null이다', () => {
		expect(getAdjacentPosts(posts, 'react', 'c').older).toBeNull();
	});

	it('카테고리가 달라 매칭되지 않으면 둘 다 null이다', () => {
		expect(getAdjacentPosts(posts, 'cs', 'b')).toEqual({ older: null, newer: null });
	});

	it('빈 목록이면 둘 다 null이다', () => {
		expect(getAdjacentPosts([], 'next', 'a')).toEqual({ older: null, newer: null });
	});
});

describe('getReadingTime', () => {
	it('빈 문자열이어도 최소 1분을 반환한다', () => {
		expect(getReadingTime('')).toBe(1);
	});

	it('500자당 1분씩 올림한다', () => {
		expect(getReadingTime('가'.repeat(500))).toBe(1);
		expect(getReadingTime('가'.repeat(501))).toBe(2);
	});

	it('코드 블록은 분량에서 제외한다', () => {
		const source = `${'가'.repeat(100)}\n\`\`\`ts\n${'const a = 1;\n'.repeat(200)}\`\`\``;

		expect(getReadingTime(source)).toBe(1);
	});

	it('공백과 마크다운 문법은 분량에서 제외한다', () => {
		expect(getReadingTime(`## ${'가 '.repeat(500)}`)).toBe(1);
	});

	it('링크는 텍스트만 분량에 포함한다', () => {
		expect(getReadingTime(`[${'가'.repeat(600)}](https://example.com)`)).toBe(2);
	});
});

describe('getHeaderNavigationList', () => {
	it('빈 문자열이면 빈 배열을 반환한다', () => {
		expect(getHeaderNavigationList('')).toEqual([]);
	});

	it('헤딩이 없는 텍스트면 빈 배열을 반환한다', () => {
		const source = '일반 텍스트\n코드 블록\n그냥 문장';
		expect(getHeaderNavigationList(source)).toEqual([]);
	});

	it('h2 하나를 파싱한다', () => {
		expect(getHeaderNavigationList('## Hello')).toEqual([{ text: 'Hello', href: '#hello', children: [] }]);
	});

	it('h2 아래 h3을 children으로 중첩한다', () => {
		const source = '## Parent\n### Child 1\n### Child 2';
		expect(getHeaderNavigationList(source)).toEqual([
			{
				text: 'Parent',
				href: '#parent',
				children: [
					{ text: 'Child 1', href: '#child-1' },
					{ text: 'Child 2', href: '#child-2' },
				],
			},
		]);
	});

	it('독립된 h2 여러 개는 각각 빈 children을 가진다', () => {
		const source = '## First\n## Second\n## Third';
		const result = getHeaderNavigationList(source);

		expect(result).toHaveLength(3);
		expect(result.every(h => Array.isArray(h.children) && h.children.length === 0)).toBe(true);
	});

	it('h2 없이 h3이 먼저 오면 top-level로 추가된다 (children 없음)', () => {
		const source = '### Orphan';
		const result = getHeaderNavigationList(source);

		expect(result).toEqual([{ text: 'Orphan', href: '#orphan' }]);
		expect(result[0].children).toBeUndefined();
	});

	it('이모지를 제거한다', () => {
		const source = '## 🚀 Deploy';
		const result = getHeaderNavigationList(source);

		expect(result[0].href).toBe('#-deploy');
	});

	it('특수문자를 제거하고 ?도 제거한다', () => {
		const source = '## What[s] Next?';
		const result = getHeaderNavigationList(source);

		expect(result[0].href).toBe('#whats-next');
	});

	it('h1과 h4는 무시한다', () => {
		const source = '# H1 Title\n## H2 Title\n#### H4 Title';
		const result = getHeaderNavigationList(source);

		expect(result).toHaveLength(1);
		expect(result[0].text).toBe('H2 Title');
	});

	it('복합 시나리오: h2+h3+고아h3+이모지 혼합', () => {
		const source = ['### Orphan First', '## 🎉 Section A', '### Sub A1', '### Sub A2', '## Section B'].join('\n');

		const result = getHeaderNavigationList(source);

		expect(result).toEqual([
			{ text: 'Orphan First', href: '#orphan-first' },
			{
				text: '🎉 Section A',
				href: '#-section-a',
				children: [
					{ text: 'Sub A1', href: '#sub-a1' },
					{ text: 'Sub A2', href: '#sub-a2' },
				],
			},
			{ text: 'Section B', href: '#section-b', children: [] },
		]);
	});
});
