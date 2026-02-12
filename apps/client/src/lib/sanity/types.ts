// lib/sanity/types.ts
import type { PortableTextBlock } from "@portabletext/react";

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImage;
  publishedAt?: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  relatedProducts?: RelatedProduct[];
}

export interface RelatedProduct {
  _id: string;
  title: string;
  slug?: { current: string };
  image?: SanityImage;
  price?: number;
  description?: string;
}
