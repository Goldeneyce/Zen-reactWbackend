import type { userProfiles, shippingAddresses, userPreferences } from "@repo/user-db";

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type ShippingAddress = typeof shippingAddresses.$inferSelect;
export type NewShippingAddress = typeof shippingAddresses.$inferInsert;

export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;
