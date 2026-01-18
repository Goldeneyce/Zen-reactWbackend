// components/PaymentForm.tsx
'use client';

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface PaymentFormProps {
  control?: Control<any>;
  errors?: FieldErrors<any>;
  onBack: () => void;
  onNext: () => void;
  onPayOnDelivery: () => void;
  codAvailable: boolean;
}

export default function PaymentForm({ control, errors, onBack, onNext, onPayOnDelivery, codAvailable }: PaymentFormProps) {
  const hasControl = Boolean(control);

  const renderInput = (name: string, placeholder: string, type = 'text', extraProps: Record<string, any> = {}) => {
    if (!hasControl) {
      return (
        <input
          placeholder={placeholder}
          type={type}
          disabled
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 text-dark dark:text-light focus:outline-none"
          {...extraProps}
        />
      );
    }

    return (
      <Controller
        name={name}
        control={control as Control<any>}
        render={({ field }) => (
          <input
            {...field}
            placeholder={placeholder}
            type={type}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
            {...extraProps}
          />
        )}
      />
    );
  };

  const renderError = (key: string) => {
    if (!errors) return null;
    const error = (errors as Record<string, any>)[key];
    if (!error) return null;
    return (
      <p className="mt-1 text-sm text-red-500">{error?.message as string}</p>
    );
  };

  return (
    <div className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom">
      <h2 className="text-2xl font-bold text-primary mb-6">Payment Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            Card Number
          </label>
          {renderInput('payment.cardNumber', '4242 4242 4242 4242')}
          {renderError('cardNumber')}
        </div>
        
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            Card Holder Name
          </label>
          {renderInput('payment.cardHolder', 'John Doe')}
          {renderError('cardHolder')}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-dark dark:text-light font-medium mb-2">
              Expiry Date
            </label>
            {renderInput('payment.expiryDate', 'MM/YY')}
            {renderError('expiryDate')}
          </div>
          
          <div>
            <label className="block text-dark dark:text-light font-medium mb-2">
              CVV
            </label>
            {renderInput('payment.cvv', '123', 'password', { maxLength: 4 })}
            {renderError('cvv')}
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