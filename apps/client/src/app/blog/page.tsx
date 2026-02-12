// app/blog/page.tsx  –  Blog listing (Server Component)
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getClient } from "@/lib/sanity/client";
import { postsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { estimateReadingTime } from "@/lib/sanity/readingTime";
import type { Post } from "@/lib/sanity/types";

export const metadata: Metadata = {
  title: "Blog | Zenon Electrics",
  description:
    "Tips, guides, and news about solar power, home automation, and security systems.",
};

export const revalidate = 60; // ISR – revalidate every 60 s

export default async function BlogPage() {
  const posts: Post[] = await getClient().fetch(postsQuery);

  return (
    <section className="py-16 md:py-24 bg-light dark:bg-light-dark min-h-screen">
      <div className="container">
        {/* Page header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4">
            Our Blog
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-primary-dark mb-4">
            Latest Articles &amp; Insights
          </h1>
          <p className="text-gray max-w-2xl mx-auto">
            Stay informed with our latest articles on solar energy, smart home
            technology, security systems, and sustainable living.
          </p>
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <p className="text-center text-gray">
            No posts published yet — check back soon!
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Card sub-component                                                */
/* ------------------------------------------------------------------ */
function BlogCard({ post }: { post: Post }) {
  const readTime = estimateReadingTime(post.body);
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-white-dark overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      {post.mainImage ? (
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={urlFor(post.mainImage).width(600).height(400).url()}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-52 w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray">
          No image
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-gray mb-3">
          {date && <time dateTime={post.publishedAt!}>{date}</time>}
          <span className="flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {readTime} min read
          </span>
        </div>

        <h2 className="text-lg font-bold text-dark dark:text-dark-light group-hover:text-secondary transition-colors line-clamp-2 mb-2">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-sm text-gray line-clamp-3 mb-4">{post.excerpt}</p>
        )}

        <span className="mt-auto inline-flex items-center text-sm font-semibold text-secondary group-hover:gap-2 transition-all">
          Read more
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Tiny clock icon                                                   */
/* ------------------------------------------------------------------ */
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  );
}
