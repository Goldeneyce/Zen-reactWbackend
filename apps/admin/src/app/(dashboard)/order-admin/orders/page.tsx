import OrdersListClient from "./OrdersListClient";

const OrdersListPage = () => {
  return (
    <div>
      <div className="mb-6 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold text-lg">Order Management</h1>
        <p className="text-sm text-muted-foreground">Search, filter, and manage all orders</p>
      </div>
      <OrdersListClient />
    </div>
  );
};

export default OrdersListPage;
