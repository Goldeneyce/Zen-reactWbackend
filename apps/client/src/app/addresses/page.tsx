"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { LocationIcon, PlusIcon, PencilIcon, TrashIcon } from "@/components/Icons";

const USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? "http://localhost:8004";

interface Address {
  id: string;
  label: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
}

const BLANK_FORM = {
  label: "Home",
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Nigeria",
  phone: "",
  isDefault: false,
};

type FormData = typeof BLANK_FORM;

async function getToken() {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(BLANK_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /* ── Fetch ── */
  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) { setError("Please log in to view your address book."); setLoading(false); return; }

      const res = await fetch(`${USER_SERVICE}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        // Profile not created yet
        setAddresses([]);
      } else if (!res.ok) {
        throw new Error("Failed to load addresses.");
      } else {
        setAddresses(await res.json());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  /* ── Helpers ── */
  const openAddForm = () => {
    setForm(BLANK_FORM);
    setEditingId(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (addr: Address) => {
    setForm({
      label: addr.label ?? "Home",
      fullName: addr.fullName,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 ?? "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone ?? "",
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    try {
      const token = await getToken();
      if (!token) { setFormError("Not authenticated."); setSaving(false); return; }

      const body = {
        label: form.label || "Home",
        fullName: form.fullName,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
        phone: form.phone || undefined,
        isDefault: form.isDefault,
      };

      const url = editingId
        ? `${USER_SERVICE}/addresses/${editingId}`
        : `${USER_SERVICE}/addresses`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Failed to save address.");
      }

      await fetchAddresses();
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`${USER_SERVICE}/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isDefault: true }),
      });
      await fetchAddresses();
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await fetch(`${USER_SERVICE}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletingId(null);
      await fetchAddresses();
    } catch { /* silent */ }
  };

  /* ── Render ── */
  if (loading) return <div className="container py-12 text-sm text-gray-500">Loading address book…</div>;
  if (error) return <div className="container py-12 text-sm text-red-500">{error}</div>;

  return (
    <div className="container py-12">
      <div className="max-w-4xl space-y-8">
        {/* Header card */}
        <div className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-gradient-to-br from-white via-white to-secondary/10 dark:from-white-dark dark:via-white-dark dark:to-secondary/10 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-dark dark:text-gray-100">Address Book</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your saved shipping addresses.</p>
        </div>

        {/* Address list */}
        <section className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-white-dark p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              <p className="text-sm text-gray-500">{addresses.length} address{addresses.length !== 1 ? "es" : ""} saved.</p>
            </div>
            {!showForm && (
              <button onClick={openAddForm} className="btn btn-primary flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Add address
              </button>
            )}
          </div>

          {/* Inline form (add / edit) */}
          {showForm && (
            <form onSubmit={handleSave} className="rounded-2xl border border-secondary/30 bg-secondary/5 dark:bg-secondary/10 p-6 space-y-4">
              <h3 className="font-semibold text-dark dark:text-gray-100">
                {editingId ? "Edit address" : "New address"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                  <select name="label" value={form.label} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm">
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Full Name *</label>
                  <input required name="fullName" value={form.fullName} onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Address Line 1 *</label>
                  <input required name="addressLine1" value={form.addressLine1} onChange={handleChange}
                    placeholder="12 Main Street"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Address Line 2</label>
                  <input name="addressLine2" value={form.addressLine2} onChange={handleChange}
                    placeholder="Apt 4B (optional)"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">City *</label>
                  <input required name="city" value={form.city} onChange={handleChange}
                    placeholder="Lagos"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">State *</label>
                  <input required name="state" value={form.state} onChange={handleChange}
                    placeholder="Lagos State"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Postal Code *</label>
                  <input required name="postalCode" value={form.postalCode} onChange={handleChange}
                    placeholder="100001"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Country *</label>
                  <input required name="country" value={form.country} onChange={handleChange}
                    placeholder="Nigeria"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="+234 800 000 0000"
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input id="isDefault" name="isDefault" type="checkbox" checked={form.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 accent-secondary rounded" />
                  <label htmlFor="isDefault" className="text-sm text-gray-600 dark:text-gray-300 select-none cursor-pointer">
                    Set as default address
                  </label>
                </div>
              </div>
              {formError && <p className="text-sm text-red-500">{formError}</p>}
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
                  {saving ? "Saving…" : editingId ? "Save changes" : "Add address"}
                </button>
                <button type="button" onClick={closeForm} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          )}

          {/* Address cards */}
          {addresses.length === 0 && !showForm ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <LocationIcon className="h-10 w-10 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400">No saved addresses yet.</p>
              <button onClick={openAddForm} className="btn btn-primary mt-2 flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Add your first address
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((addr) => (
                <div key={addr.id}
                  className={`relative rounded-2xl border p-5 transition-all ${
                    addr.isDefault
                      ? "border-secondary bg-secondary/5 dark:bg-secondary/10"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30"
                  }`}>
                  {/* Default badge */}
                  {addr.isDefault && (
                    <span className="absolute top-3 right-3 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-white">
                      Default
                    </span>
                  )}

                  {/* Label */}
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">{addr.label}</p>

                  {/* Details */}
                  <p className="font-semibold text-dark dark:text-gray-100">{addr.fullName}</p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {addr.addressLine1}
                    {addr.addressLine2 && <>, {addr.addressLine2}</>}
                    <br />
                    {addr.city}, {addr.state} {addr.postalCode}
                    <br />
                    {addr.country}
                    {addr.phone && <><br />{addr.phone}</>}
                  </p>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)}
                        className="text-xs rounded-lg border border-secondary text-secondary hover:bg-secondary hover:text-white px-3 py-1.5 transition-colors">
                        Set as default
                      </button>
                    )}
                    <button onClick={() => openEditForm(addr)}
                      className="flex items-center gap-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 transition-colors">
                      <PencilIcon className="h-3 w-3" />
                      Edit
                    </button>
                    {deletingId === addr.id ? (
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs text-red-500">Delete?</span>
                        <button onClick={() => handleDelete(addr.id)}
                          className="text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 transition-colors">
                          Yes
                        </button>
                        <button onClick={() => setDeletingId(null)}
                          className="text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 px-3 py-1.5 transition-colors">
                          No
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeletingId(addr.id)}
                        className="flex items-center gap-1.5 text-xs rounded-lg border border-red-200 dark:border-red-800/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 transition-colors ml-auto">
                        <TrashIcon className="h-3 w-3" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
