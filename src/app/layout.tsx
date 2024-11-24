import './globals.css';

import localFont from 'next/font/local';

import Header from '@/components/common/Header';
import { ThemeProvider } from '@/components/provider/ThemeProvider';
import { Metadata } from 'next';
import { ROOT_META_DATA } from '@/constant';

const pretendard = localFont({
	src: '../lib/fonts/PretendardVariable.woff2',
	display: 'swap',
	weight: '45 920',
	variable: '--font-pretendard',
});

export const metadata: Metadata = {
	title: ROOT_META_DATA.title,
	description: ROOT_META_DATA.description,
	applicationName: ROOT_META_DATA.applicationName,
	authors: ROOT_META_DATA.authors,
	generator: ROOT_META_DATA.generator,
	keywords: ROOT_META_DATA.keywords,
	referrer: ROOT_META_DATA.referrer,
	creator: ROOT_META_DATA.creator,
	publisher: ROOT_META_DATA.publisher,
	category: ROOT_META_DATA.category,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={`${pretendard.variable} font-pretendard font-normal`}>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<Header />
					<main className="mt-[97px]">{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
