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

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });
const recursive = Recursive({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default async function RootLayout({
  children,
  params: { local },
}: Readonly<{
  children: React.ReactNode;
  params: { local: string };
}>) {
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={local}>
        <body suppressHydrationWarning={true} className={inter.className}>
          <NextIntlClientProvider messages={messages}>
            <Navbar lang={local} />
            <QueryProviders>
              {children}
              <ModalProvider />
            </QueryProviders>
          </NextIntlClientProvider>

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
