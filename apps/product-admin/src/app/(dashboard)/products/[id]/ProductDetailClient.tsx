"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeftIcon,
  EditIcon,
  Loader2Icon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "@/components/icons";
import Link from "next/link";

const PRODUCT_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;
const INVENTORY_URL = process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL;

interface Specification {
  id: string;
  key: string;
  value: string;
  productId: string;
}

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
  movements?: StockMovement[];
}

interface StockMovement {
  id: string;
  type: string;
  delta: number;
  reason: string | null;
  referenceId: string | null;
  createdAt: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: number;
  features: string[];
  inStock: boolean;
  payOnDelivery: boolean;
  badge: string | null;
  specifications: Specification[];
  categories: Array<{ category: { id: number; name: string; slug: string } }>;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailClient() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [inventory, setInventory] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "specs" | "inventory">("details");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Product edit state
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    inStock: true,
    payOnDelivery: false,
    badge: "",
    sizes: "",
    colors: "",
  });

  // Spec edit state
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [editingSpecId, setEditingSpecId] = useState<string | null>(null);
  const [editSpecForm, setEditSpecForm] = useState({ key: "", value: "" });

  // Inventory state
  const [restockQty, setRestockQty] = useState(1);
  const [restockReason, setRestockReason] = useState("");
  const [adjustDelta, setAdjustDelta] = useState(0);
  const [adjustReason, setAdjustReason] = useState("");
  const [newInventory, setNewInventory] = useState({ sku: "", quantity: 0, lowStockAt: 5 });

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const getToken = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${PRODUCT_URL}/products/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      setProduct(data);
      setEditForm({
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice ?? 0,
        inStock: data.inStock,
        payOnDelivery: data.payOnDelivery,
        badge: data.badge ?? "",
        sizes: data.sizes?.join(", ") ?? "",
        colors: data.colors?.join(", ") ?? "",
      });
    } catch {
      showMessage("error", "Failed to load product");
    }
  };

  const fetchInventory = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${INVENTORY_URL}/inventory/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInventory(await res.json());
      } else {
        setInventory(null);
      }
    } catch {
      setInventory(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchProduct(), fetchInventory()]);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  /* ─── Product update ─── */
  const handleUpdateProduct = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      const body = {
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        originalPrice: editForm.originalPrice || undefined,
        inStock: editForm.inStock,
        payOnDelivery: editForm.payOnDelivery,
        badge: editForm.badge || undefined,
        sizes: editForm.sizes
          ? editForm.sizes.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        colors: editForm.colors
          ? editForm.colors.split(",").map((c) => c.trim()).filter(Boolean)
          : [],
      };
      const res = await fetch(`${PRODUCT_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update product");
      const updated = await res.json();
      setProduct(updated);
      showMessage("success", "Product updated successfully");
    } catch {
      showMessage("error", "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete product ─── */
  const handleDeleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${PRODUCT_URL}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      router.push("/products");
    } catch {
      showMessage("error", "Failed to delete product");
    }
  };

  /* ─── Specifications ─── */
  const handleAddSpec = async () => {
    if (!newSpec.key || !newSpec.value) return;
    try {
      const token = await getToken();
      const res = await fetch(`${PRODUCT_URL}/productSpecification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, key: newSpec.key, value: newSpec.value }),
      });
      if (!res.ok) throw new Error("Failed to add specification");
      showMessage("success", "Specification added");
      setNewSpec({ key: "", value: "" });
      await fetchProduct();
    } catch {
      showMessage("error", "Failed to add specification");
    }
  };

  const handleUpdateSpec = async (specId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${PRODUCT_URL}/productSpecification/${specId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key: editSpecForm.key, value: editSpecForm.value }),
      });
      if (!res.ok) throw new Error("Failed to update specification");
      showMessage("success", "Specification updated");
      setEditingSpecId(null);
      await fetchProduct();
    } catch {
      showMessage("error", "Failed to update specification");
    }
  };

  const handleDeleteSpec = async (specId: string) => {
    if (!confirm("Delete this specification?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${PRODUCT_URL}/productSpecification/${specId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete specification");
      showMessage("success", "Specification deleted");
      await fetchProduct();
    } catch {
      showMessage("error", "Failed to delete specification");
    }
  };

  /* ─── Inventory ─── */
  const handleCreateInventory = async () => {
    if (!newInventory.sku) return;
    try {
      const token = await getToken();
      const res = await fetch(`${INVENTORY_URL}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          sku: newInventory.sku,
          quantity: newInventory.quantity,
          lowStockAt: newInventory.lowStockAt,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create inventory");
      }
      showMessage("success", "Inventory item created");
      await fetchInventory();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create inventory";
      showMessage("error", msg);
    }
  };

  const handleRestock = async () => {
    if (restockQty <= 0) return;
    try {
      const token = await getToken();
      const res = await fetch(`${INVENTORY_URL}/inventory/${productId}/restock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: restockQty, reason: restockReason || undefined }),
      });
      if (!res.ok) throw new Error("Failed to restock");
      showMessage("success", `Restocked ${restockQty} units`);
      setRestockQty(1);
      setRestockReason("");
      await fetchInventory();
    } catch {
      showMessage("error", "Failed to restock");
    }
  };

  const handleAdjust = async () => {
    if (adjustDelta === 0 || !adjustReason) {
      showMessage("error", "Delta and reason are required");
      return;
    }
    try {
      const token = await getToken();
      const res = await fetch(`${INVENTORY_URL}/inventory/${productId}/adjust`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ delta: adjustDelta, reason: adjustReason }),
      });
      if (!res.ok) throw new Error("Failed to adjust stock");
      showMessage("success", "Stock adjusted");
      setAdjustDelta(0);
      setAdjustReason("");
      await fetchInventory();
    } catch {
      showMessage("error", "Failed to adjust stock");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2Icon className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <PackageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium">Product not found</p>
        <p className="text-muted-foreground mt-1">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products">
          <Button variant="outline" className="mt-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Banner */}
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
              : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground">ID: {product.id}</p>
          </div>
          {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
          <Badge variant={product.inStock ? "default" : "destructive"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDeleteProduct}>
          <Trash2Icon className="w-4 h-4 mr-1" /> Delete Product
        </Button>
      </div>

      {/* Product Image Header */}
      {product.images?.[0] && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-20 w-20 rounded-lg object-cover border"
              />
              <div className="flex gap-2 overflow-x-auto">
                {product.images.slice(1).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 2}`}
                    className="h-16 w-16 rounded-md object-cover border"
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {(["details", "specs", "inventory"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "details" ? "Product Details" : tab === "specs" ? "Specifications" : "Inventory"}
          </button>
        ))}
      </div>

      {/* ─── Product Details Tab ─── */}
      {activeTab === "details" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EditIcon className="w-5 h-5" /> Edit Product
            </CardTitle>
            <CardDescription>Update product information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Original Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.originalPrice}
                  onChange={(e) =>
                    setEditForm({ ...editForm, originalPrice: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Badge</label>
                <Input
                  value={editForm.badge}
                  placeholder="e.g. New, BestSeller"
                  onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sizes (comma-separated)</label>
                <Input
                  value={editForm.sizes}
                  placeholder="S, M, L, XL"
                  onChange={(e) => setEditForm({ ...editForm, sizes: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Colors (comma-separated)</label>
                <Input
                  value={editForm.colors}
                  placeholder="Black, Silver, White"
                  onChange={(e) => setEditForm({ ...editForm, colors: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={editForm.inStock}
                  onCheckedChange={(v) => setEditForm({ ...editForm, inStock: v })}
                />
                <label className="text-sm font-medium">In Stock</label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editForm.payOnDelivery}
                  onCheckedChange={(v) => setEditForm({ ...editForm, payOnDelivery: v })}
                />
                <label className="text-sm font-medium">Pay on Delivery</label>
              </div>
            </div>

            {/* Read-only info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Slug</p>
                <p className="text-sm font-medium">{product.slug}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="text-sm font-medium">{product.rating} ({product.reviews} reviews)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-sm font-medium">
                  {product.categories?.map((c) => c.category.name).join(", ") || "None"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleUpdateProduct} disabled={saving}>
                {saving ? (
                  <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <SaveIcon className="w-4 h-4 mr-1" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Specifications Tab ─── */}
      {activeTab === "specs" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Specification</CardTitle>
              <CardDescription>Add a new key-value specification to this product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Key (e.g. Weight)"
                  value={newSpec.key}
                  onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                />
                <Input
                  placeholder="Value (e.g. 2.5 kg)"
                  value={newSpec.value}
                  onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                />
                <Button onClick={handleAddSpec}>
                  <PlusIcon className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Specifications ({product.specifications?.length ?? 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {product.specifications?.length === 0 ? (
                <p className="text-muted-foreground text-sm">No specifications yet. Add one above.</p>
              ) : (
                <div className="space-y-2">
                  {product.specifications?.map((spec) => (
                    <div
                      key={spec.id}
                      className="flex items-center gap-2 p-3 rounded-md border"
                    >
                      {editingSpecId === spec.id ? (
                        <>
                          <Input
                            value={editSpecForm.key}
                            onChange={(e) =>
                              setEditSpecForm({ ...editSpecForm, key: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Input
                            value={editSpecForm.value}
                            onChange={(e) =>
                              setEditSpecForm({ ...editSpecForm, value: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Button size="sm" onClick={() => handleUpdateSpec(spec.id)}>
                            <SaveIcon className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingSpecId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium flex-1">{spec.key}</span>
                          <span className="text-muted-foreground flex-1">{spec.value}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingSpecId(spec.id);
                              setEditSpecForm({ key: spec.key, value: spec.value });
                            }}
                          >
                            <EditIcon className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDeleteSpec(spec.id)}
                          >
                            <Trash2Icon className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Inventory Tab ─── */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          {!inventory ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Inventory Record</CardTitle>
                <CardDescription>
                  This product has no inventory record yet. Create one to track stock.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">SKU *</label>
                    <Input
                      placeholder="e.g. PROD-001"
                      value={newInventory.sku}
                      onChange={(e) =>
                        setNewInventory({ ...newInventory, sku: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Initial Quantity</label>
                    <Input
                      type="number"
                      value={newInventory.quantity}
                      onChange={(e) =>
                        setNewInventory({ ...newInventory, quantity: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Low Stock Threshold</label>
                    <Input
                      type="number"
                      value={newInventory.lowStockAt}
                      onChange={(e) =>
                        setNewInventory({ ...newInventory, lowStockAt: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <Button className="mt-4" onClick={handleCreateInventory}>
                  <PlusIcon className="w-4 h-4 mr-1" /> Create Inventory
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stock overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-xs text-muted-foreground">Total Stock</p>
                    <p className="text-2xl font-bold">{inventory.quantity}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-xs text-muted-foreground">Reserved</p>
                    <p className="text-2xl font-bold text-orange-500">{inventory.reserved}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold text-green-600">
                      {inventory.quantity - inventory.reserved}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-xs text-muted-foreground">Low Stock Alert</p>
                    <p className="text-2xl font-bold">
                      {inventory.quantity - inventory.reserved <= inventory.lowStockAt ? (
                        <span className="text-red-500">Yes (&le;{inventory.lowStockAt})</span>
                      ) : (
                        <span className="text-green-600">No</span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Restock */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Restock</CardTitle>
                    <CardDescription>Add stock to this product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Quantity</label>
                      <Input
                        type="number"
                        min={1}
                        value={restockQty}
                        onChange={(e) => setRestockQty(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Reason (optional)</label>
                      <Input
                        placeholder="e.g. New shipment received"
                        value={restockReason}
                        onChange={(e) => setRestockReason(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleRestock} className="w-full">
                      <PlusIcon className="w-4 h-4 mr-1" /> Restock +{restockQty}
                    </Button>
                  </CardContent>
                </Card>

                {/* Adjust */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Manual Adjustment</CardTitle>
                    <CardDescription>Correct stock levels (positive or negative)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Delta</label>
                      <Input
                        type="number"
                        value={adjustDelta}
                        onChange={(e) => setAdjustDelta(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Reason *</label>
                      <Input
                        placeholder="e.g. Damaged goods removed"
                        value={adjustReason}
                        onChange={(e) => setAdjustReason(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAdjust} variant="outline" className="w-full">
                      Adjust Stock ({adjustDelta >= 0 ? "+" : ""}
                      {adjustDelta})
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Inventory Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inventory Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">SKU</p>
                      <p className="text-sm font-medium">{inventory.sku}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Variant</p>
                      <p className="text-sm font-medium">{inventory.variantName || "Default"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Low Stock Threshold</p>
                      <p className="text-sm font-medium">{inventory.lowStockAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">
                        {new Date(inventory.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock movements */}
              {inventory.movements && inventory.movements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Stock Movements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {inventory.movements.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-3 rounded-md border text-sm"
                        >
                          <div className="flex items-center gap-3">
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
                            <span className="text-muted-foreground">
                              {m.reason || "No reason"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`font-bold ${
                                m.delta > 0 ? "text-green-600" : "text-red-500"
                              }`}
                            >
                              {m.delta > 0 ? "+" : ""}
                              {m.delta}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(m.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
      <path fill="currentColor" d="M50.7 58.5L0 160H208V32H93.7C75.5 32 58.9 42.3 50.7 58.5zM240 160H448L397.3 58.5C389.1 42.3 372.5 32 354.3 32H240V160zm208 32H0V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192z"/>
    </svg>
  );
}
