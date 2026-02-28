"use client";

import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const Page = () => {
  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
  };

  return (
    <div className="">
      <h1>You do not have an access!</h1>
      <button onClick={handleSignOut}>Log out</button>
    </div>
  );
};

export default Page;
