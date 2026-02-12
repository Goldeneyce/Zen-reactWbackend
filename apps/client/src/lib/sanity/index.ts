// lib/sanity/index.ts
export { client, previewClient, getClient } from "./client";
export { urlFor } from "./image";
export { postsQuery, postBySlugQuery, postSlugsQuery } from "./queries";
export { estimateReadingTime } from "./readingTime";
export type { Post, RelatedProduct, SanityImage } from "./types";
