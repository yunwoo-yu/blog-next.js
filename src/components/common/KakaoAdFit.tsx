'use client';

import { useEffect, useRef } from 'react';

interface KakaoAdFitProps {
	unit: string;
	width: string;
	height: string;
	disabled?: boolean;
}

const KakaoAdFit = ({ unit, width, height, disabled = true }: KakaoAdFitProps) => {
	const scriptElementWrapper = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!disabled) {
			const script = document.createElement('script');
			script.setAttribute('src', '//t1.daumcdn.net/kas/static/ba.min.js');
			script.setAttribute('async', 'true');
			scriptElementWrapper.current?.appendChild(script);

			return () => {
				// const globalAdfit = 'adfit' in window ? window.adfit : null;
				// if (globalAdfit) globalAdfit.destroy(unit);
			};
		}
	}, [disabled]);

	return (
		<aside
			className="hidden lg:block"
			ref={scriptElementWrapper}
			style={{ width: `${width}px`, height: `${height}px` }}>
			<ins
				className="kakao_ad_area"
				style={{ display: 'none' }}
				data-ad-unit={unit}
				data-ad-width={width}
				data-ad-height={height}
			/>
		</aside>
	);
};

export default KakaoAdFit;
