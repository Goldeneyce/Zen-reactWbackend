// components/ShippingForm.tsx
'use client';

import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface ShippingFormProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  onNext: () => void;
}

export default function ShippingForm({ control, errors, onNext }: ShippingFormProps) {
  return (
    <div className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom">
      <h2 className="text-2xl font-bold text-primary mb-6">Address Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            First Name
          </label>
          <Controller
            name="address.firstName"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="John"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            Last Name
          </label>
          <Controller
            name="address.lastName"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName.message as string}</p>
          )}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-dark dark:text-light font-medium mb-2">
            Email Address
          </label>
          <Controller
            name="address.email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message as string}</p>
          )}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-dark dark:text-light font-medium mb-2">
            Phone Number
          </label>
          <Controller
            name="address.phone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="tel"
                placeholder="(123) 456-7890"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message as string}</p>
          )}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-dark dark:text-light font-medium mb-2">
            Address
          </label>
          <Controller
            name="address.address"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="123 Main Street"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            City
          </label>
          <Controller
            name="address.city"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="New York"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            State
          </label>
          <Controller
            name="address.state"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="NY"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.state && (
            <p className="mt-1 text-sm text-red-500">{errors.state.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            ZIP Code
          </label>
          <Controller
            name="address.zipCode"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                placeholder="10001"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            )}
          />
          {errors?.zipCode && (
            <p className="mt-1 text-sm text-red-500">{errors.zipCode.message as string}</p>
          )}
        </div>
        
        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            Country
          </label>
          <Controller
            name="address.country"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
              </select>
            )}
          />
          {errors?.country && (
            <p className="mt-1 text-sm text-red-500">{errors.country.message as string}</p>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <button
          onClick={onNext}
          className="btn btn-primary w-full"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}