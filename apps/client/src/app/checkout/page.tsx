// app/checkout/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import Searchbar from '@/components/Searchbar';
import { formatPrice } from '@/lib/formatPrice';
import ShippingForm from '@/components/ShippingForm';
import ShippingSelector, { type SelectedShipping } from '@/components/ShippingSelector';
import PaymentForm from '@/components/PaymentForm';
import type { ShippingFormData } from '@repo/types';

/** Default weight (kg) when a product doesn't specify one */
const DEFAULT_ITEM_WEIGHT = 0.5;

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const { items, getTotalPrice, clearCart } = useCartStore();

  // Shipping address captured from Step 1
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);

  // Selected shipping option from the ShippingSelector
  const [selectedShipping, setSelectedShipping] = useState<SelectedShipping>({
    rate: null,
    isCOD: false,
    cost: 0,
    shippingMethodId: '',
  });

  const subtotal = getTotalPrice();

  // Dynamic total weight of the cart (kg)
  const totalWeight = useMemo(() => {
    return items.reduce((sum, item) => {
      // CartItem may carry a `weight` field from ProductType; fallback to default
      const w = (item as any).weight ?? DEFAULT_ITEM_WEIGHT;
      return sum + w * item.quantity;
    }, 0);
  }, [items]);

  // Shipping cost comes from the selected rate
  const shippingCost = selectedShipping.cost;
  const total = subtotal + shippingCost;

  // COD available only if all items support it
  const codAvailable = items.length > 0 && items.every(item => item.payOnDelivery === true);

  /* ─── Step handlers ─── */

  const handleShippingFormDone = (data: ShippingFormData) => {
    // Store address data – don't advance step yet; user must pick a shipping method
    setShippingData(data);
  };

  const handleProceedToPayment = () => {
    if (!selectedShipping.shippingMethodId) return;
    setActiveStep('payment');
  };

  const handleShippingBack = () => {
    setActiveStep('shipping');
  };

  const handlePayOnDelivery = () => {
    // COD is handled via ShippingSelector already
    // Just proceed to review
    setActiveStep('review');
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      clearCart();
      window.location.href = '/order-confirmation';
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Searchbar className="my-8" />
        <section className="py-16 bg-light dark:bg-light-dark">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Please add items to your cart before checking out.
            </p>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Searchbar className="my-8" />
      
      <section className="py-8 bg-light dark:bg-light-dark">
        <div className="container">
          {/* Checkout Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep === 'shipping' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  1
                </div>
                <span className="mt-2 text-sm font-medium text-dark dark:text-gray-100">Shipping</span>
              </div>
              
              <div className="w-24 h-0.5 bg-gray-300 dark:bg-gray-600 mx-4" />
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep === 'payment' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  2
                </div>
                <span className="mt-2 text-sm font-medium text-dark dark:text-gray-100">Payment</span>
              </div>
              
              <div className="w-24 h-0.5 bg-gray-300 dark:bg-gray-600 mx-4" />
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep === 'review' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  3
                </div>
                <span className="mt-2 text-sm font-medium text-dark dark:text-gray-100">Review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {activeStep === 'shipping' && (
                <div className="space-y-6">
                  {/* Address Form */}
                  <ShippingForm onNext={handleShippingFormDone} />

                  {/* Shipping Selector – appears after address is filled */}
                  {shippingData && (
                    <div className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom">
                      <ShippingSelector
                        shippingData={shippingData}
                        weight={totalWeight}
                        codAvailable={codAvailable}
                        onSelect={setSelectedShipping}
                      />

                      <button
                        onClick={handleProceedToPayment}
                        disabled={!selectedShipping.shippingMethodId}
                        className="btn btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {activeStep === 'payment' && (
                <PaymentForm 
                  onBack={handleShippingBack}
                  onNext={() => setActiveStep('review')}
                  onPayOnDelivery={handlePayOnDelivery}
                  codAvailable={selectedShipping.isCOD}
                  shippingData={shippingData ?? undefined}
                  amount={total}
                  cartItems={items}
                  shippingMethodId={selectedShipping.shippingMethodId}
                  shippingCost={shippingCost}
                />
              )}
              
              {activeStep === 'review' && (
                <div className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom">
                  <h2 className="text-2xl font-bold text-primary mb-6">Order Review</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-dark dark:text-gray-100">Shipping Information</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                        {shippingData ? (
                          <>
                            <p className="font-semibold text-dark dark:text-gray-100">{shippingData.fullName}</p>
                            <p className="text-gray-700 dark:text-gray-300">
                              {shippingData.address}
                              {shippingData.addressLine2 && `, ${shippingData.addressLine2}`}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                              {shippingData.city}, {shippingData.state}
                              {shippingData.country && `, ${shippingData.country}`}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">{shippingData.email} | {shippingData.phone}</p>
                          </>
                        ) : (
                          <p className="text-gray-400 dark:text-gray-500">No shipping information</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-dark dark:text-gray-100">Shipping Method</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                        {selectedShipping.isCOD ? (
                          <p className="text-dark dark:text-gray-100">Cash on Delivery — ₦0.00</p>
                        ) : selectedShipping.rate ? (
                          <p className="text-dark dark:text-gray-100">
                            {selectedShipping.rate.carrier} ({selectedShipping.rate.serviceType})
                            — {formatPrice(selectedShipping.cost)}
                          </p>
                        ) : (
                          <p className="text-gray-400 dark:text-gray-500">No shipping method selected</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-dark dark:text-gray-100">Order Items</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <p className="font-medium text-dark dark:text-gray-100">{item.productName}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-100">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                            <p className="font-semibold text-dark dark:text-gray-100">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => setActiveStep('payment')}
                        className="btn btn-outline"
                      >
                        Back to Payment
                      </button>
                      <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="btn btn-primary flex-1"
                      >
                        {isSubmitting ? 'Placing Order...' : 'Place Order'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-white-dark p-6 rounded-lg shadow-custom dark:shadow-dark-custom sticky top-24">
                <h2 className="text-2xl font-bold text-primary mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                    <span className="font-semibold text-dark dark:text-gray-100">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                    <span className="font-semibold text-dark dark:text-gray-100">
                      {selectedShipping.isCOD
                        ? 'Pay on Delivery'
                        : shippingCost === 0
                        ? 'Select option'
                        : formatPrice(shippingCost)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-xl font-bold text-primary">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {selectedShipping.rate && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>{selectedShipping.rate.carrier}</strong> — Est.{' '}
                      {selectedShipping.rate.estimatedDays <= 1
                        ? '1 day'
                        : `${selectedShipping.rate.estimatedDays} days`}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cart weight: {totalWeight.toFixed(2)} kg
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