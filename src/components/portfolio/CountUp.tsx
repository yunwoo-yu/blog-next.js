'use client';

import { useEffect, useRef, useState } from 'react';

import { canObserve, prefersReducedMotion } from './motion';

const DURATION_MS = 900;

/** 문자열 안의 모든 정수를 비율만큼 줄인다. "400~600ms" 의 두 수가 함께 올라간다. */
export const scaleNumbers = (value: string, ratio: number) =>
	value.replace(/\d+/g, digits => String(Math.round(Number(digits) * Math.max(0, ratio))));

/**
 * 서버가 최종값을 그리고, 마운트 시 이미 뷰포트 안에 있으면 그대로 두어 깜빡이지 않는다.
 * 뷰포트 아래쪽에 있을 때만 0 으로 시작해 보이는 순간 한 번 최종값까지 올라간다.
 * 모션을 줄였거나 관찰 API 가 없으면 항상 최종값이다.
 * 보조기기에는 최종값만 읽히도록 움직이는 글자는 숨기고 같은 값을 sr-only 로 둔다.
 */
const CountUp = ({ value, className }: { value: string; className?: string }) => {
	const ref = useRef<HTMLSpanElement>(null);
	const [display, setDisplay] = useState(value);

	useEffect(() => {
		const el = ref.current;

		if (!el || prefersReducedMotion() || !canObserve() || !/\d/.test(value)) return;
		// 이미 보이는 자리(또는 지나친 자리)면 최종값을 유지하고 애니메이션을 건너뛴다. Reveal 과 같은 기준이다.
		if (el.getBoundingClientRect().top < window.innerHeight) return;

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
