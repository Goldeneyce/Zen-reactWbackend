/**
 * ShipBubble Logistics Provider
 * Docs: https://docs.shipbubble.com
 */

import type { NormalizedRate } from "./terminalAfrica.ts";

const SHIPBUBBLE_BASE_URL = "https://backend.shipbubble.com/v1";
const SHIPBUBBLE_API_KEY = process.env.SHIPBUBBLE_API_KEY || "";

/**
 * Validate a destination address with ShipBubble
 */
async function validateAddress(address: string): Promise<{
  address_code: string;
  name: string;
} | null> {
  try {
    const res = await fetch(`${SHIPBUBBLE_BASE_URL}/shipping/address/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SHIPBUBBLE_API_KEY}`,
      },
      body: JSON.stringify({ address }),
    });

    const data = await res.json();

    if (!data.success && !data.data) {
      console.error("ShipBubble – address validation failed:", data);
      return null;
    }

    // ShipBubble returns a list of matched addresses
    const results = data.data || [];
    if (results.length === 0) return null;

    return {
      address_code: results[0].address_code,
      name: results[0].name || address,
    };
  } catch (error) {
    console.error("ShipBubble address validation error:", error);
    return null;
  }
}

/**
 * Fetch shipping rates from ShipBubble
 */
export async function getShipBubbleRates(params: {
  originAddress: string;
  originCity: string;
  originState: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  weight: number; // kg
  length?: number;
  width?: number;
  height?: number;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
}): Promise<NormalizedRate[]> {
  try {
    const fullOrigin = `${params.originAddress}, ${params.originCity}, ${params.originState}, Nigeria`;
    const fullDest = `${params.destinationAddress}, ${params.destinationCity}, ${params.destinationState}, Nigeria`;

    // Validate addresses first
    const [senderAddr, receiverAddr] = await Promise.all([
      validateAddress(fullOrigin),
      validateAddress(fullDest),
    ]);

    if (!senderAddr || !receiverAddr) {
      console.warn("ShipBubble – address validation returned null, trying direct request");
    }

    // Request shipping rates
    const res = await fetch(`${SHIPBUBBLE_BASE_URL}/shipping/fetch_rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SHIPBUBBLE_API_KEY}`,
      },
      body: JSON.stringify({
        sender_address_code: senderAddr?.address_code || "",
        reciever_address_code: receiverAddr?.address_code || "",
        collect_on_delivery: "no",
        package_items: [
          {
            name: "E-commerce order",
            description: "Package shipment",
            unit_weight: params.weight,
            unit_amount: 1000,
            quantity: 1,
            category: "fashion",
          },
        ],
        package_dimension: {
          length: params.length || 30,
          width: params.width || 30,
          height: params.height || 15,
        },
      }),
    });

    const data = await res.json();

    if (!data.success && !data.data) {
      console.error("ShipBubble – fetch rates failed:", data);
      return [];
    }

    const couriers: any[] = data.data?.couriers || data.data || [];

    return couriers.map((courier: any) => ({
      provider: "shipbubble" as const,
      carrier: courier.courier_name || courier.name || "Unknown",
      carrierLogo: courier.courier_image || courier.logo || "",
      serviceType: courier.service_type || courier.type || "Standard",
      amount: parseFloat(courier.total || courier.cost || courier.amount || "0"),
      currency: "NGN",
      estimatedDays: parseEstimatedDays(courier.delivery_eta || courier.estimated_days),
      rateId: String(courier.courier_id || courier.rate_id || courier.id || ""),
      raw: courier,
    }));
  } catch (error) {
    console.error("ShipBubble rates error:", error);
    return [];
  }
}

function parseEstimatedDays(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 7;
  const match = String(value).match(/(\d+)/g);
  if (match && match.length > 0) {
    return parseInt(match[match.length - 1], 10);
  }
  return 7;
}
