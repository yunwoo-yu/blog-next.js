'use client';

import { Component, type ComponentType, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import type { ServiceSceneCanvasProps } from '@/portfolio/service-scene.types';
import { detectWebGL } from '@/portfolio/webgl-support';
import { cn } from '@/utils/utils';

/**
 * three/R3F 는 이 파일에서 값으로 import 하지 않는다. 사용자가 버튼을 누른 뒤에만 청크를 받는다.
 * React.lazy 대신 직접 import() 해서 청크 로드 실패(네트워크)와 렌더 오류를 구분한다.
 */
const importCanvas = () => import('./ServiceSceneCanvas');

type StagePhase = 'checking' | 'unsupported' | 'idle' | 'loading' | 'ready' | 'failed';
/** chunk: 3D 파일 받기 실패 / error: 그리기 오류 / context-lost: 그래픽 연결 끊김 */
type FailureReason = 'chunk' | 'error' | 'context-lost';

const FAILURE_MESSAGES: Record<FailureReason, string> = {
	chunk:
		'3D 화면 파일을 받지 못했습니다. 연결을 확인한 뒤 페이지를 새로고침하면 다시 불러올 수 있습니다. 위의 평면 도식은 그대로 사용할 수 있습니다.',
	error: '3D 화면을 그리지 못했습니다. 위의 평면 도식은 그대로 사용할 수 있습니다.',
	'context-lost': '그래픽 연결이 끊겨 3D 화면을 멈췄습니다. 다시 시도하거나 평면 도식을 계속 사용할 수 있습니다.',
};

/** 빈 문자열이면 문구를 그리지 않는다(평소에는 버튼만 보인다). */
const STATUS_MESSAGES: Record<Exclude<StagePhase, 'failed'>, string> = {
	checking: '',
	unsupported: '이 브라우저에서는 3D를 열 수 없어 평면 도식으로 보여 드립니다. 내용은 같습니다.',
	idle: '',
	loading: '3D 화면을 준비하는 중입니다.',
	ready: '3D로 보는 중입니다. 단계·전후 버튼이 3D에도 같이 적용됩니다.',
};

class CanvasBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
	state = { failed: false };

	static getDerivedStateFromError() {
		return { failed: true };
	}

	componentDidCatch() {
		this.props.onError();
	}

	render() {
		return this.state.failed ? null : this.props.children;
	}
}

type SceneState = Pick<ServiceSceneCanvasProps, 'exhibit' | 'phase' | 'variant' | 'exploded'>;

interface ServiceStageProps extends SceneState {
	reducedMotion: boolean;
	/** 3D 가 켜졌을 때만 보이는 계층 분해 전환 */
	onToggleExploded?: () => void;
	/** 항상 보이는 평면 도식. 3D 가 켜져도 DOM 에 남아 스크린리더와 키보드 사용자에게 같은 내용을 준다. */
	poster: ReactNode;
	/** 청크 로드 실패 뒤 사용자가 누르는 새로고침 동작. 테스트에서 대체한다. */
	onReload?: () => void;
}

const reloadPage = () => window.location.reload();

const buttonStyle =
	'inline-flex h-10 items-center rounded-md border border-pf-ink px-4 text-sm font-medium transition-colors hover:bg-pf-ink hover:text-pf-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A1F] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none';

const ServiceStage = ({
	exhibit,
	phase,
	variant,
	exploded,
	reducedMotion,
	onToggleExploded,
	poster,
	onReload = reloadPage,
}: ServiceStageProps) => {
	const [stage, setStage] = useState<StagePhase>('checking');
	const [failure, setFailure] = useState<FailureReason>('error');
	const [attempt, setAttempt] = useState(0);
	const [Canvas, setCanvas] = useState<ComponentType<ServiceSceneCanvasProps> | null>(null);
	const stageRef = useRef(stage);
	stageRef.current = stage;
	const loadIdRef = useRef(0);

	// 언마운트 뒤 늦게 끝난 import 가 상태를 건드리지 않게 한다.
	useEffect(
		() => () => {
			loadIdRef.current += 1;
		},
		[],
	);

	// hydration 이후에만 기능을 확인한다. 서버 렌더와 첫 클라이언트 렌더는 같은 DOM 이다.
	useEffect(() => {
		setStage(detectWebGL() ? 'idle' : 'unsupported');
	}, []);

	const fail = useCallback((reason: FailureReason) => {
		setFailure(reason);
		setStage('failed');
		setCanvas(null);
	}, []);

	const start = () => {
		const loadId = ++loadIdRef.current;

		setCanvas(null);
		setAttempt(count => count + 1);
		setStage('loading');

		importCanvas().then(
			module => {
				if (loadId === loadIdRef.current) setCanvas(() => module.default);
			},
			() => {
				if (loadId === loadIdRef.current) fail('chunk');
			},
		);
	};

	// 3D 를 끄고 평면 도식으로 돌아간다. 진행 중이던 불러오기는 무효로 만든다.
	const stop = () => {
		loadIdRef.current += 1;
		setCanvas(null);
		setStage('idle');
	};

	const onReady = useCallback(() => {
		if (stageRef.current === 'loading') setStage('ready');
	}, []);

	const showCanvas = Canvas && (stage === 'loading' || stage === 'ready');
	const status = stage === 'failed' ? FAILURE_MESSAGES[failure] : STATUS_MESSAGES[stage];

	return (
		<div>
			{/* 비율을 고정한 무대. 평면 도식 위에 3D 를 겹치므로 켜져도 레이아웃이 움직이지 않는다. */}
			<div
				className={cn(
					'relative w-full overflow-hidden rounded-lg border border-pf-ink/25 bg-pf-stage',
					// 3D 는 세로로 쌓은 구도(화면 위, 구조도 아래)라 좁은 화면에서만 세로로 높인다.
					showCanvas ? 'aspect-[4/5] sm:aspect-[8/5]' : 'aspect-[8/5]',
				)}
				data-testid="service-stage">
				{poster}
				{showCanvas && (
					<div className="absolute inset-0 bg-pf-stage" aria-hidden="true" data-testid="service-canvas">
						<CanvasBoundary key={attempt} onError={() => fail('error')}>
							<Canvas
								exhibit={exhibit}
								phase={phase}
								variant={variant}
								exploded={exploded}
								reducedMotion={reducedMotion}
								onReady={onReady}
								onContextLost={() => fail('context-lost')}
							/>
						</CanvasBoundary>
					</div>
				)}
			</div>

			<p role="status" className="mt-2 text-sm leading-6 empty:hidden" data-testid="stage-status">
				{status}
			</p>

			<div className="mt-2 flex flex-wrap gap-2">
				{stage === 'idle' && (
					<button type="button" onClick={start} className={buttonStyle}>
						3D로 구조 보기
					</button>
				)}
				{stage === 'loading' && (
					<button type="button" disabled className={buttonStyle}>
						3D 준비 중…
					</button>
				)}
				{stage === 'ready' && (
					<>
						<button type="button" onClick={stop} className={buttonStyle}>
							평면으로 보기
						</button>
						{onToggleExploded && (
							<button
								type="button"
								role="switch"
								aria-checked={exploded}
								onClick={onToggleExploded}
								className={buttonStyle}>
								{exploded ? '계층 분해 중' : '계층 분해'}
							</button>
						)}
					</>
				)}
				{stage === 'failed' && failure === 'chunk' && (
					<button type="button" onClick={onReload} className={buttonStyle}>
						페이지 새로고침 후 다시 시도
					</button>
				)}
				{stage === 'failed' && failure !== 'chunk' && (
					<button type="button" onClick={start} className={buttonStyle}>
						3D 다시 시도
					</button>
				)}
			</div>
		</div>
	);
};

export default ServiceStage;
