import { PORTFOLIO_CASES } from './cases';
import { getStory, isVisible, STORIES } from './stories';

describe('사례 스토리 데이터', () => {
	it('사례마다 스토리가 하나씩 있다', () => {
		expect(STORIES.map(item => item.slug)).toEqual(PORTFOLIO_CASES.map(item => item.slug));
	});

	it('판단마다 고른 안이 하나 이상 있고 버린 안이 있으면 이유를 적는다', () => {
		for (const story of STORIES) {
			for (const decision of story.decisions) {
				expect(
					decision.options.some(option => option.verdict === 'chosen'),
					`${story.slug}: ${decision.question}`,
				).toBe(true);
				for (const option of decision.options) expect(option.reason.length, option.name).toBeGreaterThan(10);
			}
		}
	});

	it('확인 전 문장([확인 필요])은 draft 로만 표시한다', () => {
		for (const story of STORIES) {
			for (const decision of story.decisions) {
				for (const option of decision.options) {
					if (option.reason.includes('[확인 필요]'))
						expect(option.basis, `${story.slug}: ${option.name}`).toBe('draft');
				}
			}
		}
	});

	it('사례마다 확인할 질문을 남긴다', () => {
		for (const story of STORIES) expect(story.checks.length, story.slug).toBeGreaterThan(0);
	});

	it('초안은 운영 빌드에서 숨기고 이력서 근거 문장은 항상 보인다', () => {
		expect(isVisible('draft', 'production')).toBe(false);
		expect(isVisible('draft', 'development')).toBe(true);
		expect(isVisible('resume', 'production')).toBe(true);
	});

	it('코드·커밋으로 확인한 문장(code)은 운영 빌드에서도 보인다', () => {
		expect(isVisible('code', 'production')).toBe(true);
		expect(isVisible('code', 'development')).toBe(true);
	});

	it('사례마다 풀었던 문제가 있고 문제 문장은 사례 안에서 겹치지 않는다', () => {
		for (const story of STORIES) {
			const problems = story.troubles.map(trouble => trouble.problem);

			expect(problems.length, story.slug).toBeGreaterThan(0);
			expect(new Set(problems).size, story.slug).toBe(problems.length);
		}
	});

	it('없는 slug 는 undefined 를 돌려준다', () => {
		expect(getStory('nope')).toBeUndefined();
		expect(getStory('wellomarket-checkout')?.slug).toBe('wellomarket-checkout');
	});
});
