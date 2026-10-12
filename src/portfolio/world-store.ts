import type { PhaseIndex, Variant } from './exhibits';
import type { WorldState } from './world';

/** React 가 구독하는 값. 장·단계·전후·분해가 바뀔 때만 새 객체가 된다. */
export interface WorldView {
	section: number;
	phase: PhaseIndex;
	variants: Variant[];
	exploded: boolean[];
}

/** 매 프레임 읽는 값. React 상태가 아니라서 스크롤마다 렌더를 일으키지 않는다. */
export interface WorldMotion {
	/** 스크롤이 가리키는 목표 카메라 위치 */
	cameraIndex: number;
	/** 카메라가 실제로 따라가는 감쇠된 위치. 캔버스가 매 프레임 갱신한다. */
	smoothIndex: number;
	/** -1~1. 마우스 위치. 터치 기기에서는 0 으로 둔다. */
	pointerX: number;
	pointerY: number;
}

export interface WorldStore {
	motion: WorldMotion;
	getView: () => WorldView;
	subscribe: (listener: () => void) => () => void;
	/** 모션이 바뀌었을 때(스크롤·포인터) 캔버스가 다시 그리도록 알리는 구독 */
	subscribeMotion: (listener: () => void) => () => void;
	applyScroll: (state: WorldState) => void;
	setPointer: (x: number, y: number) => void;
	setVariant: (index: number, variant: Variant) => void;
	toggleExploded: (index: number) => void;
}

export const createWorldStore = (count: number): WorldStore => {
	let view: WorldView = {
		section: 0,
		phase: 0,
		variants: Array.from({ length: count }, () => 'after' as Variant),
		exploded: Array.from({ length: count }, () => false),
	};
	const motion: WorldMotion = { cameraIndex: 0, smoothIndex: 0, pointerX: 0, pointerY: 0 };
	const viewListeners = new Set<() => void>();
	const motionListeners = new Set<() => void>();

	const emitView = () => {
		for (const listener of viewListeners) listener();
	};
	const emitMotion = () => {
		for (const listener of motionListeners) listener();
	};

	return {
		motion,
		getView: () => view,
		subscribe: listener => {
			viewListeners.add(listener);

			return () => viewListeners.delete(listener);
		},
		subscribeMotion: listener => {
			motionListeners.add(listener);

			return () => motionListeners.delete(listener);
		},
		applyScroll: state => {
			if (motion.cameraIndex !== state.cameraIndex) {
				motion.cameraIndex = state.cameraIndex;
				emitMotion();
			}

			if (state.section !== view.section || state.phase !== view.phase) {
				view = { ...view, section: state.section, phase: state.phase };
				emitView();
			}
		},
		setPointer: (x, y) => {
			if (motion.pointerX === x && motion.pointerY === y) return;

			motion.pointerX = x;
			motion.pointerY = y;
			emitMotion();
		},
		setVariant: (index, variant) => {
			if (view.variants[index] === variant) return;

			const variants = [...view.variants];
			variants[index] = variant;
			view = { ...view, variants };
			emitView();
		},
		toggleExploded: index => {
			const exploded = [...view.exploded];
			exploded[index] = !exploded[index];
			view = { ...view, exploded };
			emitView();
		},
	};
};
