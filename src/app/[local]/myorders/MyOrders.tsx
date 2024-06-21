"use client";
import Phone from "@/components/Phone";
import Tshirt from "@/components/Tshirt";
import { format, formatDate } from "date-fns";
import { CalendarIcon, CopyIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { COLORS } from "../../../constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MyOrders = ({ orders }) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    console.log(typeof event.target.value);
    console.log(event.target.value);

    setMaxPrice(event.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (selectedStatus !== "all" && order.status !== selectedStatus) {
      return false;
    }

    // Filter by date range
    if (startDate && new Date(order.createdAt) < new Date(startDate)) {
      return false;
    }
    if (endDate && new Date(order.createdAt) > new Date(endDate)) {
      return false;
    }

    // Filter by price range
    if (Number(minPrice) && order.amount < Number(minPrice)) {
      return false;
    }
    if (Number(maxPrice) && order.amount > Number(maxPrice)) {
      return false;
    }

    return true;
  });

  /* const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus); */

  return (
    <div className="px-20 py-10 bg-slate-50 grainy-light">
      <h3 className="text-bold">My Orders History</h3>
      <div className="m-4">
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status:" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>products</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="awaiting_shipment">
                Awaiting Shipment
              </SelectItem>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="awaiting_processing">
                Awaiting Processing
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex flex-col items-start">
            <Label className="mb-2">Start Purchase Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col items-start">
            <Label className="mb-2">End Purchase Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>End date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center mt-4 w-[250px]">
          <div className="flex flex-col justify-center items-start">
            <Label className="mb-2">Min Price</Label>
            <Input
              type="number"
              onChange={handleMinPriceChange}
              placeholder="Min Price"
            />
          </div>
          <div className="flex flex-col justify-center items-start m-3">
            <Label className="mb-2">Max Price</Label>
            <Input
              type="number"
              onChange={handleMaxPriceChange}
              placeholder="Max Price"
            />
          </div>
        </div>
      </div>
      {filteredOrders.length > 0 ? (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {filteredOrders.map((order) => (
            <Card order={order} key={order.id} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold">Empty List</p>
        </div>
      )}
    </div>
  );
};

const Card = ({ order }) => {
  return (
    <li className="w-[200px]">
      <Link
        href={`/thank-you?orderId=${order.id}`}
        className="flex flex-1 cursor-pointer flex-col gap-2 rounded-[16px] border-2 border-purple-200/15 bg-white p-4 shadow-xl shadow-purple-200/10 transition-all hover:shadow-purple-200/20"
      >
        <ProductImage
          croppedImageUrl={order.configuration.croppedImageUrl}
          model={order.configuration.model}
          imageUrl={order.configuration.imageUrl}
          color={order.configuration.color}
        />
        <div className="flex-between">
          <p className="p-20-semibold mr-3 line-clamp-1 text-dark-600">
            {format(new Date(order.createdAt), "MM/dd/yyyy")}
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
    <div className="grid gap-4 py-4 h-40 w-40 rounded-[10px]">
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
