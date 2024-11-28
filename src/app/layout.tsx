import './globals.css';

import { Metadata } from 'next';
import localFont from 'next/font/local';

import Header from '@/components/common/Header';
import { ThemeProvider } from '@/components/common/provider/ThemeProvider';
import { ROOT_META_DATA } from '@/constant';

const pretendard = localFont({
	src: '../lib/fonts/PretendardVariable.woff2',
	display: 'swap',
	weight: '45 920',
	variable: '--font-pretendard',
});

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
					<main className="mt-[98px]">{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
