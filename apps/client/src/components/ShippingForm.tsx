// components/ShippingForm.tsx
"use client";

import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingFormSchema, type ShippingFormData as ShippingFormInputs } from "@repo/types";

const NIGERIA_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers",
  "Sokoto","Taraba","Yobe","Zamfara"
];

interface ShippingFormProps {
  onNext: (data: ShippingFormInputs) => void;
}

export default function ShippingForm({ onNext }: ShippingFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    },
  });

  const onSubmit: SubmitHandler<ShippingFormInputs> = (data) => {
    onNext(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom"
    >
      <h2 className="text-2xl font-bold text-primary mb-6">Address Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-dark dark:text-light font-medium mb-2">
            Full Name
          </label>
          <input
            {...register("fullName")}
            placeholder="Victor Chek"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message as string}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-dark dark:text-light font-medium mb-2">
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="john@example.com"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message as string}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-dark dark:text-light font-medium mb-2">
            Phone Number
          </label>
          <input
            {...register("phone")}
            type="tel"
            placeholder="08012345678"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message as string}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-dark dark:text-light font-medium mb-2">
            Address
          </label>
          <input
            {...register("address")}
            placeholder="123 Main Street"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            City
          </label>
          <input
            {...register("city")}
            placeholder="Asaba"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-dark dark:text-light font-medium mb-2">
            State
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="">Select a state</option>
                {NIGERIA_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-500">{errors.state.message as string}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button type="submit" className="btn btn-primary w-full">
          Continue to Payment
        </button>
      </div>
    </form>
  );
}