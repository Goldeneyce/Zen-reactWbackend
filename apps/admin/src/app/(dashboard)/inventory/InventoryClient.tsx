"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  SearchIcon,
  WarehouseIcon,
} from "@/components/icons";
import Link from "next/link";

const INVENTORY_URL = process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL;
const PRODUCT_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;

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

interface ProductMap {
  [id: string]: { name: string; image: string };
}

export default function InventoryClient() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [productMap, setProductMap] = useState<ProductMap>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getToken = async () => {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(
        `${INVENTORY_URL}/inventory?page=${page}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);

      // Hydrate product names
      const productIds = data.items.map((i: InventoryItem) => i.productId);
      if (productIds.length > 0) {
        const productRes = await fetch(
          `${PRODUCT_URL}/products/bulk?ids=${productIds.join(",")}`
        );
        if (productRes.ok) {
          const products = await productRes.json();
          const map: ProductMap = {};
          products.forEach((p: { id: string; name: string; image: string }) => {
            map[p.id] = { name: p.name, image: p.image };
          });
          setProductMap(map);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  const filteredItems = search
    ? items.filter(
        (item) =>
          item.sku.toLowerCase().includes(search.toLowerCase()) ||
          (productMap[item.productId]?.name ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WarehouseIcon className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search SKU or product..."
              className="pl-9 w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Low Stock</p>
            <p className="text-2xl font-bold text-orange-500">
              {items.filter((i) => i.quantity - i.reserved <= i.lowStockAt).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-red-500">
              {items.filter((i) => i.quantity - i.reserved <= 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground">Total Units</p>
            <p className="text-2xl font-bold">
              {items.reduce((sum, i) => sum + i.quantity, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Showing {filteredItems.length} of {total} items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2Icon className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Reserved</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">
                          No inventory items found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => {
                        const available = item.quantity - item.reserved;
                        const isLow = available <= item.lowStockAt && available > 0;
                        const isOut = available <= 0;
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {productMap[item.productId]?.name ?? item.productId.slice(0, 8)}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                            <TableCell>{item.variantName || "–"}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{item.reserved}</TableCell>
                            <TableCell className="text-right font-bold">
                              {available}
                            </TableCell>
                            <TableCell>
                              {isOut ? (
                                <Badge variant="destructive">Out of Stock</Badge>
                              ) : isLow ? (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                                  Low Stock
                                </Badge>
                              ) : (
                                <Badge variant="default">In Stock</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Link href={`/products/${item.productId}`}>
                                <Button variant="ghost" size="sm">
                                  Manage
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
