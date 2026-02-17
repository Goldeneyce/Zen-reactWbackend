import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { fetchApiServer } from "@/lib/order-admin-api";
import OrderAdminDashboard from "./OrderAdminDashboard";

const OrderAdminPage = async () => {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || "";

  const [stats, revenueByDay, statusDistribution] = await Promise.all([
    fetchApiServer("/admin/orders/stats", token),
    fetchApiServer("/admin/orders/revenue-by-day", token),
    fetchApiServer("/admin/orders/status-distribution", token),
  ]);

  return (
    <div>
      <div className="mb-6 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold text-lg">Order Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of order operations, fulfillment, and performance</p>
      </div>
      <OrderAdminDashboard
        stats={stats || {}}
        revenueByDay={revenueByDay || []}
        statusDistribution={statusDistribution || []}
      />
    </div>
  );
};

export default OrderAdminPage;
