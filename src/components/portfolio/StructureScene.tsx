'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

import {
	type Exhibit,
	type FlowNode,
	getNodeLabel,
	getNodeState,
	NODE_STATE_GLYPHS,
	type NodeState,
	type ServiceScreen,
	type Variant,
} from '@/portfolio/exhibits';

import { Layer, Part, Path, Screen, Slab, type Tone, useScene } from './ServiceScenePrimitives';

/** 열·계층 → 월드 좌표. 왼쪽 7.7칸쯤은 서비스 화면 자리이고 오른쪽이 구조도다. */
const COL_X = [-2.1, 0.4, 2.9, 5.4] as const;
const LAYER_Y = [1.7, 0, -1.7] as const;
/** 계층이 분해될 때 z 로 벌어지는 거리. 맨 위 계층이 가장 앞으로 나온다. */
const LAYER_LIFT = [1.6, 0, -1.6] as const;
const PLATE = { w: 2.35, h: 1.1, d: 0.14 } as const;
/** 구조도·화면을 합친 폭의 가운데가 원점이 되도록 옮기는 값 */
const CENTER_SHIFT = -0.35;
const SCREEN_X = -5.4;

interface Palette {
	fill: string;
	text: string;
	opacity: number;
	tone?: Tone;
}

const LIGHT: Record<NodeState, Palette> = {
	idle: { fill: '#D9D4C6', text: '#8A8576', opacity: 0.4 },
	provisional: { fill: '#F7F4EC', text: '#14161A', opacity: 1 },
	confirmed: { fill: '#D9480F', text: '#FFFFFF', opacity: 1 },
	broken: { fill: '#D6363C', text: '#FFFFFF', opacity: 1 },
	waiting: { fill: '#CFC8BA', text: '#14161A', opacity: 1 },
	recovered: { fill: '#1F8553', text: '#FFFFFF', opacity: 1 },
};

const DARK: Record<NodeState, Palette> = {
	idle: { fill: '#2A2F3A', text: '#7F8796', opacity: 0.45 },
	provisional: { fill: '#363D4C', text: '#F2F0EA', opacity: 1 },
	confirmed: { fill: '#C2410C', text: '#FFFFFF', opacity: 1 },
	broken: { fill: '#C62F35', text: '#FFFFFF', opacity: 1 },
	waiting: { fill: '#4A5160', text: '#F2F0EA', opacity: 1 },
	recovered: { fill: '#1F8553', text: '#FFFFFF', opacity: 1 },
};

const PX_PER_UNIT = 200;
const FONT = 'Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif';

interface TextStyle {
	width: number;
	height: number;
	color: string;
	size: number;
	weight?: number;
}

/** 글자 단위로 줄을 나눈다. 공백이 있으면 공백에서 먼저 끊고, 없으면(한글 위주) 폭이 차는 곳에서 끊는다. */
const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) => {
	const lines: string[] = [];
	let current = '';

	for (const char of text) {
		const next = current + char;

		if (ctx.measureText(next).width > maxWidth && current) {
			lines.push(current.trimEnd());
			current = char === ' ' ? '' : char;
		} else {
			current = next;
		}
	}

	if (current) lines.push(current.trimEnd());
	if (lines.length > maxLines) {
		const kept = lines.slice(0, maxLines);
		kept[maxLines - 1] = `${kept[maxLines - 1].slice(0, -1)}…`;

		return kept;
	}

	return lines;
};

const drawText = (canvas: HTMLCanvasElement, text: string, style: TextStyle) => {
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = style.color;
	ctx.font = `${style.weight ?? 600} ${style.size}px ${FONT}`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	const lineHeight = style.size * 1.28;
	const lines = wrapLines(ctx, text, canvas.width - style.size, Math.max(1, Math.floor(canvas.height / lineHeight)));
	const top = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

	lines.forEach((line, index) => {
		ctx.fillText(line, canvas.width / 2, top + index * lineHeight);
	});
};

/** 글자를 그린 텍스처. 글꼴이 늦게 로드되면 한 번 더 그린다. */
const useTextTexture = (text: string, style: TextStyle) => {
	const invalidate = useThree(state => state.invalidate);
	const { width, height, color, size, weight } = style;
	const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

	useEffect(() => {
		const canvas = document.createElement('canvas');
		canvas.width = Math.round(width * PX_PER_UNIT);
		canvas.height = Math.round(height * PX_PER_UNIT);

		const next = new THREE.CanvasTexture(canvas);
		next.colorSpace = THREE.SRGBColorSpace;
		next.anisotropy = 4;

		const paint = () => {
			drawText(canvas, text, { width, height, color, size, weight });
			next.needsUpdate = true;
			invalidate();
		};

		paint();
		setTexture(next);

		let alive = true;
		document.fonts?.ready.then(() => {
			if (alive) paint();
		});

		return () => {
			alive = false;
			next.dispose();
		};
	}, [text, width, height, color, size, weight, invalidate]);

	return texture;
};

const Label = ({ text, ...style }: { text: string } & TextStyle) => {
	const texture = useTextTexture(text, style);

	if (!texture) return null;

	return (
		<mesh>
			<planeGeometry args={[style.width, style.height]} />
			<meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
		</mesh>
	);
};

const GRID_CENTER_X = (COL_X[0] + COL_X[3]) / 2;

/** 세로 화면에서는 행 간격을 좁혀 위쪽 절반에 들어가게 한다. */
const layerY = (layer: number, portrait: boolean) => LAYER_Y[layer] * (portrait ? 0.85 : 1);

const nodePosition = (node: FlowNode, portrait: boolean): [number, number] => [
	COL_X[node.col],
	layerY(node.layer, portrait),
];

const NodePlate = ({
	node,
	state,
	label,
	dark,
	portrait,
}: {
	node: FlowNode;
	state: NodeState;
	label: string;
	dark: boolean;
	portrait: boolean;
}) => {
	const palette = (dark ? DARK : LIGHT)[state];
	const [x, y] = nodePosition(node, portrait);
	const glyph = NODE_STATE_GLYPHS[state];
	const active = state !== 'idle';

	return (
		<Part pos={[x, y, active ? 0.08 : 0]} scale={active ? 1 : 0.94}>
			<Slab
				size={[PLATE.w, PLATE.h, PLATE.d]}
				radius={0.14}
				bevel={0.03}
				color={palette.fill}
				metalness={0.1}
				roughness={0.7}
				opacity={palette.opacity}
				glow={state === 'confirmed' || state === 'broken' || state === 'recovered' ? 0.25 : 0}
			/>
			<group position={[0, 0, PLATE.d / 2 + 0.012]}>
				<Label
					text={glyph ? `${glyph} ${label}` : label}
					width={PLATE.w - 0.1}
					height={PLATE.h - 0.1}
					color={palette.text}
					size={50}
				/>
			</group>
		</Part>
	);
};

const edgeTone = (state: NodeState): Tone => {
	if (state === 'broken') return 'warn';
	if (state === 'recovered') return 'good';
	if (state === 'confirmed') return 'ok';

	return 'info';
};

/** 서비스 화면 자리. 공개 캡처만 텍스처로 올린다. 아직 받는 중이면 빈 화면 판이 잠깐 보인다. */
const StageScreen = ({ screen, portrait }: { screen: ServiceScreen | undefined; portrait: boolean }) => {
	const mobile = screen?.device === 'mobile';
	const scale = portrait ? 0.72 : 1;
	const w = (mobile ? 1.6 : 3.8) * scale;
	const h = (mobile ? 3.4 : 2.4) * scale;

	return (
		<group
			position={portrait ? [GRID_CENTER_X, layerY(0, true) + 1.25 + h / 2, -0.2] : [SCREEN_X, 0.1, -0.3]}
			rotation={portrait ? [0, 0, 0] : [0, 0.22, 0]}>
			<Screen w={w} h={h} image={screen?.src}>
				<group />
			</Screen>
		</group>
	);
};

interface StructureSceneProps {
	exhibit: Exhibit;
	phase: number;
	variant: Variant;
	exploded: boolean;
	/** 무대에 올릴 공개 화면. 없으면 "공개 화면 없음". */
	screen: ServiceScreen | undefined;
	/** 화면 텍스처를 받아도 되는지. 멀리 있는 장면은 이미지를 받지 않는다. */
	loadScreen?: boolean;
}

/**
 * 전시 데이터(노드·간선·상태)를 그대로 3D 로 옮긴 구조도. 도형은 장식이 아니라 이름이 붙은 노드이고,
 * 상태는 색과 기호로 함께 나타낸다. 화면은 공개 캡처만 올리고, 없으면 없다고 적는다.
 */
const StructureScene = ({ exhibit, phase, variant, exploded, screen, loadScreen = true }: StructureSceneProps) => {
	const { dark } = useScene();
	const isDark = Boolean(dark);
	const size = useThree(state => state.size);
	const portrait = size.width / Math.max(1, size.height) < 0.9;
	const states = useMemo(
		() => new Map(exhibit.nodes.map(node => [node.id, getNodeState(exhibit, variant, phase, node.id)])),
		[exhibit, variant, phase],
	);
	const nodeById = useMemo(() => new Map(exhibit.nodes.map(node => [node.id, node])), [exhibit]);
	// 분해하면 노드는 z 로 벌어지지만 연결선은 한 평면에 있어 끝이 어긋난다. 어긋난 선을 그리느니 숨긴다.
	const edges = exploded ? [] : exhibit.edges[variant];
	// 공개 화면이 없으면 빈 판을 두지 않고 구조도를 한가운데에 놓는다.
	const hasScreen = Boolean(screen);
	const position: [number, number, number] = portrait
		? [-GRID_CENTER_X, hasScreen ? -0.3 : 1.2, 0]
		: [hasScreen ? -CENTER_SHIFT : -GRID_CENTER_X, 0, 0];

	return (
		<group position={position}>
			{hasScreen && <StageScreen screen={loadScreen ? screen : undefined} portrait={portrait} />}

			{[0, 1, 2].map(layer => {
				const nodes = exhibit.nodes.filter(node => node.layer === layer);

				return (
					<Layer
						key={layer}
						z={LAYER_LIFT[layer]}
						plate={{ center: [(COL_X[0] + COL_X[3]) / 2, layerY(layer, portrait)], size: [10.2, 1.5] }}>
						{nodes.map(node => (
							<NodePlate
								key={node.id}
								node={node}
								state={states.get(node.id) ?? 'idle'}
								label={getNodeLabel(node, variant)}
								dark={isDark}
								portrait={portrait}
							/>
						))}
					</Layer>
				);
			})}

			<group position={[0, 0, -0.1]}>
				{edges.map(([from, to]) => {
					const a = nodeById.get(from);
					const b = nodeById.get(to);

					if (!a || !b) return null;

					const fromState = states.get(from) ?? 'idle';
					const toState = states.get(to) ?? 'idle';
					const visible = fromState !== 'idle' && toState !== 'idle';

					return (
						<Path
							key={`${from}-${to}`}
							points={[nodePosition(a, portrait), nodePosition(b, portrait)]}
							tone={edgeTone(toState)}
							show={visible}
							radius={0.04}
							glow={0.3}
						/>
					);
				})}
			</group>

			{exploded &&
				exhibit.layerLabels.map((text, layer) => (
					<Part key={text} pos={[COL_X[0], layerY(layer, portrait) + 0.78, LAYER_LIFT[layer]]}>
						<Label text={text} width={2.6} height={0.4} color={isDark ? '#A8A293' : '#6B6558'} size={30} weight={700} />
					</Part>
				))}
		</group>
	);
};

export default StructureScene;
