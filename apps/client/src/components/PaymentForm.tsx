// components/PaymentForm.tsx
'use client';

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import PaystackPaymentForm from './PaystackPaymentForm';
import { ShippingFormData, CartItem } from '@repo/types';

interface PaymentFormProps {
  control?: Control<any>;
  errors?: FieldErrors<any>;
  onBack: () => void;
  onNext: () => void;
  onPayOnDelivery: () => void;
  codAvailable: boolean;
  shippingData?: ShippingFormData;
  amount?: number;
  cartItems?: CartItem[];
}

export default function PaymentForm({ 
  control, 
  errors, 
  onBack, 
  onNext, 
  onPayOnDelivery, 
  codAvailable,
  shippingData,
  amount = 0,
  cartItems
}: PaymentFormProps) {
  
  const handlePaymentSuccess = (reference: string) => {
    console.log("Payment successful with reference:", reference);
    // Proceed to next step after successful payment
    onNext();
  };

  const handlePaymentClose = () => {
    console.log("Payment modal closed");
  };

  return (
    <div className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom">
      <h2 className="text-2xl font-bold text-primary mb-6">Payment Information</h2>
      
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
            Secure Payment with Paystack
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Amount to pay: ₦{amount?.toLocaleString() || '0'}
          </p>
          {shippingData && (
            <PaystackPaymentForm
              shippingData={shippingData}
              amount={amount}
              cartItems={cartItems}
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
            />
          )}
          {!shippingData && (
            <p className="text-sm text-red-500">Please complete shipping information first.</p>
          )}
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="btn btn-outline flex-1"
        >
          Back to Address
        </button>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>
        {codAvailable ? (
          <>
            <button
              onClick={onPayOnDelivery}
              className="btn btn-outline w-full"
            >
              Pay on Delivery
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              You&apos;ll pay with cash or card at the collection point.
            </p>
          </>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Pay on Delivery is not available. One or more items in your cart do not support pay on delivery.
          </p>
        )}
      </div>
    </div>
  );
}