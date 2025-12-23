// Root layout - fonts and global CSS are imported here
// The actual html/body structure is in [locale]/layout.tsx for i18n support
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

export const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
