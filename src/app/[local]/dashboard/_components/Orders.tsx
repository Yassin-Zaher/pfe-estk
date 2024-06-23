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
import { CalendarIcon, Copy, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import * as XLSX from "xlsx";
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
import { COLORS } from "@root/constants";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMutation } from "@tanstack/react-query";
import { changeOrderStatus } from "../actions";
import { useRouter } from "next/navigation";

const Orders = ({ orders }) => {
  const rowsPerPage = 8;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);
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
      <div className="flex flex-col gap-8">
        <h3 className="text-black text-4xl font-bold tracking-tight">Orders</h3>

        <div>
          <div className="flex justify-between">
            <div className="flex flex-col items-start">
              <Label className="text-black mb-2">Start Purchase Date</Label>
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choose a status" />
                </SelectTrigger>
                <SelectContent className="mb-2">
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
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-start">
                <Label className="text-black mb-2">Start Purchase Date</Label>
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
                <Label className="text-black mb-2">End Purchase Date</Label>
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
          </div>

          <div className="flex items-center mt-4 w-[250px]">
            <div className="flex flex-col justify-center items-start">
              <Label className="text-black mb-2">Min Price</Label>
              <Input
                type="number"
                onChange={handleMinPriceChange}
                placeholder="Min Price"
              />
            </div>
            <div className="flex flex-col justify-center items-start m-3">
              <Label className="text-black mb-2">Max Price</Label>
              <Input
                type="number"
                onChange={handleMaxPriceChange}
                placeholder="Max Price"
              />
            </div>
          </div>
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

          {filteredOrders.length > 0 ? (
            <TableBody>
              {filteredOrders.slice(startIndex, endIndex).map((order) => (
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
                      orderId={order.id}
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
          ) : (
            <div className="flex justify-center items-center m-4 p-3">
              <p className="p-20-semibold text-balck">There is no orders 😕</p>
            </div>
          )}
        </Table>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={
                  startIndex === 0
                    ? "pointer-events-none cursor-pointer opacity-50"
                    : undefined
                }
                onClick={() => {
                  setStartIndex(startIndex - rowsPerPage);
                  setEndIndex(endIndex - rowsPerPage);
                }}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className={
                  orders.length <= endIndex
                    ? "pointer-events-none cursor-pointer opacity-50"
                    : undefined
                }
                onClick={() => {
                  if (orders.length > endIndex) {
                    setStartIndex(startIndex + rowsPerPage);
                    setEndIndex(endIndex + rowsPerPage);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Orders;

export function DialogDemo({
  orderId,
  imageUrl,
  model,
  croppedImageUrl,
  color,
}) {
  const [dialogHeight, setDialogHeight] = useState("auto");
  const router = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["change-order-status"],
    mutationFn: changeOrderStatus,
    onSuccess: () => router.refresh(),
  });

  useEffect(() => {
    const img = new Image();
    img.src = model === "custom" || "tshirt" ? imageUrl : croppedImageUrl;
    img.onload = () => {
      const maxHeight = window.innerHeight - 200; // Adjust as needed
      setDialogHeight(Math.min(img.height, maxHeight));
    };
  }, [imageUrl, croppedImageUrl, model]);

  const downloadExelFile = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([
      ["Order ID", "Image URL"],
      [orderId, imageUrl],
    ]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Create an HTML anchor element to trigger the download
    const link = document.createElement("a");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert workbook to Blob
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Create URL and trigger download
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = "orders.xlsx"; // Set the filename for the Excel file
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.png"; // Set the default filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      mutate({ id: orderId, newStatus: "awaiting_processing" as OrderStatus });
    } catch (error) {
      console.error("Error downloading the image:", error);
    }

    downloadExelFile();
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

        {model === "tshirt" || model === "custom" ? (
          <div className="flex-1">
            <Tshirt
              className={
                model === "custom"
                  ? ""
                  : cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")
              }
              imgSrc={model === "custom" ? imageUrl : croppedImageUrl}
              model={model}
            />
          </div>
        ) : (
          <Phone
            className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")}
            imgSrc={croppedImageUrl}
          />
        )}

        <DialogFooter>
          <Button onClick={handleDownload}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
