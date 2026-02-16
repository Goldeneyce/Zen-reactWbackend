// lib/sanity/readingTime.ts

import type { PortableTextBlock } from "@portabletext/react";

/**
 * Extracts plain text from Portable Text blocks and calculates
 * the estimated reading time (average 200 words per minute).
 */
export function estimateReadingTime(body: PortableTextBlock[] | undefined): number {
  if (!body) return 0;

  const text = body
    .filter((block) => block._type === "block")
    .map((block) => {
      // Each block contains an array of children spans
      const children = (block.children as { text?: string }[]) ?? [];
      return children.map((child) => child.text ?? "").join("");
    })
    .join(" ");

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
