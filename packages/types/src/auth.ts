export interface CustomJwtSessionClaims {
  userId?: string;
  metadata?: {
    role?: 'user' | 'admin';
  };
}