import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPortfolioCase, PORTFOLIO_CASES } from '@/portfolio/cases';

import { buildCaseMetadata, CasePage } from '../case-page';

interface Params {
	params: Promise<{ slug: string }>;
}

// 목록에 없는 slug 는 정적 생성하지 않고 404 로 처리한다.
export const dynamicParams = false;

// 모든 사례가 같은 전시 컴포넌트를 쓴다. 3D 는 버튼을 누를 때만 받으므로 route 번들에는 포함되지 않는다.
export const generateStaticParams = () => PORTFOLIO_CASES.map(item => ({ slug: item.slug }));

export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
	const { slug } = await params;
	const item = getPortfolioCase(slug);

	// 없는 slug 는 페이지가 notFound() 로 처리한다. 여기서 던지면 404 대신 500 이 된다.
	if (!item) return {};

	return buildCaseMetadata(item);
};

export default async function PortfolioCasePage({ params }: Params) {
	const { slug } = await params;
	const item = getPortfolioCase(slug);

	if (!item) notFound();

	return <CasePage item={item} />;
}
