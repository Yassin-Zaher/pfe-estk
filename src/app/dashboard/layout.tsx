import type { Metadata } from "next";
import Header from "./_components/AdminHeader";
import { currentUser } from "@clerk/nextjs/server";
import { useAuth, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Sidebar from "./_components/shared/SideBar";
import MobileNav from "./_components/shared/MobileNav";

export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const ADMIN_EMAIL = "yassinzaherpro@gmail.com";
  //console.log(user.user.emailAddresses[0].emailAddress);

  if (!user || user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    return redirect("/");
  }

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <MobileNav />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}
