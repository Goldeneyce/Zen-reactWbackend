"use client";

import { useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { ShippingFormData } from "@repo/types";

interface PaystackPaymentFormProps {
  shippingData: ShippingFormData;
  amount: number;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
}

// Paystack public key
const PAYSTACK_PUBLIC_KEY = "pk_test_fe1ec94572a0b588acf6e238053de752f869bb02";

const fetchPaystackSession = async (
  shippingData: ShippingFormData,
  amount: number,
  token: string
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify({
        email: shippingData.email,
        amount,
        metadata: {
          fullName: shippingData.fullName,
          phone: shippingData.phone,
          address: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((json) => json);
};

export default function PaystackPaymentForm({
  shippingData,
  amount,
  onSuccess,
  onClose,
}: PaystackPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => setToken(token));
  }, [getToken]);

  // Configure Paystack payment hook
  const config = {
    reference: `ref_${Date.now()}`,
    email: shippingData.email,
    amount: amount * 100, // Convert to kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    onSuccess: (response: any) => {
      // Handle successful payment
      toast.success("Payment successful!");
      console.log("Payment reference:", response);
      setLoading(false);
      
      if (onSuccess) {
        onSuccess(response.reference);
      }
    },
    onClose: () => {
      // Handle payment modal close
      toast.info("Payment cancelled");
      setLoading(false);
      
      if (onClose) {
        onClose();
      }
    },
  };

  const initializePaystackPayment = usePaystackPayment(config);

  /**
   * Fetch checkout session from backend and open Paystack popup
   */
  const initializePayment = async () => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchPaystackSession(shippingData, amount, token);

      if (data.success && data.access_code) {
        // Open Paystack popup
        initializePaystackPayment(onSuccess as any);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error("Failed to initialize payment");
      setLoading(false);
    }
  };

  if (!token) {
    return <div className="w-full text-center py-3">Loading...</div>;
  }

  return (
    <button
      onClick={initializePayment}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
    >
      {loading ? "Initializing..." : "Proceed to Payment"}
    </button>
  );
}
