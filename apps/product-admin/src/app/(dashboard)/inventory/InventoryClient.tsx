"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  SearchIcon,
  WarehouseIcon,
  AlertTriangleIcon,
  PackageIcon,
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
  createdAt: string;
  updatedAt: string;
}

export default function InventoryClient() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filtered, setFiltered] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${INVENTORY_URL}/inventory`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.items || [];
        setItems(list);
        setFiltered(list);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(items);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        items.filter(
          (i) =>
            i.sku.toLowerCase().includes(q) ||
            i.productId.toLowerCase().includes(q) ||
            i.variantName?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, items]);

  // Summary
  const totalItems = items.length;
  const totalStock = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalReserved = items.reduce((sum, i) => sum + i.reserved, 0);
  const lowStockCount = items.filter(
    (i) => i.quantity - i.reserved <= i.lowStockAt
  ).length;
  const healthPercent = totalItems > 0
    ? Math.round(((totalItems - lowStockCount) / totalItems) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <WarehouseIcon className="h-7 w-7" /> Stock Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor inventory across all products
          </p>
        </div>
        <Button variant="outline" onClick={fetchInventory}>
          <RefreshCwIcon className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <PackageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <WarehouseIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Stock</p>
                <p className="text-2xl font-bold">{totalStock.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                <AlertTriangleIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-2">Stock Health</p>
            <p className="text-2xl font-bold mb-2">{healthPercent}%</p>
            <Progress value={healthPercent} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by SKU, product ID, or variant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {filtered.length} inventory item{filtered.length !== 1 ? "s" : ""}
          </CardTitle>
          <CardDescription>Click product ID to manage inventory for that product</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Reserved</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => {
                    const available = item.quantity - item.reserved;
                    const isLow = available <= item.lowStockAt;
                    const isOut = available <= 0;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm font-medium">
                          {item.sku}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/products/${item.productId}`}
                            className="text-primary hover:underline font-mono text-xs"
                          >
                            {item.productId.slice(0, 8)}...
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.variantName || "Default"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right text-orange-500">
                          {item.reserved}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          <span className={isOut ? "text-red-500" : isLow ? "text-orange-500" : "text-green-600"}>
                            {available}
                          </span>
                        </TableCell>
                        <TableCell>
                          {isOut ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : isLow ? (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="default">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reserved summary */}
      {totalReserved > 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{totalReserved}</strong> units reserved across all items.
              Total available: <strong className="text-foreground">{totalStock - totalReserved}</strong> units.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
