import { Hono } from "hono";

const sessionRoute = new Hono();
import { clerkMiddleware } from "@hono/clerk-auth";
import { shouldBeUser } from "../middleware/authMiddleware.js";


export default sessionRoute;