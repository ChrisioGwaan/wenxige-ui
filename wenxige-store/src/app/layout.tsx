import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import AntdProvider from '@/components/layout/AntdProvider';
import { CartProvider } from '@/components/cart/CartContext';
import StoreHeader from '@/components/layout/StoreHeader';
import StoreFooter from '@/components/layout/StoreFooter';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wenxige Tea — Premium Chinese Tea',
  description:
    'Discover the art of premium Chinese tea. Sourced from heritage gardens, curated by tea masters.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={geistSans.variable}>
      <body>
        <AntdProvider>
          <CartProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <StoreHeader />
              <main style={{ flex: 1 }}>{children}</main>
              <StoreFooter />
            </div>
          </CartProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
