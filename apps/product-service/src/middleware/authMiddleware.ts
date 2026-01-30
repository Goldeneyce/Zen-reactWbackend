import { Request, Response, NextFunction } from "express";
import { CustomJwtSessionClaims } from "@repo/types";
import { jwtVerify } from "jose";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const shouldBeUser = async (
    req:Request, 
    res:Response, 
    next:NextFunction
) => {
  return verifySupabaseAuth(req, res, next);
};

export const shouldBeAdmin = async (
    req:Request, 
    res:Response, 
    next:NextFunction
) => {
  return verifySupabaseAuth(req, res, next, "admin");
};

const getBearerToken = (req: Request) => {
  const header = req.headers.authorization;
  if (!header) return null;
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
};

const verifySupabaseAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
  requiredRole?: "admin"
) => {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({
      message: "You are not logged in!",
    });
  }

  try {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Auth secret not configured." });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const claims = payload as CustomJwtSessionClaims;
    const userId = claims.sub || claims.userId;

    if (!userId) {
      return res.status(401).json({ message: "You are not logged in!" });
    }

    if (requiredRole) {
      const role =
        claims.app_metadata?.role ||
        claims.user_metadata?.role ||
        claims.role;

      if (role !== requiredRole) {
        return res.status(403).json({
          message: "You are not authorized to access this resource!",
        });
      }
    }

    req.userId = userId;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "You are not logged in!",
    });
  }
};