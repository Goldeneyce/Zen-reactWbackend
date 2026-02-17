"use client";

import { useState, useEffect, useCallback } from "react";
import { getReturns, getReturnStats, updateReturn } from "@/lib/order-admin-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import Link from "next/link";

interface ReturnItem {
  _id: string;
  orderId: string;
  email: string;
  type: string;
  status: string;
  reason: string;
  refundAmount: number;
  createdAt: string;
}

interface ReturnStats {
  totalRefunded: number;
  byType: Array<{ type: string; count: number }>;
  byStatus: Array<{ status: string; count: number }>;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);

const returnStatusColor = (s: string) => {
  const map: Record<string, string> = {
    requested: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    approved: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
    rejected: "bg-red-500/20 text-red-700 dark:text-red-400",
    received: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-400",
    refunded: "bg-green-500/20 text-green-700 dark:text-green-400",
    exchanged: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
  };
  return map[s] || "bg-gray-500/20";
};

const typeColor = (t: string) => {
  const map: Record<string, string> = {
    return: "bg-orange-500/20 text-orange-700",
    refund: "bg-red-500/20 text-red-700",
    exchange: "bg-blue-500/20 text-blue-700",
  };
  return map[t] || "bg-gray-500/20";
};

export default function ReturnsClient() {
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [stats, setStats] = useState<ReturnStats | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20" };
      if (statusFilter !== "all") params.status = statusFilter;
      if (typeFilter !== "all") params.type = typeFilter;

      const [returnsData, statsData] = await Promise.all([
        getReturns(params),
        getReturnStats(),
      ]);
      setReturns(returnsData.returns || []);
      setTotal(returnsData.total || 0);
      setTotalPages(returnsData.totalPages || 0);
      setStats(statsData);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load returns");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusUpdate = async (returnId: string, newStatus: string) => {
    try {
      await updateReturn(returnId, { status: newStatus });
      toast.success(`Return updated to "${newStatus}"`);
      fetchData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Refunded</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(stats.totalRefunded || 0)}</CardTitle>
            </CardHeader>
          </Card>
          {stats.byType?.map((t) => (
            <Card key={t.type}>
              <CardHeader className="pb-2">
                <CardDescription className="capitalize">{t.type}s</CardDescription>
                <CardTitle className="text-2xl">{t.count}</CardTitle>
              </CardHeader>
            </Card>
          ))}
          {stats.byStatus?.filter((s) => s.status === "requested").map((s) => (
            <Card key="pending-returns">
              <CardHeader className="pb-2">
                <CardDescription>Pending Requests</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">{s.count}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 flex gap-3 flex-wrap">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="exchanged">Exchanged</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-35"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="return">Return</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="exchange">Exchange</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Returns Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Refund</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : returns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No return requests found.</TableCell>
              </TableRow>
            ) : (
              returns.map((ret) => (
                <TableRow key={ret._id}>
                  <TableCell className="font-mono text-xs">
                    <Link href={`/order-admin/orders/${ret.orderId}?tab=returns`} className="text-primary hover:underline">
                      {ret.orderId.slice(-8)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{ret.email}</TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-0.5 rounded text-xs font-medium capitalize", typeColor(ret.type))}>
                      {ret.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn("px-2 py-0.5 rounded text-xs font-medium", returnStatusColor(ret.status))}>
                      {ret.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm max-w-50 truncate">{ret.reason}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(ret.refundAmount || 0)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(ret.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select onValueChange={(v) => handleStatusUpdate(ret._id, v)}>
                      <SelectTrigger className="h-8 w-30 text-xs">
                        <SelectValue placeholder="Update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approve</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                        <SelectItem value="received">Mark Received</SelectItem>
                        <SelectItem value="refunded">Mark Refunded</SelectItem>
                        <SelectItem value="exchanged">Mark Exchanged</SelectItem>
                      </SelectContent>
                    </Select>
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
          Showing {returns.length} of {total} (Page {page} of {totalPages || 1})
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
