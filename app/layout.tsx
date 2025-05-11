import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CompanyContextProvider } from "@/context/company-context";
import { ProfileProvider } from "@/context/profile-context";
import QueryProvider from "@/lib/QueryProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DeeDee - Business Dashboard",
  description: "Manage your business profile and connect with investors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <ToastProvider>
          <CompanyContextProvider>
            <ProfileProvider>
              <body className={`${inter.className} bg-black text-white`}>
              <Toaster position="top-right" richColors />
                {children}
              </body>
            </ProfileProvider>
          </CompanyContextProvider>
        </ToastProvider>
      </QueryProvider>
    </html>
  );
}
