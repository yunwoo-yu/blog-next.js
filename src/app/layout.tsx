import { ThemeProvider } from "@/components/provider/ThemeProvider";
import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/common/Header";

const pretendard = localFont({
  src: "../lib/fonts/PretendardVariable.woff2",
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
          <main className="mt-[97px]">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
