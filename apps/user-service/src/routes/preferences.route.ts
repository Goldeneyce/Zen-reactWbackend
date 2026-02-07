import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { db, userPreferences, userProfiles } from "@repo/user-db";
import { eq } from "drizzle-orm";
import { shouldBeUser } from "../middleware/authMiddleware.js";

export default async function preferencesRoute(fastify: FastifyInstance) {
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

  // GET /preferences — get user preferences
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = await getUserId(request.userId);
    if (!userId) {
      return reply.status(404).send({ message: "Profile not found. Create a profile first." });
    }

    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (!prefs) {
      // Return defaults if no preferences row exists
      return reply.send({ receiveNewsletter: false });
    }

    return reply.send(prefs);
  });

  // PUT /preferences — update user preferences
  fastify.put<{
    Body: {
      receiveNewsletter?: boolean;
    };
  }>("/", async (request, reply) => {
    const userId = await getUserId(request.userId);
    if (!userId) {
      return reply.status(404).send({ message: "Profile not found. Create a profile first." });
    }

    const { receiveNewsletter } = request.body;

    const [existing] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(userPreferences)
        .set({
          ...(receiveNewsletter !== undefined && { receiveNewsletter }),
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, userId))
        .returning();

      return reply.send(updated);
    }

    const [created] = await db
      .insert(userPreferences)
      .values({
        userId,
        receiveNewsletter: receiveNewsletter ?? false,
      })
      .returning();

    return reply.status(201).send(created);
  });
}
