import { renderToString } from 'react-dom/server';

import { EXHIBITS } from '@/portfolio/exhibits';

import ServiceSceneCanvas from './ServiceSceneCanvas';

describe('ServiceSceneCanvas', () => {
	it('서버에서 import·렌더해도 예외가 없고 캔버스는 aria-hidden 이다', () => {
		const html = renderToString(
			<ServiceSceneCanvas
				exhibit={EXHIBITS[0]}
				phase={0}
				variant="after"
				exploded={false}
				reducedMotion
				onReady={() => {}}
				onContextLost={() => {}}
			/>,
		);
		expect(html).toContain('aria-hidden="true"');
	});
});
