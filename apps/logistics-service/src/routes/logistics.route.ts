import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { shouldBeUser, shouldBeAdmin } from "../middleware/authMiddleware.ts";
import {
  createShipment,
  listShipments,
  getShipment,
  getShipmentsByOrder,
  updateShipment,
  addShipmentEvent,
  trackByNumber,
  listRates,
  createRate,
} from "../controllers/logistics.controller.ts";

export const logisticsRoutes = (app: FastifyInstance) => {
  // ─── Shipping rates (public + admin) ─────────────────
  app.get<{ Querystring: { region?: string; carrier?: string } }>(
    "/rates",
    async (request, reply) => listRates(request, reply)
  );

  app.post<{
    Body: {
      carrier: string;
      serviceLevel: string;
      region?: string;
      basePrice: number;
      pricePerKg?: number;
      estimatedDays?: number;
    };
  }>("/rates", { preHandler: shouldBeAdmin }, async (request, reply) =>
    createRate(request, reply)
  );

  // ─── Public tracking ─────────────────────────────────
  app.get<{ Params: { trackingNumber: string } }>(
    "/tracking/:trackingNumber",
    async (request, reply) => trackByNumber(request, reply)
  );

  // ─── Shipments (authenticated) ───────────────────────
  app.post<{ Body: Parameters<typeof createShipment>[0]["body"] }>(
    "/shipments",
    { preHandler: shouldBeUser },
    async (request, reply) => createShipment(request as any, reply)
  );

  app.get(
    "/shipments",
    { preHandler: shouldBeUser },
    async (request, reply) => listShipments(request, reply)
  );

  app.get<{ Params: { id: string } }>(
    "/shipments/:id",
    { preHandler: shouldBeUser },
    async (request, reply) => getShipment(request, reply)
  );

  app.get<{ Params: { orderId: string } }>(
    "/shipments/order/:orderId",
    { preHandler: shouldBeUser },
    async (request, reply) => getShipmentsByOrder(request, reply)
  );

  // ─── Admin shipment management ───────────────────────
  app.patch<{ Params: { id: string }; Body: Record<string, unknown> }>(
    "/shipments/:id",
    { preHandler: shouldBeAdmin },
    async (request, reply) => updateShipment(request as any, reply)
  );

  app.post<{ Params: { id: string }; Body: { status: string; location?: string; description?: string } }>(
    "/shipments/:id/events",
    { preHandler: shouldBeAdmin },
    async (request, reply) => addShipmentEvent(request, reply)
  );
};
