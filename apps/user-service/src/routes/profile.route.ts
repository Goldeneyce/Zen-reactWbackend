import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db, userProfiles, userPreferences } from "@repo/user-db";
import { eq } from "drizzle-orm";
import { shouldBeUser } from "../middleware/authMiddleware.js";

export default async function profileRoute(fastify: FastifyInstance) {
  fastify.addHook("onRequest", shouldBeUser);

  // GET /profile — get the current user's profile
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const authId = request.userId;

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.authId, authId))
      .limit(1);

    if (!profile) {
      return reply.status(404).send({ message: "Profile not found" });
    }

    return reply.send(profile);
  });

  // POST /profile — create profile (upsert)
  fastify.post<{
    Body: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      avatarUrl?: string;
    };
  }>("/", async (request, reply) => {
    const authId = request.userId;
    const { firstName, lastName, email, phone, avatarUrl } = request.body;

    const [existing] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.authId, authId))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(userProfiles)
        .set({
          firstName,
          lastName,
          email,
          phone: phone ?? null,
          avatarUrl: avatarUrl ?? null,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.authId, authId))
        .returning();

      return reply.send(updated);
    }

    const [created] = await db
      .insert(userProfiles)
      .values({
        authId,
        firstName,
        lastName,
        email,
        phone: phone ?? null,
        avatarUrl: avatarUrl ?? null,
      })
      .returning();

    // Also create default preferences
    await db.insert(userPreferences).values({
      userId: created!.id,
      receiveNewsletter: false,
    });

    return reply.status(201).send(created);
  });

  // PUT /profile — update profile
  fastify.put<{
    Body: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      avatarUrl?: string;
    };
  }>("/", async (request, reply) => {
    const authId = request.userId;
    const { firstName, lastName, email, phone, avatarUrl } = request.body;

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.authId, authId))
      .limit(1);

    if (!profile) {
      return reply.status(404).send({ message: "Profile not found" });
    }

    const [updated] = await db
      .update(userProfiles)
      .set({
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.authId, authId))
      .returning();

    return reply.send(updated);
  });

  // DELETE /profile — delete profile and cascaded data
  fastify.delete("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const authId = request.userId;

    const [deleted] = await db
      .delete(userProfiles)
      .where(eq(userProfiles.authId, authId))
      .returning();

    if (!deleted) {
      return reply.status(404).send({ message: "Profile not found" });
    }

    return reply.send({ message: "Profile deleted successfully" });
  });
}
