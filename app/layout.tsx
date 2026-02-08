import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "Sangem Hotels - Delicious Food & Cozy Stays",
  description: "Experience authentic Indian cuisine with love and passion. Fine dining, banquet facilities, and 24/7 service across multiple locations in Hyderabad.",
  keywords: "restaurant, Indian cuisine, fine dining, Hyderabad, Sangem Hotels, banquet, food delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
