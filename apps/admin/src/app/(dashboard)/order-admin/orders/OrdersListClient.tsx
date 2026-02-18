"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getAdminOrders, bulkUpdateStatus } from "@/lib/order-admin-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import Link from "next/link";
import { MoreHorizontalIcon, ArrowUpDownIcon, SearchIcon } from "@/components/icons";

interface OrderItem {
  _id: string;
  userId?: string;
  email: string;
  status: string;
  priority: string;
  paymentMethod: string;
  amount: number;
  createdAt: string;
  shippingDetails?: { fullName?: string };
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "unpaid", label: "Unpaid" },
  { value: "refunded", label: "Refunded" },
  { value: "on_hold", label: "On Hold" },
];

const PAYMENT_OPTIONS = [
  { value: "all", label: "All Methods" },
  { value: "card", label: "Card" },
  { value: "cod", label: "Pay on Delivery" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const statusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    processing: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
    paid: "bg-green-500/20 text-green-700 dark:text-green-400",
    shipped: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-400",
    delivered: "bg-teal-500/20 text-teal-700 dark:text-teal-400",
    completed: "bg-green-600/20 text-green-800 dark:text-green-300",
    cancelled: "bg-red-500/20 text-red-700 dark:text-red-400",
    unpaid: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
    refunded: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
    partially_refunded: "bg-purple-400/20 text-purple-600 dark:text-purple-300",
    on_hold: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
  };
  return map[status] || "bg-gray-500/20 text-gray-700";
};

const priorityColor = (priority: string) => {
  const map: Record<string, string> = {
    low: "bg-gray-200/50 text-gray-600",
    normal: "bg-blue-200/50 text-blue-600",
    high: "bg-orange-200/50 text-orange-600",
    urgent: "bg-red-200/50 text-red-600",
  };
  return map[priority] || "";
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);

export default function OrdersListClient() {
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [priority, setPriority] = useState("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "20",
        sortBy,
        sortOrder,
      };
      if (status !== "all") params.status = status;
      if (paymentMethod !== "all") params.paymentMethod = paymentMethod;
      if (priority !== "all") params.priority = priority;
      if (search) params.search = search;

      const data = await getAdminOrders(params);
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, status, paymentMethod, priority, search, sortBy, sortOrder]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o._id)));
    }
  };

  const handleBulkAction = async (newStatus: string) => {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateStatus(Array.from(selectedIds), newStatus);
      toast.success(`${selectedIds.size} orders updated to "${newStatus}"`);
      setSelectedIds(new Set());
      fetchOrders();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-50">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, order ID, customer name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentMethod} onValueChange={(v) => { setPaymentMethod(v); setPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYMENT_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priority} onValueChange={(v) => { setPriority(v); setPage(1); }}>
              <SelectTrigger className="w-35"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <Card>
          <CardContent className="py-3 flex items-center gap-3">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("processing")}>
              Mark Processing
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("shipped")}>
              Mark Shipped
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("delivered")}>
              Mark Delivered
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkAction("cancelled")}>
              Cancel Selected
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={orders.length > 0 && selectedIds.size === orders.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("_id")}>
                  Order ID <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("email")}>
                  Customer <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("amount")}>
                  Amount <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => toggleSort("createdAt")}>
                  Date <ArrowUpDownIcon className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id} data-state={selectedIds.has(order._id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(order._id)}
                      onCheckedChange={() => toggleSelect(order._id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <Link
                      href={`/order-admin/orders/${order._id}`}
                      className="text-primary hover:underline"
                    >
                      {order._id.slice(-8)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{order.shippingDetails?.fullName || "—"}</span>
                      <span className="text-xs text-muted-foreground">{order.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusColor(order.status))}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-0.5 rounded text-xs", priorityColor(order.priority || "normal"))}>
                      {order.priority || "normal"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs",
                      order.paymentMethod === "cod" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {order.paymentMethod === "cod" ? "COD" : "Card"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(order.amount)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order._id)}>
                          Copy Order ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/order-admin/orders/${order._id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/order-admin/orders/${order._id}?tab=edit`}>Edit Order</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/order-admin/orders/${order._id}?tab=fraud`}>Fraud Analysis</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/order-admin/orders/${order._id}?tab=shipping`}>Shipping</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${order.userId}`}>View Customer</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-sm text-muted-foreground">
          Showing {orders.length} of {total} orders (Page {page} of {totalPages || 1})
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
