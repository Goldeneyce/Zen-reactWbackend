/**
 * Terminal Africa Logistics Provider
 * Docs: https://docs.terminal.africa
 */

const TERMINAL_AFRICA_BASE_URL = "https://sandbox.terminal.africa/v1";
const TERMINAL_AFRICA_SECRET = process.env.TERMINAL_AFRICA_SECRET_KEY || "";

interface TerminalShipmentPayload {
  pickup_address: string;
  delivery_address: string;
  parcel: {
    weight: number; // kg
    length?: number; // cm
    width?: number; // cm
    height?: number; // cm
    description?: string;
  };
}

interface TerminalRate {
  carrier_name: string;
  carrier_logo: string;
  amount: number; // in NGN (kobo)
  currency: string;
  delivery_time: string; // e.g. "3-5 days"
  carrier_slug: string;
  rate_id: string;
}

export interface NormalizedRate {
  provider: "terminal_africa" | "shipbubble";
  carrier: string;
  carrierLogo: string;
  serviceType: string;
  amount: number; // Naira
  currency: string;
  estimatedDays: number;
  rateId: string;
  raw?: any;
}

/**
 * Get an address ID from Terminal Africa for a Nigerian address
 */
async function getOrCreateAddress(
  city: string,
  state: string,
  address: string,
  name: string,
  phone: string,
  email: string
): Promise<string> {
  const res = await fetch(`${TERMINAL_AFRICA_BASE_URL}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TERMINAL_AFRICA_SECRET}`,
    },
    body: JSON.stringify({
      city,
      state,
      country: "NG",
      street: address,
      name,
      phone,
      email,
      is_residential: true,
    }),
  });

  const data = await res.json();

  if (!data.status || !data.data?.address_id) {
    console.error("Terminal Africa – create address failed:", data);
    throw new Error(
      `Terminal Africa address creation failed: ${data.message || "Unknown error"}`
    );
  }

  return data.data.address_id;
}

/**
 * Create a parcel on Terminal Africa
 */
async function createParcel(parcel: {
  weight: number;
  length?: number;
  width?: number;
  height?: number;
  description?: string;
}): Promise<string> {
  const res = await fetch(`${TERMINAL_AFRICA_BASE_URL}/parcels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TERMINAL_AFRICA_SECRET}`,
    },
    body: JSON.stringify({
      description: parcel.description || "E-commerce shipment",
      packaging: "box",
      weight: parcel.weight,
      items: [
        {
          description: parcel.description || "E-commerce items",
          name: "Package",
          currency: "NGN",
          value: 1000,
          quantity: 1,
          weight: parcel.weight,
        },
      ],
      metadata: {},
    }),
  });

  const data = await res.json();

  if (!data.status || !data.data?.parcel_id) {
    console.error("Terminal Africa – create parcel failed:", data);
    throw new Error(
      `Terminal Africa parcel creation failed: ${data.message || "Unknown error"}`
    );
  }

  return data.data.parcel_id;
}

/**
 * Fetch shipping rates from Terminal Africa
 */
export async function getTerminalAfricaRates(params: {
  originCity: string;
  originState: string;
  originAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationAddress: string;
  weight: number; // kg
  length?: number;
  width?: number;
  height?: number;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
}): Promise<NormalizedRate[]> {
  try {
    // 1. Create pickup and delivery addresses
    const [pickupAddressId, deliveryAddressId] = await Promise.all([
      getOrCreateAddress(
        params.originCity,
        params.originState,
        params.originAddress,
        params.senderName,
        params.senderPhone,
        params.senderEmail
      ),
      getOrCreateAddress(
        params.destinationCity,
        params.destinationState,
        params.destinationAddress,
        params.recipientName,
        params.recipientPhone,
        params.recipientEmail
      ),
    ]);

    // 2. Create parcel
    const parcelId = await createParcel({
      weight: params.weight,
      length: params.length,
      width: params.width,
      height: params.height,
    });

    // 3. Get shipment rates
    const res = await fetch(`${TERMINAL_AFRICA_BASE_URL}/rates/shipment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TERMINAL_AFRICA_SECRET}`,
      },
      body: JSON.stringify({
        pickup_address: pickupAddressId,
        delivery_address: deliveryAddressId,
        parcel: parcelId,
        shipment_type: "dropoff",
        currency: "NGN",
      }),
    });

    const data = await res.json();

    if (!data.status || !data.data) {
      console.error("Terminal Africa – get rates failed:", data);
      return [];
    }

    const rates: any[] = Array.isArray(data.data) ? data.data : [];

    return rates.map((rate: any) => ({
      provider: "terminal_africa" as const,
      carrier: rate.carrier_name || rate.carrier || "Unknown",
      carrierLogo: rate.carrier_logo || "",
      serviceType: rate.service_type || "Standard",
      amount: rate.amount ? rate.amount / 100 : 0, // Convert kobo to Naira
      currency: rate.currency || "NGN",
      estimatedDays: parseEstimatedDays(rate.delivery_time || rate.estimated_days),
      rateId: rate.rate_id || rate.id || "",
      raw: rate,
    }));
  } catch (error) {
    console.error("Terminal Africa rates error:", error);
    return [];
  }
}

function parseEstimatedDays(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 7;
  // Parse "3-5 days" → 5 (take max)
  const match = String(value).match(/(\d+)/g);
  if (match && match.length > 0) {
    return parseInt(match[match.length - 1], 10);
  }
  return 7;
}
