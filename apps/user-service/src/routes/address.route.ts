import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@repo/user-db";
import { shouldBeUser } from "../middleware/authMiddleware.js";

export default async function addressRoute(fastify: FastifyInstance) {
  fastify.addHook("onRequest", shouldBeUser);

  // Helper: get internal user ID from auth ID
  const getUserId = async (authId: string) => {
    const profile = await prisma.userProfile.findUnique({
      where: { authId },
      select: { id: true },
    });
    return profile?.id;
  };

  // GET /addresses — list all shipping addresses
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = await getUserId(request.userId);
    if (!userId) {
      return reply.status(404).send({ message: "Profile not found. Create a profile first." });
    }

    const addresses = await prisma.shippingAddress.findMany({
      where: { userId },
    });

    return reply.send(addresses);
  });

  // GET /addresses/:id — get a specific address
  fastify.get<{
    Params: { id: string };
  }>("/:id", async (request, reply) => {
    const userId = await getUserId(request.userId);
    if (!userId) {
      return reply.status(404).send({ message: "Profile not found" });
    }

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
    const userId = await getUserId(request.userId);
    if (!userId) {
      return reply.status(404).send({ message: "Profile not found. Create a profile first." });
    }

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
    const userId = await getUserId(request.userId);
    if (!userId) {
      return reply.status(404).send({ message: "Profile not found" });
    }

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
    const userId = await getUserId(request.userId);
    if (!userId) {
      return reply.status(404).send({ message: "Profile not found" });
    }

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
