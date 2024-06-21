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
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";

  const images = await getAllImages({ page, searchQuery });

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
        <Collection
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  );
};

export default Home;
