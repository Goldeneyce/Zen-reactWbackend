import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL;

async function getToken() {
  const supabase = getSupabaseBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

async function fetchApi(path: string, options?: RequestInit) {
  const token = await getToken();
  const res = await fetch(`${ORDER_SERVICE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// Server-side fetch (pass token directly)
export async function fetchApiServer(path: string, token: string) {
  const res = await fetch(`${ORDER_SERVICE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

// ─── Dashboard Stats ────────────────────────────────────────
export const getOrderStats = () => fetchApi("/admin/orders/stats");
export const getRevenueByDay = () => fetchApi("/admin/orders/revenue-by-day");
export const getStatusDistribution = () => fetchApi("/admin/orders/status-distribution");

// ─── Orders CRUD ────────────────────────────────────────────
export const getAdminOrders = (params: Record<string, string> = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/admin/orders?${query}`);
};

export const getAdminOrder = (id: string) => fetchApi(`/admin/orders/${id}`);

export const updateOrder = (id: string, data: Record<string, unknown>) =>
  fetchApi(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const updateOrderStatus = (id: string, status: string, reason?: string) =>
  fetchApi(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, reason }),
  });

export const markOrderPaid = (id: string, notes?: string) =>
  fetchApi(`/admin/orders/${id}/mark-paid`, {
    method: "PATCH",
    body: JSON.stringify({ notes }),
  });

export const bulkUpdateStatus = (orderIds: string[], status: string, reason?: string) =>
  fetchApi("/admin/orders/bulk-status", {
    method: "POST",
    body: JSON.stringify({ orderIds, status, reason }),
  });

// ─── Fraud ──────────────────────────────────────────────────
export const updateFraudAnalysis = (id: string, data: Record<string, unknown>) =>
  fetchApi(`/admin/orders/${id}/fraud`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// ─── Activity / Notes ───────────────────────────────────────
export const getOrderActivity = (id: string) => fetchApi(`/admin/orders/${id}/activity`);

export const addOrderNote = (id: string, description: string, noteType: string = "internal") =>
  fetchApi(`/admin/orders/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ description, noteType }),
  });

// ─── Returns ────────────────────────────────────────────────
export const getReturns = (params: Record<string, string> = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchApi(`/admin/returns?${query}`);
};

export const getReturn = (id: string) => fetchApi(`/admin/returns/${id}`);
export const getOrderReturns = (orderId: string) => fetchApi(`/admin/orders/${orderId}/returns`);

export const createReturn = (data: Record<string, unknown>) =>
  fetchApi("/admin/returns", { method: "POST", body: JSON.stringify(data) });

export const updateReturn = (id: string, data: Record<string, unknown>) =>
  fetchApi(`/admin/returns/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const getReturnStats = () => fetchApi("/admin/returns/stats");

// ─── Reports ────────────────────────────────────────────────
export const getMonthlyReport = (months = 12) =>
  fetchApi(`/admin/orders/report/monthly?months=${months}`);

export const getPaymentMethodReport = () => fetchApi("/admin/orders/report/payment-methods");
export const getTopCustomers = (limit = 10) => fetchApi(`/admin/orders/report/top-customers?limit=${limit}`);
