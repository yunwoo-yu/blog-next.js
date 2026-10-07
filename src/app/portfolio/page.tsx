import type { Metadata } from 'next';

import JsonLd from '@/components/common/JsonLd';
import PortfolioOverview from '@/components/portfolio/PortfolioOverview';
import { GITHUB_URL, LINKEDIN_URL } from '@/constant';
import { PORTFOLIO_DESCRIPTION, PORTFOLIO_PATH, PORTFOLIO_TITLE } from '@/portfolio/overview';
import { buildAlternates, buildBreadcrumbJsonLd, buildPortfolioJsonLd } from '@/utils/seo';

export const metadata: Metadata = {
	title: PORTFOLIO_TITLE,
	description: PORTFOLIO_DESCRIPTION,
	alternates: buildAlternates(PORTFOLIO_PATH),
	// 페이지가 openGraph 를 정의하면 루트 값이 통째로 대체되므로 이미지까지 함께 적는다.
	openGraph: {
		type: 'profile',
		url: PORTFOLIO_PATH,
		title: PORTFOLIO_TITLE,
		description: PORTFOLIO_DESCRIPTION,
		locale: 'ko_KR',
		images: ['/images/og_thumbnail.png'],
	},
	twitter: {
		card: 'summary_large_image',
		title: PORTFOLIO_TITLE,
		description: PORTFOLIO_DESCRIPTION,
		images: ['/images/og_thumbnail.png'],
	},
	robots: { index: true, follow: true },
};

export default function PortfolioPage() {
	return (
		<>
			<JsonLd
				data={buildPortfolioJsonLd({
					title: PORTFOLIO_TITLE,
					description: PORTFOLIO_DESCRIPTION,
					path: PORTFOLIO_PATH,
					jobTitle: 'Front-End Developer',
					sameAs: [GITHUB_URL, LINKEDIN_URL],
				})}
			/>
			<JsonLd data={buildBreadcrumbJsonLd([{ name: '포트폴리오', path: PORTFOLIO_PATH }])} />
			<PortfolioOverview />
		</>
	);
}
