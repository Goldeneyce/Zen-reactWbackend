export { prisma } from './client.js'
export * from '../generated/prisma/client.js'
export { Prisma } from '../generated/prisma/client.js'

/**
 * Parse JSON-encoded array fields on a product object.
 * SQLite stores arrays as JSON strings; this converts them back to real arrays.
 */
export function parseProductArrays<T extends Record<string, any>>(product: T): T {
  const jsonFields = ['images', 'sizes', 'colors', 'features'] as const;
  const result = { ...product };
  for (const field of jsonFields) {
    if (typeof result[field] === 'string') {
      try {
        (result as any)[field] = JSON.parse(result[field]);
      } catch {
        (result as any)[field] = [];
      }
    }
  }
  return result;
}