// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useEffect } from 'react';

import { getExhibit } from '@/portfolio/exhibits';
import type { ServiceSceneCanvasProps } from '@/portfolio/service-scene.types';

import ServiceExhibit from './ServiceExhibit';

// WebGL 경계만 대체한다. 실제 three/R3F 는 jsdom 에서 렌더하지 않는다.
const canvasMock = vi.hoisted(() => ({
	behavior: 'ok' as 'ok' | 'throw',
	last: null as null | ServiceSceneCanvasProps,
	mounts: 0,
}));

vi.mock('./ServiceSceneCanvas', () => ({
	default: (props: ServiceSceneCanvasProps) => {
		if (canvasMock.behavior === 'throw') throw new Error('render failed');
		canvasMock.last = props;
		return <ReadyOnMount onReady={props.onReady} />;
	},
}));

const ReadyOnMount = ({ onReady }: { onReady: () => void }) => {
	useEffect(() => {
		canvasMock.mounts += 1;
		onReady();
	}, [onReady]);
	return <div data-testid="mock-canvas" />;
};

const stubWebGL = (supported: boolean) =>
	vi
		.spyOn(HTMLCanvasElement.prototype, 'getContext')
		.mockReturnValue((supported ? { getExtension: () => null } : null) as never);

const stubMotion = (reduce: boolean) =>
	vi.stubGlobal('matchMedia', (query: string) => ({
		matches: reduce && query.includes('reduce'),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	}));

const exhibit = getExhibit('regional-news-cache')!;
const loadButton = () => screen.findByRole('button', { name: '3D로 구조 보기' });

beforeEach(() => {
	canvasMock.behavior = 'ok';
	canvasMock.last = null;
	canvasMock.mounts = 0;
	stubMotion(false);
	stubWebGL(true);
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('ServiceExhibit 컨트롤', () => {
	it('전·후 선택이 도식 문구와 단계 설명을 바꾼다', () => {
		render(<ServiceExhibit exhibit={exhibit} />);

		expect(screen.getByTestId('phase-caption')).toHaveTextContent(exhibit.phases.after[0].caption);

		fireEvent.click(screen.getByRole('radio', { name: /개선 전/ }));

		expect(screen.getByTestId('phase-caption')).toHaveTextContent(exhibit.phases.before[0].caption);
		expect(screen.getByRole('img', { name: /서버 조회·60초 캐시, 1단계/ })).toBeInTheDocument();
	});

	it('단계 버튼과 화살표·Home·End 키가 같은 단계를 가리킨다', () => {
		render(<ServiceExhibit exhibit={exhibit} />);

		const group = screen.getByRole('group', { name: /단계 1\/4/ });
		const buttons = within(group).getAllByRole('button');

		expect(buttons).toHaveLength(4);
		fireEvent.click(buttons[2]);
		expect(buttons[2]).toHaveAttribute('aria-current', 'step');
		expect(screen.getByRole('group', { name: /단계 3\/4/ })).toBeInTheDocument();

		fireEvent.keyDown(buttons[2], { key: 'ArrowRight' });
		expect(buttons[3]).toHaveAttribute('aria-current', 'step');
		expect(buttons[3]).toHaveFocus();

		fireEvent.keyDown(buttons[3], { key: 'ArrowRight' });
		expect(buttons[3]).toHaveAttribute('aria-current', 'step');

		fireEvent.keyDown(buttons[3], { key: 'Home' });
		expect(buttons[0]).toHaveAttribute('aria-current', 'step');
		fireEvent.keyDown(buttons[0], { key: 'End' });
		expect(buttons[3]).toHaveAttribute('aria-current', 'step');
	});

	it('분해 스위치는 3D 가 켜진 뒤에만 나타나고, 도식에 계층 이름을 드러낸다', async () => {
		const { container } = render(<ServiceExhibit exhibit={exhibit} />);

		expect(screen.queryByRole('switch')).toBeNull();

		fireEvent.click(await loadButton());
		const toggle = await screen.findByRole('switch');

		expect(toggle).toHaveAttribute('aria-checked', 'false');
		expect(container.querySelector('.pf-layer-label')).toBeNull();

		fireEvent.click(toggle);

		expect(toggle).toHaveAttribute('aria-checked', 'true');
		expect(Array.from(container.querySelectorAll('.pf-layer-label')).map(node => node.textContent)).toEqual(
			exhibit.layerLabels,
		);
	});

	it('도식은 색뿐 아니라 기호와 텍스트로 상태를 전한다', () => {
		const { container } = render(<ServiceExhibit exhibit={exhibit} />);

		fireEvent.click(screen.getByRole('radio', { name: /개선 전/ }));
		fireEvent.click(within(screen.getByRole('group', { name: /단계/ })).getAllByRole('button')[3]);

		expect(container.querySelector('.pf-node-glyph')?.textContent).toBe('✕');
		expect(container.querySelector('title')?.textContent).toMatch(/: (문제 발생|대기)/);
	});

	it('공개 캡처가 없는 사례는 빈 자리를 두지 않고, 캡처가 있는 사례는 출처 캡션을 보인다', () => {
		const { unmount } = render(<ServiceExhibit exhibit={exhibit} />);
		expect(screen.queryByTestId('screen-frame')).toBeNull();
		unmount();

		render(<ServiceExhibit exhibit={getExhibit('wello-responsive-search')!} />);
		const frame = screen.getByTestId('screen-frame');
		expect(within(frame).getAllByRole('img')[0]).toHaveAttribute('alt', expect.stringContaining('통합검색'));
		expect(frame).toHaveTextContent('2026-10-07');

		// 개선 전 화면은 없으므로 개선 후 화면으로 채우지 않는다.
		fireEvent.click(screen.getByRole('radio', { name: /개선 전/ }));
		expect(screen.queryByTestId('screen-frame')).toBeNull();
	});
});

describe('3D 무대', () => {
	it('사용자가 버튼을 누르기 전에는 캔버스를 불러오지 않는다', async () => {
		render(<ServiceExhibit exhibit={exhibit} />);

		await loadButton();
		await new Promise(resolve => setTimeout(resolve, 20));

		expect(canvasMock.mounts).toBe(0);
		expect(screen.queryByTestId('service-canvas')).not.toBeInTheDocument();
	});

	it('버튼을 누르면 aria-hidden 캔버스가 열리고 컨트롤 상태가 그대로 전달된다', async () => {
		render(<ServiceExhibit exhibit={exhibit} />);

		fireEvent.click(await loadButton());
		const wrapper = await screen.findByTestId('service-canvas');

		expect(wrapper).toHaveAttribute('aria-hidden', 'true');
		await waitFor(() => expect(screen.getByTestId('stage-status')).toHaveTextContent('3D로 보는 중'));
		expect(canvasMock.last).toMatchObject({
			exhibit,
			variant: 'after',
			phase: 0,
			exploded: false,
			reducedMotion: false,
		});

		fireEvent.click(screen.getByRole('radio', { name: /개선 전/ }));
		fireEvent.click(within(screen.getByRole('group', { name: /단계/ })).getAllByRole('button')[2]);
		fireEvent.click(await screen.findByRole('switch'));

		expect(canvasMock.last).toMatchObject({ variant: 'before', phase: 2, exploded: true });
		// 평면 도식은 3D 가 켜져도 DOM 에 남는다.
		expect(screen.getByTestId('flow-poster')).toBeInTheDocument();
	});

	it('평면으로 보기를 누르면 캔버스를 걷어내고 3D 버튼으로 돌아간다', async () => {
		render(<ServiceExhibit exhibit={exhibit} />);

		fireEvent.click(await loadButton());
		await screen.findByTestId('service-canvas');
		fireEvent.click(await screen.findByRole('button', { name: '평면으로 보기' }));

		expect(screen.queryByTestId('service-canvas')).not.toBeInTheDocument();
		expect(await loadButton()).toBeEnabled();
		expect(screen.getByTestId('flow-poster')).toBeInTheDocument();
	});

	it('캔버스에 전시 데이터를 그대로 넘기고 전·후 변경을 따라간다', async () => {
		const search = getExhibit('wello-responsive-search')!;
		render(<ServiceExhibit exhibit={search} />);

		fireEvent.click(await loadButton());
		await screen.findByTestId('service-canvas');
		expect(canvasMock.last?.exhibit).toBe(search);
		expect(canvasMock.last?.variant).toBe('after');

		fireEvent.click(screen.getByRole('radio', { name: /개선 전/ }));
		expect(canvasMock.last?.variant).toBe('before');
	});

	it('새로 만든 기능은 전·후 비교 없이 구현 하나만 보여 준다', () => {
		render(<ServiceExhibit exhibit={getExhibit('mydata-integration')!} />);

		expect(screen.queryByRole('radio')).toBeNull();
		expect(screen.getByTestId('phase-caption')).toHaveTextContent(/본인인증/);
	});

	it('움직임 줄이기 설정을 캔버스에 전달한다', async () => {
		stubMotion(true);
		render(<ServiceExhibit exhibit={exhibit} />);

		fireEvent.click(await loadButton());
		await screen.findByTestId('service-canvas');

		await waitFor(() => expect(canvasMock.last?.reducedMotion).toBe(true));
	});

	it('WebGL2 가 없으면 버튼 없이 평면 도식 안내만 보인다', async () => {
		stubWebGL(false);
		render(<ServiceExhibit exhibit={exhibit} />);

		expect(await screen.findByText(/3D를 열 수 없어 평면 도식으로/)).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: '3D로 구조 보기' })).not.toBeInTheDocument();
		fireEvent.click(screen.getByRole('radio', { name: /개선 전/ }));
		expect(screen.getByTestId('phase-caption')).toHaveTextContent(exhibit.phases.before[0].caption);
	});

	it('그리기 오류가 나면 캔버스를 걷어내고 다시 시도를 준다', async () => {
		canvasMock.behavior = 'throw';
		vi.spyOn(console, 'error').mockImplementation(() => {});
		render(<ServiceExhibit exhibit={exhibit} />);

		fireEvent.click(await loadButton());

		expect(await screen.findByText(/3D 화면을 그리지 못했습니다/)).toBeInTheDocument();
		expect(screen.queryByTestId('service-canvas')).not.toBeInTheDocument();

		canvasMock.behavior = 'ok';
		fireEvent.click(screen.getByRole('button', { name: '3D 다시 시도' }));
		expect(await screen.findByTestId('service-canvas')).toBeInTheDocument();
	});

	it('컨텍스트가 끊기면 멈추고, 다시 시도하면 캔버스를 새로 올린다', async () => {
		render(<ServiceExhibit exhibit={exhibit} />);

		fireEvent.click(await loadButton());
		await screen.findByTestId('service-canvas');
		const before = canvasMock.mounts;

		act(() => canvasMock.last?.onContextLost());

		expect(await screen.findByText(/그래픽 연결이 끊겨/)).toBeInTheDocument();
		expect(screen.queryByTestId('service-canvas')).not.toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: '3D 다시 시도' }));
		await screen.findByTestId('service-canvas');
		await waitFor(() => expect(canvasMock.mounts).toBeGreaterThan(before));
	});
});
