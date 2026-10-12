// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { EXHIBITS } from '@/portfolio/exhibits';
import { getPhaseScrollY } from '@/portfolio/world';

import PortfolioWorld from './PortfolioWorld';

const ORGANIZATION: Record<string, string> = {
	'ai-chatbot-cms': '살린',
	'ai-chatbot-ssr': '살린',
	'swing-frontend': '살린',
	'avatar-studio-performance': '살린',
};

const METAS = EXHIBITS.map(item => ({
	slug: item.slug,
	organization: ORGANIZATION[item.slug] ?? '웰로',
}));

const mocks = vi.hoisted(() => ({ webgl: true, canvasFails: false }));

vi.mock('@/portfolio/webgl-support', () => ({ detectWebGL: () => mocks.webgl }));

vi.mock('./WorldCanvas', () => ({
	default: ({ onReady }: { onReady: () => void }) => {
		if (mocks.canvasFails) throw new Error('render failed');
		onReady();

		return <div data-testid="mock-canvas" />;
	},
}));

const matchMedia = (reduced: boolean) =>
	vi.fn((query: string) => ({
		matches: query.includes('reduced-motion') ? reduced : false,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	}));

const renderWorld = () =>
	render(
		<PortfolioWorld exhibits={EXHIBITS} metas={METAS}>
			<h2>소개</h2>
		</PortfolioWorld>,
	);

const enterWorld = async () => {
	renderWorld();
	await screen.findByTestId('portfolio-world');
};

beforeEach(() => {
	mocks.webgl = true;
	mocks.canvasFails = false;
	window.localStorage.clear();
	vi.stubGlobal('matchMedia', matchMedia(false));
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('PortfolioWorld', () => {
	it('WebGL2 가 없으면 소개와 평면 전시를 보여 준다', async () => {
		mocks.webgl = false;
		renderWorld();

		expect(screen.getByRole('heading', { name: '소개' })).toBeInTheDocument();
		expect(screen.getByRole('group', { name: '전시할 사례 선택' })).toBeInTheDocument();
		expect(screen.queryByTestId('portfolio-world')).toBeNull();
		expect(screen.getByRole('region', { name: '대표 전시' })).toBeInTheDocument();
	});

	it('움직임 줄이기 설정이면 월드를 켜지 않는다', () => {
		vi.stubGlobal('matchMedia', matchMedia(true));
		renderWorld();

		expect(screen.queryByTestId('portfolio-world')).toBeNull();
	});

	it('사용자가 껐던 기록이 있으면 평면으로 시작하고 다시 켤 수 있다', async () => {
		window.localStorage.setItem('pf-world', 'off');
		renderWorld();

		expect(screen.queryByTestId('portfolio-world')).toBeNull();

		fireEvent.click(screen.getByRole('button', { name: '3D 월드로 보기' }));

		expect(await screen.findByTestId('portfolio-world')).toBeInTheDocument();
		expect(window.localStorage.getItem('pf-world')).toBe('on');
	});

	it('월드에서는 사례마다 장이 하나씩 있고 캔버스를 한가할 때 불러온다', async () => {
		await enterWorld();

		for (const exhibit of EXHIBITS) {
			expect(screen.getByRole('heading', { level: 3, name: exhibit.headline })).toBeInTheDocument();
		}

		expect(await screen.findByTestId('mock-canvas')).toBeInTheDocument();
	});

	it('전·후를 바꾸면 해당 장의 설명이 바뀌고 다른 장은 그대로다', async () => {
		await enterWorld();

		const checkout = EXHIBITS[0];
		const [firstCaption] = screen.getAllByTestId('world-caption');

		expect(firstCaption).toHaveTextContent(checkout.phases.after[0].caption);

		fireEvent.click(screen.getAllByRole('button', { name: '위험 시나리오' })[0]);

		expect(screen.getAllByTestId('world-caption')[0]).toHaveTextContent(checkout.phases.before[0].caption);
		expect(screen.getAllByTestId('world-caption')[1]).toHaveTextContent(EXHIBITS[1].phases.after[0].caption);
	});

	it('카드에는 한 줄 결과를 두고 문제·결정 같은 긴 설명은 싣지 않는다', async () => {
		await enterWorld();

		expect(screen.getAllByText(EXHIBITS[0].callouts.outcome).length).toBeGreaterThan(0);
		expect(screen.queryByText(EXHIBITS[0].callouts.problem)).toBeNull();
		expect(screen.queryByText(EXHIBITS[0].callouts.decision)).toBeNull();
		expect(screen.queryByRole('switch')).toBeNull();
	});

	it('각 장은 상세 페이지로 가는 링크를 가진다', async () => {
		await enterWorld();

		const links = screen.getAllByRole('link', { name: /판단과 문제 해결 보기/ });

		expect(links.map(link => link.getAttribute('href'))).toEqual(EXHIBITS.map(item => `/portfolio/${item.slug}`));
	});

	it('3D 끄기를 누르면 평면으로 돌아가고 기록을 남긴다', async () => {
		await enterWorld();

		fireEvent.click(screen.getByRole('button', { name: '3D 끄고 평면으로 보기' }));

		expect(screen.queryByTestId('portfolio-world')).toBeNull();
		expect(window.localStorage.getItem('pf-world')).toBe('off');
	});

	it('캔버스가 그리다 실패하면 평면으로 물러난다', async () => {
		mocks.canvasFails = true;
		renderWorld();

		await waitFor(() => expect(screen.queryByTestId('portfolio-world')).toBeNull(), { timeout: 2000 });
		expect(screen.getByRole('region', { name: '대표 전시' })).toBeInTheDocument();
	});

	it('저장소가 막혀 있어도 월드가 열린다', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		await act(async () => {
			renderWorld();
		});

		expect(await screen.findByTestId('portfolio-world')).toBeInTheDocument();
	});

	it('사례 선택 줄은 조직별로 묶고, 고르면 그 장의 첫 단계 위치로 정확히 스크롤한다', async () => {
		const scrollTo = vi.fn();
		window.scrollTo = scrollTo;
		// jsdom 에는 레이아웃이 없으므로 섹션 높이를 직접 준다. 전경 1530, 장마다 1980.
		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
			const key = this.dataset.worldSection;
			const index = EXHIBITS.findIndex(item => item.slug === key);
			const top = key === 'hero' ? 0 : key ? 1530 + index * 1980 : 0;
			const height = key === 'hero' ? 1530 : key ? 1980 : 0;

			return { top, bottom: top + height, left: 0, right: 0, width: 0, height, x: 0, y: top, toJSON: () => ({}) };
		});
		await enterWorld();

		const bar = screen.getByRole('navigation', { name: '사례 선택' });

		expect(within(bar).getAllByText('웰로').length).toBeGreaterThan(0);
		expect(within(bar).getAllByText('살린').length).toBeGreaterThan(0);

		for (const exhibit of EXHIBITS) {
			expect(within(bar).getAllByRole('button', { name: exhibit.shortTitle }).length, exhibit.slug).toBeGreaterThan(0);
		}

		const target = 3;

		fireEvent.click(within(bar).getAllByRole('button', { name: EXHIBITS[target].shortTitle })[0]);

		expect(scrollTo).toHaveBeenCalledTimes(1);
		expect(scrollTo).toHaveBeenCalledWith({
			top: getPhaseScrollY({ top: 1530 + target * 1980, height: 1980 }, window.innerHeight, 0),
			behavior: 'smooth',
		});
	});

	it('방문 중 움직임 줄이기가 켜지면 월드를 접고 평면으로 돌아간다', async () => {
		let notify: ((event: { matches: boolean }) => void) | undefined;

		vi.stubGlobal(
			'matchMedia',
			vi.fn((query: string) => ({
				matches: false,
				addEventListener: (_: string, listener: (event: { matches: boolean }) => void) => {
					if (query.includes('reduced-motion')) notify = listener;
				},
				removeEventListener: vi.fn(),
			})),
		);
		await enterWorld();

		act(() => notify?.({ matches: true }));

		await waitFor(() => expect(screen.queryByTestId('portfolio-world')).toBeNull());
	});
});
