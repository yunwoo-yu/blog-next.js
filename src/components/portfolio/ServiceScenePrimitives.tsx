'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import type { PhaseIndex, Variant } from '@/portfolio/exhibits';

export type V3 = readonly [number, number, number];
export const ZERO: V3 = [0, 0, 0];

export type Tone = 'ink' | 'steel' | 'paper' | 'info' | 'ok' | 'good' | 'warn' | 'bad';

/** 작업 도면 팔레트: 잉크·점토·종이 + 확정(주황)·파손(빨강)·복구(초록) */
export const TONES: Record<Tone, string> = {
	ink: '#14161A',
	steel: '#cfc8ba',
	paper: '#F2F0EA',
	info: '#4a4f5a',
	ok: '#FF5A1F',
	good: '#2EA36B',
	warn: '#E5484D',
	bad: '#E5484D',
};

/** 어두운 배경에서는 잉크·강철 톤이 묻히므로 한 단계 밝힌다. 확정·파손·복구 색은 그대로 둔다. */
export const TONES_DARK: Record<Tone, string> = {
	...TONES,
	ink: '#3d4455',
	steel: '#a8a293',
	info: '#7f8a9e',
};

export const getTones = (dark: boolean) => (dark ? TONES_DARK : TONES);

/** 점토처럼 무광으로 고정 */
const matte = (metalness: number, roughness: number) => ({
	metalness: Math.min(metalness, 0.08),
	roughness: Math.max(roughness, 0.72),
});

export interface SceneState {
	phase: PhaseIndex;
	variant: Variant;
	exploded: boolean;
	reducedMotion: boolean;
	/** 어두운 테마에서 보이는지. 생략하면 밝은 테마. */
	dark?: boolean;
}

const SceneContext = createContext<SceneState>({ phase: 0, variant: 'after', exploded: false, reducedMotion: true });
export const SceneProvider = SceneContext.Provider;
export const useScene = () => useContext(SceneContext);

const MAX_STEP = 1 / 30;
const SETTLE = 1e-3;
const tmpP = new THREE.Vector3();
const tmpS = new THREE.Vector3();

interface PartProps {
	pos: V3;
	/** 분해 보기에서 더해지는 오프셋 */
	lift?: V3;
	scale?: number | V3;
	rot?: V3;
	show?: boolean;
	children?: ReactNode;
}

/**
 * 위치·스케일·표시 여부가 props 로 바뀔 때만 짧게 보간하는 그룹.
 * 움직이는 동안에만 invalidate 하고, reducedMotion 이면 즉시 맞춘다.
 */
export const Part = ({ pos, lift = ZERO, scale = 1, rot = ZERO, show = true, children }: PartProps) => {
	const { exploded, reducedMotion } = useScene();
	const invalidate = useThree(s => s.invalidate);
	const ref = useRef<THREE.Group>(null);
	const cur = useRef<{ p: THREE.Vector3; s: THREE.Vector3; v: number } | null>(null);
	const sc: V3 = typeof scale === 'number' ? [scale, scale, scale] : scale;
	const lf = exploded ? lift : ZERO;

	// 부모가 props 를 바꿔 다시 렌더할 때만 실행된다 → 한 번 그려 보간을 시작
	useEffect(() => {
		invalidate();
	});

	useFrame((state, delta) => {
		const g = ref.current;
		if (!g) return;
		tmpP.set(pos[0] + lf[0], pos[1] + lf[1], pos[2] + lf[2]);
		tmpS.set(sc[0], sc[1], sc[2]);
		const vt = show ? 1 : 0;
		let c = cur.current;
		let moving = false;
		if (!c) {
			c = { p: tmpP.clone(), s: tmpS.clone(), v: vt };
			cur.current = c;
		} else if (reducedMotion) {
			c.p.copy(tmpP);
			c.s.copy(tmpS);
			c.v = vt;
		} else {
			const k = 1 - Math.exp(-Math.min(delta, MAX_STEP) * 9);
			c.p.lerp(tmpP, k);
			c.s.lerp(tmpS, k);
			c.v += (vt - c.v) * k;
			if (c.p.distanceTo(tmpP) > SETTLE || c.s.distanceTo(tmpS) > SETTLE || Math.abs(vt - c.v) > SETTLE) {
				moving = true;
			} else {
				c.p.copy(tmpP);
				c.s.copy(tmpS);
				c.v = vt;
			}
		}
		g.position.copy(c.p);
		g.scale.copy(c.s).multiplyScalar(Math.max(c.v, 1e-4));
		g.visible = c.v > 0.02;
		if (moving) state.invalidate();
	});

	return (
		<group ref={ref} rotation={[rot[0], rot[1], rot[2]]}>
			{children}
		</group>
	);
};

/** z 방향으로 분리되는 의미 단위 층. 분해 시 반투명 판이 함께 나타난다. */
export const Layer = ({
	z,
	plate,
	children,
}: {
	z: number;
	plate?: { center: readonly [number, number]; size: readonly [number, number] };
	children: ReactNode;
}) => {
	const { exploded } = useScene();
	return (
		<Part pos={ZERO} lift={[0, 0, z]}>
			{plate && (
				<Part pos={[plate.center[0], plate.center[1], -0.12]} show={exploded}>
					<Slab size={[plate.size[0], plate.size[1], 0.03]} radius={0.12} bevel={0.01} tone="info" opacity={0.08} />
					<Slab
						size={[plate.size[0], plate.size[1], 0.012]}
						radius={0.12}
						bevel={0.005}
						tone="info"
						opacity={0.22}
						wire
					/>
				</Part>
			)}
			{children}
		</Part>
	);
};

const roundedShape = (w: number, h: number, r: number) => {
	const x = -w / 2;
	const y = -h / 2;
	const s = new THREE.Shape();
	s.moveTo(x + r, y);
	s.lineTo(x + w - r, y);
	s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
	s.lineTo(x + w, y + h - r);
	s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
	s.lineTo(x + r, y + h);
	s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
	s.lineTo(x, y + r);
	s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
	return s;
};

/** 외부 모델 없이 만든 모따기(bevel) 둥근 판. size 는 모따기를 포함한 바깥 치수. */
const useSlabGeometry = (w: number, h: number, d: number, radius: number, bevel: number) => {
	const geo = useMemo(() => {
		const bt = Math.max(Math.min(bevel, d * 0.45, w / 4, h / 4), 0.001);
		const bs = bt * 0.8;
		const iw = Math.max(w - 2 * bs, 0.01);
		const ih = Math.max(h - 2 * bs, 0.01);
		const r = Math.max(Math.min(radius - bs, iw / 2 - 0.001, ih / 2 - 0.001), 0.001);
		const depth = Math.max(d - 2 * bt, 0.002);
		const g = new THREE.ExtrudeGeometry(roundedShape(iw, ih, r), {
			depth,
			bevelEnabled: true,
			bevelThickness: bt,
			bevelSize: bs,
			bevelSegments: 3,
			curveSegments: 8,
		});
		g.translate(0, 0, -depth / 2);
		return g;
	}, [w, h, d, radius, bevel]);
	useEffect(() => () => geo.dispose(), [geo]);
	return geo;
};

interface SlabProps {
	size: V3;
	radius?: number;
	bevel?: number;
	tone?: Tone;
	color?: string;
	metalness?: number;
	roughness?: number;
	glow?: number;
	opacity?: number;
	wire?: boolean;
	position?: V3;
}

export const Slab = ({
	size,
	radius = 0.08,
	bevel = 0.025,
	tone = 'steel',
	color,
	metalness = 0.3,
	roughness = 0.42,
	glow = 0,
	opacity = 1,
	wire = false,
	position = ZERO,
}: SlabProps) => {
	const { dark } = useScene();
	const geo = useSlabGeometry(size[0], size[1], size[2], radius, bevel);
	const c = color ?? getTones(Boolean(dark))[tone];
	const edges = useMemo(() => new THREE.EdgesGeometry(geo, 35), [geo]);
	useEffect(() => () => edges.dispose(), [edges]);
	return (
		<mesh geometry={geo} position={[position[0], position[1], position[2]]}>
			<meshStandardMaterial
				color={c}
				{...matte(metalness, roughness)}
				emissive={glow > 0 ? c : '#000000'}
				emissiveIntensity={glow * 0.6}
				transparent={opacity < 1}
				opacity={opacity}
				depthWrite={opacity >= 1}
				wireframe={wire}
			/>
			{opacity >= 1 && !wire && size[2] > 0.045 && (
				<lineSegments geometry={edges}>
					<lineBasicMaterial color="#14161A" transparent opacity={0.55} />
				</lineSegments>
			)}
		</mesh>
	);
};

/** 단순 메시용 재질. */
export const Std = ({
	tone = 'steel',
	color,
	glow = 0,
	metalness = 0.3,
	roughness = 0.45,
	opacity = 1,
	wire = false,
}: {
	tone?: Tone;
	color?: string;
	glow?: number;
	metalness?: number;
	roughness?: number;
	opacity?: number;
	wire?: boolean;
}) => {
	const { dark } = useScene();
	const c = color ?? getTones(Boolean(dark))[tone];
	return (
		<meshStandardMaterial
			color={c}
			{...matte(metalness, roughness)}
			emissive={glow > 0 ? c : '#000000'}
			emissiveIntensity={glow * 0.6}
			transparent={opacity < 1}
			opacity={opacity}
			depthWrite={opacity >= 1}
			wireframe={wire}
		/>
	);
};

/** 점들을 잇는 얇은 관(XY 평면). 첫 점을 기준으로 그려지듯 나타난다. */
export const Path = ({
	points,
	tone = 'info',
	show = true,
	radius = 0.035,
	glow = 0.5,
}: {
	points: ReadonlyArray<readonly [number, number]>;
	tone?: Tone;
	show?: boolean;
	radius?: number;
	glow?: number;
}) => {
	const [cyl, sph] = useMemo(() => [new THREE.CylinderGeometry(1, 1, 1, 10), new THREE.SphereGeometry(1, 14, 10)], []);
	useEffect(
		() => () => {
			cyl.dispose();
			sph.dispose();
		},
		[cyl, sph],
	);
	const [ox, oy] = points[0];
	const last = points.length - 1;
	return (
		<Part pos={[ox, oy, 0]} show={show}>
			{points.slice(0, -1).map((a, i) => {
				const b = points[i + 1];
				const dx = b[0] - a[0];
				const dy = b[1] - a[1];
				return (
					<mesh
						key={`s${i}`}
						geometry={cyl}
						position={[(a[0] + b[0]) / 2 - ox, (a[1] + b[1]) / 2 - oy, 0]}
						rotation={[0, 0, Math.atan2(dy, dx) - Math.PI / 2]}
						scale={[radius, Math.hypot(dx, dy), radius]}>
						<Std tone={tone} glow={glow} metalness={0.2} roughness={0.35} />
					</mesh>
				);
			})}
			{points.map((p, i) => (
				<mesh
					key={`j${i}`}
					geometry={sph}
					position={[p[0] - ox, p[1] - oy, 0]}
					scale={i === 0 || i === last ? radius * 2.4 : radius * 1.3}>
					<Std tone={tone} glow={glow} metalness={0.2} roughness={0.3} />
				</mesh>
			))}
		</Part>
	);
};

/** 공개 스크린샷을 화면에 입힌다. 로드 실패 시 null → 추상 UI 로 대체. */
const useScreenTexture = (url: string | undefined, aspect: number) => {
	const invalidate = useThree(s => s.invalidate);
	const [tex, setTex] = useState<THREE.Texture | null>(null);
	useEffect(() => {
		if (!url) {
			setTex(null);
			return;
		}
		let alive = true;
		let loaded: THREE.Texture | null = null;
		new THREE.TextureLoader().load(
			url,
			t => {
				if (!alive) {
					t.dispose();
					return;
				}
				const img = t.image as { width: number; height: number };
				const ia = img.width / img.height;
				t.colorSpace = THREE.SRGBColorSpace;
				t.anisotropy = 4;
				if (ia > aspect) {
					t.repeat.x = aspect / ia;
					t.offset.x = (1 - t.repeat.x) / 2;
				} else {
					t.repeat.y = ia / aspect;
					t.offset.y = 1 - t.repeat.y;
				}
				loaded = t;
				setTex(t);
				invalidate();
			},
			undefined,
			() => {
				if (alive) setTex(null);
			},
		);
		return () => {
			alive = false;
			loaded?.dispose();
		};
	}, [url, aspect, invalidate]);
	return tex;
};

/** 스크린샷이 없을 때 쓰는 추상 UI 면(헤더·행·강조 칩). 로고·문구 없음. */
export const UiSurface = ({ w, h, tone = 'info', rows = 3 }: { w: number; h: number; tone?: Tone; rows?: number }) => (
	<group>
		<Slab size={[w * 0.86, h * 0.09, 0.025]} radius={0.03} bevel={0.008} color="#d3ccbc" position={[0, h * 0.36, 0]} />
		<Slab
			size={[w * 0.28, h * 0.07, 0.03]}
			radius={0.03}
			bevel={0.01}
			tone={tone}
			glow={0.35}
			position={[-w * 0.29, h * 0.2, 0]}
		/>
		{Array.from({ length: rows }, (_, i) => (
			<Slab
				key={i}
				size={[w * 0.86, h * 0.12, 0.025]}
				radius={0.035}
				bevel={0.008}
				color={i % 2 ? '#dcd6c8' : '#d3ccbc'}
				position={[0, h * 0.04 - i * h * 0.17, 0]}
			/>
		))}
	</group>
);

/** 베젤이 있는 화면. image 가 있으면 텍스처, 없으면 children(기본 추상 UI). */
export const Screen = ({
	w,
	h,
	d = 0.1,
	bezel = 0.07,
	image,
	tone = 'info',
	rows = 3,
	children,
}: {
	w: number;
	h: number;
	d?: number;
	bezel?: number;
	image?: string;
	tone?: Tone;
	rows?: number;
	children?: ReactNode;
}) => {
	const { dark } = useScene();
	const iw = w - bezel * 2;
	const ih = h - bezel * 2;
	const tex = useScreenTexture(image, iw / ih);
	const z = d / 2 + 0.006;
	return (
		<group>
			<Slab
				size={[w, h, d]}
				radius={Math.min(0.14, w / 6)}
				bevel={0.028}
				color={dark ? '#303644' : '#14161A'}
				metalness={0.5}
				roughness={0.35}
			/>
			{tex ? (
				<mesh position={[0, 0, z]}>
					<planeGeometry args={[iw, ih]} />
					<meshBasicMaterial map={tex} toneMapped={false} />
				</mesh>
			) : (
				<>
					<mesh position={[0, 0, z]}>
						<planeGeometry args={[iw, ih]} />
						<meshBasicMaterial color="#ECE8DD" toneMapped={false} />
					</mesh>
					<group position={[0, 0, z + 0.014]}>{children ?? <UiSurface w={iw} h={ih} tone={tone} rows={rows} />}</group>
				</>
			)}
		</group>
	);
};
