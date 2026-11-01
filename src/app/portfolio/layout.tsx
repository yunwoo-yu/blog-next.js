import type { ReactNode } from 'react';

import PortfolioTopBar from '@/components/portfolio/PortfolioTopBar';
import { cn } from '@/utils/utils';

import './portfolio.css';

/** 포트폴리오 영역은 사이트 테마와 무관하게 흰 바탕의 라이트 팔레트로 고정한다(portfolio.css). */
export default function PortfolioLayout({ children }: { children: ReactNode }) {
	return (
		<div
			className={cn(
				// 공통 헤더를 숨기므로 main 의 위쪽 여백을 되돌리고, 인쇄에서는 화면 높이·여백 보정을 해제한다.
				'pf-root mt-[calc(var(--header-height)*-1)] min-h-screen bg-white text-[15px] leading-[1.6] text-pf-gray-800 antialiased [color-scheme:light] print:mt-0 print:min-h-0',
				// 이력서 원문의 강조색을 라이트 팔레트로 맞춘다. 인쇄 컴포넌트의 !important 글자색은 유지한다.
				'[&_strong]:font-bold [&_strong]:text-pf-gray-900 dark:[&_strong]:text-pf-gray-900',
				// 도식의 정적 transform 은 두고 전환만 끈다. 움직이는 transform 은 각 컴포넌트의 motion-safe: 로 제한한다.
				'motion-reduce:[&_*]:![transition:none] motion-reduce:[&_*::before]:![transition:none] motion-reduce:[&_*::after]:![transition:none]',
			)}>
			<PortfolioTopBar />
			{children}
		</div>
	);
}
