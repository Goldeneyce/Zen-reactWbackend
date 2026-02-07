import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db, shippingAddresses, userProfiles } from "@repo/user-db";
import { eq, and } from "drizzle-orm";
import { shouldBeUser } from "../middleware/authMiddleware.js";

export default async function addressRoute(fastify: FastifyInstance) {
  fastify.addHook("onRequest", shouldBeUser);

  // Helper: get internal user ID from auth ID
  const getUserId = async (authId: string) => {
    const [profile] = await db
      .select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.authId, authId))
      .limit(1);
    return profile?.id;
  };

  // GET /addresses — list all shipping addresses
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = await getUserId(request.userId);
    if (!userId) {
      return reply.status(404).send({ message: "Profile not found. Create a profile first." });
    }

    const addresses = await db
      .select()
      .from(shippingAddresses)
      .where(eq(shippingAddresses.userId, userId));

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

    const [address] = await db
      .select()
      .from(shippingAddresses)
      .where(
        and(
          eq(shippingAddresses.id, request.params.id),
          eq(shippingAddresses.userId, userId)
        )
      )
      .limit(1);

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
      await db
        .update(shippingAddresses)
        .set({ isDefault: false })
        .where(eq(shippingAddresses.userId, userId));
    }

    const [created] = await db
      .insert(shippingAddresses)
      .values({
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
      })
      .returning();

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
    const [existing] = await db
      .select()
      .from(shippingAddresses)
      .where(
        and(eq(shippingAddresses.id, id), eq(shippingAddresses.userId, userId))
      )
      .limit(1);

    if (!existing) {
      return reply.status(404).send({ message: "Address not found" });
    }

    // If setting as default, unset other defaults
    if (body.isDefault) {
      await db
        .update(shippingAddresses)
        .set({ isDefault: false })
        .where(eq(shippingAddresses.userId, userId));
    }

    const [updated] = await db
      .update(shippingAddresses)
      .set({
        ...(body.label !== undefined && { label: body.label }),
        ...(body.fullName !== undefined && { fullName: body.fullName }),
        ...(body.addressLine1 !== undefined && { addressLine1: body.addressLine1 }),
        ...(body.addressLine2 !== undefined && { addressLine2: body.addressLine2 }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.state !== undefined && { state: body.state }),
        ...(body.postalCode !== undefined && { postalCode: body.postalCode }),
        ...(body.country !== undefined && { country: body.country }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.isDefault !== undefined && { isDefault: body.isDefault }),
        updatedAt: new Date(),
      })
      .where(eq(shippingAddresses.id, id))
      .returning();

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

    const [deleted] = await db
      .delete(shippingAddresses)
      .where(
        and(
          eq(shippingAddresses.id, request.params.id),
          eq(shippingAddresses.userId, userId)
        )
      )
      .returning();

    if (!deleted) {
      return reply.status(404).send({ message: "Address not found" });
    }

    return reply.send({ message: "Address deleted successfully" });
  });
}
