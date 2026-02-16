import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { shouldBeUser, shouldBeAdmin } from "../middleware/authMiddleware.ts";
import {
  createReview,
  getProductReviews,
  getProductRating,
  getUserReviews,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  getRecentReviews,
} from "../controllers/review.controller.ts";

export function reviewRoutes(fastify: FastifyInstance) {
  /* ───────────── Public ───────────── */

  /** GET /reviews/product/:productId — paginated reviews for a product */
  fastify.get<{
    Params: { productId: string };
    Querystring: { page?: string; limit?: string; sort?: string };
  }>(
    "/reviews/product/:productId",
    async (request, reply) => {
      const { productId } = request.params;
      const page = Number(request.query.page) || 1;
      const limit = Math.min(Number(request.query.limit) || 10, 50);
      const sort = request.query.sort || "recent";
      const result = await getProductReviews(productId, page, limit, sort);
      return reply.send(result);
    }
  );

  /** GET /reviews/product/:productId/rating — rating snapshot */
  fastify.get<{ Params: { productId: string } }>(
    "/reviews/product/:productId/rating",
    async (request, reply) => {
      const snapshot = await getProductRating(request.params.productId);
      return reply.send(snapshot);
    }
  );

  /** GET /reviews/recent — latest reviews across all products */
  fastify.get<{ Querystring: { limit?: string } }>(
    "/reviews/recent",
    async (request, reply) => {
      const limit = Math.min(Number(request.query.limit) || 10, 50);
      const reviews = await getRecentReviews(limit);
      return reply.send(reviews);
    }
  );

  /* ───────────── Authenticated ───────────── */

  /** POST /reviews — create a review */
  fastify.post<{
    Body: {
      productId: string;
      rating: number;
      title: string;
      comment: string;
      // images?: string[];
    };
  }>(
    "/reviews",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const userId = request.userId!;
      const result = await createReview({ ...request.body, userId });
      if ("error" in result) {
        return reply.status(result.status).send({ message: result.error });
      }
      return reply.status(201).send(result);
    }
  );

  /** GET /reviews/user — current user's reviews */
  fastify.get<{ Querystring: { page?: string; limit?: string } }>(
    "/reviews/user",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const userId = request.userId!;
      const page = Number(request.query.page) || 1;
      const limit = Math.min(Number(request.query.limit) || 10, 50);
      const result = await getUserReviews(userId, page, limit);
      return reply.send(result);
    }
  );

  /** PUT /reviews/:reviewId — update own review */
  fastify.put<{
    Params: { reviewId: string };
    Body: { rating?: number; title?: string; comment?: string; /* images?: string[] */ };
  }>(
    "/reviews/:reviewId",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const userId = request.userId!;
      const result = await updateReview(request.params.reviewId, userId, request.body);
      if ("error" in result) {
        return reply.status(result.status).send({ message: result.error });
      }
      return reply.send(result);
    }
  );

  /** DELETE /reviews/:reviewId — delete own review (or admin) */
  fastify.delete<{ Params: { reviewId: string } }>(
    "/reviews/:reviewId",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const userId = request.userId!;
      const result = await deleteReview(request.params.reviewId, userId);
      if ("error" in result) {
        return reply.status(result.status).send({ message: result.error });
      }
      return reply.status(204).send();
    }
  );

  /** POST /reviews/:reviewId/helpful — mark a review as helpful */
  fastify.post<{ Params: { reviewId: string } }>(
    "/reviews/:reviewId/helpful",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const result = await markHelpful(request.params.reviewId);
      if ("error" in result) {
        return reply.status(result.status).send({ message: result.error });
      }
      return reply.send(result);
    }
  );

  /** POST /reviews/:reviewId/report — report a review */
  fastify.post<{ Params: { reviewId: string } }>(
    "/reviews/:reviewId/report",
    { preHandler: shouldBeUser },
    async (request, reply) => {
      const result = await reportReview(request.params.reviewId);
      if ("error" in result) {
        return reply.status(result.status).send({ message: result.error });
      }
      return reply.send({ message: "Review reported" });
    }
  );

  /* ───────────── Admin ───────────── */

  /** DELETE /reviews/admin/:reviewId — admin delete any review */
  fastify.delete<{ Params: { reviewId: string } }>(
    "/reviews/admin/:reviewId",
    { preHandler: shouldBeAdmin },
    async (request, reply) => {
      const result = await deleteReview(request.params.reviewId);
      if ("error" in result) {
        return reply.status(result.status).send({ message: result.error });
      }
      return reply.status(204).send();
    }
  );
}
