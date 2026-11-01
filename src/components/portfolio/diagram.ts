import type { SequenceDiagram } from '@/portfolio/stories';

/** 시퀀스 도식의 계산. 화면용(SequenceDiagram)과 인쇄용(PrintDiagram)이 같이 쓴다. */

export type DiagramStep = SequenceDiagram['steps'][number];
export type Tone = NonNullable<DiagramStep['tone']>;

/** 보조기기용 순서 목록에서 단계 뒤에 붙이는 이름. 보이는 도식에는 칩 대신 선 모양·색과 범례를 쓴다. */
export const TONE_LABEL: Record<Tone, string> = { normal: '', problem: '문제', fix: '해결' };

/** 도식 아래 범례 한 줄의 항목. 화면·인쇄 모두 문제는 빨간 점선, 해결은 파란 실선이다. */
const LEGEND: Partial<Record<Tone, string>> = { problem: '점선 빨강: 문제 흐름', fix: '실선 파랑: 해결 흐름' };

/** 도식에 실제로 나오는 종류만 범례에 싣는다. 없으면 빈 문자열. */
export const getLegend = (diagram: Pick<SequenceDiagram, 'steps'>) =>
	(['problem', 'fix'] as const)
		.filter(tone => diagram.steps.some(step => getTone(step) === tone))
		.map(tone => LEGEND[tone])
		.join(' · ');

export const getTone = (step: DiagramStep): Tone => step.tone ?? 'normal';

/** index 번째 참여자의 세로줄 위치(가로 %). */
export const centerOf = (count: number, index: number) => `${((index + 0.5) / count) * 100}%`;

/**
 * 라벨이 한 칸에 갇히지 않도록 이웃 칸까지 넓힌 열 범위(0부터), 화살표 방향, 자기 자신에게 보내는지 여부.
 * 넓히는 쪽은 화살표 쪽이 아닌 여유 쪽이다.
 */
export const getLabelSpan = (count: number, step: DiagramStep) => {
	let start = Math.min(step.from, step.to);
	let end = Math.max(step.from, step.to);

	if (count > 2 && end - start < 1) {
		if (end + 1 < count) end += 1;
		else start -= 1;
	}

	return { start, end, rightward: step.to >= step.from, self: step.from === step.to };
};
