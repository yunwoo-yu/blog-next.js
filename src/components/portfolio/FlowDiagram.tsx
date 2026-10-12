import {
	type Exhibit,
	getNodeLabel,
	getNodeState,
	NODE_STATE_GLYPHS,
	NODE_STATE_LABELS,
	type NodeState,
	type Variant,
} from '@/portfolio/exhibits';

interface FlowDiagramProps {
	exhibit: Exhibit;
	variant: Variant;
	phase: number;
	exploded: boolean;
}

const NODE_W = 100;
const NODE_H = 42;
const COL_X = (col: number) => 14 + col * 116;
/** 분해 보기: 계층을 멀리 벌린다. 기본 보기: 한 덩어리로 붙인다. */
const ROW_Y = (layer: number, exploded: boolean) => (exploded ? 46 + layer * 86 : 66 + layer * 68);

const STATE_CLASS: Record<NodeState, string> = {
	idle: 'pf-node-idle',
	provisional: 'pf-node-provisional',
	confirmed: 'pf-node-confirmed',
	broken: 'pf-node-broken',
	waiting: 'pf-node-waiting',
	recovered: 'pf-node-recovered',
};

/**
 * 시스템 구조 도식. 서버에서 그대로 렌더되는 SVG 이고, 3D 가 꺼져 있어도 같은 정보를 준다.
 * 각 노드의 상태는 색뿐 아니라 기호와 스크린리더용 텍스트로도 전달한다.
 */
const FlowDiagram = ({ exhibit, variant, phase, exploded }: FlowDiagramProps) => {
	const position = (id: string) => {
		const node = exhibit.nodes.find(item => item.id === id);
		if (!node) return null;

		return {
			x: COL_X(node.col),
			y: ROW_Y(node.layer, exploded),
		};
	};

	return (
		<svg
			viewBox="0 0 480 300"
			role="img"
			aria-label={`${exhibit.shortTitle} 시스템 구조 도식. ${exhibit.variantLabels[variant]}, ${phase + 1}단계.`}
			className="pf-diagram block h-full w-full"
			data-exploded={exploded}>
			{exploded &&
				exhibit.layerLabels.map((label, layer) => (
					<g key={label}>
						<line x1="8" x2="472" y1={ROW_Y(layer, true) - 14} y2={ROW_Y(layer, true) - 14} className="pf-layer-rule" />
						<text x="10" y={ROW_Y(layer, true) - 20} className="pf-layer-label">
							{label}
						</text>
					</g>
				))}

			{exhibit.edges[variant].map(([from, to]) => {
				const a = position(from);
				const b = position(to);
				if (!a || !b) return null;

				const toState = getNodeState(exhibit, variant, phase, to);
				const fromState = getNodeState(exhibit, variant, phase, from);
				const active = toState !== 'idle' && fromState !== 'idle';

				return (
					<line
						key={`${from}-${to}`}
						x1={a.x + NODE_W / 2}
						y1={a.y + NODE_H / 2}
						x2={b.x + NODE_W / 2}
						y2={b.y + NODE_H / 2}
						className={`pf-edge pf-edge-${active ? toState : 'idle'}`}
					/>
				);
			})}

			{exhibit.nodes.map(node => {
				const state = getNodeState(exhibit, variant, phase, node.id);
				const label = getNodeLabel(node, variant);

				return (
					<g
						key={node.id}
						className="pf-node"
						style={{ transform: `translate(${COL_X(node.col)}px, ${ROW_Y(node.layer, exploded)}px)` }}>
						<rect width={NODE_W} height={NODE_H} rx="6" className={STATE_CLASS[state]} />
						<text
							x={NODE_W / 2}
							y={NODE_H / 2 + 1}
							textAnchor="middle"
							dominantBaseline="middle"
							className="pf-node-text">
							{label}
						</text>
						{NODE_STATE_GLYPHS[state] && (
							<text x={NODE_W - 7} y="11" textAnchor="end" className="pf-node-glyph">
								{NODE_STATE_GLYPHS[state]}
							</text>
						)}
						<title>{`${label}: ${NODE_STATE_LABELS[state]}`}</title>
					</g>
				);
			})}
		</svg>
	);
};

export default FlowDiagram;
