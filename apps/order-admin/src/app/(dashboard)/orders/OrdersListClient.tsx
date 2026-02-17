"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getAdminOrders, bulkUpdateStatus } from "@/lib/order-admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  email: string;
  status: string;
  priority: string;
  paymentMethod: string;
  amount: number;
  createdAt: string;
  shippingDetails?: { fullName?: string; state?: string; city?: string; address?: string };
}

// All 36 states of Nigeria + FCT
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

/** Normalize a state value for matching (lowercased, trimmed, handles common aliases) */
const normalizeState = (raw?: string): string => {
  if (!raw) return "";
  const s = raw.trim().toLowerCase();
  if (s === "fct" || s === "abuja" || s === "fct abuja" || s === "fct (abuja)") return "fct (abuja)";
  return s;
};

/** Find the canonical state name or return null */
const matchState = (raw?: string): string | null => {
  const norm = normalizeState(raw);
  if (!norm) return null;
  return NIGERIAN_STATES.find((st) => st.toLowerCase() === norm) || null;
};

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

type ViewMode = "all" | "by-state";

export default function OrdersListClient() {
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [stateFilter, setStateFilter] = useState("all");
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
      if (stateFilter !== "all") params.state = stateFilter;
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
  }, [page, status, paymentMethod, priority, stateFilter, search, sortBy, sortOrder]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Group orders by Nigerian state for the "By State" view
  const stateGroups = useMemo(() => {
    const groups: Record<string, OrderItem[]> = {};
    const unmatched: OrderItem[] = [];

    // Initialize all states
    for (const state of NIGERIAN_STATES) {
      groups[state] = [];
    }

    for (const order of orders) {
      const matched = matchState(order.shippingDetails?.state);
      if (matched) {
        groups[matched]!.push(order);
      } else {
        unmatched.push(order);
      }
    }

    return { groups, unmatched };
  }, [orders]);

  // State counts for summary cards (only states with orders)
  const stateSummary = useMemo(() => {
    const all = NIGERIAN_STATES.map((state) => ({
      state,
      count: stateGroups.groups[state]!.length,
      totalAmount: stateGroups.groups[state]!.reduce((s, o) => s + o.amount, 0),
    }));
    const withOrders = all.filter((s) => s.count > 0).sort((a, b) => b.count - a.count);
    const empty = all.filter((s) => s.count === 0);
    return { withOrders, empty, unmatchedCount: stateGroups.unmatched.length };
  }, [stateGroups]);

  // Orders filtered for table (respects selectedState in by-state mode)
  const displayOrders = useMemo(() => {
    if (viewMode !== "by-state" || !selectedState) return orders;
    if (selectedState === "__unmatched__") return stateGroups.unmatched;
    return stateGroups.groups[selectedState] || [];
  }, [viewMode, selectedState, orders, stateGroups]);

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
    if (selectedIds.size === displayOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayOrders.map((o) => o._id)));
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
      {/* View Mode Toggle */}
      <div className="flex gap-1 border-b">
        <button
          onClick={() => { setViewMode("all"); setSelectedState(null); }}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            viewMode === "all"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
          )}
        >
          All Orders
        </button>
        <button
          onClick={() => setViewMode("by-state")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            viewMode === "by-state"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
          )}
        >
          By State
        </button>
      </div>

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
            <Select value={stateFilter} onValueChange={(v) => { setStateFilter(v); setPage(1); }}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {NIGERIAN_STATES.map((st) => (
                  <SelectItem key={st} value={st}>{st}</SelectItem>
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

      {/* ─── By State View: State Summary Cards ─────────────────────── */}
      {viewMode === "by-state" && !loading && (
        <div className="space-y-4">
          {/* General / All Orders card */}
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md border-2",
              selectedState === null
                ? "border-primary bg-primary/5"
                : "border-transparent hover:border-muted"
            )}
            onClick={() => setSelectedState(null)}
          >
            <CardContent className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">📦</div>
                <div>
                  <p className="font-semibold">All New Orders</p>
                  <p className="text-xs text-muted-foreground">General overview — all states combined</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="text-base px-3 py-1">{orders.length}</Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(orders.reduce((s, o) => s + o.amount, 0))}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* States with orders */}
          {stateSummary.withOrders.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">States with Orders ({stateSummary.withOrders.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {stateSummary.withOrders.map(({ state, count, totalAmount }) => (
                  <Card
                    key={state}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md border-2",
                      selectedState === state
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-muted"
                    )}
                    onClick={() => setSelectedState(state)}
                  >
                    <CardContent className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-sm">📍</div>
                        <span className="font-medium text-sm">{state}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="text-xs">{count}</Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{formatCurrency(totalAmount)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Unmatched orders (no recognized state) */}
          {stateSummary.unmatchedCount > 0 && (
            <Card
              className={cn(
                "cursor-pointer transition-all hover:shadow-md border-2",
                selectedState === "__unmatched__"
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-muted"
              )}
              onClick={() => setSelectedState("__unmatched__")}
            >
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-sm">⚠️</div>
                  <div>
                    <span className="font-medium text-sm">Unrecognized State</span>
                    <p className="text-[10px] text-muted-foreground">Orders with unknown or missing state</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">{stateSummary.unmatchedCount}</Badge>
              </CardContent>
            </Card>
          )}

          {/* Empty states (collapsed) */}
          {stateSummary.empty.length > 0 && (
            <details className="group">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground py-1">
                {stateSummary.empty.length} states with no orders — click to view
              </summary>
              <div className="mt-2 flex flex-wrap gap-2">
                {stateSummary.empty.map(({ state }) => (
                  <span key={state} className="text-xs px-2 py-1 bg-muted rounded">{state}</span>
                ))}
              </div>
            </details>
          )}

          {/* Selected state header */}
          {selectedState && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <span className="text-sm font-medium">
                Showing: {selectedState === "__unmatched__" ? "Unrecognized State" : selectedState}
              </span>
              <Badge variant="secondary">{displayOrders.length} orders</Badge>
              <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setSelectedState(null)}>
                Clear Filter
              </Button>
            </div>
          )}
        </div>
      )}

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
                  checked={displayOrders.length > 0 && selectedIds.size === displayOrders.length}
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
              <TableHead>State</TableHead>
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
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : displayOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              displayOrders.map((order) => (
                <TableRow key={order._id} data-state={selectedIds.has(order._id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(order._id)}
                      onCheckedChange={() => toggleSelect(order._id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <Link
                      href={`/orders/${order._id}`}
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
                    {order.shippingDetails?.state ? (
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        matchState(order.shippingDetails.state)
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      )}>
                        {order.shippingDetails.state}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
                          <Link href={`/orders/${order._id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/orders/${order._id}?tab=edit`}>Edit Order</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/orders/${order._id}?tab=fraud`}>Fraud Analysis</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/orders/${order._id}?tab=shipping`}>Shipping</Link>
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
          Showing {displayOrders.length} of {total} orders
          {viewMode === "by-state" && selectedState ? ` (filtered: ${selectedState === "__unmatched__" ? "Unrecognized" : selectedState})` : ""}
          {" "}(Page {page} of {totalPages || 1})
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
