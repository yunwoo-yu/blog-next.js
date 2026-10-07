import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import JsonLd from '@/components/common/JsonLd';
import CaseStudy from '@/components/portfolio/CaseStudy';
import { buildCasePath, type PortfolioCase } from '@/portfolio/cases';
import { PORTFOLIO_PATH } from '@/portfolio/overview';
import { buildAlternates, buildBreadcrumbJsonLd, buildCaseStudyJsonLd } from '@/utils/seo';

/** 사례 상세 route 들이 공유하는 메타데이터. */
export const buildCaseMetadata = (item: PortfolioCase): Metadata => {
	const path = buildCasePath(item.slug);

	return {
		title: item.title,
		description: item.summary,
		keywords: item.keywords,
		alternates: buildAlternates(path),
		openGraph: {
			type: 'article',
			url: path,
			title: item.title,
			description: item.summary,
			locale: 'ko_KR',
			images: ['/images/og_thumbnail.png'],
		},
		twitter: {
			card: 'summary_large_image',
			title: item.title,
			description: item.summary,
			images: ['/images/og_thumbnail.png'],
		},
		robots: { index: true, follow: true },
	};
};

interface CasePageProps {
	item: PortfolioCase;
	/** 사례 본문 뒤에 붙는 보조 영역. 시연처럼 무거운 클라이언트 코드는 해당 route 가 직접 넘긴다. */
	children?: ReactNode;
}

export const CasePage = ({ item, children }: CasePageProps) => {
	const path = buildCasePath(item.slug);

	return (
		<>
			<JsonLd
				data={buildCaseStudyJsonLd({
					title: item.title,
					description: item.summary,
					path,
					parentPath: PORTFOLIO_PATH,
					keywords: item.keywords,
				})}
			/>
			<JsonLd
				data={buildBreadcrumbJsonLd([
					{ name: '포트폴리오', path: PORTFOLIO_PATH },
					{ name: item.title, path },
				])}
			/>
			<CaseStudy item={item}>{children}</CaseStudy>
		</>
	);
};
