"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No reset token provided. Please request a new link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      setMessage(data.message);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      console.error("Reset password error:", err);
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
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">New Password</h2>
            <p className="mt-2 text-slate-500">Create a secure new password for your account.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {status === "error" && <div className="text-red-500 text-sm font-medium">{message}</div>}
            {status === "success" && <div className="text-emerald-600 text-sm font-medium bg-emerald-50 p-4 rounded-xl border border-emerald-100">{message} (Redirecting to login...)</div>}

            {status !== "success" && token && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">New Password</label>
                  <input 
                    type="password" required minLength={6}
                    className="w-full bg-slate-100 rounded-xl px-4 py-4 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium tracking-widest" 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">Confirm Password</label>
                  <input 
                    type="password" required minLength={6}
                    className="w-full bg-slate-100 rounded-xl px-4 py-4 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium tracking-widest" 
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" disabled={status === "loading"}
                  className="w-full bg-[#6C63FF] hover:bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg transition-colors shadow-lg shadow-[#6C63FF]/30 disabled:bg-indigo-300"
                >
                  {status === "loading" ? "Updating..." : "Update Password"}
                </button>
              </>
            )}

            {!token && (
               <Link href="/forgot-password" className="block text-center mt-4">
               <button type="button" className="w-full bg-slate-200 hover:bg-slate-300 text-indigo-900 rounded-xl py-4 font-bold transition-colors">
                 Request New Link
               </button>
             </Link>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
