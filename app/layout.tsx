import { ToastProvider } from '@/components/ui/toast-provider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DeeDee - Business Dashboard',
  description: 'Manage your business profile and connect with investors',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <ToastProvider>
     <body className={`${inter.className} bg-black text-white`}>
        {children}
      </body>
    </ToastProvider>
    </html>
  );
}
