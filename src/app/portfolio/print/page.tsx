import type { Metadata } from 'next';

import PortfolioPrint from '@/components/portfolio/PortfolioPrint';
import { PRINT_TITLE } from '@/portfolio/print';

// 파일 제목: 브라우저가 PDF 저장 시 <title> 을 파일명으로 쓴다.
export const metadata: Metadata = {
	title: PRINT_TITLE,
	robots: { index: false, follow: false },
};

export default function PortfolioPrintPage() {
	return <PortfolioPrint />;
}
