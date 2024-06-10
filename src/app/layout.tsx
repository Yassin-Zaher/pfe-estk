import type { Metadata } from "next";
import { Inter, Recursive } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import QueryProviders from "@/components/Providers";
import { constructMetadata } from "@/lib/utils";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

import { ModalProvider } from "@/providers/modal-provider";
import { Toaster as UIToaster } from "@/components/ui/toaster";
import { Toaster } from "sonner";
import { currentUser } from "@clerk/nextjs/server";

const inter = Inter({ subsets: ["latin"] });
const recursive = Recursive({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <QueryProviders>
            {children}
            <ModalProvider />
          </QueryProviders>

          <UIToaster />
          <Toaster theme="light" closeButton richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}

/*

<html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <UIProviders>
            <Navbar />
            <main className="flex grainy-light flex-col ">
              <div className="flex-1 flex flex-col h-full">
                <QueryProviders>{children}</QueryProviders>
              </div>
              <Footer />
            </main>
            <Toaster />
          </UIProviders>
        </UserProvider>
      </body>
    </html>
*/
