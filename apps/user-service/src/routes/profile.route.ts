import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@repo/user-db";
import { shouldBeUser } from "../middleware/authMiddleware.js";

export default async function profileRoute(fastify: FastifyInstance) {
  fastify.addHook("onRequest", shouldBeUser);

  // GET /profile — get the current user's profile
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const authId = request.userId;

    const profile = await prisma.userProfile.findUnique({
      where: { authId },
    });

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

    const existing = await prisma.userProfile.findUnique({
      where: { authId },
    });

    if (existing) {
      const updated = await prisma.userProfile.update({
        where: { authId },
        data: {
          firstName,
          lastName,
          email,
          phone: phone ?? null,
          avatarUrl: avatarUrl ?? null,
        },
      });

      return reply.send(updated);
    }

    const created = await prisma.userProfile.create({
      data: {
        authId,
        firstName,
        lastName,
        email,
        phone: phone ?? null,
        avatarUrl: avatarUrl ?? null,
        preferences: {
          create: { receiveNewsletter: false },
        },
      },
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

    const profile = await prisma.userProfile.findUnique({
      where: { authId },
    });

    if (!profile) {
      return reply.status(404).send({ message: "Profile not found" });
    }

    const data: Record<string, unknown> = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;

    const updated = await prisma.userProfile.update({
      where: { authId },
      data,
    });

    return reply.send(updated);
  });

  // DELETE /profile — delete profile and cascaded data
  fastify.delete("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const authId = request.userId;

    try {
      await prisma.userProfile.delete({
        where: { authId },
      });
    } catch {
      return reply.status(404).send({ message: "Profile not found" });
    }

    return reply.send({ message: "Profile deleted successfully" });
  });
}
