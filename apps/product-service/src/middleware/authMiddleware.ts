import { createMiddleware } from "hono/factory";
import type { CustomJwtSessionClaims } from "@repo/types";
import { jwtVerify } from "jose";

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

const getBearerToken = (authorization: string | undefined) => {
  if (!authorization) return null;
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
};

const verifySupabaseAuth = async (
  c: any,
  next: () => Promise<void>,
  requiredRole?: "admin"
) => {
  const token = getBearerToken(c.req.header("Authorization"));

  if (!token) {
    return c.json({ message: "You are not logged in!" }, 401);
  }

  try {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      return c.json({ message: "Auth secret not configured." }, 500);
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
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

      if (role !== requiredRole) {
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