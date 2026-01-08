// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import Searchbar from '@/components/Searchbar';
import ShippingForm from '@/components/ShippingForm';
import PaymentForm from '@/components/PaymentForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FieldErrors } from 'react-hook-form';
import * as z from 'zod';
import { ShippingFormData, PaymentFormData } from '@/types';

const checkoutSchema = z.object({
  shipping: z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    address: z.string().min(5, 'Please enter a valid address'),
    city: z.string().min(2, 'Please enter a city'),
    state: z.string().min(2, 'Please enter a state'),
    zipCode: z.string().min(5, 'Please enter a valid zip code'),
    country: z.string().min(2, 'Please enter a country'),
  }),
  payment: z.object({
    cardNumber: z.string().min(16, 'Please enter a valid card number'),
    cardHolder: z.string().min(2, 'Please enter card holder name'),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Please enter a valid expiry date (MM/YY)'),
    cvv: z.string().min(3, 'Please enter a valid CVV'),
  }),
});

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const { items, getTotalPrice, clearCart } = useCartStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
      },
      payment: {
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
      },
    },
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const onSubmit = async (data: z.infer<typeof checkoutSchema>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Checkout data:', data);
      
      // Clear cart and show success
      clearCart();
      alert('Order placed successfully! Thank you for your purchase.');
      
      // Redirect to confirmation page
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
                <span className="mt-2 text-sm font-medium">Shipping</span>
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
                <span className="mt-2 text-sm font-medium">Payment</span>
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
                <span className="mt-2 text-sm font-medium">Review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {activeStep === 'shipping' && (
                <ShippingForm 
                  control={control}
                  errors={(errors.shipping || {}) as FieldErrors<ShippingFormData>}
                  onNext={() => setActiveStep('payment')}
                />
              )}
              
              {activeStep === 'payment' && (
                <PaymentForm 
                  control={control}
                  errors={(errors.payment || {}) as FieldErrors<PaymentFormData>}
                  onBack={() => setActiveStep('shipping')}
                  onNext={() => setActiveStep('review')}
                  onPayOnDelivery={() => {}}
                  codAvailable={false}
                />
              )}
              
              {activeStep === 'review' && (
                <div className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom">
                  <h2 className="text-2xl font-bold text-primary mb-6">Order Review</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Shipping Information</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                        {/* This would display actual form data */}
                        <p>John Doe</p>
                        <p>123 Main St, New York, NY 10001</p>
                        <p>john@example.com | (123) 456-7890</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Payment Method</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                        <p>Visa ending in 4242</p>
                        <p>Expires: 12/25</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Order Items</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-100">
                                Qty: {item.quantity} × ₦{item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ₦{(item.price * item.quantity).toFixed(2)}
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
                        onClick={handleSubmit(onSubmit)}
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
                    <span className="font-semibold">₦{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'Free' : `₦${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b">
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
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
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