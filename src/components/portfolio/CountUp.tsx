'use client';

import { useEffect, useRef, useState } from 'react';

import { canObserve, prefersReducedMotion } from './motion';

const DURATION_MS = 900;

/** 문자열 안의 모든 정수를 비율만큼 줄인다. "400~600ms" 의 두 수가 함께 올라간다. */
export const scaleNumbers = (value: string, ratio: number) =>
	value.replace(/\d+/g, digits => String(Math.round(Number(digits) * Math.max(0, ratio))));

/**
 * 보이는 순간 한 번 0에서 최종값까지 올라간다. 모션을 줄였거나 관찰 API 가 없으면 처음부터 최종값이다.
 * 보조기기에는 최종값만 읽히도록 움직이는 글자는 숨기고 같은 값을 sr-only 로 둔다.
 */
const CountUp = ({ value, className }: { value: string; className?: string }) => {
	const ref = useRef<HTMLSpanElement>(null);
	const [display, setDisplay] = useState(value);

	useEffect(() => {
		const el = ref.current;

		if (!el || prefersReducedMotion() || !canObserve() || !/\d/.test(value)) return;

		let frame = 0;
		const observer = new IntersectionObserver(entries => {
			if (!entries.some(entry => entry.isIntersecting)) return;
			observer.disconnect();

			const startedAt = performance.now();
			const tick = (now: number) => {
				// rAF 의 timestamp 는 performance.now() 보다 앞설 수 있어 음수가 되지 않게 0 으로 막는다.
				const progress = Math.min(1, Math.max(0, (now - startedAt) / DURATION_MS));

				setDisplay(scaleNumbers(value, 1 - (1 - progress) ** 3));
				if (progress < 1) frame = requestAnimationFrame(tick);
			};

			frame = requestAnimationFrame(tick);
		});

		setDisplay(scaleNumbers(value, 0));
		observer.observe(el);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
			setDisplay(value);
		};
	}, [value]);

	return (
		<>
			<span ref={ref} aria-hidden="true" data-testid="count-up" className={className}>
				{display}
			</span>
			<span className="sr-only">{value}</span>
		</>
	);
};

export default CountUp;
