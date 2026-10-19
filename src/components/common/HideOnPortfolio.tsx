'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** 포트폴리오(/portfolio 이하)는 자체 상단 바를 쓰므로 사이트 공통 헤더·푸터를 그리지 않는다. */
export default function HideOnPortfolio({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	if (pathname === '/portfolio' || pathname.startsWith('/portfolio/')) return null;

	return children;
}
