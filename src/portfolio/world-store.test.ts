import { createWorldStore } from './world-store';

describe('createWorldStore', () => {
	it('장·단계가 바뀔 때만 뷰가 새 객체가 되고, 카메라 이동은 모션만 알린다', () => {
		const store = createWorldStore(4);
		const view = vi.fn();
		const motion = vi.fn();

		store.subscribe(view);
		store.subscribeMotion(motion);

		store.applyScroll({ cameraIndex: 1, section: 1, phase: 0, local: 0 });
		expect(view).toHaveBeenCalledTimes(1);

		const before = store.getView();

		store.applyScroll({ cameraIndex: 1.4, section: 1, phase: 0, local: 0.9 });
		expect(store.getView()).toBe(before);
		expect(view).toHaveBeenCalledTimes(1);
		expect(motion).toHaveBeenCalledTimes(2);
		expect(store.motion.cameraIndex).toBe(1.4);

		store.applyScroll({ cameraIndex: 1.4, section: 1, phase: 0, local: 0.9 });
		expect(motion).toHaveBeenCalledTimes(2);
	});

	it('전·후와 분해는 해당 사례만 바꾸고 같은 값이면 알리지 않는다', () => {
		const store = createWorldStore(3);
		const view = vi.fn();

		store.subscribe(view);
		store.setVariant(1, 'before');
		store.setVariant(1, 'before');
		store.toggleExploded(2);

		expect(store.getView().variants).toEqual(['after', 'before', 'after']);
		expect(store.getView().exploded).toEqual([false, false, true]);
		expect(view).toHaveBeenCalledTimes(2);
	});

	it('구독을 해제하면 더 알리지 않는다', () => {
		const store = createWorldStore(1);
		const view = vi.fn();
		const off = store.subscribe(view);

		off();
		store.toggleExploded(0);

		expect(view).not.toHaveBeenCalled();
	});

	it('같은 포인터 위치는 알리지 않는다', () => {
		const store = createWorldStore(1);
		const motion = vi.fn();

		store.subscribeMotion(motion);
		store.setPointer(0.2, -0.1);
		store.setPointer(0.2, -0.1);

		expect(motion).toHaveBeenCalledTimes(1);
	});
});
