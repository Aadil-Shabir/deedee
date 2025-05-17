import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
// Remove direct imports of client components from server component

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
      <body className={`${inter.className} bg-black text-white`}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}

// Create a client component for providers
import { ClientProviders } from "@/components/providers/client-providers";

function Providers({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
