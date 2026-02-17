/**
 * ShippingSelector – radio-group UI that fetches live rates from
 * Terminal Africa + ShipBubble via the Next.js /api/shipping/quote
 * route.  Presents Cheapest / Fastest / Recommended highlights,
 * then a "Cash on Delivery" option, then remaining options.
 *
 * Props:
 *  - shippingData  : the address the user just submitted
 *  - weight        : total cart weight (kg)
 *  - codAvailable  : whether all cart items support pay-on-delivery
 *  - onSelect      : callback with the selected rate + cost
 */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { formatPrice } from "@/lib/formatPrice";
import {
  TruckIcon,
  TruckFastIcon,
  TagIcon,
  BoltIcon,
  ThumbsUpIcon,
  MoneyBillIcon,
  SpinnerIcon,
} from "@/components/Icons";
import type { ShippingFormData } from "@repo/types";

/* ─── Types ─── */

export interface ShippingRate {
  provider: "terminal_africa" | "shipbubble";
  carrier: string;
  carrierLogo: string;
  serviceType: string;
  amount: number; // Naira
  currency: string;
  estimatedDays: number;
  rateId: string;
}

export interface SelectedShipping {
  rate: ShippingRate | null;
  isCOD: boolean;
  cost: number; // Naira – 0 for COD
  shippingMethodId: string; // rateId or "cod"
}

interface ShippingSelectorProps {
  shippingData: ShippingFormData;
  weight: number; // kg
  codAvailable: boolean;
  onSelect: (selection: SelectedShipping) => void;
}

/* ─── Component ─── */

export default function ShippingSelector({
  shippingData,
  weight,
  codAvailable,
  onSelect,
}: ShippingSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allRates, setAllRates] = useState<ShippingRate[]>([]);
  const [cheapest, setCheapest] = useState<ShippingRate | null>(null);
  const [fastest, setFastest] = useState<ShippingRate | null>(null);
  const [recommended, setRecommended] = useState<ShippingRate | null>(null);
  const [selectedId, setSelectedId] = useState<string>(""); // rateId or "cod"

  /* ─── Fetch rates whenever address/weight changes ─── */
  const fetchRates = useCallback(async () => {
    if (!shippingData.state || !shippingData.city || !shippingData.address) return;
    if (!weight || weight <= 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationAddress: shippingData.address,
          destinationCity: shippingData.city,
          destinationState: shippingData.state,
          recipientName: shippingData.fullName,
          recipientPhone: shippingData.phone,
          recipientEmail: shippingData.email,
          weight,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch shipping rates");
      }

      const data = await res.json();

      setAllRates(data.all || []);
      setCheapest(data.cheapest || null);
      setFastest(data.fastest || null);
      setRecommended(data.recommended || null);

      // Auto-select recommended if available
      if (data.recommended) {
        const r = data.recommended as ShippingRate;
        setSelectedId(r.rateId);
        onSelect({
          rate: r,
          isCOD: false,
          cost: r.amount,
          shippingMethodId: r.rateId,
        });
      }
    } catch (err) {
      console.error("Shipping rates fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load shipping options"
      );
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shippingData.state,
    shippingData.city,
    shippingData.address,
    shippingData.fullName,
    shippingData.phone,
    shippingData.email,
    weight,
  ]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  /* ─── Handlers ─── */

  const handleSelect = (rate: ShippingRate) => {
    setSelectedId(rate.rateId);
    onSelect({
      rate,
      isCOD: false,
      cost: rate.amount,
      shippingMethodId: rate.rateId,
    });
  };

  const handleSelectCOD = () => {
    setSelectedId("cod");
    onSelect({
      rate: null,
      isCOD: true,
      cost: 0,
      shippingMethodId: "cod",
    });
  };

  /* ─── Helpers ─── */

  const highlightIds = new Set(
    [cheapest?.rateId, fastest?.rateId, recommended?.rateId].filter(Boolean)
  );

  // "Other" rates = everything not in the highlight set
  const otherRates = allRates.filter((r) => !highlightIds.has(r.rateId));

  const daysLabel = (days: number) =>
    days <= 1 ? "1 day" : `${days} days`;

  /* ─── Render ─── */

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-500 dark:text-gray-400">
        <SpinnerIcon className="w-8 h-8 animate-spin" />
        <p className="text-sm">Fetching live shipping rates…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
        <p className="font-semibold mb-1">Could not load shipping options</p>
        <p>{error}</p>
        <button
          onClick={fetchRates}
          className="mt-3 px-4 py-1.5 text-xs bg-red-100 dark:bg-red-800/40 rounded hover:bg-red-200 dark:hover:bg-red-800/60 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (allRates.length === 0 && !codAvailable) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-sm py-6 text-center">
        No shipping options available for this address.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-dark dark:text-light mb-1">
        Choose Shipping Method
      </h3>

      {/* ─── Highlighted Options ─── */}
      {cheapest && (
        <RateCard
          rate={cheapest}
          badge="Cheapest"
          badgeColor="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
          icon={<TagIcon className="w-5 h-5" />}
          selected={selectedId === cheapest.rateId}
          onSelect={() => handleSelect(cheapest)}
          daysLabel={daysLabel}
        />
      )}

      {fastest && fastest.rateId !== cheapest?.rateId && (
        <RateCard
          rate={fastest}
          badge="Fastest"
          badgeColor="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
          icon={<BoltIcon className="w-5 h-5" />}
          selected={selectedId === fastest.rateId}
          onSelect={() => handleSelect(fastest)}
          daysLabel={daysLabel}
        />
      )}

      {recommended &&
        recommended.rateId !== cheapest?.rateId &&
        recommended.rateId !== fastest?.rateId && (
          <RateCard
            rate={recommended}
            badge="Recommended"
            badgeColor="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
            icon={<ThumbsUpIcon className="w-5 h-5" />}
            selected={selectedId === recommended.rateId}
            onSelect={() => handleSelect(recommended)}
            daysLabel={daysLabel}
          />
        )}

      {/* ─── Cash on Delivery ─── */}
      {codAvailable && (
        <label
          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
            selectedId === "cod"
              ? "border-primary bg-primary/5 dark:bg-primary/10"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <input
            type="radio"
            name="shipping"
            checked={selectedId === "cod"}
            onChange={handleSelectCOD}
            className="accent-primary w-4 h-4"
          />
          <MoneyBillIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-dark dark:text-light">
                Cash on Delivery
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                Pay Later
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Pay with cash or card when you receive your order
            </p>
          </div>
          <span className="font-semibold text-dark dark:text-light whitespace-nowrap">
            ₦0.00
          </span>
        </label>
      )}

      {/* ─── Other Options ─── */}
      {otherRates.length > 0 && (
        <>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 mb-1 uppercase tracking-wider font-medium">
            Other Options
          </p>
          {otherRates.map((rate) => (
            <RateCard
              key={rate.rateId}
              rate={rate}
              icon={<TruckIcon className="w-5 h-5" />}
              selected={selectedId === rate.rateId}
              onSelect={() => handleSelect(rate)}
              daysLabel={daysLabel}
            />
          ))}
        </>
      )}
    </div>
  );
}

/* ─── Rate Card Sub-component ─── */

function RateCard({
  rate,
  badge,
  badgeColor,
  icon,
  selected,
  onSelect,
  daysLabel,
}: {
  rate: ShippingRate;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  daysLabel: (d: number) => string;
}) {
  return (
    <label
      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
        selected
          ? "border-primary bg-primary/5 dark:bg-primary/10"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
    >
      <input
        type="radio"
        name="shipping"
        checked={selected}
        onChange={onSelect}
        className="accent-primary w-4 h-4"
      />

      {/* Carrier logo or fallback icon */}
      {rate.carrierLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={rate.carrierLogo}
          alt={rate.carrier}
          className="w-8 h-8 object-contain rounded shrink-0"
        />
      ) : (
        <span className="text-primary shrink-0">{icon}</span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-dark dark:text-light">
            {rate.carrier}
          </span>
          {badge && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor}`}
            >
              {badge}
            </span>
          )}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 capitalize">
            {rate.provider === "terminal_africa"
              ? "Terminal Africa"
              : "ShipBubble"}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {rate.serviceType} · Est. {daysLabel(rate.estimatedDays)}
        </p>
      </div>

      <span className="font-semibold text-dark dark:text-light whitespace-nowrap">
        {formatPrice(rate.amount)}
      </span>
    </label>
  );
}
