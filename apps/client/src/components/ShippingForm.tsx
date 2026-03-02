// components/ShippingForm.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingFormSchema, type ShippingFormData as ShippingFormInputs } from "@repo/types";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? "http://localhost:8004";

const NIGERIA_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers",
  "Sokoto","Taraba","Yobe","Zamfara"
];

interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

async function getToken() {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

interface ShippingFormProps {
  onNext: (data: ShippingFormInputs) => void;
}

export default function ShippingForm({ onNext }: ShippingFormProps) {
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
  const [saveAddress, setSaveAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "Nigeria",
      label: "Home",
    },
  });

  /* ── Fetch saved addresses ── */
  const fetchAddresses = useCallback(async () => {
    setLoadingAddresses(true);
    try {
      const token = await getToken();
      if (!token) { setLoadingAddresses(false); return; }

      const res = await fetch(`${USER_SERVICE}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data: SavedAddress[] = await res.json();
        setSavedAddresses(data);

        // Auto-select and prepopulate default address
        const defaultAddr = data.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          populateFromAddress(defaultAddr);
        }
      }
    } catch {
      // Silently fail – user can still enter manually
    } finally {
      setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  /* ── Populate form from a saved address ── */
  const populateFromAddress = (addr: SavedAddress) => {
    reset({
      fullName: addr.fullName,
      email: "", // Email is not stored in addresses, user must enter
      phone: addr.phone ?? "",
      address: addr.addressLine1,
      addressLine2: addr.addressLine2 ?? "",
      city: addr.city,
      state: addr.state,
      country: addr.country ?? "Nigeria",
      label: addr.label ?? "Home",
    });
  };

  /* ── Handle saved address selection ── */
  const handleAddressSelection = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === "new") {
      reset({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "Nigeria",
        label: "Home",
      });
      setSaveAddress(false);
    } else {
      const addr = savedAddresses.find((a) => a.id === addressId);
      if (addr) populateFromAddress(addr);
    }
  };

  /* ── Save new address to user service ── */
  const saveNewAddress = async (data: ShippingFormInputs) => {
    try {
      const token = await getToken();
      if (!token) return;

      await fetch(`${USER_SERVICE}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          label: data.label || "Home",
          fullName: data.fullName,
          addressLine1: data.address,
          addressLine2: data.addressLine2 || undefined,
          city: data.city,
          state: data.state,
          country: data.country || "Nigeria",
          phone: data.phone,
          isDefault: savedAddresses.length === 0, // First address becomes default
        }),
      });
    } catch {
      // Silently fail – checkout should not be blocked by address save failure
    }
  };

  const onSubmit: SubmitHandler<ShippingFormInputs> = async (data) => {
    if (saveAddress && selectedAddressId === "new") {
      setSavingAddress(true);
      await saveNewAddress(data);
      setSavingAddress(false);
    }
    onNext(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom"
    >
      <h2 className="text-2xl font-bold text-primary mb-6">Address Information</h2>

      {/* ── Saved address selector ── */}
      {!loadingAddresses && savedAddresses.length > 0 && (
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-500 mb-3">
            Select an Address
          </label>
          <div className="space-y-2">
            {savedAddresses.map((addr) => (
              <label
                key={addr.id}
                className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedAddressId === addr.id
                    ? "border-secondary bg-secondary/5 dark:bg-secondary/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="savedAddress"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => handleAddressSelection(addr.id)}
                  className="mt-1 h-4 w-4 accent-secondary"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-dark">{addr.fullName}</span>
                    <span className="text-xs uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-white font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {addr.city}, {addr.state}, {addr.country}
                    {addr.phone && ` — ${addr.phone}`}
                  </p>
                </div>
              </label>
            ))}

            {/* New address option */}
            <label
              className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedAddressId === "new"
                  ? "border-secondary bg-secondary/5 dark:bg-secondary/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <input
                type="radio"
                name="savedAddress"
                value="new"
                checked={selectedAddressId === "new"}
                onChange={() => handleAddressSelection("new")}
                className="h-4 w-4 accent-secondary"
              />
              <span className="font-medium text-dark">+ Use a new address</span>
            </label>
          </div>
        </div>
      )}

      {loadingAddresses && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Loading saved addresses…</p>
      )}

      {/* ── Address form fields ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Label */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Label
          </label>
          <Controller
            name="label"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            )}
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Full Name *
          </label>
          <input
            {...register("fullName")}
            placeholder="Ciroma Chukwuma Adekunle"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message as string}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Email Address *
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="john@example.com"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message as string}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Phone Number *
          </label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="+234 800 000 0000"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message as string}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Address Line 1 *
          </label>
          <input
            {...register("address")}
            placeholder="12 Main Street"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address.message as string}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Address Line 2
          </label>
          <input
            {...register("addressLine2")}
            placeholder="Landmark (optional)"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            City *
          </label>
          <input
            {...register("city")}
            placeholder="Asaba"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message as string}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            State *
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="">Select a state</option>
                {NIGERIA_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-500">{errors.state.message as string}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Country *
          </label>
          <input
            {...register("country")}
            placeholder="Nigeria"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </div>

      {/* ── Save address checkbox (only for new addresses) ── */}
      {selectedAddressId === "new" && (
        <div className="mt-5 flex items-center gap-3">
          <input
            id="saveAddress"
            type="checkbox"
            checked={saveAddress}
            onChange={(e) => setSaveAddress(e.target.checked)}
            className="h-4 w-4 accent-secondary rounded"
          />
          <label
            htmlFor="saveAddress"
            className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer"
          >
            Save this address to my address book
          </label>
        </div>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={savingAddress}
          className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {savingAddress ? "Saving address…" : "Continue to Shipping"}
        </button>
      </div>
    </form>
  );
}