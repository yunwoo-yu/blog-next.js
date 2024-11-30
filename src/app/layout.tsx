import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';

import Header from '@/components/common/Header';
import { ThemeProvider } from '@/components/common/provider/ThemeProvider';
import { ROOT_META_DATA } from '@/constant';
import { pretendard } from '@/lib/fonts/fonts';

export const metadata: Metadata = {
	...ROOT_META_DATA,
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
				<Analytics />
			</body>
		</html>
	);
}
