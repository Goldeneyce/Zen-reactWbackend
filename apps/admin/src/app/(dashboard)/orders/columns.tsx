"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontalIcon } from "@/components/icons";
import Link from "next/link";
import { OrderType } from "@repo/types";
import { toast } from "react-toastify";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const MarkAsPaidButton = ({ orderId }: { orderId: string }) => {

  const handleMarkAsPaid = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders/${orderId}/mark-paid`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to mark order as paid");
      }
      toast.success("Order marked as paid!");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to mark order as paid");
    }
  };

  return (
    <DropdownMenuItem onClick={handleMarkAsPaid}>
      Mark as Paid
    </DropdownMenuItem>
  );
};

const MarkAsDeliveredButton = ({ orderId }: { orderId: string }) => {

  const handleMarkAsDelivered = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders/${orderId}/deliver`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to mark order as delivered");
      }
      toast.success("Order marked as delivered!");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to mark order as delivered");
    }
  };

  return (
    <DropdownMenuItem onClick={handleMarkAsDelivered}>
      Mark as Delivered
    </DropdownMenuItem>
  );
};

// export type Payment = {
//   id: string;
//   amount: number;
//   fullName: string;
//   userId: string;
//   email: string;
//   status: "pending" | "processing" | "success" | "failed";
// };

export const columns: ColumnDef<OrderType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "_id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            status === "pending" && "bg-yellow-500/40",
            status === "success" && "bg-green-500/40",
            status === "failed" && "bg-red-500/40",
            status === "unpaid" && "bg-orange-500/40",
            status === "paid" && "bg-green-500/40",
            status === "delivered" && "bg-blue-500/40",
            status === "completed" && "bg-green-500/40",
            status === "cancelled" && "bg-red-500/40"
          )}
        >
          {status as string}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string | undefined;
      return (
        <div className={cn(
          "p-1 rounded-md w-max text-xs",
          method === "cod" && "bg-orange-100 text-orange-700",
          method === "card" && "bg-blue-100 text-blue-700",
        )}>
          {method === "cod" ? "Pay on Delivery" : method === "card" ? "Card" : method || "Card"}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount/100);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      const status = order.status;
      const paymentMethod = (order as any).paymentMethod;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order._id)}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/users/${order.userId}`}>View customer</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View order details</DropdownMenuItem>
            {/* Mark as Delivered - for COD unpaid orders */}
            {paymentMethod === "cod" && status === "unpaid" && (
              <>
                <DropdownMenuSeparator />
                <MarkAsDeliveredButton orderId={order._id} />
              </>
            )}
            {/* Mark as Paid - for delivered COD orders or any unpaid/delivered order */}
            {(status === "delivered" || (paymentMethod === "cod" && status === "unpaid")) && (
              <>
                <DropdownMenuSeparator />
                <MarkAsPaidButton orderId={order._id} />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
