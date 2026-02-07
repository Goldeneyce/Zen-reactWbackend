import { FastifyRequest, FastifyReply } from "fastify";
import { prisma, Prisma } from "@repo/logistics-db";

// ─── Types ────────────────────────────────────────────

interface CreateShipmentBody {
  orderId: string;
  carrier?: string;
  serviceLevel?: string;
  destinationAddress: Prisma.InputJsonValue;
  originAddress?: Prisma.InputJsonValue;
  items: {
    productId: string;
    sku?: string;
    productName?: string;
    quantity?: number;
  }[];
  weight?: number;
  notes?: string;
}

interface UpdateShipmentBody {
  status?: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  serviceLevel?: string;
  estimatedDelivery?: string;
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
}

interface AddEventBody {
  status: string;
  location?: string;
  description?: string;
}

// ─── Controllers ──────────────────────────────────────

/** POST / – create a new shipment */
export const createShipment = async (
  request: FastifyRequest<{ Body: CreateShipmentBody }>,
  reply: FastifyReply
) => {
  const userId = request.userId!;
  const {
    orderId,
    carrier,
    serviceLevel,
    destinationAddress,
    originAddress,
    items,
    weight,
    notes,
  } = request.body;

  const shipment = await prisma.shipment.create({
    data: {
      orderId,
      userId,
      carrier,
      serviceLevel,
      destinationAddress,
      originAddress: originAddress ?? undefined,
      weight,
      notes,
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          sku: i.sku,
          productName: i.productName,
          quantity: i.quantity ?? 1,
        })),
      },
      events: {
        create: {
          status: "PENDING",
          description: "Shipment created",
        },
      },
    },
    include: { items: true, events: true },
  });

  return reply.status(201).send(shipment);
};

/** GET / – list shipments for current user */
export const listShipments = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = request.userId!;

  const shipments = await prisma.shipment.findMany({
    where: { userId },
    include: { items: true, events: { orderBy: { occurredAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return reply.send(shipments);
};

/** GET /:id – get single shipment */
export const getShipment = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: { items: true, events: { orderBy: { occurredAt: "asc" } } },
  });

  if (!shipment) {
    return reply.status(404).send({ message: "Shipment not found" });
  }

  return reply.send(shipment);
};

/** GET /order/:orderId – get shipments for an order */
export const getShipmentsByOrder = async (
  request: FastifyRequest<{ Params: { orderId: string } }>,
  reply: FastifyReply
) => {
  const { orderId } = request.params;

  const shipments = await prisma.shipment.findMany({
    where: { orderId },
    include: { items: true, events: { orderBy: { occurredAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return reply.send(shipments);
};

/** PATCH /:id – update shipment (admin) */
export const updateShipment = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: UpdateShipmentBody;
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const data = request.body;

  const shipment = await prisma.shipment.update({
    where: { id },
    data: {
      ...(data.status && { status: data.status as any }),
      ...(data.carrier && { carrier: data.carrier }),
      ...(data.trackingNumber && { trackingNumber: data.trackingNumber }),
      ...(data.trackingUrl && { trackingUrl: data.trackingUrl }),
      ...(data.serviceLevel && { serviceLevel: data.serviceLevel }),
      ...(data.estimatedDelivery && {
        estimatedDelivery: new Date(data.estimatedDelivery),
      }),
      ...(data.shippedAt && { shippedAt: new Date(data.shippedAt) }),
      ...(data.deliveredAt && { deliveredAt: new Date(data.deliveredAt) }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
    include: { items: true, events: { orderBy: { occurredAt: "desc" } } },
  });

  return reply.send(shipment);
};

/** POST /:id/events – add a tracking event (admin) */
export const addShipmentEvent = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: AddEventBody;
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const { status, location, description } = request.body;

  // Also update the shipment status to match
  const [event] = await prisma.$transaction([
    prisma.shipmentEvent.create({
      data: {
        shipmentId: id,
        status: status as any,
        location,
        description,
      },
    }),
    prisma.shipment.update({
      where: { id },
      data: { status: status as any },
    }),
  ]);

  return reply.status(201).send(event);
};

/** GET /tracking/:trackingNumber – public tracking lookup */
export const trackByNumber = async (
  request: FastifyRequest<{ Params: { trackingNumber: string } }>,
  reply: FastifyReply
) => {
  const { trackingNumber } = request.params;

  const shipment = await prisma.shipment.findFirst({
    where: { trackingNumber },
    include: { items: true, events: { orderBy: { occurredAt: "asc" } } },
  });

  if (!shipment) {
    return reply.status(404).send({ message: "Shipment not found" });
  }

  return reply.send(shipment);
};

// ─── Shipping Rates ────────────────────────────────────

/** GET /rates – list available shipping rates */
export const listRates = async (
  request: FastifyRequest<{
    Querystring: { region?: string; carrier?: string };
  }>,
  reply: FastifyReply
) => {
  const { region, carrier } = request.query as {
    region?: string;
    carrier?: string;
  };

  const rates = await prisma.shippingRate.findMany({
    where: {
      active: true,
      ...(region && { region }),
      ...(carrier && { carrier }),
    },
    orderBy: { basePrice: "asc" },
  });

  return reply.send(rates);
};

/** POST /rates – create a shipping rate (admin) */
export const createRate = async (
  request: FastifyRequest<{
    Body: {
      carrier: string;
      serviceLevel: string;
      region?: string;
      basePrice: number;
      pricePerKg?: number;
      estimatedDays?: number;
    };
  }>,
  reply: FastifyReply
) => {
  const rate = await prisma.shippingRate.create({ data: request.body });
  return reply.status(201).send(rate);
};
