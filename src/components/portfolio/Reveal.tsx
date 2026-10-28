'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/utils';

import { canObserve, prefersReducedMotion } from './motion';

/**
 * 화면 아래쪽에 있던 내용이 스크롤로 들어올 때 한 번 부드럽게 나타난다.
 * 서버가 그린 HTML 은 항상 보이는 상태이고, 스크립트·IntersectionObserver 가 있으며 모션을 줄이지 않았을 때만 숨겼다 보여 준다.
 */
const Reveal = ({ children, className }: { children: ReactNode; className?: string }) => {
	const ref = useRef<HTMLDivElement>(null);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		const el = ref.current;

		if (!el || prefersReducedMotion() || !canObserve()) return;
		if (el.getBoundingClientRect().top < window.innerHeight) return;

		setHidden(true);
		const observer = new IntersectionObserver(
			entries => {
				if (entries.some(entry => entry.isIntersecting)) {
					setHidden(false);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 },
		);

		observer.observe(el);

		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			data-revealed={!hidden}
			className={cn(
				'transition-[opacity,transform] duration-500 ease-out',
				hidden && 'translate-y-3 opacity-0',
				className,
			)}>
			{children}
		</div>
	);
};

export default Reveal;
