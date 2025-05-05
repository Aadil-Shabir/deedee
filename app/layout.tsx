import { ToastProvider } from '@/components/ui/toast-provider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CompanyContextProvider } from '@/context/company-context';
import { ProfileProvider } from "@/context/profile-context";

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
      <CompanyContextProvider>
        <ProfileProvider>
          <body className={`${inter.className} bg-black text-white`}>
            {children}
          </body>
        </ProfileProvider>
      </CompanyContextProvider>
    </ToastProvider>
    </html>
  );
}
