import { clampPhase, type PhaseIndex } from './exhibits';

/**
 * 스크롤 3D 월드의 순수 계산. DOM·three 를 모른다.
 * 섹션 0 은 전경(hero), 1~N 은 사례 장(chapter)이다. 카메라 포즈 i 는 섹션 i 를 비춘다.
 * 섹션 i 의 끝 구간에서 카메라가 포즈 i+1 로 넘어가므로, 다음 섹션이 올라올 때는 이미 도착해 있다.
 */

export const DIORAMA_GAP = 16;
/** 한 장 안에서 단계(phase)가 진행되는 비율. 나머지 구간은 다음 장으로 이동하는 카메라 연출. */
export const PHASE_SPAN = 0.72;
const TRAVEL_START = 0.78;
/** 전경은 단계가 없으므로 거의 처음부터 천천히 첫 장으로 다가간다. */
const HERO_TRAVEL_START = 0.12;

export interface SectionSpan {
	/** 월드 컨테이너 상단 기준 px */
	top: number;
	height: number;
}

export interface WorldState {
	/** 0 = 전경, 1~N = 장. 소수는 이동 중인 카메라 위치 */
	cameraIndex: number;
	/** 현재 섹션 번호(0 = hero) */
	section: number;
	phase: PhaseIndex;
	/** 현재 섹션 안의 진행도 0~1 */
	local: number;
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

export const smoothstep = (edge0: number, edge1: number, value: number) => {
	const t = clamp01((value - edge0) / (edge1 - edge0));

	return t * t * (3 - 2 * t);
};

/** 스크롤 위치에서 월드 상태를 구한다. scrollY 는 월드 컨테이너 상단으로부터 내려온 px. */
export const computeWorldState = (scrollY: number, spans: SectionSpan[], viewportHeight: number): WorldState => {
	if (spans.length === 0) return { cameraIndex: 0, section: 0, phase: 0, local: 0 };

	let section = 0;

	for (let index = 0; index < spans.length; index += 1) {
		if (spans[index].top <= scrollY) section = index;
	}

	const span = spans[section];
	const travel = Math.max(1, span.height - viewportHeight);
	const local = clamp01((scrollY - span.top) / travel);
	const isLast = section === spans.length - 1;
	const cameraIndex = isLast
		? section
		: section + smoothstep(section === 0 ? HERO_TRAVEL_START : TRAVEL_START, 1, local);
	const phase = section === 0 ? 0 : clampPhase(Math.floor(clamp01(local / PHASE_SPAN) * 4));

	return { cameraIndex, section, phase, local };
};

/** 장(1~N)의 단계 i 로 스크롤하려면 컨테이너 안에서 가야 하는 px. */
export const getPhaseScrollY = (span: SectionSpan, viewportHeight: number, phase: number) => {
	const travel = Math.max(1, span.height - viewportHeight);

	return span.top + travel * PHASE_SPAN * ((clampPhase(phase) + 0.5) / 4);
};

export type Vec3 = [number, number, number];

export interface CameraPose {
	position: Vec3;
	target: Vec3;
}

export const WORLD_FOV = 32;
const TAN_HALF_FOV = Math.tan((WORLD_FOV * Math.PI) / 360);
const DIORAMA_WIDTH = 14.4;
const DIORAMA_HEIGHT = 7.2;
const PORTRAIT_WIDTH = 10.4;

export const getDioramaX = (index: number) => index * DIORAMA_GAP;

/**
 * 포즈. 가로 화면에서는 카드가 왼쪽에 서므로 장면을 오른쪽으로, 세로 화면에서는 카드가 아래라서 장면을 위로 민다.
 * count 는 사례 수.
 */
export const getPose = (index: number, count: number, aspect: number): CameraPose => {
	const portrait = aspect < 0.9;

	if (index <= 0) {
		// 줄지어 선 디오라마를 비스듬히 내려다본다. 끝은 화면 밖으로 이어져 월드가 계속된다는 느낌을 준다.
		const distance = Math.max(64 / (aspect * 2 * TAN_HALF_FOV), 54);

		// 세로 화면은 한 화면에 한 디오라마밖에 못 담는다. 글이 아래쪽에 서므로 첫 장과 같은 구도(위쪽 절반)로 보여 준다.
		if (portrait) return getPose(1, count, aspect);

		// 글이 왼쪽에 서므로 첫 디오라마가 화면 오른쪽 절반에 오도록 비켜 본다.
		return { position: [-2, 12, distance], target: [-6, 1.5, 0] };
	}

	const x = getDioramaX(index - 1);
	const unitsPerDistance = 2 * TAN_HALF_FOV;

	if (portrait) {
		// 세로 화면의 장면은 위에 화면, 아래에 구조도를 쌓는다. 아래 40%는 카드가 덮으므로 위쪽 절반 남짓에 맞춘다.
		const distance = PORTRAIT_WIDTH / (aspect * unitsPerDistance);

		return { position: [x + 1.2, 2.4, distance], target: [x, -1.7, 0] };
	}

	// 가로 화면: 왼쪽 카드가 화면 폭의 약 40%를 덮으므로 디오라마가 오른쪽 62% 안에 들어오게 물러서고 오른쪽으로 민다.
	const distance = Math.max(
		DIORAMA_WIDTH / (0.58 * aspect * unitsPerDistance),
		(DIORAMA_HEIGHT / unitsPerDistance) * 1.2,
	);
	const shift = distance * unitsPerDistance * aspect * 0.2;

	return { position: [x - shift + 1.6, 3.0, distance], target: [x - shift, -0.2, 0] };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 카메라 인덱스(소수)에 해당하는 포즈. 이동 중에는 위로 들며 뒤로 물러났다가 들어와 호를 그린다. */
export const getCameraPoseAt = (cameraIndex: number, count: number, aspect: number): CameraPose => {
	const max = count;
	const clamped = Math.min(max, Math.max(0, cameraIndex));
	const from = Math.min(max, Math.floor(clamped));
	const to = Math.min(max, from + 1);
	const t = clamped - from;
	const a = getPose(from, count, aspect);
	const b = getPose(to, count, aspect);
	const arc = Math.sin(Math.PI * t);

	return {
		position: [
			lerp(a.position[0], b.position[0], t),
			lerp(a.position[1], b.position[1], t) + arc * 1.6,
			lerp(a.position[2], b.position[2], t) + arc * 4,
		],
		target: [lerp(a.target[0], b.target[0], t), lerp(a.target[1], b.target[1], t), lerp(a.target[2], b.target[2], t)],
	};
};
