import { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from '@clerk/fastify'
import type { CustomJwtSessionClaims } from "@repo/types";

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string | null;
  }
}

export const shouldBeUser = async (request:FastifyRequest, reply:FastifyReply) => {
  const { userId } = getAuth(request);
  if (!userId) {
    return reply.status(401).send({
      message: "You are not logged in!",
    });
  }

  request.userId = userId;
};

export const shouldBeAdmin = async (request:FastifyRequest, reply:FastifyReply) => {
  const { userId, sessionClaims } = getAuth(request);
  if (!userId) {
    return reply.status(401).send({
      message: "You are not logged in!",
    });
  }

  const claims = sessionClaims as CustomJwtSessionClaims | undefined;

  if (claims?.metadata?.role !== 'admin') {
    return reply.status(403).send({
      message: "You are not authorized to access this resource!",
    });
  }

  request.userId = userId;
};