// components/PaymentForm.tsx
'use client';

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface PaymentFormProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  onBack: () => void;
  onNext: () => void;
  onPayOnDelivery: () => void;
  codAvailable: boolean;
}

export default function PaymentForm({ control, errors, onBack, onNext, onPayOnDelivery, codAvailable }: PaymentFormProps) {
  return (
    <div className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom">
      <h2 className="text-2xl font-bold text-primary mb-6">Payment Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            Card Number
          </label>
          <Controller
            name="payment.cardNumber"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="4242 4242 4242 4242"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.cardNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.cardNumber.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            Card Holder Name
          </label>
          <Controller
            name="payment.cardHolder"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.cardHolder && (
            <p className="mt-1 text-sm text-red-500">{errors.cardHolder.message as string}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-dark dark:text-light font-medium mb-2">
              Expiry Date
            </label>
            <Controller
              name="payment.expiryDate"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              )}
            />
            {errors?.expiryDate && (
              <p className="mt-1 text-sm text-red-500">{errors.expiryDate.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-dark dark:text-light font-medium mb-2">
              CVV
            </label>
            <Controller
              name="payment.cvv"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  placeholder="123"
                  type="password"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              )}
            />
            {errors?.cvv && (
              <p className="mt-1 text-sm text-red-500">{errors.cvv.message as string}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="btn btn-outline flex-1"
        >
          Back to Address
        </button>
        <button
          onClick={onNext}
          className="btn btn-primary flex-1"
        >
          Review Order
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
            Pay on Delivery is available only for orders below ₦50,000.
          </p>
        )}
      </div>
    </div>
  );
}