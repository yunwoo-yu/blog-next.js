import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';

import { pretendard } from '@/assets/fonts/fonts';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { ThemeProvider } from '@/components/common/provider/ThemeProvider';
import { ROOT_META_DATA } from '@/constant';

export const metadata: Metadata = {
	...ROOT_META_DATA,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${pretendard.variable} font-pretendard font-normal print:text-sm`}>
			<body className="flex min-h-screen flex-col">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<Header />
					<main className="mt-[97px] flex-1 print:mt-0">{children}</main>
					<Footer />
				</ThemeProvider>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}
