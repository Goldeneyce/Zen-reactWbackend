"use client";

import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background gap-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-destructive mb-2">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to access the Order Admin dashboard.
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Only users with the <strong>orderAdmin</strong> or <strong>admin</strong> role can access this area.
        </p>
      </div>
      <button
        onClick={handleSignOut}
        className="rounded-md border px-6 py-2 text-sm hover:bg-accent transition-colors"
      >
        Sign out &amp; try another account
      </button>
    </div>
  );
}
