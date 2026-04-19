"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      setMessage(data.message);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex font-sans pt-20">
      
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between text-white p-16">
        <Image src="/bg_growaiedu.png" alt="GrowAiEdu Background" fill className="object-cover absolute inset-0 z-0 brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-0"></div>
        
        <div className="relative z-10 space-y-4">
           <h1 className="text-5xl font-bold tracking-tight">GrowAiEdu</h1>
           <p className="text-xl text-slate-300 max-w-sm">Secure access to your creative future.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <Link href="/login" className="text-indigo-600 font-bold mb-4 inline-block hover:underline">
               ← Back to Login
            </Link>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Reset Password</h2>
            <p className="mt-2 text-slate-500">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {status === "error" && <div className="text-red-500 text-sm font-medium">{message}</div>}
            {status === "success" && <div className="text-emerald-600 text-sm font-medium bg-emerald-50 p-4 rounded-xl border border-emerald-100">{message}</div>}

            {status !== "success" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full bg-slate-100 rounded-xl px-4 py-4 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                    placeholder="student@growaiedu.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" disabled={status === "loading"}
                  className="w-full bg-[#6C63FF] hover:bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg transition-colors shadow-lg shadow-[#6C63FF]/30 disabled:bg-indigo-300"
                >
                  {status === "loading" ? "Sending..." : "Send Reset Link"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
