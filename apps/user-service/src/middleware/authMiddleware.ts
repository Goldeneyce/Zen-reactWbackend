import type { FastifyRequest, FastifyReply } from "fastify";
import type { CustomJwtSessionClaims } from "@repo/types";
import { jwtVerify, createRemoteJWKSet } from "jose";

const getJWKS = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not configured.");
  }
  return createRemoteJWKSet(
    new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)
  );
};

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    userEmail?: string;
    userMeta?: { full_name?: string; name?: string; avatar_url?: string };
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
    return reply.status(401).send({ message: "You are not logged in!" });
  }

  try {
    const JWKS = getJWKS();
    const { payload } = await jwtVerify(token, JWKS);
    const claims = payload as CustomJwtSessionClaims;
    const userId = claims.sub || claims.userId;

    if (!userId) {
      return reply.status(401).send({ message: "You are not logged in!" });
    }

    if (requiredRole) {
      const role =
        claims.app_metadata?.role ||
        claims.user_metadata?.role ||
        claims.role;

      if (role !== requiredRole) {
        return reply.status(403).send({
          message: "You are not authorized to access this resource!",
        });
      }
    }

    request.userId = userId;
    request.userEmail = claims.email;
    request.userMeta = claims.user_metadata;
  } catch (error) {
    return reply.status(401).send({ message: "Invalid or expired token!" });
  }
};
