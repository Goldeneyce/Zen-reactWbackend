export interface CustomJwtSessionClaims {
  sub?: string;
  userId?: string;
  role?: string;
  app_metadata?: {
    role?: 'user' | 'admin';
  };
  user_metadata?: {
    role?: 'user' | 'admin';
  };
}