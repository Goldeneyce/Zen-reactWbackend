// app/blog/[slug]/page.tsx  –  Single blog post (Server Component)
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { getClient } from "@/lib/sanity/client";
import { postBySlugQuery, postSlugsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { estimateReadingTime } from "@/lib/sanity/readingTime";
import RelatedProducts from "@/components/blog/RelatedProducts";
import type { Post } from "@/lib/sanity/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ImageValue = { alt?: string } & Record<string, any>;

/* ------------------------------------------------------------------
   Static params – pre-render every published post at build time
   ------------------------------------------------------------------ */
export async function generateStaticParams() {
  const slugs: string[] = await getClient().fetch(postSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------
   Dynamic metadata
   ------------------------------------------------------------------ */
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post: Post | null = await getClient().fetch(postBySlugQuery, { slug });
  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} | Zenon Electrics Blog`,
    description: post.excerpt ?? `Read "${post.title}" on the Zenon Electrics blog.`,
    openGraph: post.mainImage
      ? { images: [urlFor(post.mainImage).width(1200).height(630).url()] }
      : undefined,
  };
}

/* ------------------------------------------------------------------
   Portable Text custom components
   ------------------------------------------------------------------ */
const portableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => (
      <figure className="my-8">
        <Image
          src={urlFor(value).width(900).url()}
          alt={value.alt ?? "Blog image"}
          width={900}
          height={500}
          className="rounded-xl w-full"
        />
      </figure>
    ),
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-dark dark:text-dark-light">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3 text-dark dark:text-dark-light">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed text-dark/80 dark:text-dark-light/80">
        {children}
      </p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-secondary pl-4 italic my-6 text-gray">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({
      value,
      children,
    }: {
      value?: { href?: string };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-secondary underline hover:text-secondary/80 transition-colors"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-dark/80 dark:text-dark-light/80">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-dark/80 dark:text-dark-light/80">
        {children}
      </ol>
    ),
  },
};

/* ------------------------------------------------------------------
   Page component
   ------------------------------------------------------------------ */
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post: Post | null = await getClient().fetch(postBySlugQuery, { slug });

  if (!post) notFound();

  const readTime = estimateReadingTime(post.body);

  return (
    <article className="py-16 bg-light dark:bg-light-dark min-h-screen">
      <div className="container max-w-3xl mx-auto">
        {/* Back link */}
        <a
          href="/blog"
          className="inline-flex items-center gap-1 text-secondary font-medium mb-8 hover:underline"
        >
          ← Back to Blog
        </a>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-dark dark:text-dark-light mb-4">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray mb-8">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <span className="text-secondary font-medium">{readTime} min read</span>
        </div>

        {/* Hero image */}
        {post.mainImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10">
            <Image
              src={urlFor(post.mainImage).width(1200).height(630).url()}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Body */}
        {post.body && (
          <div className="prose prose-lg max-w-none">
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        )}

        {/* Related products */}
        {post.relatedProducts && post.relatedProducts.length > 0 && (
          <RelatedProducts products={post.relatedProducts} />
        )}
      </div>
    </article>
  );
}
