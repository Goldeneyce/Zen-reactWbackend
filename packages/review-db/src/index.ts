import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* ─── Interfaces ─── */

export interface IReview extends Document {
  _id: Types.ObjectId;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  // images?: string[];
  verified: boolean;
  helpful: number;
  reported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRatingSnapshot extends Document {
  _id: Types.ObjectId;
  productId: string;
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  updatedAt: Date;
}

/* ─── Review Schema ─── */

const reviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 120 },
    comment: { type: String, required: true, maxlength: 2000 },
    // images: { type: [String], default: [] },
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    reported: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// A user can only leave one review per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

/* ─── Rating Snapshot Schema ─── */

const ratingSnapshotSchema = new Schema<IRatingSnapshot>(
  {
    productId: { type: String, required: true, unique: true },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

/* ─── Models ─── */

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export const RatingSnapshot: Model<IRatingSnapshot> =
  mongoose.models.RatingSnapshot ||
  mongoose.model<IRatingSnapshot>("RatingSnapshot", ratingSnapshotSchema);

/* ─── Connection helper ─── */

let isConnected = false;

export async function connectReviewDb(uri?: string): Promise<typeof mongoose> {
  if (isConnected) return mongoose;

  const mongoUri = uri || process.env.REVIEW_DB_URL;
  if (!mongoUri) {
    throw new Error(
      "REVIEW_DB_URL env variable is required to connect to MongoDB"
    );
  }

  await mongoose.connect(mongoUri);
  isConnected = true;
  console.log("Connected to Review MongoDB");
  return mongoose;
}

export { mongoose };
