/** 모션 줄이기 설정. matchMedia 가 없는 환경(SSR·jsdom)에서는 줄이지 않는 쪽으로 본다. */
export const prefersReducedMotion = () =>
	typeof window !== 'undefined' &&
	typeof window.matchMedia === 'function' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const canObserve = () => typeof IntersectionObserver !== 'undefined';
