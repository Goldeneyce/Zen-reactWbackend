/**
 * Rate Quote Controller
 *
 * Races Terminal Africa and ShipBubble to find the best shipping rates.
 * Returns: cheapest, fastest, recommended, and all options.
 */

import { FastifyRequest, FastifyReply } from "fastify";
import { getTerminalAfricaRates, type NormalizedRate } from "../providers/terminalAfrica.ts";
import { getShipBubbleRates } from "../providers/shipbubble.ts";

// ─── Store origin defaults (your warehouse / pickup location) ──────
const ORIGIN = {
  address: process.env.ORIGIN_ADDRESS || "123 Commerce Ave",
  city: process.env.ORIGIN_CITY || "Ikeja",
  state: process.env.ORIGIN_STATE || "Lagos",
  name: process.env.ORIGIN_NAME || "Zenon Store",
  phone: process.env.ORIGIN_PHONE || "08000000000",
  email: process.env.ORIGIN_EMAIL || "logistics@zenon.store",
};

interface QuoteRequestBody {
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  weight: number; // kg – total weight of all items
  length?: number; // cm
  width?: number; // cm
  height?: number; // cm
}

export interface CategorizedRates {
  cheapest: NormalizedRate | null;
  fastest: NormalizedRate | null;
  recommended: NormalizedRate | null;
  all: NormalizedRate[];
}

/**
 * POST /quote
 * Body: QuoteRequestBody
 * Returns CategorizedRates
 */
export const getShippingQuote = async (
  request: FastifyRequest<{ Body: QuoteRequestBody }>,
  reply: FastifyReply
) => {
  const body = request.body;

  if (
    !body.destinationState ||
    !body.destinationCity ||
    !body.destinationAddress ||
    !body.weight
  ) {
    return reply.code(400).send({
      error:
        "Missing required fields: destinationAddress, destinationCity, destinationState, weight",
    });
  }

  const sharedParams = {
    originAddress: ORIGIN.address,
    originCity: ORIGIN.city,
    originState: ORIGIN.state,
    destinationAddress: body.destinationAddress,
    destinationCity: body.destinationCity,
    destinationState: body.destinationState,
    weight: body.weight,
    length: body.length,
    width: body.width,
    height: body.height,
    senderName: ORIGIN.name,
    senderPhone: ORIGIN.phone,
    senderEmail: ORIGIN.email,
    recipientName: body.recipientName || "Customer",
    recipientPhone: body.recipientPhone || "08000000000",
    recipientEmail: body.recipientEmail || "customer@example.com",
  };

  // Race both providers — use Promise.allSettled so one failure doesn't block the other
  const [terminalResult, shipbubbleResult] = await Promise.allSettled([
    getTerminalAfricaRates(sharedParams),
    getShipBubbleRates(sharedParams),
  ]);

  const terminalRates =
    terminalResult.status === "fulfilled" ? terminalResult.value : [];
  const shipbubbleRates =
    shipbubbleResult.status === "fulfilled" ? shipbubbleResult.value : [];

  if (terminalResult.status === "rejected") {
    console.error("Terminal Africa failed:", terminalResult.reason);
  }
  if (shipbubbleResult.status === "rejected") {
    console.error("ShipBubble failed:", shipbubbleResult.reason);
  }

  // Merge & sort
  const allRates = [...terminalRates, ...shipbubbleRates].filter(
    (r) => r.amount > 0
  );

  // Sort by price ascending
  allRates.sort((a, b) => a.amount - b.amount);

  const categorized = categorizeRates(allRates);

  return reply.send({
    success: true,
    providers: {
      terminal_africa: terminalRates.length,
      shipbubble: shipbubbleRates.length,
    },
    ...categorized,
  });
};

/**
 * Pick cheapest, fastest, and recommended from a sorted rates array.
 */
function categorizeRates(rates: NormalizedRate[]): CategorizedRates {
  if (rates.length === 0) {
    return { cheapest: null, fastest: null, recommended: null, all: [] };
  }

  // Cheapest = lowest amount (already sorted by price)
  const cheapest = rates[0];

  // Fastest = lowest estimatedDays
  const sorted = [...rates].sort((a, b) => a.estimatedDays - b.estimatedDays);
  const fastest = sorted[0];

  // Recommended = best balance of price and speed
  // Score = normalized_price * 0.6 + normalized_days * 0.4
  const maxPrice = Math.max(...rates.map((r) => r.amount));
  const minPrice = Math.min(...rates.map((r) => r.amount));
  const maxDays = Math.max(...rates.map((r) => r.estimatedDays));
  const minDays = Math.min(...rates.map((r) => r.estimatedDays));

  const priceRange = maxPrice - minPrice || 1;
  const daysRange = maxDays - minDays || 1;

  const scored = rates.map((r) => ({
    rate: r,
    score:
      ((r.amount - minPrice) / priceRange) * 0.6 +
      ((r.estimatedDays - minDays) / daysRange) * 0.4,
  }));

  scored.sort((a, b) => a.score - b.score);
  const recommended = scored[0].rate;

  return { cheapest, fastest, recommended, all: rates };
}
