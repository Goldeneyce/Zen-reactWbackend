"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Comment {
  id: string;
  post_slug: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  body: string;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function BlogComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  /* ---------- Fetch auth state ---------- */
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const checkAdmin = (email?: string | null) =>
      !!email && adminEmails.includes(email.toLowerCase());

    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
      setIsAdmin(checkAdmin(data.session?.user?.email));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setIsAdmin(checkAdmin(session?.user?.email));
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ---------- Fetch comments ---------- */
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data: Comment[] = await res.json();
      setComments(data);
    } catch {
      setError("Could not load comments.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  /* ---------- Submit comment ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, body: body.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to post comment");
      }

      setBody("");
      await fetchComments();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Delete comment ---------- */
  const handleDelete = async (commentId: string) => {
    try {
      const res = await fetch(
        `/api/comments?id=${encodeURIComponent(commentId)}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError("Could not delete comment.");
    }
  };

  /* ---------- Helpers ---------- */
  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
  };

  /* ---------- Render ---------- */
  return (
    <section className="mt-16 border-t border-gray/20 pt-10">
      <h2 className="text-2xl font-bold text-dark dark:text-dark-light mb-8">
        Comments{" "}
        {comments.length > 0 && (
          <span className="text-base font-normal text-gray">
            ({comments.length})
          </span>
        )}
      </h2>

      {/* -------- Comment form -------- */}
      {userId ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Share your thoughts…"
            className="w-full rounded-xl border border-gray/30 bg-white dark:bg-white-dark
                       text-dark dark:text-dark-light placeholder:text-gray/50
                       p-4 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40
                       resize-none transition"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray">
              {body.length}/2000 characters
            </span>
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              className="px-5 py-2 rounded-lg bg-secondary text-white text-sm font-medium
                         hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
            >
              {submitting ? "Posting…" : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 rounded-xl border border-gray/20 bg-white dark:bg-white-dark p-6 text-center">
          <p className="text-gray text-sm mb-3">
            Sign in to join the conversation.
          </p>
          <a
            href="/login"
            className="inline-block px-5 py-2 rounded-lg bg-secondary text-white text-sm font-medium
                       hover:bg-secondary/90 transition-colors"
          >
            Sign In
          </a>
        </div>
      )}

      {/* -------- Error -------- */}
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* -------- Comments list -------- */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-gray/10 h-24"
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray text-sm">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="flex gap-4 rounded-xl bg-white dark:bg-white-dark p-4 shadow-sm"
            >
              {/* Avatar */}
              <div className="shrink-0">
                {comment.user_avatar ? (
                  <Image
                    src={comment.user_avatar}
                    alt={comment.user_name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
                    {comment.user_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-dark dark:text-dark-light">
                    {comment.user_name}
                  </span>
                  <span className="text-xs text-gray">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>

                <p className="text-sm text-dark/80 dark:text-dark-light/80 whitespace-pre-wrap wrap-break-word">
                  {comment.body}
                </p>

                {/* Delete button (own comments or admin) */}
                {(userId === comment.user_id || isAdmin) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="mt-2 text-xs text-red-400 hover:text-red-500 transition-colors"
                  >
                    {isAdmin && userId !== comment.user_id
                      ? "Delete (Admin)"
                      : "Delete"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
