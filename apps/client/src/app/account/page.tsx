"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      const meta = user?.user_metadata as {
        first_name?: string;
        middle_name?: string;
        last_name?: string;
        phone_number?: string;
        gender?: string;
        date_of_birth?: string;
      } | undefined;
      setEmail(user?.email ?? null);
      setFirstName(meta?.first_name ?? "");
      setMiddleName(meta?.middle_name ?? "");
      setLastName(meta?.last_name ?? "");
      setPhoneNumber(meta?.phone_number ?? "");
      setGender(meta?.gender ?? "");
      setDateOfBirth(meta?.date_of_birth ?? "");
      setLoading(false);
    });
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        phone_number: phoneNumber,
        gender,
        date_of_birth: dateOfBirth,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Profile updated.");
    }

    setSaving(false);
  };

  const handlePasswordReset = async () => {
    setSecurityMessage(null);
    const supabase = getSupabaseBrowserClient();
    if (!email) {
      setSecurityMessage("No email found for this account.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      setSecurityMessage(error.message);
    } else {
      setSecurityMessage("Password reset link sent to your email.");
    }
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="container py-12">Loading account…</div>;
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl space-y-8">
        <div className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-gradient-to-br from-white via-white to-secondary/10 dark:from-white-dark dark:via-white-dark dark:to-secondary/10 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-dark dark:text-gray-100">Account settings</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your profile, security, and preferences.</p>
        </div>

        <section className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-white-dark p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Profile</h2>
              <p className="text-sm text-gray-500">Update your personal information.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email ?? ""}
                disabled
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Middle name</label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Middle name (optional)"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+234 123 456 7890"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date of birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white-dark px-4 py-2.5 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              {message && <p className="text-sm text-secondary">{message}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn btn-outline"
                >
                  Log out
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-white-dark p-8 shadow-sm">
          <h2 className="text-lg font-semibold">Security</h2>
          <p className="text-sm text-gray-500">Keep your account secure.</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="btn btn-outline"
            >
              Send password reset link
            </button>
            {securityMessage && <p className="text-sm text-secondary">{securityMessage}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
