import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@repo/user-db";
import { shouldBeUser } from "../middleware/authMiddleware.js";

export default async function addressRoute(fastify: FastifyInstance) {
  fastify.addHook("onRequest", shouldBeUser);

  // Helper: get or auto-create internal user ID from auth ID
  const getOrCreateUserId = async (request: FastifyRequest) => {
    const authId = request.userId;

    const existing = await prisma.userProfile.findUnique({
      where: { authId },
      select: { id: true },
    });
    if (existing) return existing.id;

    // Auto-create a profile from JWT claims
    const email = request.userEmail ?? `${authId}@unknown.com`;
    const fullName = request.userMeta?.full_name ?? request.userMeta?.name ?? "";
    const [firstName, ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");

    const created = await prisma.userProfile.create({
      data: {
        authId,
        firstName: firstName || email.split("@")[0] || "User",
        lastName: lastName || "",
        email,
        avatarUrl: request.userMeta?.avatar_url ?? null,
        preferences: { create: { receiveNewsletter: false } },
      },
      select: { id: true },
    });
    return created.id;
  };

  // GET /addresses — list all shipping addresses
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = await getOrCreateUserId(request);

    const addresses = await prisma.shippingAddress.findMany({
      where: { userId },
    });

    return reply.send(addresses);
  });

  // GET /addresses/:id — get a specific address
  fastify.get<{
    Params: { id: string };
  }>("/:id", async (request, reply) => {
    const userId = await getOrCreateUserId(request);

    const address = await prisma.shippingAddress.findFirst({
      where: { id: request.params.id, userId },
    });

    if (!address) {
      return reply.status(404).send({ message: "Address not found" });
    }

    return reply.send(address);
  });

  // POST /addresses — create a new shipping address
  fastify.post<{
    Body: {
      label?: string;
      fullName: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone?: string;
      isDefault?: boolean;
    };
  }>("/", async (request, reply) => {
    const userId = await getOrCreateUserId(request);

    const body = request.body;

    // If this address is default, unset other defaults
    if (body.isDefault) {
      await prisma.shippingAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const created = await prisma.shippingAddress.create({
      data: {
        userId,
        label: body.label ?? "Home",
        fullName: body.fullName,
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2 ?? null,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
        phone: body.phone ?? null,
        isDefault: body.isDefault ?? false,
      },
    });

    return reply.status(201).send(created);
  });

  // PUT /addresses/:id — update an address
  fastify.put<{
    Params: { id: string };
    Body: {
      label?: string;
      fullName?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
      phone?: string;
      isDefault?: boolean;
    };
  }>("/:id", async (request, reply) => {
    const userId = await getOrCreateUserId(request);

    const { id } = request.params;
    const body = request.body;

    // Verify ownership
    const existing = await prisma.shippingAddress.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return reply.status(404).send({ message: "Address not found" });
    }

    // If setting as default, unset other defaults
    if (body.isDefault) {
      await prisma.shippingAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const data: Record<string, unknown> = {};
    if (body.label !== undefined) data.label = body.label;
    if (body.fullName !== undefined) data.fullName = body.fullName;
    if (body.addressLine1 !== undefined) data.addressLine1 = body.addressLine1;
    if (body.addressLine2 !== undefined) data.addressLine2 = body.addressLine2;
    if (body.city !== undefined) data.city = body.city;
    if (body.state !== undefined) data.state = body.state;
    if (body.postalCode !== undefined) data.postalCode = body.postalCode;
    if (body.country !== undefined) data.country = body.country;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.isDefault !== undefined) data.isDefault = body.isDefault;

    const updated = await prisma.shippingAddress.update({
      where: { id },
      data,
    });

    return reply.send(updated);
  });

  // DELETE /addresses/:id — delete an address
  fastify.delete<{
    Params: { id: string };
  }>("/:id", async (request, reply) => {
    const userId = await getOrCreateUserId(request);

    // Verify ownership first
    const existing = await prisma.shippingAddress.findFirst({
      where: { id: request.params.id, userId },
    });

    if (!existing) {
      return reply.status(404).send({ message: "Address not found" });
    }

    await prisma.shippingAddress.delete({
      where: { id: request.params.id },
    });

    return reply.send({ message: "Address deleted successfully" });
  });
}
