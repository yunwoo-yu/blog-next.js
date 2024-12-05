'use client';

import { useEffect, useRef } from 'react';

interface KakaoAdFitProps {
	unit: string;
	width: string;
	height: string;
	disabled?: boolean;
	className?: string;
}

interface Adfit {
	display: (unit: string) => void;
	destroy: (unit: string) => void;
	refresh: (unit: string) => void;
}

declare global {
	interface Window {
		adfit?: Adfit;
	}
}

const KakaoAdFit = ({ unit, width, height, className, disabled = false }: KakaoAdFitProps) => {
	const scriptElementWrapper = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!disabled) {
			const script = document.createElement('script');
			script.setAttribute('src', '//t1.daumcdn.net/kas/static/ba.min.js');
			script.setAttribute('async', 'true');
			scriptElementWrapper.current?.appendChild(script);

			return () => {
				const globalAdfit = 'adfit' in window ? window.adfit : null;

				if (globalAdfit) {
					globalAdfit.destroy(unit);
				}
			};
		}
	}, [disabled, unit]);

	return (
		<div className={className}>
			<aside ref={scriptElementWrapper} style={{ width: `${width}px`, height: `${height}px` }}>
				<ins
					className="kakao_ad_area"
					style={{ display: 'none' }}
					data-ad-unit={unit}
					data-ad-width={width}
					data-ad-height={height}
				/>
			</aside>
		</div>
	);
};

export default KakaoAdFit;
