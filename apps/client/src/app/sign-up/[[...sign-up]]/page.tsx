"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { AppleAuthIcon, GoogleAuthIcon } from "@/components/Icons";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email to confirm your account.");
    }

    setLoading(false);
  };

  const handleSocialSignUp = async (provider: "google" | "apple") => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen mt-10">
      <div className="w-full max-w-md bg-white dark:bg-white-dark rounded-2xl shadow-custom dark:shadow-dark-custom p-8">
        <div className="text-center mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary">Join us</p>
          <h1 className="text-3xl font-bold text-primary mt-2">Create your Zentrics account</h1>
          <p className="text-sm text-gray-500 mt-2">Save your wishlist, track orders, and checkout faster.</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-dark dark:text-gray-100 font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div>
            <label className="block text-dark dark:text-gray-100 font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          {message && <p className="text-sm text-secondary">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-white-dark text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialSignUp("google")}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            type="button"
          >
            <GoogleAuthIcon className="w-5 h-5" />
            <span>Google</span>
          </button>

          <button
            onClick={() => handleSocialSignUp("apple")}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            type="button"
          >
            <AppleAuthIcon className="w-5 h-5" />
            <span>Apple</span>
          </button>
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-6">
          Already have an account? <Link href="/login" className="text-secondary">Sign in</Link>
        </p>
      </div>
    </div>
  );
}