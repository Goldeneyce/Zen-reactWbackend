import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { fetchApiServer } from "@/lib/order-admin-api";
import OrderDetailClient from "./OrderDetailClient";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

const OrderDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || "";

  const [order, activity, returns] = await Promise.all([
    fetchApiServer(`/admin/orders/${id}`, token),
    fetchApiServer(`/admin/orders/${id}/activity`, token),
    fetchApiServer(`/admin/orders/${id}/returns`, token),
  ]);

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-semibold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-4">The order you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/orders" className="text-primary hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Try to get logistics data
  let shipments: Record<string, unknown>[] = [];
  try {
    const logisticsUrl = process.env.NEXT_PUBLIC_LOGISTICS_SERVICE_URL || "http://localhost:8011";
    const shipRes = await fetch(`${logisticsUrl}/shipments/order/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (shipRes.ok) shipments = await shipRes.json();
  } catch { /* logistics service may be down */ }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/orders"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          &larr; Back to Orders
        </Link>
        <div className="px-4 py-2 bg-secondary rounded-md flex-1">
          <h1 className="font-semibold text-lg">Order #{id.slice(-8)}</h1>
          <p className="text-sm text-muted-foreground">
            Created {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <OrderDetailClient
        order={order}
        activity={activity || []}
        returns={returns || []}
        shipments={shipments}
      />
    </div>
  );
};

export default OrderDetailPage;
