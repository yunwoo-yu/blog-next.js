import type { Exhibit, PhaseIndex, Variant } from './exhibits';

export interface ServiceSceneCanvasProps {
	exhibit: Exhibit;
	phase: PhaseIndex;
	variant: Variant;
	exploded: boolean;
	reducedMotion: boolean;
	onReady: () => void;
	onContextLost: () => void;
}
