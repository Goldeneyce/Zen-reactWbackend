"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/nextjs";
import { ShippingFormData, CartItem } from "@repo/types";

interface PaystackPaymentFormProps {
  shippingData: ShippingFormData;
  amount: number;
  cartItems?: CartItem[];
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
}

// Paystack public key
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

// Declare PaystackPop type
declare global {
  interface Window {
    PaystackPop?: any;
  }
}

const fetchPaystackSession = async (
  shippingData: ShippingFormData,
  amount: number,
  token: string | null,
  cartItems?: CartItem[]
) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
    {
      method: "POST",
      body: JSON.stringify({
        email: shippingData.email,
        amount,
        cart: cartItems?.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          price: item.price  // Include price as fallback for placeholder products
        })) || [],
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
        ...(token && token !== "mock-token" ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  )
    .then((response) => {
      console.log("Fetch response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      console.log("Parsed JSON response:", json);
      return json;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
};

export default function PaystackPaymentForm({
  shippingData,
  amount,
  cartItems,
  onSuccess,
  onClose,
}: PaystackPaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Ensure component only renders on client
  useEffect(() => {
    console.log("Setting mounted to true");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && authLoaded) {
      console.log("Auth status:", { isSignedIn, userId: user?.id });
      
      if (!isSignedIn) {
        console.error("User not signed in");
        toast.error("Please sign in to continue");
        return;
      }
      
      console.log("Fetching token...");
      getToken().then((token) => {
        console.log("Token received:", token ? "✓" : "null");
        if (token) {
          setToken(token);
        } else {
          // Token is null but user is signed in - use mock for development
          console.log("Token is null, using mock token for development");
          setToken("mock-token");
        }
      }).catch((error) => {
        console.error("Error fetching token:", error);
        toast.error("Authentication error");
      });
    }
  }, [getToken, mounted, authLoaded, isSignedIn, user]);

  // Load Paystack inline script
  useEffect(() => {
    if (!mounted) return;

    console.log("Loading Paystack script...");
    
    // Check if script is already loaded
    if (window.PaystackPop) {
      console.log("Paystack script already loaded");
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      console.log("Paystack script loaded successfully");
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Paystack script");
      toast.error("Failed to load payment system");
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [mounted]);

  /**
   * Fetch checkout session from backend and open Paystack popup
   */
  const initializePayment = async () => {
    if (!window.PaystackPop) {
      toast.error("Payment system not loaded. Please refresh the page.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchPaystackSession(shippingData, amount, token, cartItems);
      
      console.log("Backend response:", data);
      console.log("Access code:", data.access_code);

      if (data.success && data.access_code) {
        // Use authorization_url to redirect instead of inline popup
        // The inline popup seems to have compatibility issues
        if (data.authorization_url) {
          console.log("Redirecting to Paystack checkout:", data.authorization_url);
          window.location.href = data.authorization_url;
        } else {
          // Fallback to inline popup if no authorization_url
          const paystackConfig = {
            key: PAYSTACK_PUBLIC_KEY,
            access_code: data.access_code,
            onClose: function () {
              toast.info("Payment cancelled");
              setLoading(false);
              
              if (onClose) {
                onClose();
              }
            },
            callback: function (response: any) {
              toast.success("Payment successful!");
              console.log("Payment reference:", response);
              setLoading(false);
              
              if (onSuccess) {
                onSuccess(response.reference);
              }
            },
          };

          console.log("Paystack config:", paystackConfig);
          const handler = window.PaystackPop.setup(paystackConfig);
          
          // Try newTransaction() method for access_code
          if (handler.newTransaction) {
            handler.newTransaction();
          } else {
            handler.openIframe();
          }
        }
      } else {
        console.error("Invalid backend response:", data);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error("Failed to initialize payment");
      setLoading(false);
    }
  };

  // Don't render until mounted on client and script is loaded
  if (!mounted || !authLoaded || !scriptLoaded) {
    console.log("Loading state:", { mounted, authLoaded, token: !!token, scriptLoaded, isSignedIn });
    return (
      <div className="w-full text-center py-3">
        <div>Loading payment system...</div>
        <div className="text-sm text-gray-500 mt-2">
          Mounted: {mounted ? "✓" : "⏳"} | 
          Auth: {authLoaded ? "✓" : "⏳"} | 
          SignedIn: {isSignedIn ? "✓" : "❌"} | 
          Script: {scriptLoaded ? "✓" : "⏳"}
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="w-full text-center py-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Please sign in to continue with payment</p>
      </div>
    );
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
