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
	it('히어로는 큰 문장과 프로젝트 보기·이력서 보기 버튼을 가진다', () => {
		render(<PortfolioOverview />);

		expect(
			screen.getByRole('heading', { level: 2, name: /결제부터 마이데이터, 어드민까지.*프론트엔드 개발자 유윤우/ }),
		).toBeInTheDocument();
		expect(screen.getByRole('link', { name: '프로젝트 보기' })).toHaveAttribute('href', '#projects');
		expect(screen.getByRole('link', { name: '이력서 보기' })).toHaveAttribute('href', '/resume');
		expect(document.getElementById('projects')).not.toBeNull();
	});

	it('핵심 숫자 3개가 수치가 나온 사례로 연결된다', () => {
		render(<PortfolioOverview />);

		expect(PORTFOLIO_KEY_RESULTS).toHaveLength(3);
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

	it('제목·메타·결과 박스를 먼저 보여 준다', () => {
		render(<CaseStudy item={item} />);

		expect(screen.getByRole('link', { name: '포트폴리오' })).toHaveAttribute('href', '/portfolio');
		expect(screen.getByRole('heading', { level: 2, name: item.title })).toBeInTheDocument();
		expect(screen.getByText([item.organization, item.service, item.period].join(' · '))).toBeInTheDocument();

		const result = screen.getByRole('region', { name: '결과' });
		expect(result.textContent).toContain(getExhibit(item.slug)!.callouts.outcome);
	});

	it('이력서 원문(문제·기여·결과)을 접지 않고 순서대로 싣고 예전 앵커를 유지한다', () => {
		for (const each of PORTFOLIO_CASES) {
			const { container, unmount } = render(<CaseStudy item={each} />);
			const outcome = getExhibit(each.slug)!.callouts.outcome.trim();
			const sameAsBox = each.stages.find(stage => stage.id === 'result')!.text.trim() === outcome;
			const titles = ['어떤 문제였나요', '어떻게 풀었나요', ...(sameAsBox ? [] : ['결과가 어땠나요'])];
			const headings = titles.map(name => screen.getByRole('heading', { level: 3, name }));

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
				expect(anchor.textContent).toContain(stage.text);
			}
			// 결과 박스와 같은 문장은 한 번만 보여 준다.
			if (sameAsBox) expect(container.textContent!.split(outcome).length - 1, each.slug).toBe(1);
			expect(container.textContent).not.toContain('이력서 원문');
			unmount();
		}
	});

	it('공개 서비스 화면을 출처 캡션과 함께 보여 준다', () => {
		render(<CaseStudy item={item} />);

		const screens = document.getElementById('screens')!;
		const exhibit = getExhibit(item.slug)!;

		for (const shot of exhibit.gallery ?? []) {
			expect(within(screens).getByRole('img', { name: shot.alt })).toBeInTheDocument();
			expect(screens.textContent).toContain(shot.caption);
		}
	});

	it('공개 화면이 없는 사례는 화면 섹션을 만들지 않는다', () => {
		const donation = PORTFOLIO_CASES.find(each => each.slug === 'donation-duplicate-guard')!;

		render(<CaseStudy item={donation} />);

		expect(document.getElementById('screens')).toBeNull();
	});

	it('이웃 사례로 이동하는 목록을 준다', () => {
		render(<CaseStudy item={item} />);

		const other = screen.getByRole('navigation', { name: '다른 프로젝트도 볼 수 있어요' });

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
