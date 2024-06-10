"use client";
import Phone from "@/components/Phone";
import Tshirt from "@/components/Tshirt";
import { formatDate } from "date-fns";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { COLORS } from "../../../constants";
import { cn } from "@/lib/utils";

const MyOrders = ({ orders }) => {
  return (
    <>
      {orders.length > 0 ? (
        <ul className="collection-list">
          {orders.map((order) => (
            <Card order={order} key={order.id} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold">Empty List</p>
        </div>
      )}
    </>
  );
};

const Card = ({ order }) => {
  return (
    <li>
      <Link href={`/thank-you?orderId=${order.id}`} className="collection-card">
        <ProductImage
          croppedImageUrl={order.configuration.croppedImageUrl}
          model={order.configuration.model}
          imageUrl={order.configuration.imageUrl}
          color={order.configuration.color}
        />
        <div className="flex-between">
          <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">
            {order.id}
          </p>
          <CopyIcon width={24} height={24} />
        </div>
      </Link>
    </li>
  );
};
const ProductImage = ({ imageUrl, model, croppedImageUrl, color }) => {
  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color
  )?.tw;
  return (
    <div className="grid gap-4 py-4 h-52 w-full rounded-[10px] object-cover ">
      {model === "tshirt" || model === "custom" ? (
        <Tshirt imgSrc={imageUrl} model={model} />
      ) : (
        <Phone
          className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")}
          imgSrc={croppedImageUrl}
        />
      )}
    </div>
  );
};

export default MyOrders;
