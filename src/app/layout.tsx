import { ThemeProvider } from "@/components/provider/theme-provider";
import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/common/header/Header";

const pretendard = localFont({
  src: "../lib/assets/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pretendard.variable} font-pretendard font-normal`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="mt-[77px]">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
