"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
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
  PlusIcon,
  EditIcon,
  SaveIcon,
  Trash2Icon,
  TagIcon,
  Loader2Icon,
  XIcon,
} from "@/components/icons";

const PRODUCT_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", slug: "", description: "" });
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", slug: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const getToken = async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${PRODUCT_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  /* ─── Create ─── */
  const handleCreate = async () => {
    if (!newForm.name || !newForm.slug) {
      showMsg("error", "Name and slug are required");
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch(`${PRODUCT_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newForm.name,
          slug: newForm.slug,
          description: newForm.description || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create category");
      }
      showMsg("success", "Category created");
      setNewForm({ name: "", slug: "", description: "" });
      setShowNewForm(false);
      await fetchCategories();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create category";
      showMsg("error", msg);
    } finally {
      setSaving(false);
    }
  };

  /* ─── Update ─── */
  const handleUpdate = async (id: number) => {
    setSaving(true);
    try {
      const token = await getToken();
      const res = await fetch(`${PRODUCT_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          slug: editForm.slug,
          description: editForm.description || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to update category");
      showMsg("success", "Category updated");
      setEditingId(null);
      await fetchCategories();
    } catch {
      showMsg("error", "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete ─── */
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${PRODUCT_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete category");
      showMsg("success", "Category deleted");
      await fetchCategories();
    } catch {
      showMsg("error", "Failed to delete category");
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TagIcon className="h-7 w-7" /> Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage product categories
          </p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          {showNewForm ? (
            <>
              <XIcon className="h-4 w-4 mr-2" /> Cancel
            </>
          ) : (
            <>
              <PlusIcon className="h-4 w-4 mr-2" /> Add Category
            </>
          )}
        </Button>
      </div>

      {/* New Category Form */}
      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Category</CardTitle>
            <CardDescription>Create a new product category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={newForm.name}
                  onChange={(e) => {
                    setNewForm({
                      ...newForm,
                      name: e.target.value,
                      slug: slugify(e.target.value),
                    });
                  }}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Slug *</label>
                <Input
                  value={newForm.slug}
                  onChange={(e) => setNewForm({ ...newForm, slug: e.target.value })}
                  placeholder="category-slug"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? (
                  <Loader2Icon className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <PlusIcon className="w-4 h-4 mr-1" />
                )}
                {saving ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No categories found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((cat) => (
                    <TableRow key={cat.id}>
                      {editingId === cat.id ? (
                        <>
                          <TableCell>
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editForm.slug}
                              onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(cat.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleUpdate(cat.id)}
                                disabled={saving}
                              >
                                <SaveIcon className="w-3 h-3 mr-1" /> Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="font-medium">{cat.name}</TableCell>
                          <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {cat.description || "—"}
                          </TableCell>
                          <TableCell>
                            {new Date(cat.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingId(cat.id);
                                  setEditForm({
                                    name: cat.name,
                                    slug: cat.slug,
                                    description: cat.description || "",
                                  });
                                }}
                              >
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(cat.id)}
                              >
                                <Trash2Icon className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
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
