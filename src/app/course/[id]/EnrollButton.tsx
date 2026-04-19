"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

interface EnrollButtonProps {
  courseId: string;
  isLoggedIn: boolean;
}

export default function EnrollButton({ courseId, isLoggedIn }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderRes.json();

      // 2. Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key from env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "GrowAiEdu",
        description: "Course Enrollment Payment",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify payment on server
          setLoading(true);
          try {
            const verifyRes = await fetch("/api/payments/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            // Redirect to dashboard on success
            router.push("/student-dashboard");
            router.refresh();
          } catch (err) {
            console.error(err);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "Student", // Could take from user context if available
        },
        theme: {
          color: "#3F3EE8",
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button 
        onClick={handleEnroll} 
        disabled={loading}
        className="w-full bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-2xl py-4 font-bold text-lg transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Complete Enrollment"}
      </button>
    </>
  );
}
