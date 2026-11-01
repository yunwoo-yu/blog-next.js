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

	it('개발 중 비교와 대안을 배포된 기존 방식으로 표시하지 않는다', () => {
		const labels = (slug: string) => getStory(slug)!.decisions[0].options.map(({ label }) => label);

		expect(labels('wellomarket-checkout')).toEqual(['지금 접근', '처음 접근']);
		expect(labels('ai-chatbot-cms')).toEqual(['이 방법', '다른 방법']);
		expect(labels('wellobiz-chakra-zod').slice(0, 2)).toEqual(['바꾼 방식', '기존 방식']);
	});

	it('통합 챗봇은 메타데이터·스크롤 도식과 답변 처리를 남기고 타인 작업 정정을 보존한다', () => {
		const story = getStory('ai-chatbot-cms')!;

		expect(getStory('ai-chatbot-ssr')).toBeUndefined();
		expect(story.decisions).toHaveLength(2);
		expect(story.troubles).toHaveLength(3);
		const diagrams = story.troubles.flatMap(trouble => (trouble.diagram ? [trouble.diagram] : []));
		expect(diagrams).toHaveLength(2);
		expect(diagrams[0].actors).toEqual(['링크 미리보기', 'Next.js 서버', '고객사 설정']);
		expect(diagrams[0].steps.map(step => step.label)).toEqual([
			'(CSR) JS를 실행하기 전 HTML에는 고객사별 메타가 없음',
			'고객사 코드가 첫 칸인 주소로 요청',
			'서버에서 코드로 고객사와 메타 설정 조회',
			'제목·설명·OG 값',
			'head에 title과 og 태그를 채운 HTML 응답',
		]);
		expect(diagrams[1].steps.at(-1)?.label).toContain('스크롤 위치 보정');
		expect(story.troubles[0].fix).toContain('CMS에서 OG 문구·이미지를 편집');
		expect(story.troubles[2].fix).toContain('스트림');
		expect(story.troubles[2].fix).toContain('폴링');
		expect(story.checks.join(' ')).toContain('[code]/layout.tsx의 generateMetadata와 메타 조회 함수');
		expect(story.checks.join(' ')).toContain('sitemap·robots와 Next.js 초기 세팅은 다른 팀원의 작업');
	});

	it('없는 slug 는 undefined 를 돌려준다', () => {
		expect(getStory('nope')).toBeUndefined();
		expect(getStory('wellomarket-checkout')?.slug).toBe('wellomarket-checkout');
	});
});
