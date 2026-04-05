import { getHeaderNavigationList } from './post-utils';

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
