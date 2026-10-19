import type { ReactNode } from 'react';

import PortfolioTopBar from '@/components/portfolio/PortfolioTopBar';

import './portfolio.css';

/** 포트폴리오 영역은 사이트 테마와 무관하게 흰 바탕의 라이트 팔레트로 고정한다(portfolio.css). */
export default function PortfolioLayout({ children }: { children: ReactNode }) {
	return (
		<div className="pf-root min-h-full">
			<PortfolioTopBar />
			{children}
		</div>
	);
}
