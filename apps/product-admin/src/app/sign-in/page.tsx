"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session?.user);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSignedIn(!!session?.user);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      {signedIn ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-medium">You are already signed in.</p>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Go to dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-xl border p-8 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Product Admin</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to manage products &amp; inventory
            </p>
          </div>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border px-3 py-2 bg-background"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border px-3 py-2 bg-background"
                placeholder="Enter your password"
              />
            </div>
            {message && <p className="text-sm text-red-500">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
