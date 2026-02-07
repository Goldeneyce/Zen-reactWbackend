export interface ReviewType {
  _id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  // images?: string[];
  verified: boolean;
  helpful: number;
  reported: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RatingSnapshotType {
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
  updatedAt: string;
}

export interface ReviewsPaginatedResponse {
  reviews: ReviewType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
