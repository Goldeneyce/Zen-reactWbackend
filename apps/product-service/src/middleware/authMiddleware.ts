import { createMiddleware } from "hono/factory";
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

export const shouldBeUser = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c, next) => {
  return verifySupabaseAuth(c, next);
});

export const shouldBeAdmin = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c, next) => {
  return verifySupabaseAuth(c, next, "admin");
});

export const shouldBeProductAdmin = createMiddleware<{
  Variables: {
    userId: string;
  };
}>(async (c, next) => {
  return verifySupabaseAuth(c, next, "productAdmin");
});

const getBearerToken = (authorization: string | undefined) => {
  if (!authorization) return null;
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
};

const verifySupabaseAuth = async (
  c: any,
  next: () => Promise<void>,
  requiredRole?: "admin" | "productAdmin"
) => {
  const token = getBearerToken(c.req.header("Authorization"));

  if (!token) {
    return c.json({ message: "You are not logged in!" }, 401);
  }

  try {
    const JWKS = getJWKS();
    const { payload } = await jwtVerify(token, JWKS);
    const claims = payload as CustomJwtSessionClaims;
    const userId = claims.sub || claims.userId;

    if (!userId) {
      return c.json({ message: "You are not logged in!" }, 401);
    }

    if (requiredRole) {
      const role =
        claims.app_metadata?.role ||
        claims.user_metadata?.role ||
        claims.role;

      if (requiredRole === "productAdmin") {
        if (role !== "productAdmin" && role !== "admin") {
          return c.json({
            message: "You are not authorized to access this resource!",
          }, 403);
        }
      } else if (role !== requiredRole) {
        return c.json({
          message: "You are not authorized to access this resource!",
        }, 403);
      }
    }

    c.set("userId", userId);
    await next();
  } catch (error) {
    return c.json({ message: "You are not logged in!" }, 401);
  }
};