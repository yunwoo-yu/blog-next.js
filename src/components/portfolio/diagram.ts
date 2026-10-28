import type { SequenceDiagram } from '@/portfolio/stories';

/** 시퀀스 도식의 계산. 화면용(SequenceDiagram)과 인쇄용(PrintDiagram)이 같이 쓴다. */

export type DiagramStep = SequenceDiagram['steps'][number];
export type Tone = NonNullable<DiagramStep['tone']>;

export const TONE_LABEL: Record<Tone, string> = { normal: '', problem: '문제', fix: '해결' };

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
