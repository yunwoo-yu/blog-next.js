'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import useDarkMode from '@/hooks/useDarkMode';
import { getStageScreen } from '@/portfolio/exhibits';
import type { ServiceSceneCanvasProps } from '@/portfolio/service-scene.types';
import { SceneProvider, type V3 } from './ServiceScenePrimitives';
import StructureScene from './StructureScene';

export type { ServiceSceneCanvasProps };

const CAMERA_REST: V3 = [3.2, 2.6, 10];
const CAMERA_EXPLODED: V3 = [6.4, 4.2, 8.2];
/** 직교 카메라가 화면에 담는 월드 폭·높이 */
const VIEW_REST = { w: 15, h: 7.8 };
const VIEW_EXPLODED = { w: 17, h: 9.4 };
const LOOK_AT = new THREE.Vector3(0, -0.1, 0);
const tmp = new THREE.Vector3();

/** 카메라 구도: 평소와 분해 보기 사이를 짧게 보간(직교 축측 투영). 줌은 캔버스 크기에 맞춘다. */
const CameraRig = ({ exploded, reducedMotion }: { exploded: boolean; reducedMotion: boolean }) => {
	const invalidate = useThree(s => s.invalidate);
	const placed = useRef(false);

	useEffect(() => {
		invalidate();
	});

	useFrame((state, delta) => {
		const base = exploded ? CAMERA_EXPLODED : CAMERA_REST;
		const view = exploded ? VIEW_EXPLODED : VIEW_REST;
		const { width, height } = state.size;
		const zoomTarget = Math.min(width / view.w, height / view.h);
		tmp.set(base[0], base[1], base[2]);
		const cam = state.camera as THREE.OrthographicCamera;
		let moving = false;
		if (!placed.current || reducedMotion) {
			cam.position.copy(tmp);
			cam.zoom = zoomTarget;
			placed.current = true;
		} else {
			const k = 1 - Math.exp(-Math.min(delta, 1 / 30) * 6);
			cam.position.lerp(tmp, k);
			cam.zoom += (zoomTarget - cam.zoom) * k;
			if (cam.position.distanceTo(tmp) > 1e-3 || Math.abs(zoomTarget - cam.zoom) > 1e-2) moving = true;
			else {
				cam.position.copy(tmp);
				cam.zoom = zoomTarget;
			}
		}
		cam.lookAt(LOOK_AT);
		cam.updateProjectionMatrix();
		if (moving) state.invalidate();
	});
	return null;
};

/** 첫 프레임이 그려질 때 한 번 알린다. */
const ReadySignal = ({ onReady }: { onReady: () => void }) => {
	const done = useRef(false);
	useFrame(() => {
		if (done.current) return;
		done.current = true;
		onReady();
	});
	return null;
};

/** 컨텍스트 소실/복원 리스너. 언마운트 시 해제한다. */
const ContextGuard = ({ onLost }: { onLost: () => void }) => {
	const canvas = useThree(s => s.gl.domElement);
	const invalidate = useThree(s => s.invalidate);
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

const Stage = ({
	exhibit,
	phase,
	variant,
	exploded,
	reducedMotion,
}: Omit<ServiceSceneCanvasProps, 'onReady' | 'onContextLost'>) => {
	const dark = useDarkMode();
	const invalidate = useThree(state => state.invalidate);
	// biome-ignore lint/correctness/useExhaustiveDependencies: dark 가 바뀔 때만 실행하려는 의도다.
	useEffect(() => invalidate(), [dark, invalidate]);
	return (
		<SceneProvider value={{ phase, variant, exploded, reducedMotion, dark }}>
			<StructureScene
				key={exhibit.slug}
				exhibit={exhibit}
				phase={phase}
				variant={variant}
				exploded={exploded}
				screen={getStageScreen(exhibit, variant)}
			/>
		</SceneProvider>
	);
};

/**
 * 서비스 포트폴리오 3D 전시 장면. 접근성 의미는 부모 DOM 이 맡고, 캔버스는 장식(aria-hidden)이다.
 * three r163+ 의 WebGLRenderer 는 WebGL2 전용이다. 렌더는 props 가 바뀌어 움직이는 동안에만 일어난다.
 */
const ServiceSceneCanvas = ({
	exhibit,
	phase,
	variant,
	exploded,
	reducedMotion,
	onReady,
	onContextLost,
}: ServiceSceneCanvasProps) => {
	// 언마운트 뒤 늦게 오는 콜백을 무시하기 위한 가드
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

	return (
		<Canvas
			aria-hidden="true"
			frameloop="demand"
			dpr={[1, 1.5]}
			orthographic
			camera={{ position: [CAMERA_REST[0], CAMERA_REST[1], CAMERA_REST[2]], zoom: 100, near: 0.1, far: 60 }}
			gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
			style={{ touchAction: 'auto', pointerEvents: 'none' }}>
			<ambientLight intensity={1.0} />
			<hemisphereLight args={['#fffaf0', '#cfc8ba', 0.9]} />
			<directionalLight position={[4, 7, 6]} intensity={2.2} />
			<directionalLight position={[-6, 3, 4]} intensity={0.7} color="#fff1e0" />
			<CameraRig exploded={exploded} reducedMotion={reducedMotion} />
			<Stage exhibit={exhibit} phase={phase} variant={variant} exploded={exploded} reducedMotion={reducedMotion} />
			<ContextGuard onLost={handleLost} />
			<ReadySignal onReady={handleReady} />
		</Canvas>
	);
};

export default ServiceSceneCanvas;
