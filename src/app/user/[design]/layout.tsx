"use client";
import { Room } from "./Room";
import { CollaborativeApp } from "./CollaborativeApp";
import { Work_Sans } from "next/font/google";
import { useRouter } from "next/router";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={`${workSans.className} bg-canvas-grey-200 flex-1`}>
      {children}
    </main>
  );
};

export default RootLayout;
