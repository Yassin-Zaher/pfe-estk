"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatPrice } from "@/lib/utils";
import StatusDropdown from "../StatusDropdown";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { Copy, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tshirt from "@/components/Tshirt";
import { COLORS } from "../../../../constants";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Phone from "@/components/Phone";

const Orders = ({ orders }) => {
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const handleCopyImageLink = async (imageUrl) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast.success("Image URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy:");
    }
  };
  return (
    <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
      <div className="flex flex-col gap-16">
        <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>
        <div>
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
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">
                Purchase date
              </TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Object</TableHead>
              <TableHead className="text-right">Link</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="bg-accent">
                <TableCell>
                  <div className="hidden text-black text-sm md:inline">
                    {order.user.email}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <StatusDropdown id={order.id} orderStatus={order.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(new Date(order.createdAt), "MM/dd/yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(order.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <DialogDemo
                    croppedImageUrl={order.configuration.croppedImageUrl}
                    model={order.configuration.model}
                    imageUrl={order.configuration.imageUrl}
                    color={order.configuration.color}
                  />
                </TableCell>
                <TableCell className="text-right cursor-pointer p-2">
                  <Button
                    variant="link"
                    onClick={() =>
                      handleCopyImageLink(order.configuration.imageUrl)
                    }
                  >
                    <CopyIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;

export function DialogDemo({ imageUrl, model, croppedImageUrl, color }) {
  const [dialogHeight, setDialogHeight] = useState("auto");

  useEffect(() => {
    const img = new Image();
    img.src = model === "custom" || "tshirt" ? imageUrl : croppedImageUrl;
    img.onload = () => {
      const maxHeight = window.innerHeight - 200; // Adjust as needed
      setDialogHeight(Math.min(img.height, maxHeight));
    };
  }, [imageUrl, croppedImageUrl, model]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.png"; // You can set the default filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color
  )?.tw;

  console.log(model);

  const getComponentForValue = (rendredItem) => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">preview prodcut</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        style={{ maxHeight: dialogHeight, overflowY: "auto" }}
      >
        <DialogHeader>
          <DialogTitle>Product details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {model === "tshirt" || model === "custom" ? (
            <Tshirt
              className={
                model === "custom"
                  ? ""
                  : cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")
              }
              imgSrc={imageUrl}
              model={model}
            />
          ) : (
            <Phone
              className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")}
              imgSrc={croppedImageUrl}
            />
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleDownload}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

{
  /* <Tshirt
className={
  model === "custom"
    ? ""
    : cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")
}
imgSrc={
  model === "custom" ? imageUrl : configuration.croppedImageUrl!
}
model={model}
/> */
}
