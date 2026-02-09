"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchIcon,
  BarChart3Icon,
  RefreshCwIcon,
} from "@/components/icons";
import Link from "next/link";

const INVENTORY_URL = process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL;

interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  variantName: string | null;
  quantity: number;
  reserved: number;
  lowStockAt: number;
  movements?: StockMovement[];
}

interface StockMovement {
  id: string;
  type: string;
  delta: number;
  reason: string | null;
  referenceId: string | null;
  createdAt: string;
  inventoryItemId: string;
}

interface MovementWithProduct extends StockMovement {
  sku: string;
  productId: string;
}

export default function MovementsClient() {
  const [movements, setMovements] = useState<MovementWithProduct[]>([]);
  const [filtered, setFiltered] = useState<MovementWithProduct[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      // Fetch all inventory items (which include movements)
      const res = await fetch(`${INVENTORY_URL}/inventory?pageSize=200`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        const items: InventoryItem[] = Array.isArray(data) ? data : data.items || [];

        // For each item, fetch detail to get movements
        const allMovements: MovementWithProduct[] = [];
        const detailPromises = items.map(async (item) => {
          try {
            const detailRes = await fetch(`${INVENTORY_URL}/inventory/${item.productId}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (detailRes.ok) {
              const detail = await detailRes.json();
              if (detail.movements) {
                detail.movements.forEach((m: StockMovement) => {
                  allMovements.push({
                    ...m,
                    sku: item.sku,
                    productId: item.productId,
                  });
                });
              }
            }
          } catch {
            // skip this item
          }
        });

        await Promise.all(detailPromises);

        // Sort by date (newest first)
        allMovements.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setMovements(allMovements);
        setFiltered(allMovements);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  useEffect(() => {
    let result = movements;

    if (typeFilter !== "all") {
      result = result.filter((m) => m.type === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.sku.toLowerCase().includes(q) ||
          m.productId.toLowerCase().includes(q) ||
          m.reason?.toLowerCase().includes(q) ||
          m.referenceId?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [search, typeFilter, movements]);

  // Summary
  const inbound = movements.filter((m) => m.type === "INBOUND").reduce((s, m) => s + m.delta, 0);
  const outbound = movements.filter((m) => m.type === "OUTBOUND").reduce((s, m) => s + Math.abs(m.delta), 0);
  const adjustments = movements.filter((m) => m.type === "ADJUSTMENT").length;
  const reservations = movements.filter((m) => m.type === "RESERVATION").length;

  const movementTypes = ["all", "INBOUND", "OUTBOUND", "RESERVATION", "RELEASE", "ADJUSTMENT"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3Icon className="h-7 w-7" /> Stock Movements
          </h1>
          <p className="text-muted-foreground mt-1">
            Track all stock changes across your inventory
          </p>
        </div>
        <Button variant="outline" onClick={fetchMovements}>
          <RefreshCwIcon className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total Inbound</p>
            <p className="text-2xl font-bold text-green-600">+{inbound}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total Outbound</p>
            <p className="text-2xl font-bold text-red-500">-{outbound}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Adjustments</p>
            <p className="text-2xl font-bold">{adjustments}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Reservations</p>
            <p className="text-2xl font-bold text-orange-500">{reservations}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by SKU, product ID, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {movementTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t === "all" ? "All Types" : t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {filtered.length} movement{filtered.length !== 1 ? "s" : ""}
          </CardTitle>
          <CardDescription>
            Complete audit trail of stock changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Delta</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No stock movements found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-sm">
                        <div>
                          <p>{new Date(m.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(m.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            m.type === "INBOUND" || m.type === "RELEASE"
                              ? "default"
                              : m.type === "ADJUSTMENT"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {m.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{m.sku}</TableCell>
                      <TableCell>
                        <Link
                          href={`/products/${m.productId}`}
                          className="text-primary hover:underline font-mono text-xs"
                        >
                          {m.productId.slice(0, 8)}...
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-bold ${
                            m.delta > 0 ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {m.delta > 0 ? "+" : ""}
                          {m.delta}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                        {m.reason || "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {m.referenceId ? `${m.referenceId.slice(0, 8)}...` : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
