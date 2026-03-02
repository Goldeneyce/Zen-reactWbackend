"use client";

import { useEffect, useState } from "react";
import { OrderType } from "@repo/types";
import { toast } from "react-toastify";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { formatPrice } from "@/lib/formatPrice";

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const supabase = getSupabaseBrowserClient();
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) {
          setError("Please log in to view your orders.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/user-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePayForOrder = async (orderId: string) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        toast.error('Please log in to make payment.');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders/${orderId}/pay`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to process payment');
      }

      toast.success('Payment confirmed! Thank you.');
      // Refresh orders
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status: 'paid' } : o)
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "unpaid":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-300 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage all your orders in one place
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-white-dark rounded-lg shadow-md dark:shadow-dark-custom p-12 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg
              className="mx-auto h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Orders Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            When you place orders, they will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-white-dark rounded-lg shadow-md dark:shadow-dark-custom overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Placed on {formatDate(order.createdAt || new Date())}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Products
                  </h4>
                  <div className="space-y-2">
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex-1">
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {product.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            × {product.quantity}
                          </span>
                        </div>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {formatPrice(product.price * product.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Shipping Address
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {order.shippingAddress}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Total Amount
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(order.amount)}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {/* Show payment method badge */}
                    {(order as any).paymentMethod === 'cod' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        Pay on Delivery
                      </span>
                    )}
                    {/* Pay button for delivered COD orders */}
                    {(order as any).paymentMethod === 'cod' && order.status === 'delivered' && (
                      <button
                        onClick={() => handlePayForOrder(order._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Pay Now
                      </button>
                    )}
                    {/* Show unpaid notice for COD orders awaiting delivery */}
                    {(order as any).paymentMethod === 'cod' && order.status === 'unpaid' && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Payment due upon delivery
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;