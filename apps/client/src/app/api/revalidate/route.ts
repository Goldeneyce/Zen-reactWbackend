// app/api/revalidate/route.ts  –  Webhook for on-demand revalidation
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate
 *
 * Called by a Sanity webhook whenever a post document is created,
 * updated, or deleted.
 *
 * Expected body (Sanity GROQ-powered webhook projection):
 * {
 *   "_type": "post",
 *   "slug": { "current": "my-post" }
 * }
 *
 * Set the webhook secret in your Sanity project dashboard and
 * match it with SANITY_REVALIDATE_SECRET in your .env.
 */
export async function POST(request: NextRequest) {
  // ── Validate webhook secret ──
  const secret = request.headers.get("x-sanity-webhook-secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Revalidate the blog listing page
    revalidatePath("/blog");

    // Revalidate the specific post page if a slug is provided
    if (body?.slug?.current) {
      revalidatePath(`/blog/${body.slug.current}`);
    }

    return NextResponse.json({
      revalidated: true,
      slug: body?.slug?.current ?? null,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}
