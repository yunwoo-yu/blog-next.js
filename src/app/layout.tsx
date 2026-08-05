import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import Script from 'next/script';
import { ViewTransition } from 'react';

import { pretendard } from '@/assets/fonts/fonts';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import JsonLd from '@/components/common/JsonLd';
import { ThemeProvider } from '@/components/common/provider/ThemeProvider';
import { BASE_URL, GITHUB_URL, LINKEDIN_URL, META_AUTHOR_NAME, META_TITLE, ROOT_META_DATA } from '@/constant';

export const metadata: Metadata = {
	...ROOT_META_DATA,
	other: {
		'google-adsense-account': 'ca-pub-5735722585151965',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" suppressHydrationWarning className={`${pretendard.variable} font-pretendard font-normal`}>
			<body className="flex min-h-screen flex-col">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring">
						본문 바로가기
					</a>
					<Header />
					{/* 이름을 주지 않으면 React가 자동 이름을 붙여 root와 별개 그룹이 생기고,
					    같은 콘텐츠가 root와 함께 두 번 페이드된다. 이름을 고정해 CSS로 제어한다. */}
					<ViewTransition name="page-content">
						<main id="main-content" className="mt-[var(--header-height)] flex-1 print:mt-0">
							{children}
						</main>
					</ViewTransition>
					<Footer />
				</ThemeProvider>
				<JsonLd
					data={{
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: META_TITLE,
						url: BASE_URL,
						inLanguage: 'ko-KR',
						author: {
							'@type': 'Person',
							name: META_AUTHOR_NAME,
							url: BASE_URL,
							sameAs: [GITHUB_URL, LINKEDIN_URL],
						},
					}}
				/>
				<SpeedInsights />
				<Analytics />
				<Script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5735722585151965"
					crossOrigin="anonymous"
					strategy="afterInteractive"
				/>
			</body>
		</html>
	);
}
