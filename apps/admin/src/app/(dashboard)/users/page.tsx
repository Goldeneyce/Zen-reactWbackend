import type { User } from "@supabase/supabase-js";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const getData = async (): Promise<{data:User[]; totalCount:number}> => {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: [], totalCount: 0};
  }

};

const UsersPage = async () => {
  const res = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>
      <DataTable columns={columns} data={res.data} />
    </div>
  );
};

export default UsersPage;
