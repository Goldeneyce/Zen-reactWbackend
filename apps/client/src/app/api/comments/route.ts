import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabaseServer";
import { containsProfanity } from "@/lib/profanityFilter";

/** Comma-separated list of admin emails set in .env */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

/* ------------------------------------------------------------------
   GET /api/comments?slug=<post-slug>
   Returns all comments for a given blog post, newest first.
   ------------------------------------------------------------------ */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_comments")
    .select("id, post_slug, user_id, user_name, user_avatar, body, created_at")
    .eq("post_slug", slug)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* ------------------------------------------------------------------
   POST /api/comments   { slug, body }
   Creates a comment for the authenticated user.
   ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let payload: { slug?: string; body?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, body } = payload;

  if (!slug || !body || body.trim().length === 0) {
    return NextResponse.json(
      { error: "slug and body are required" },
      { status: 400 }
    );
  }

  if (body.length > 2000) {
    return NextResponse.json(
      { error: "Comment must be 2000 characters or less" },
      { status: 400 }
    );
  }

  if (containsProfanity(body)) {
    return NextResponse.json(
      { error: "Your comment contains inappropriate language. Please revise and try again." },
      { status: 422 }
    );
  }

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Anonymous";

  const userAvatar = user.user_metadata?.avatar_url || null;

  const { data, error } = await supabase
    .from("blog_comments")
    .insert({
      post_slug: slug,
      user_id: user.id,
      user_name: userName,
      user_avatar: userAvatar,
      body: body.trim(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

/* ------------------------------------------------------------------
   DELETE /api/comments?id=<comment-id>
   Lets a user delete their own comment, or lets an admin delete any.
   ------------------------------------------------------------------ */
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing comment id" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userIsAdmin = isAdmin(user.email);

  // Admins use the service-role client to bypass RLS;
  // regular users use the normal client (RLS enforced).
  if (userIsAdmin) {
    const serviceClient = createSupabaseServiceClient();
    const { error } = await serviceClient
      .from("blog_comments")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
