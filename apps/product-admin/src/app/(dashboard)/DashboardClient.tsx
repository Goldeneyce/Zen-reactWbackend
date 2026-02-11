"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShirtIcon, WarehouseIcon, AlertTriangleIcon, TrendingUpIcon, TagIcon, BarChart3Icon } from "@/components/icons";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import Link from "next/link";

interface ProductSummary {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
}

interface InventorySummary {
  totalItems: number;
  totalQuantity: number;
  lowStockItems: number;
  outOfStockItems: number;
}

interface RecentProduct {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  images: string[];
  createdAt: string;
}

export default function DashboardClient() {
  const [productSummary, setProductSummary] = useState<ProductSummary | null>(null);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary | null>(null);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        // Fetch products
        const productsRes = await fetch(
          `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?limit=100`,
          { headers }
        );
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const products = productsData.products || productsData || [];
          const total = products.length;
          const inStock = products.filter((p: { inStock: boolean }) => p.inStock).length;
          setProductSummary({
            totalProducts: total,
            inStockProducts: inStock,
            outOfStockProducts: total - inStock,
          });
          // Get 5 most recent
          const sorted = [...products].sort(
            (a: { createdAt: string }, b: { createdAt: string }) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentProducts(sorted.slice(0, 5));
        }

        // Fetch inventory
        const inventoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL}/inventory`,
          { headers }
        );
        if (inventoryRes.ok) {
          const invData = await inventoryRes.json();
          const items = invData.items || invData || [];
          const totalQty = items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
          const lowStock = items.filter(
            (i: { quantity: number; lowStockAt: number }) => i.quantity > 0 && i.quantity <= (i.lowStockAt || 10)
          ).length;
          const outOfStock = items.filter((i: { quantity: number }) => i.quantity === 0).length;
          setInventorySummary({
            totalItems: items.length,
            totalQuantity: totalQty,
            lowStockItems: lowStock,
            outOfStockItems: outOfStock,
          });
        }
      } catch {
        // silently fail - dashboard is best-effort
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-20 animate-pulse bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stockHealthPercent = productSummary
    ? Math.round((productSummary.inStockProducts / Math.max(productSummary.totalProducts, 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your product management center</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <ShirtIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{productSummary?.totalProducts ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {productSummary?.inStockProducts ?? 0} in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inventory Items
            </CardTitle>
            <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inventorySummary?.totalItems ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {inventorySummary?.totalQuantity?.toLocaleString() ?? 0} total units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {inventorySummary?.lowStockItems ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Items below threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock Health
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stockHealthPercent}%</div>
            <Progress value={stockHealthPercent} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Products</CardTitle>
            <Link
              href="/products"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No products yet</p>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <ShirtIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${product.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/products"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <ShirtIcon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">Manage Products</span>
              </Link>
              <Link
                href="/inventory"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <WarehouseIcon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">Manage Inventory</span>
              </Link>
              <Link
                href="/categories"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <TagIcon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">Categories</span>
              </Link>
              <Link
                href="/movements"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <BarChart3Icon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium">Stock Movements</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
