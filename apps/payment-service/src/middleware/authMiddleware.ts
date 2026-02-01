import type { CustomJwtSessionClaims } from "@repo/types";
import { jwtVerify } from "jose";

import type { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    rawBody?: string;
  }
}

export const shouldBeUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return verifySupabaseAuth(request, reply);
};

export const shouldBeAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return verifySupabaseAuth(request, reply, "admin");
};

const getBearerToken = (authorization: string | undefined) => {
  if (!authorization) return null;
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
};

const verifySupabaseAuth = async (
	request: FastifyRequest,
	reply: FastifyReply,
	requiredRole?: "admin"
) => {
	const token = getBearerToken(request.headers.authorization);

  if (!token) {
    return reply.code(401).send({ message: "You are not logged in!" });
  }

  try {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      return reply.code(500).send({ message: "Auth secret not configured." });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const claims = payload as CustomJwtSessionClaims;
    const userId = claims.sub || claims.userId;

    if (!userId) {
      return reply.code(401).send({ message: "You are not logged in!" });
    }

    if (requiredRole) {
      const role =
        claims.app_metadata?.role ||
        claims.user_metadata?.role ||
        claims.role;

      if (role !== requiredRole) {
        return reply.code(403).send({ message: "You are not authorized!" });
      }
    }

    request.userId = userId;
    return;
  } catch (error) {
    return reply.code(401).send({ message: "You are not logged in!" });
  }
};