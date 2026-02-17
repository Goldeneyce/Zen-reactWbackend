/**
 * POST /api/shipping/quote
 *
 * Server-side logistics router — proxies the request to the
 * logistics-service which races Terminal Africa + ShipBubble.
 * Keeps all API keys on the backend; the frontend never sees them.
 */
import { NextRequest, NextResponse } from "next/server";

const LOGISTICS_SERVICE_URL =
  process.env.LOGISTICS_SERVICE_URL || "http://localhost:8011";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      destinationAddress,
      destinationCity,
      destinationState,
      recipientName,
      recipientPhone,
      recipientEmail,
      weight,
      length,
      width,
      height,
    } = body;

    if (!destinationState || !destinationCity || !destinationAddress || !weight) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: destinationAddress, destinationCity, destinationState, weight",
        },
        { status: 400 }
      );
    }

    // Forward to the logistics-service
    const response = await fetch(`${LOGISTICS_SERVICE_URL}/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationAddress,
        destinationCity,
        destinationState,
        recipientName: recipientName || "Customer",
        recipientPhone: recipientPhone || "08000000000",
        recipientEmail: recipientEmail || "customer@example.com",
        weight,
        length,
        width,
        height,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Logistics service error:", response.status, text);
      return NextResponse.json(
        { error: "Failed to fetch shipping rates", detail: text },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Shipping quote API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
