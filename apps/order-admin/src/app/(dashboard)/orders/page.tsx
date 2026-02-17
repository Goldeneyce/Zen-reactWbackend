import { Suspense } from "react";
import OrdersListClient from "./OrdersListClient";

export const metadata = {
  title: "Orders | Zentrics Order Admin",
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and track all customer orders</p>
      </div>
      <Suspense fallback={<div className="flex items-center justify-center h-48 text-muted-foreground">Loading...</div>}>
        <OrdersListClient />
      </Suspense>
    </div>
  );
}
