'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import * as THREE from 'three';

import useDarkMode from '@/hooks/useDarkMode';
import { type Exhibit, getStageScreen } from '@/portfolio/exhibits';
import { getCameraPoseAt, getDioramaX, WORLD_FOV } from '@/portfolio/world';
import type { WorldStore } from '@/portfolio/world-store';

import { SceneProvider } from './ServiceScenePrimitives';
import StructureScene from './StructureScene';

interface WorldCanvasProps {
	exhibits: Exhibit[];
	store: WorldStore;
	reducedMotion: boolean;
	onReady: () => void;
	onContextLost: () => void;
}

/** 스크롤이 정한 카메라 위치(소수 인덱스)를 감쇠하며 따라간다. 도착하면 렌더를 멈춘다(frameloop=demand). */
const CameraRig = ({ store, count }: { store: WorldStore; count: number }) => {
	const invalidate = useThree(state => state.invalidate);
	const look = useMemo(() => new THREE.Vector3(), []);
	const placed = useRef(false);

	useEffect(() => store.subscribeMotion(invalidate), [store, invalidate]);

	useFrame((state, delta) => {
		const motion = store.motion;

		if (!placed.current) {
			motion.smoothIndex = motion.cameraIndex;
			placed.current = true;
		} else {
			const k = 1 - Math.exp(-Math.min(delta, 1 / 30) * 7);

			motion.smoothIndex += (motion.cameraIndex - motion.smoothIndex) * k;

			if (Math.abs(motion.cameraIndex - motion.smoothIndex) > 1e-3) state.invalidate();
			else motion.smoothIndex = motion.cameraIndex;
		}

		const aspect = state.size.width / Math.max(1, state.size.height);
		const pose = getCameraPoseAt(motion.smoothIndex, count, aspect);

		state.camera.position.set(...pose.position);
		look.set(...pose.target);
		state.camera.lookAt(look);
	});

	return null;
};

/** 멀리 떠 있는 점들. 카메라가 움직이면 거리에 따라 다르게 밀려 시차가 생긴다. */
const Dust = ({ span }: { span: number }) => {
	const geometry = useMemo(() => {
		const positions = new Float32Array(260 * 3);
		let seed = 7;
		const random = () => {
			seed = (seed * 16807) % 2147483647;

			return seed / 2147483647;
		};

		for (let i = 0; i < 260; i += 1) {
			positions[i * 3] = -14 + random() * (span + 28);
			positions[i * 3 + 1] = -9 + random() * 20;
			positions[i * 3 + 2] = -34 + random() * 30;
		}

		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		return geo;
	}, [span]);

	useEffect(() => () => geometry.dispose(), [geometry]);

	return (
		<points geometry={geometry}>
			<pointsMaterial color="#14161A" size={0.09} sizeAttenuation transparent opacity={0.22} depthWrite={false} />
		</points>
	);
};

/** 한 사례의 디오라마. 활성 장이면 포인터로 살짝 기울고, 지난 장은 완성 상태, 아직 안 온 장은 처음 상태로 둔다. */
const Diorama = ({
	exhibit,
	index,
	store,
	reducedMotion,
}: {
	exhibit: Exhibit;
	index: number;
	store: WorldStore;
	reducedMotion: boolean;
}) => {
	const view = useSyncExternalStore(store.subscribe, store.getView, store.getView);
	const dark = useDarkMode();
	const invalidate = useThree(state => state.invalidate);
	const group = useRef<THREE.Group>(null);
	const chapter = index + 1;
	const variant = view.variants[index];
	// 글자 텍스처가 많아 가까운 장면만 올린다. 전경(hero)에서는 앞쪽 몇 개를 보여 준다.
	const near = view.section === 0 ? chapter <= 3 : Math.abs(view.section - chapter) <= 1;
	const phase = view.section > chapter ? 3 : view.section < chapter ? 0 : view.phase;
	const active = view.section === chapter;

	// 테마가 바뀌면 색만 달라지므로 한 번 다시 그린다.
	// biome-ignore lint/correctness/useExhaustiveDependencies: dark 가 바뀔 때만 실행하려는 의도다.
	useEffect(() => invalidate(), [dark, invalidate]);

	useFrame((state, delta) => {
		const node = group.current;
		if (!node) return;

		// 카메라가 도착한 장면만 보인다. 이동 중에는 출발·도착 두 장면이 함께 보인다.
		node.visible = Math.abs(store.motion.smoothIndex - chapter) < 0.999 || view.section === 0;

		const targetY = active && !reducedMotion ? store.motion.pointerX * 0.2 : 0;
		const targetX = active && !reducedMotion ? -store.motion.pointerY * 0.09 : 0;
		const k = 1 - Math.exp(-Math.min(delta, 1 / 30) * 6);

		node.rotation.y += (targetY - node.rotation.y) * k;
		node.rotation.x += (targetX - node.rotation.x) * k;

		if (Math.abs(targetY - node.rotation.y) > 1e-3 || Math.abs(targetX - node.rotation.x) > 1e-3) state.invalidate();
	});

	return (
		<group position={[getDioramaX(index), 0, 0]} ref={group}>
			<SceneProvider value={{ phase, variant, exploded: view.exploded[index], reducedMotion, dark }}>
				{near && (
					<StructureScene
						exhibit={exhibit}
						phase={phase}
						variant={variant}
						exploded={view.exploded[index]}
						screen={getStageScreen(exhibit, variant)}
						loadScreen={view.section === 0 ? chapter <= 1 : Math.abs(view.section - chapter) <= 1}
					/>
				)}
			</SceneProvider>
		</group>
	);
};

const ReadySignal = ({ onReady }: { onReady: () => void }) => {
	const done = useRef(false);

	useFrame(() => {
		if (done.current) return;

		done.current = true;
		onReady();
	});

	return null;
};

const ContextGuard = ({ onLost }: { onLost: () => void }) => {
	const canvas = useThree(state => state.gl.domElement);
	const invalidate = useThree(state => state.invalidate);

	useEffect(() => {
		const lost = (event: Event) => {
			event.preventDefault();
			onLost();
		};
		const restored = () => invalidate();

		canvas.addEventListener('webglcontextlost', lost);
		canvas.addEventListener('webglcontextrestored', restored);

		return () => {
			canvas.removeEventListener('webglcontextlost', lost);
			canvas.removeEventListener('webglcontextrestored', restored);
		};
	}, [canvas, invalidate, onLost]);

	return null;
};

/**
 * 스크롤 3D 월드. 사례마다 디오라마 하나를 가로로 늘어놓고 카메라가 그 사이를 지나간다.
 * 캔버스는 장식(aria-hidden)이고 같은 정보는 부모 DOM 이 준다. 렌더는 움직이는 동안에만 일어난다.
 */
const WorldCanvas = ({ exhibits, store, reducedMotion, onReady, onContextLost }: WorldCanvasProps) => {
	const alive = useRef(false);
	const readyRef = useRef(onReady);
	const lostRef = useRef(onContextLost);
	readyRef.current = onReady;
	lostRef.current = onContextLost;

	useEffect(() => {
		alive.current = true;

		return () => {
			alive.current = false;
		};
	}, []);

	const handleReady = useRef(() => {
		if (alive.current) readyRef.current();
	}).current;
	const handleLost = useRef(() => {
		if (alive.current) lostRef.current();
	}).current;

	const span = getDioramaX(exhibits.length - 1);

	return (
		<Canvas
			aria-hidden="true"
			frameloop="demand"
			dpr={[1, 1.5]}
			camera={{ fov: WORLD_FOV, near: 0.5, far: 160, position: [0, 4, 40] }}
			gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
			style={{ pointerEvents: 'none' }}>
			<ambientLight intensity={1.0} />
			<hemisphereLight args={['#fffaf0', '#cfc8ba', 0.9]} />
			<directionalLight position={[10, 14, 12]} intensity={2.2} />
			<directionalLight position={[-8, 6, 10]} intensity={0.7} color="#fff1e0" />
			<CameraRig store={store} count={exhibits.length} />
			<Dust span={span} />
			{exhibits.map((exhibit, index) => (
				<Diorama key={exhibit.slug} exhibit={exhibit} index={index} store={store} reducedMotion={reducedMotion} />
			))}
			<ContextGuard onLost={handleLost} />
			<ReadySignal onReady={handleReady} />
		</Canvas>
	);
};

export default WorldCanvas;
