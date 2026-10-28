import type { SequenceDiagram } from '@/portfolio/stories';

import { getTone, TONE_LABEL } from './diagram';

/** 보이는 도식은 보조기기에서 숨기므로, 같은 내용을 순서 목록으로 따로 준다. */
const DiagramReadout = ({ diagram }: { diagram: SequenceDiagram }) => (
	<ol className="sr-only">
		{diagram.steps.map((step, index) => {
			const label = TONE_LABEL[getTone(step)];

			return (
				<li key={`${step.label}-${index}`}>
					{diagram.actors[step.from]}
					{step.from === step.to ? ' 안에서' : `에서 ${diagram.actors[step.to]}(으)로`}: {step.label}
					{label && ` (${label})`}
				</li>
			);
		})}
	</ol>
);

export default DiagramReadout;
