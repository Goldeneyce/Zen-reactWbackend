// lib/sanity/queries.ts
import { groq } from "next-sanity";

/* ------------------------------------------------------------------ */
/*  Blog listing – fetch all published posts, newest first            */
/* ------------------------------------------------------------------ */
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    "excerpt": array::join(string::split(pt::text(body), "")[0..200], "") + "...",
    body
  }
`;

/* ------------------------------------------------------------------ */
/*  Single post by slug – includes related products                   */
/* ------------------------------------------------------------------ */
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    body,
    relatedProducts[]-> {
      _id,
      title,
      slug,
      "image": mainImage,
      price,
      description
    }
  }
`;

/* ------------------------------------------------------------------ */
/*  All post slugs – used for generateStaticParams                    */
/* ------------------------------------------------------------------ */
export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;
