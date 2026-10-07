import type { ReactNode } from 'react';

import './portfolio.css';

export default function PortfolioLayout({ children }: { children: ReactNode }) {
	return <div className="pf-root">{children}</div>;
}
