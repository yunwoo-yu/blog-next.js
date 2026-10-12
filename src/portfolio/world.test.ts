import {
	computeWorldState,
	getCameraPoseAt,
	getDioramaX,
	getPhaseScrollY,
	getPose,
	PHASE_SPAN,
	type SectionSpan,
	smoothstep,
} from './world';

const VH = 800;
// hero 1.7 화면, 사례 4장 각 2.6 화면
const spans: SectionSpan[] = [
	{ top: 0, height: 1360 },
	{ top: 1360, height: 2080 },
	{ top: 3440, height: 2080 },
	{ top: 5520, height: 2080 },
	{ top: 7600, height: 2080 },
];

describe('computeWorldState', () => {
	it('맨 위는 전경이고 단계는 0이다', () => {
		expect(computeWorldState(0, spans, VH)).toEqual({ cameraIndex: 0, section: 0, phase: 0, local: 0 });
	});

	it('전경에서는 스크롤하는 동안 카메라가 첫 장으로 서서히 다가간다', () => {
		const travel = 1360 - VH;
		const early = computeWorldState(travel * 0.05, spans, VH);
		const mid = computeWorldState(travel * 0.5, spans, VH);
		const end = computeWorldState(travel, spans, VH);

		expect(early.cameraIndex).toBe(0);
		expect(mid.cameraIndex).toBeGreaterThan(0);
		expect(mid.cameraIndex).toBeLessThan(1);
		expect(end.cameraIndex).toBe(1);
		expect(mid.phase).toBe(0);
	});

	it('장 안에서는 스크롤에 따라 단계가 0→3 으로 오른다', () => {
		const travel = 2080 - VH;
		const at = (ratio: number) => computeWorldState(1360 + travel * ratio, spans, VH);

		expect(at(0.01).phase).toBe(0);
		expect(at(PHASE_SPAN * 0.3).phase).toBe(1);
		expect(at(PHASE_SPAN * 0.6).phase).toBe(2);
		expect(at(PHASE_SPAN * 0.95).phase).toBe(3);
		expect(at(1).phase).toBe(3);
	});

	it('장 중반까지 카메라는 그 장에 머물고, 끝 구간에서 다음 장으로 넘어간다', () => {
		const travel = 2080 - VH;
		const mid = computeWorldState(1360 + travel * 0.5, spans, VH);
		const end = computeWorldState(1360 + travel, spans, VH);

		expect(mid.section).toBe(1);
		expect(mid.cameraIndex).toBe(1);
		expect(end.cameraIndex).toBe(2);
	});

	it('다음 섹션이 올라오는 시점에는 카메라가 이미 그 장에 도착해 있다', () => {
		expect(computeWorldState(3440, spans, VH).cameraIndex).toBe(2);
	});

	it('마지막 장에서는 카메라가 더 넘어가지 않는다', () => {
		const last = computeWorldState(9680, spans, VH);

		expect(last.section).toBe(4);
		expect(last.cameraIndex).toBe(4);
	});

	it('범위를 벗어난 스크롤과 빈 입력을 안전하게 처리한다', () => {
		expect(computeWorldState(-500, spans, VH).section).toBe(0);
		expect(computeWorldState(Number.NaN, spans, VH).local).toBe(0);
		expect(computeWorldState(100, [], VH).cameraIndex).toBe(0);
	});
});

describe('getPhaseScrollY', () => {
	it('단계 지점으로 스크롤하면 그 단계가 된다', () => {
		for (const phase of [0, 1, 2, 3]) {
			const y = getPhaseScrollY(spans[2], VH, phase);

			expect(computeWorldState(y, spans, VH).phase).toBe(phase);
			expect(computeWorldState(y, spans, VH).section).toBe(2);
		}
	});
});

describe('카메라 포즈', () => {
	it('장 i 의 포즈는 해당 디오라마 근처를 비추고, 가로 화면에서는 장면을 오른쪽으로 민다', () => {
		const pose = getPose(2, 4, 1.6);

		expect(pose.target[0]).toBeLessThan(getDioramaX(1));
		expect(pose.target[0]).toBeGreaterThan(getDioramaX(0));
	});

	it('세로 화면에서는 장면을 위로 민다', () => {
		const pose = getPose(1, 4, 0.5);

		expect(pose.target[1]).toBeLessThan(0);
	});

	it('이동 중에는 위로 들며 물러났다가 도착한다', () => {
		const a = getCameraPoseAt(1, 4, 1.6);
		const mid = getCameraPoseAt(1.5, 4, 1.6);
		const b = getCameraPoseAt(2, 4, 1.6);

		expect(mid.position[1]).toBeGreaterThan(Math.max(a.position[1], b.position[1]));
		expect(mid.position[2]).toBeGreaterThan(Math.max(a.position[2], b.position[2]));
		expect(b.position[0]).toBeCloseTo(getPose(2, 4, 1.6).position[0]);
	});

	it('전경은 한 장보다 훨씬 멀리서 월드를 내려다본다', () => {
		const wide = getPose(0, 4, 1.6);
		const close = getPose(1, 4, 1.6);

		expect(wide.position[2]).toBeGreaterThan(close.position[2] * 2);
	});

	it('범위를 벗어난 인덱스는 끝 포즈로 고정한다', () => {
		expect(getCameraPoseAt(99, 4, 1.6)).toEqual(getPose(4, 4, 1.6));
		expect(getCameraPoseAt(-3, 4, 1.6)).toEqual(getPose(0, 4, 1.6));
	});
});

describe('smoothstep', () => {
	it('경계에서 0과 1, 중간에서 0.5', () => {
		expect(smoothstep(0.2, 0.8, 0.1)).toBe(0);
		expect(smoothstep(0.2, 0.8, 0.9)).toBe(1);
		expect(smoothstep(0, 1, 0.5)).toBe(0.5);
	});
});
