// app/cart/page.tsx
'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import { MinusIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import ShippingForm from '@/components/ShippingForm';
import PaymentForm from '@/components/PaymentForm';
import type { ShippingFormData } from '@repo/types';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1); // 1: Cart, 2: Shipping, 3: Payment
  const router = useRouter();
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);

  const formatOrderId = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ZEN-${yyyy}${mm}${dd}-${rand}`;
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      removeItem(itemId);
    }
  };

  const handleShippingNext = (data: ShippingFormData) => {
    setShippingData(data);
    setActiveStep(3);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      const orderId = formatOrderId();
      const order = {
        id: orderId,
        method: 'card' as const,
        items: items.map(i => ({ id: i.id, name: i.productName, qty: i.quantity, price: i.price })),
        totals: { subtotal, shipping, tax, total },
        shippingData,
      };
      try { localStorage.setItem('last-order', JSON.stringify(order)); } catch {}
      toast.success('Checkout completed! Thank you for your order.');
      clearCart();
      setIsCheckingOut(false);
      router.push(`/order-confirmation?method=card&id=${encodeURIComponent(orderId)}`);
    }, 1000);
  };

  const handleCashOnDelivery = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const orderId = formatOrderId();
      const order = {
        id: orderId,
        method: 'cod' as const,
        items: items.map(i => ({ id: i.id, name: i.productName, qty: i.quantity, price: i.price })),
        totals: { subtotal, shipping, tax, total },
        shippingData,
      };
      try { localStorage.setItem('last-order', JSON.stringify(order)); } catch {}
      toast.info('Order placed with Pay on Delivery. You will pay upon delivery.');
      clearCart();
      setIsCheckingOut(false);
      router.push(`/order-confirmation?method=cod&id=${encodeURIComponent(orderId)}`);
    }, 1000);
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <>
        {/* Stepper */}
        <div className="py-6">
          <div className="container">
            <div className="flex items-center justify-center gap-6">
              {/* Step 1 */}
              <button
                className={`flex items-center gap-2 ${activeStep === 1 ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'} `}
                onClick={() => setActiveStep(1)}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${activeStep === 1 ? 'border-secondary bg-secondary text-white' : 'border-gray-300 dark:border-gray-600'}`}>1</span>
                <span className="font-medium">Cart</span>
              </button>
              {/* Divider */}
              <span className="w-10 h-px bg-gray-300 dark:bg-gray-700" />
              {/* Step 2 */}
              <button
                className={`flex items-center gap-2 ${activeStep === 2 ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'} `}
                onClick={() => setActiveStep(2)}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${activeStep === 2 ? 'border-secondary bg-secondary text-white' : 'border-gray-300 dark:border-gray-600'}`}>2</span>
                <span className="font-medium">Address</span>
              </button>
              {/* Divider */}
              <span className="w-10 h-px bg-gray-300 dark:bg-gray-700" />
              {/* Step 3 */}
              <button
                className={`flex items-center gap-2 ${activeStep === 3 ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'} `}
                onClick={() => setActiveStep(3)}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${activeStep === 3 ? 'border-secondary bg-secondary text-white' : 'border-gray-300 dark:border-gray-600'}`}>3</span>
                <span className="font-medium">Payment</span>
              </button>
            </div>
          </div>
        </div>
        <section className="py-16 bg-light dark:bg-light-dark">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Looks like you haven&apos;t added any products to your cart yet.
            </p>
            <Link href="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Stepper */}
      <div className="py-6">
        <div className="container">
          <div className="flex items-center justify-center gap-6">
            {/* Step 1 */}
            <button
              className={`flex items-center gap-2 ${activeStep === 1 ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'} `}
              onClick={() => setActiveStep(1)}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${activeStep === 1 ? 'border-secondary bg-secondary text-white' : 'border-gray-300 dark:border-gray-600'}`}>1</span>
              <span className="font-medium">Cart</span>
            </button>
            {/* Divider */}
            <span className="w-10 h-px bg-gray-300 dark:bg-gray-700" />
            {/* Step 2 */}
            <button
              className={`flex items-center gap-2 ${activeStep === 2 ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'} `}
              onClick={() => setActiveStep(2)}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${activeStep === 2 ? 'border-secondary bg-secondary text-white' : 'border-gray-300 dark:border-gray-600'}`}>2</span>
              <span className="font-medium">Address</span>
            </button>
            {/* Divider */}
            <span className="w-10 h-px bg-gray-300 dark:bg-gray-700" />
            {/* Step 3 */}
            <button
              className={`flex items-center gap-2 ${activeStep === 3 ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'} `}
              onClick={() => setActiveStep(3)}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${activeStep === 3 ? 'border-secondary bg-secondary text-white' : 'border-gray-300 dark:border-gray-600'}`}>3</span>
              <span className="font-medium">Payment</span>
            </button>
          </div>
        </div>
      </div>
      
      <section className="py-8 bg-light dark:bg-light-dark">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Step 1: Cart Review */}
              {activeStep === 1 && (
                <div className="bg-white dark:bg-white-dark rounded-lg shadow-custom dark:shadow-dark-custom p-6">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Your Cart ({items.reduce((sum, item) => sum + item.quantity, 0)} Items)
                  </h2>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <div className="shrink-0">
                          <div className="w-24 h-24 rounded overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.productName}
                              width={96}
                              height={96}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-primary mb-2">
                            {item.productName}
                          </h3>
                          <p className="text-secondary font-semibold mb-3">
                            ₦{item.price.toFixed(2)}
                          </p>
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="btn btn-outline py-2! px-4! text-sm"
                            >
                              Remove <TrashIcon className="w-4 h-4 ml-2" />
                            </button>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <h3 className="font-bold text-lg">
                            ₦{(item.price * item.quantity).toFixed(2)}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="btn btn-primary" onClick={() => setActiveStep(2)}>Continue</button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {activeStep === 2 && (
                <div className="bg-white dark:bg-white-dark rounded-lg shadow-custom dark:shadow-dark-custom p-6">
                  <h2 className="text-2xl font-bold text-primary mb-6">Address Details</h2>
                  <ShippingForm onNext={handleShippingNext} />
                  <div className="mt-6 flex justify-start">
                    <button className="btn btn-outline" onClick={() => setActiveStep(1)}>Back to Cart</button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {activeStep === 3 && (
                <div className="bg-white dark:bg-white-dark rounded-lg shadow-custom dark:shadow-dark-custom p-6">
                  <h2 className="text-2xl font-bold text-primary mb-6">Payment</h2>
                  <PaymentForm
                    onBack={() => setActiveStep(2)}
                    onNext={handleCheckout}
                    onPayOnDelivery={handleCashOnDelivery}
                    codAvailable={subtotal < 50000}
                    shippingData={shippingData}
                    amount={total}
                  />
                  {isCheckingOut && (
                    <p className="text-sm text-secondary mt-4">Processing...</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`bg-white dark:bg-white-dark rounded-lg shadow-custom dark:shadow-dark-custom p-6 sticky top-24 ${activeStep !== 1 ? 'opacity-60 pointer-events-none' : ''}`}>
                <h2 className="text-2xl font-bold text-primary mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="font-semibold">₦{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'Free' : `₦${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">Tax (10%)</span>
                    <span className="font-semibold">₦{tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-xl font-bold text-primary">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₦{total.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {activeStep === 1 && (
                  <button
                    onClick={() => setActiveStep(2)}
                    className="btn btn-primary w-full mb-4"
                  >
                    Proceed to Address
                  </button>
                )}
                
                <Link
                  href="/products"
                  className="btn btn-outline w-full text-center"
                >
                  Continue Shopping
                </Link>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <strong>Free shipping</strong> on orders over ₦500
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Estimated delivery: 3-5 business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
