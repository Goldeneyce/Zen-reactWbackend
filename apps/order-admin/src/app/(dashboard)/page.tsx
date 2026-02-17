import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { fetchApiServer } from "@/lib/order-admin-api";
import OrderAdminDashboard from "./DashboardClient";

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
      <div className="mb-6 px-4 py-3 bg-gradient-to-r from-secondary to-secondary/50 rounded-lg border">
        <h1 className="font-bold text-xl">Order Admin Dashboard</h1>
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
