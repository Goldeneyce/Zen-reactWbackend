// app/api/draft/route.ts  –  Enable / disable Next.js draft mode
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * GET /api/draft?secret=<SANITY_PREVIEW_SECRET>&slug=/blog/my-post
 *
 * Enables Next.js draft mode and redirects to the given slug.
 * Call without params (or ?disable=1) to exit draft mode.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // ── Disable draft mode ──
  if (searchParams.has("disable")) {
    const dm = await draftMode();
    dm.disable();
    redirect(searchParams.get("redirect") ?? "/");
  }

  // ── Enable draft mode ──
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") ?? "/";

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  const dm = await draftMode();
  dm.enable();
  redirect(slug);
}
