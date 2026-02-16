import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">No session ID found!</p>
          <Link 
            href="/cart" 
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  try {
    // Verify payment with Paystack via payment service
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/verify-payment/${session_id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 bg-card rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-destructive mb-4">Payment Verification Failed</h1>
            <p className="text-muted-foreground mb-6">Unable to verify your payment. Please contact support.</p>
            <Link 
              href="/cart" 
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      );
    }

    const data = await res.json();

    // Check if payment was successful
    const isSuccess = data.success && data.data?.status === "success";
    const paymentStatus = data.data?.status || "unknown";
    const amount = data.data?.amount ? formatPrice(data.data.amount / 100) : "₦0.00";
    const reference = data.data?.reference || session_id;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card rounded-lg shadow-lg max-w-lg">
          {isSuccess ? (
            <>
              <div className="mb-6">
                <svg
                  className="w-20 h-20 text-green-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
              <p className="text-lg text-muted-foreground mb-2">Thank you for your purchase.</p>
              <p className="text-sm text-muted-foreground mb-6">
                Amount paid: <span className="font-semibold">{amount}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-8">
                Reference: {reference}
              </p>
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium"
                >
                  View Your Orders
                </Link>
                <Link
                  href="/orders"
                  className="block w-full px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <svg
                  className="w-20 h-20 text-destructive mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-destructive mb-4">Payment {paymentStatus}</h1>
              <p className="text-muted-foreground mb-8">
                Your payment could not be completed. Please try again.
              </p>
              <p className="text-xs text-muted-foreground mb-8">
                Reference: {reference}
              </p>
              <div className="space-y-3">
                <Link
                  href="/cart"
                  className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium"
                >
                  Return to Cart
                </Link>
                <Link
                  href="/"
                  className="block w-full px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-card rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">
            An error occurred while verifying your payment. Please contact support.
          </p>
          <Link 
            href="/cart" 
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }
};

export default ReturnPage;