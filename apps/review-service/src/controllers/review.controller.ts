import { Review, RatingSnapshot, type IReview } from "@repo/review-db";

/* ─── Helpers ─── */

type ControllerError = { error: string; status: number };
type ControllerResult<T> = T | ControllerError;

/** Recalculate and persist the rating snapshot for a product */
async function refreshRatingSnapshot(productId: string) {
  const pipeline = await Review.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        r1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        r2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
        r3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
        r4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
        r5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
      },
    },
  ]);

  if (pipeline.length === 0) {
    await RatingSnapshot.findOneAndDelete({ productId });
    return null;
  }

  const agg = pipeline[0]!;
  return RatingSnapshot.findOneAndUpdate(
    { productId },
    {
      averageRating: Math.round(agg.averageRating * 10) / 10,
      totalReviews: agg.totalReviews,
      distribution: {
        1: agg.r1,
        2: agg.r2,
        3: agg.r3,
        4: agg.r4,
        5: agg.r5,
      },
    },
    { upsert: true, new: true }
  );
}

/* ─── Controllers ─── */

/** Create a new review */
export async function createReview(data: {
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  // images?: string[];
}): Promise<ControllerResult<IReview>> {
  // Validate rating
  if (data.rating < 1 || data.rating > 5) {
    return { error: "Rating must be between 1 and 5", status: 400 };
  }

  // Check duplicate
  const existing = await Review.findOne({
    productId: data.productId,
    userId: data.userId,
  });
  if (existing) {
    return { error: "You have already reviewed this product", status: 409 };
  }

  const review = await Review.create(data);
  await refreshRatingSnapshot(data.productId);
  return review;
}

/** Get paginated reviews for a product */
export async function getProductReviews(
  productId: string,
  page: number,
  limit: number,
  sort: string
) {
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    recent: { createdAt: -1 },
    oldest: { createdAt: 1 },
    highest: { rating: -1, createdAt: -1 },
    lowest: { rating: 1, createdAt: -1 },
    helpful: { helpful: -1, createdAt: -1 },
  };

  const sortOption = sortMap[sort] || sortMap.recent!;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ productId })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ productId }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/** Get rating snapshot for a product */
export async function getProductRating(productId: string) {
  const snapshot = await RatingSnapshot.findOne({ productId }).lean();
  if (!snapshot) {
    return {
      productId,
      averageRating: 0,
      totalReviews: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }
  return snapshot;
}

/** Get reviews by user */
export async function getUserReviews(
  userId: string,
  page: number,
  limit: number
) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ userId }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/** Get recent reviews across all products */
export async function getRecentReviews(limit: number) {
  return Review.find().sort({ createdAt: -1 }).limit(limit).lean();
}

/** Update an existing review (only the author) */
export async function updateReview(
  reviewId: string,
  userId: string,
  data: { rating?: number; title?: string; comment?: string; /* images?: string[] */ }
): Promise<ControllerResult<IReview>> {
  if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
    return { error: "Rating must be between 1 and 5", status: 400 };
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    return { error: "Review not found", status: 404 };
  }
  if (review.userId !== userId) {
    return { error: "You can only edit your own reviews", status: 403 };
  }

  if (data.rating !== undefined) review.rating = data.rating;
  if (data.title !== undefined) review.title = data.title;
  if (data.comment !== undefined) review.comment = data.comment;
  // if (data.images !== undefined) review.images = data.images;

  await review.save();
  await refreshRatingSnapshot(review.productId);
  return review;
}

/** Delete a review (author or admin when no userId is passed) */
export async function deleteReview(
  reviewId: string,
  userId?: string
): Promise<ControllerResult<{ deleted: true }>> {
  const review = await Review.findById(reviewId);
  if (!review) {
    return { error: "Review not found", status: 404 };
  }
  if (userId && review.userId !== userId) {
    return { error: "You can only delete your own reviews", status: 403 };
  }

  const { productId } = review;
  await review.deleteOne();
  await refreshRatingSnapshot(productId);
  return { deleted: true };
}

/** Increment the helpful counter */
export async function markHelpful(
  reviewId: string
): Promise<ControllerResult<IReview>> {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { $inc: { helpful: 1 } },
    { new: true }
  );
  if (!review) {
    return { error: "Review not found", status: 404 };
  }
  return review;
}

/** Flag a review as reported */
export async function reportReview(
  reviewId: string
): Promise<ControllerResult<IReview>> {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { reported: true },
    { new: true }
  );
  if (!review) {
    return { error: "Review not found", status: 404 };
  }
  return review;
}
