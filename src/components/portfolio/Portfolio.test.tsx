// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import { GITHUB_URL } from '@/constant';
import { buildCasePath, PORTFOLIO_CASES } from '@/portfolio/cases';
import { getExhibit } from '@/portfolio/exhibits';
import { PORTFOLIO_KEY_RESULTS } from '@/portfolio/overview';
import { STORIES } from '@/portfolio/stories';

import CaseStudy from './CaseStudy';
import PortfolioOverview from './PortfolioOverview';
import PortfolioTopBar from './PortfolioTopBar';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

afterEach(() => {
	vi.unstubAllEnvs();
});

describe('PortfolioTopBar', () => {
	it('이름과 이력서·블로그·GitHub 텍스트 링크를 가진다', () => {
		render(<PortfolioTopBar />);

		const nav = screen.getByRole('navigation', { name: '포트폴리오 내비게이션' });

		expect(within(nav).getByRole('link', { name: '유윤우' })).toHaveAttribute('href', '/portfolio');
		expect(within(nav).getByRole('link', { name: '이력서' })).toHaveAttribute('href', '/resume');
		expect(within(nav).getByRole('link', { name: '블로그' })).toHaveAttribute('href', '/blog/posts');

		const github = within(nav).getByRole('link', { name: /GitHub/ });
		expect(github).toHaveAttribute('href', GITHUB_URL);
		expect(github).toHaveAttribute('target', '_blank');
		expect(github.getAttribute('rel')).toContain('noopener');
	});
});

describe('PortfolioOverview', () => {
	it('히어로는 큰 이름과 프로젝트 보기·이력서 보기 버튼을 가진다', () => {
		render(<PortfolioOverview />);

		expect(screen.getByRole('heading', { level: 2, name: '유윤우' })).toBeInTheDocument();
		expect(document.body.textContent).not.toContain('만들어 온');
		expect(screen.getByRole('link', { name: '프로젝트 보기' })).toHaveAttribute('href', '#projects');
		expect(screen.getByRole('link', { name: '이력서 보기' })).toHaveAttribute('href', '/resume');
		expect(document.getElementById('projects')).not.toBeNull();
	});

	it('핵심 숫자가 수치가 나온 사례로 연결된다', () => {
		render(<PortfolioOverview />);

		expect(PORTFOLIO_KEY_RESULTS).toHaveLength(2);
		for (const result of PORTFOLIO_KEY_RESULTS) {
			const link = screen.getByRole('link', { name: new RegExp(`${result.value}.*${result.label}`) });

			expect(link).toHaveAttribute('href', buildCasePath(result.slug));
		}
	});

	it('모든 사례가 회사별 목록에서 한 줄씩 사례 페이지로 연결된다', () => {
		render(<PortfolioOverview />);

		const projects = document.getElementById('projects')!;

		for (const organization of ['웰로', '살린']) {
			const count = PORTFOLIO_CASES.filter(item => item.organization === organization).length;
			const header = within(projects).getByRole('heading', { level: 4, name: new RegExp(`^${organization}`) });

			expect(header.textContent).toContain(String(count));
		}
		for (const item of PORTFOLIO_CASES) {
			const link = within(projects).getByRole('link', { name: new RegExp(escapeRegExp(item.title)) });

			expect(link).toHaveAttribute('href', buildCasePath(item.slug));
			expect(link.textContent).toContain(item.service);
		}
	});

	it('경력과 활동(수상)을 목록으로 보여 준다', () => {
		render(<PortfolioOverview />);

		const experience = document.getElementById('experience')!;
		const activities = document.getElementById('activities')!;

		expect(experience.textContent).toContain('웰로');
		expect(experience.textContent).toContain('살린');
		expect(activities.textContent).toContain('과학기술정보통신부 장관상 대상 수상');
		expect(activities.textContent).toContain('BP(Best Practice) 선정');
	});

	it('3D 캔버스·영문 장식 라벨·필터 버튼이 없다', () => {
		const { container } = render(<PortfolioOverview />);

		expect(container.querySelector('canvas')).toBeNull();
		expect(container.querySelector('button, [aria-pressed]')).toBeNull();
		expect(container.querySelector('.font-mono, .uppercase')).toBeNull();
		expect(container.textContent).not.toMatch(/Front-End Developer|Portfolio/);
	});

	it('퇴사 사유와 광고 슬롯, 이메일을 렌더하지 않는다', () => {
		const { container } = render(<PortfolioOverview />);

		expect(container.textContent).not.toContain('권고사직');
		expect(container.querySelector('ins.adsbygoogle')).toBeNull();
		expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
	});
});

describe('CaseStudy', () => {
	const item = PORTFOLIO_CASES[1];

	it('제목과 회사 라벨·서비스·기간 메타를 보여 준다', () => {
		render(<CaseStudy item={item} />);

		expect(screen.getByRole('link', { name: '포트폴리오' })).toHaveAttribute('href', '/portfolio');
		expect(screen.getByRole('heading', { level: 2, name: item.title })).toBeInTheDocument();
		expect(screen.getByText(item.organization)).toBeInTheDocument();
		expect(screen.getByText([item.service, item.period].filter(Boolean).join(' · '))).toBeInTheDocument();
	});

	it('맨 위 한눈에 블록에 요약이 있고 "내가 맡은 것"은 없다', () => {
		for (const each of PORTFOLIO_CASES) {
			const { container, unmount } = render(<CaseStudy item={each} />);
			const glance = screen.getByRole('region', { name: '한눈에 보기' });

			expect(glance.textContent, each.slug).toContain(each.summary);
			expect(within(glance).queryByRole('list'), each.slug).toBeNull();
			expect(container.textContent, each.slug).not.toContain('내가 맡은 것');
			unmount();
		}
	});

	it('큰 숫자는 수치가 있는 사례에만 그리고 없으면 숫자 영역 자체를 두지 않는다', () => {
		for (const each of PORTFOLIO_CASES) {
			const keyResult = PORTFOLIO_KEY_RESULTS.find(result => result.slug === each.slug);
			const { unmount } = render(<CaseStudy item={each} />);
			const glance = screen.getByRole('region', { name: '한눈에 보기' });
			const number = within(glance).queryByTestId('case-number');

			if (keyResult) {
				expect(number, each.slug).not.toBeNull();
				expect(number!.textContent).toContain(keyResult.value);
				expect(number!.textContent).toContain(keyResult.label);
			} else {
				expect(number, each.slug).toBeNull();
			}
			unmount();
		}
		expect(PORTFOLIO_CASES.some(each => !PORTFOLIO_KEY_RESULTS.some(r => r.slug === each.slug))).toBe(true);
	});

	it('이력서 원문(문제·기여·결과)을 접지 않고 순서대로 싣고 예전 앵커를 유지한다', () => {
		for (const each of PORTFOLIO_CASES) {
			const { container, unmount } = render(<CaseStudy item={each} />);
			const outcome = getExhibit(each.slug)!.callouts.outcome.trim();
			const sameAsOutcome = each.stages.find(stage => stage.id === 'result')!.text.trim() === outcome;
			const headings = ['문제', '해결', '결과'].map(name => screen.getByRole('heading', { level: 3, name }));

			for (let i = 1; i < headings.length; i += 1) {
				expect(
					headings[i - 1].compareDocumentPosition(headings[i]) & Node.DOCUMENT_POSITION_FOLLOWING,
					each.slug,
				).toBeTruthy();
			}
			// 세 앵커(#problem·#contribution·#result)는 항상 있고 본문은 접히지 않는다.
			for (const stage of each.stages) {
				const anchor = container.querySelector(`#${stage.id}`)!;

				expect(anchor, `${each.slug} #${stage.id}`).not.toBeNull();
				expect(anchor.closest('details')).toBeNull();
				// 빈 줄로 나눈 문단은 각각 렌더되므로 문단마다 본문에 있어야 한다(내용을 빼지 않는다).
				for (const paragraph of stage.text.split(/\n{2,}/)) {
					expect(anchor.textContent, `${each.slug} #${stage.id}`).toContain(paragraph.trim());
				}
			}
			// 결과 요약은 결과 섹션에 있고, 본문과 같은 문장이면 한 번만 나온다.
			expect(container.querySelector('#result')!.textContent).toContain(outcome);
			if (sameAsOutcome) expect(container.textContent!.split(outcome).length - 1, each.slug).toBe(1);
			expect(container.textContent).not.toContain('이력서 원문');
			unmount();
		}
	});

	it('사례 상세에는 도식과 겹치는 별도 타임라인 섹션이 없다', () => {
		for (const each of PORTFOLIO_CASES) {
			const { container, unmount } = render(<CaseStudy item={each} />);

			expect(container.querySelector('[data-testid="flow-steps-after"]'), each.slug).toBeNull();
			expect(container.textContent, each.slug).not.toContain('어떻게 동작하나');
			unmount();
		}
	});

	it('판단은 선택/미선택 카드로, 문제는 제목 → 해결 순서의 블로그 흐름으로 보여 준다', () => {
		const withStory = STORIES.find(story => story.decisions.length > 0 && story.troubles.length > 0)!;
		const each = PORTFOLIO_CASES.find(c => c.slug === withStory.slug)!;

		render(<CaseStudy item={each} />);

		const decisions = document.getElementById('decisions')!;
		const troubles = document.getElementById('troubles')!;
		const items = troubles.querySelectorAll('[data-testid="trouble"]');

		expect(within(decisions).getAllByTestId('decision-chosen').length).toBeGreaterThan(0);
		expect(decisions.textContent).toContain('선택한 방법');
		expect(items.length).toBe(withStory.troubles.length);
		withStory.troubles.forEach((trouble, index) => {
			expect(items[index].querySelector('h5')!.textContent).toContain(trouble.problem);
			expect(items[index].textContent).toContain(trouble.fix.split(/\n{2,}/)[0]);
		});
	});

	it('사례 상세에 "공개 화면" 섹션과 서비스 스크린샷이 없다', () => {
		for (const each of PORTFOLIO_CASES) {
			const { container, unmount } = render(<CaseStudy item={each} />);

			expect(container.querySelector('#screens'), each.slug).toBeNull();
			expect(container.textContent).not.toContain('공개 화면');
			// 다른 프로젝트 목록의 56px 썸네일은 유지한다. 본문에는 이미지가 없다.
			const bodyImages = [...container.querySelectorAll('img')].filter(img => !img.closest('nav'));

			expect(bodyImages, each.slug).toHaveLength(0);
			unmount();
		}
	});

	it('본문을 빈 줄로 나누면 문단 여러 개로 그리고 강조는 문단마다 적용한다', () => {
		const base = PORTFOLIO_CASES[1];
		const stage = base.stages.find(each => each.id === 'contribution')!;
		const highlight = stage.highlights?.[0];
		const text = `첫째 문단 ${highlight ?? ''}\n\n둘째 문단 ${highlight ?? ''}\n\n셋째 문단`;
		const patched = {
			...base,
			stages: base.stages.map(each => (each.id === 'contribution' ? { ...each, text } : each)),
		};

		render(<CaseStudy item={patched} />);

		const paragraphs = document.querySelectorAll('#contribution > div > p');

		expect(paragraphs).toHaveLength(3);
		expect(paragraphs[1].textContent).toContain('둘째 문단');
		if (highlight) {
			expect(paragraphs[0].querySelector('strong')).not.toBeNull();
			expect(paragraphs[1].querySelector('strong')).not.toBeNull();
		}
	});

	it('이웃 사례로 이동하는 목록을 준다', () => {
		render(<CaseStudy item={item} />);

		const other = screen.getByRole('navigation', { name: '다른 프로젝트' });

		expect(
			within(other).getByRole('link', { name: new RegExp(escapeRegExp(PORTFOLIO_CASES[0].title)) }),
		).toHaveAttribute('href', buildCasePath(PORTFOLIO_CASES[0].slug));
		expect(
			within(other).getByRole('link', { name: new RegExp(escapeRegExp(PORTFOLIO_CASES[2].title)) }),
		).toHaveAttribute('href', buildCasePath(PORTFOLIO_CASES[2].slug));
	});

	it('운영 빌드에서는 초안 판단·문제를 렌더하지 않는다', () => {
		vi.stubEnv('NODE_ENV', 'production');

		for (const story of STORIES) {
			const each = PORTFOLIO_CASES.find(c => c.slug === story.slug)!;
			const drafts = [
				...story.decisions.flatMap(decision => decision.options.filter(o => o.basis === 'draft').map(o => o.reason)),
				...story.troubles.filter(trouble => trouble.basis === 'draft').map(trouble => trouble.problem),
			];
			const { container, unmount } = render(<CaseStudy item={each} />);

			expect(container.textContent).not.toContain('초안');
			for (const draft of drafts) expect(container.textContent, `${story.slug}: ${draft}`).not.toContain(draft);
			unmount();
		}
	});

	it('퇴사 사유와 광고 슬롯을 렌더하지 않는다', () => {
		for (const each of PORTFOLIO_CASES) {
			const { container, unmount } = render(<CaseStudy item={each} />);

			expect(container.textContent).not.toContain('권고사직');
			expect(container.querySelector('ins.adsbygoogle')).toBeNull();
			unmount();
		}
	});
});
