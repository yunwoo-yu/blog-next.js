// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';

import { getExhibit } from '@/portfolio/exhibits';

import ServiceExhibit from './ServiceExhibit';

// 모듈 import 자체가 거부되는 경로다. 팩토리가 던지면 `import('./ServiceSceneCanvas')` 가 실제로 reject 된다.
// 이 테스트는 "네트워크가 복구되면 나아진다"를 증명하지 않는다 — 실제 청크 abort 후 복구는 프로덕션 브라우저에서 따로 확인한다.
vi.mock('./ServiceSceneCanvas', () => {
	throw new Error('Failed to load chunk');
});

beforeEach(() => {
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ getExtension: () => null } as never);
	vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

const exhibit = getExhibit('wellomarket-checkout')!;

describe('ServiceExhibit 청크 import 실패', () => {
	it('캔버스 없이 청크 실패 안내를 보이고 평면 도식·컨트롤은 유지한다', async () => {
		render(<ServiceExhibit exhibit={exhibit} onReload={vi.fn()} />);

		fireEvent.click(await screen.findByRole('button', { name: '3D로 구조 보기' }));

		expect(await screen.findByText(/3D 화면 파일을 받지 못했습니다/)).toBeInTheDocument();
		expect(screen.queryByTestId('service-canvas')).not.toBeInTheDocument();
		expect(screen.getByTestId('flow-poster')).toBeInTheDocument();
		fireEvent.click(screen.getByRole('radio', { name: /위험 시나리오/ }));
		expect(screen.getByTestId('phase-caption')).toHaveTextContent(exhibit.phases.before[0].caption);
	});

	it('효과 없는 "3D 다시 시도" 대신 사용자가 누르는 새로고침 버튼만 주고 자동으로 새로고침하지 않는다', async () => {
		const onReload = vi.fn();
		render(<ServiceExhibit exhibit={exhibit} onReload={onReload} />);
		fireEvent.click(await screen.findByRole('button', { name: '3D로 구조 보기' }));
		await screen.findByText(/3D 화면 파일을 받지 못했습니다/);

		expect(screen.queryByRole('button', { name: '3D 다시 시도' })).not.toBeInTheDocument();
		expect(onReload).not.toHaveBeenCalled();

		fireEvent.click(screen.getByRole('button', { name: '페이지 새로고침 후 다시 시도' }));
		expect(onReload).toHaveBeenCalledTimes(1);
	});
});
