"use client";
import { Room } from "./Room";
import { CollaborativeApp } from "./CollaborativeApp";
import { Work_Sans } from "next/font/google";
import { useRouter } from "next/router";
import { MobileConfigurator } from "@/components/mobile/LeftConfigurator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
});
const RootLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    design: string;
  };
}) => {
  return (
    <main className={`${workSans.className} bg-canvas-grey-200 flex-1`}>
      <Room roomId={params.design}>
        <TooltipProvider>{children}</TooltipProvider>
      </Room>
    </main>
  );
};

export default RootLayout;
