// app/order-confirmation/page.tsx
'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/formatPrice';

type OrderSummary = {
  id: string;
  method: 'card' | 'cod';
  items: { id: string; name: string; qty: number; price: number }[];
  totals: { subtotal: number; shipping: number; tax: number; total: number };
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

export default function OrderConfirmation({ searchParams }: { searchParams: Promise<{ method?: string; id?: string }> }) {
  const [order, setOrder] = useState<OrderSummary | null>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('last-order') : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const params = use(searchParams);
  const methodParam = params?.method === 'cod' ? 'cod' : 'card';
  const title = methodParam === 'cod' ? 'Order Placed – Pay on Delivery' : 'Order Confirmed – Payment Received';
  const message = methodParam === 'cod'
    ? "Your order has been placed successfully. You'll pay upon delivery (cash or card)."
    : 'Your payment was successful and your order has been confirmed.';

  return (
    <section className="py-16 bg-light dark:bg-light-dark">
      <div className="container max-w-3xl mx-auto">
        <div className="bg-white dark:bg-white-dark rounded-lg shadow-custom dark:shadow-dark-custom p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-white">✓</div>
            <h1 className="text-3xl font-bold text-primary mt-4">{title}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">{message}</p>
          </div>

          {order && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">Order Summary</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Order ID: <span className="font-mono">{order.id}</span></p>
                <ul className="space-y-2">
                  {order.items.map((it) => (
                    <li key={it.id} className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{it.name} × {it.qty}</span>
                      <span className="font-semibold">{formatPrice(it.price * it.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Subtotal</span><span className="font-semibold">{formatPrice(order.totals.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Shipping</span><span className="font-semibold">{order.totals.shipping === 0 ? 'Free' : formatPrice(order.totals.shipping)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Tax</span><span className="font-semibold">{formatPrice(order.totals.tax)}</span></div>
                  <div className="flex justify-between text-primary font-bold"><span>Total</span><span>{formatPrice(order.totals.total)}</span></div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">Delivery Address</h2>
                <div className="text-gray-700 dark:text-gray-300">
                  <p>{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.address}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                  <p>{order.address.country}</p>
                  <p className="mt-2 text-sm">Email: {order.address.email}</p>
                  <p className="text-sm">Phone: {order.address.phone}</p>
                </div>
              </div>
            </div>
          )}

          {!order && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">Order details were not found. You can still continue shopping.</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
            <Link href="/" className="btn btn-outline">Go to Home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
