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
import { formatPrice } from "@/lib/utils";
import StatusDropdown from "../StatusDropdown";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import Image from "next/image";
import { Copy, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const Orders = ({ orders }) => {
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
            {orders.map((order) => (
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
                  {order.configuration.model}
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
