// lib/sanity/client.ts
import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN for published content
});

/**
 * Preview client — bypasses CDN and uses an auth token
 * so draft / unpublished documents are visible.
 */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

/**
 * Returns the appropriate client based on draft mode.
 */
export function getClient(preview = false) {
  return preview ? previewClient : client;
}
