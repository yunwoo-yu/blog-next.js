'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/utils/utils';

const CLIENT_ID = 'ca-pub-5735722585151965';

interface AdSlotProps {
	slot: string | undefined;
	format?: string;
	fullWidthResponsive?: boolean;
	className?: string;
	style?: React.CSSProperties;
}

declare global {
	interface Window {
		adsbygoogle?: unknown[];
	}
}

const AdSlot = ({ slot, format = 'auto', fullWidthResponsive = true, className, style }: AdSlotProps) => {
	const pushed = useRef(false);

	useEffect(() => {
		if (!slot || pushed.current) return;
		try {
			window.adsbygoogle = window.adsbygoogle ?? [];
			window.adsbygoogle.push({});
			pushed.current = true;
		} catch {
			// AdSense 미로드 상태(개발/심사 대기) 무시
		}
	}, [slot]);

	if (!slot) return null;

	return (
		<ins
			className={cn('adsbygoogle block', className)}
			style={{ display: 'block', ...style }}
			data-ad-client={CLIENT_ID}
			data-ad-slot={slot}
			data-ad-format={format}
			data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
		/>
	);
};

export default AdSlot;
