import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/ui/Toast';
import { DialogProvider } from '@/components/ui/ConfirmDialog';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'EasyShop - Premium E-Commerce Store',
  description: 'Discover premium products at unbeatable prices. Quality shopping experience with fast delivery and exceptional service.',
  keywords: 'ecommerce, shop, online store, premium products',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="antialiased font-sans">
        <ToastProvider>
          <DialogProvider>
            <AuthProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AuthProvider>
          </DialogProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
