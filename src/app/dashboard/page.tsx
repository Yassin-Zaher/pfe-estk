import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { formatPrice } from "@/lib/utils";
import StatusDropdown from "./StatusDropdown";
import { currentUser } from "@clerk/nextjs/server";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./_components/OverView";
import { RecentSales } from "./_components/recent-sales";
import { getAllImages, getConfigImages } from "@/lib/actions/image.actions";
import { navLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { Collection } from "./_components/shared/Collection";
import { CollectionTwo } from "./_components/shared/CollectionTwo";

const Home = async ({ searchParams }) => {
  /* const page = Number(searchParams?.page) || 1; */
  const page = 1;
  const searchQuery = (searchParams?.query as string) || "";

  /* const images = await getAllImages({ page, searchQuery }); */
  const images = await getConfigImages();

  return (
    <>
      <section className="home">
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <CollectionTwo
          hasSearch={true}
          images={images}
          totalPages={0}
          page={page}
        />
        {/* <CollectionT
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        /> */}
      </section>
    </>
  );
};

export default Home;

/*
 <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {" "}
                    {formatPrice(lastWeekSum._sum.amount ?? 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {formatPrice(WEEKLY_GOAL)} goal
                  </p>
                </CardContent>

                <CardFooter>
                  <Progress
                    value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                  />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {" "}
                    {formatPrice(lastWeekSum._sum.amount ?? 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {formatPrice(WEEKLY_GOAL)} goal
                  </p>
                </CardContent>

                <CardFooter>
                  <Progress
                    value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                  />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {" "}
                    {formatPrice(lastWeekSum._sum.amount ?? 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {formatPrice(WEEKLY_GOAL)} goal
                  </p>
                </CardContent>

                <CardFooter>
                  <Progress
                    value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                  />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {" "}
                    {formatPrice(lastWeekSum._sum.amount ?? 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    of {formatPrice(WEEKLY_GOAL)} goal
                  </p>
                </CardContent>

                <CardFooter>
                  <Progress
                    value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                  />
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made {orders.length} sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales sales={recentSales} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>

*/
