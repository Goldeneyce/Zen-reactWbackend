"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeftIcon,
  Loader2Icon,
  PlusIcon,
} from "@/components/icons";
import Link from "next/link";

const PRODUCT_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;

export default function NewProductClient() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    originalPrice: 0,
    image: "",
    images: "",
    sizes: "",
    colors: "",
    features: "",
    inStock: true,
    payOnDelivery: false,
    badge: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
  });

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSlugify = () => {
    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setForm({ ...form, slug });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      showMessage("error", "Name and slug are required");
      return;
    }

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const body = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: form.price,
        originalPrice: form.originalPrice || undefined,
        image: form.image || undefined,
        images: form.images
          ? form.images.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        sizes: form.sizes
          ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        colors: form.colors
          ? form.colors.split(",").map((c) => c.trim()).filter(Boolean)
          : [],
        features: form.features
          ? form.features.split("\n").map((f) => f.trim()).filter(Boolean)
          : [],
        inStock: form.inStock,
        payOnDelivery: form.payOnDelivery,
        badge: form.badge || undefined,
        weight: form.weight || undefined,
        length: form.length || undefined,
        width: form.width || undefined,
        height: form.height || undefined,
      };

      const res = await fetch(`${PRODUCT_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create product");
      }

      const product = await res.json();
      router.push(`/products/${product.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create product";
      showMessage("error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
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
      <div className="flex items-center gap-3">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-sm text-muted-foreground">Fill in the details to create a new product</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Basic product details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Slug *</label>
              <div className="flex gap-2">
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="product-slug"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleSlugify}>
                  Generate
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Price ($) *</label>
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Original Price ($)</label>
              <Input
                type="number"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Badge</label>
              <Input
                value={form.badge}
                placeholder="e.g. New, Sale, Limited"
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Main Image URL</label>
              <Input
                value={form.image}
                placeholder="https://..."
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Additional Image URLs (comma-separated)</label>
            <Input
              value={form.images}
              placeholder="https://img1.jpg, https://img2.jpg"
              onChange={(e) => setForm({ ...form, images: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the product..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sizes (comma-separated)</label>
              <Input
                value={form.sizes}
                placeholder="S, M, L, XL"
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Colors (comma-separated)</label>
              <Input
                value={form.colors}
                placeholder="Black, Silver, White"
                onChange={(e) => setForm({ ...form, colors: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Features (one per line)</label>
            <Textarea
              rows={3}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder={"Premium quality material\nFree shipping\n30-day returns"}
            />
          </div>

          <div className="flex gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.inStock}
                onCheckedChange={(v) => setForm({ ...form, inStock: v })}
              />
              <label className="text-sm font-medium">In Stock</label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.payOnDelivery}
                onCheckedChange={(v) => setForm({ ...form, payOnDelivery: v })}
              />
              <label className="text-sm font-medium">Pay on Delivery</label>
            </div>
          </div>

          {/* Shipping Dimensions */}
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">Shipping Dimensions (Optional)</label>
            <p className="text-xs text-muted-foreground">Used for logistics and shipping rate calculation</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2.5"
                  value={form.weight || ""}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Length (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 30"
                  value={form.length || ""}
                  onChange={(e) => setForm({ ...form, length: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Width (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 20"
                  value={form.width || ""}
                  onChange={(e) => setForm({ ...form, width: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Height (cm)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 15"
                  value={form.height || ""}
                  onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link href="/products">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <PlusIcon className="w-4 h-4 mr-1" />
              )}
              {saving ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
