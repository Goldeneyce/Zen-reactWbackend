import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@repo/user-db";
import { shouldBeUser } from "../middleware/authMiddleware.js";

export default async function preferencesRoute(fastify: FastifyInstance) {
  fastify.addHook("onRequest", shouldBeUser);

  // Helper: get internal user ID from auth ID
  const getUserId = async (authId: string) => {
    const profile = await prisma.userProfile.findUnique({
      where: { authId },
      select: { id: true },
    });
    return profile?.id;
  };

  // GET /preferences — get user preferences
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = await getUserId(request.userId);
    if (!userId) {
      return reply.status(404).send({ message: "Profile not found. Create a profile first." });
    }

    const prefs = await prisma.userPreference.findUnique({
      where: { userId },
    });

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

    const result = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        ...(receiveNewsletter !== undefined && { receiveNewsletter }),
      },
      create: {
        userId,
        receiveNewsletter: receiveNewsletter ?? false,
      },
    });

    return reply.send(result);
  });
}
