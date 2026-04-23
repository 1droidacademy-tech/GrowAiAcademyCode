"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          throw new Error(data.message || "Login failed");
        } else {
          const text = await res.text();
          console.error("Server returned non-JSON error:", text);
          throw new Error("Server error: " + text.substring(0, 100));
        }
      }

      const data = await res.json();
      // Use window.location.href for a full reload/redirect to guarantee 
      // the Server Component Navbar re-reads the fresh auth cookie.
      window.location.href = data.user.role === "ADMIN" ? "/admin-dashboard" : "/student-dashboard";
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex font-sans pt-20">
      
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between text-white p-16">
        <Image src="/ai-training-students-india.png" alt="Learn AI for beginners India with GrowAiEdu training" fill className="object-cover absolute inset-0 z-0 brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-0"></div>
        
        <div className="relative z-10 space-y-4">
           <h1 className="text-5xl font-bold tracking-tight">GrowAiEdu</h1>
           <p className="text-xl text-slate-300 max-w-sm">Unlock a futuristic universe of learning tailored to your creative spark.</p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex gap-4 items-start">
             <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
               ⚙️
             </div>
             <div>
               <h3 className="font-bold text-white">AI Powered Modules</h3>
               <p className="text-sm text-slate-400">Adaptive paths that evolve with your progress.</p>
             </div>
          </div>
          <div className="flex gap-4 items-start">
             <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
               🌌
             </div>
             <div>
               <h3 className="font-bold text-white">Virtual Labs</h3>
               <p className="text-sm text-slate-400">Experiment in a 3D sandbox without boundaries.</p>
             </div>
          </div>
          
          <div className="mt-12 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
            <p className="italic text-slate-200 text-sm mb-4">"The curriculum feels like playing a high-end game where every level unlocks a real-world skill."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 overflow-hidden relative">
                 <Image src="/ai-course-students-india.png" alt="Student learning artificial intelligence India" fill className="object-cover" />
              </div>
              <div className="text-sm text-cyan-400 font-medium">— Alex, 16</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6 float-right">
              👋
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-slate-500">Enter your credentials to access your dashboard.</p>
          </div>

          <form className="space-y-5 mt-8" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
            
            <div className="space-y-4">
              <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-600">Email Address</label>
                 <input 
                   type="email" required
                   className="w-full bg-slate-100 rounded-xl px-4 py-4 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                   value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                   placeholder="Your Email"
                 />
              </div>
              <div className="space-y-1">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold text-slate-600" htmlFor="password">Password</label>
                    <Link 
                      href="/forgot-password" 
                      title="Go to forgot password page" 
                      className="flex-shrink-0 text-xs font-bold text-indigo-600 hover:text-indigo-500 relative z-30 py-1 px-2 -mr-2 transition-colors inline-block"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input 
                    id="password"
                    type="password" required
                   className="w-full bg-slate-100 rounded-xl px-4 py-4 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium tracking-widest" 
                   value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                 />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#6C63FF] hover:bg-indigo-600 text-white rounded-xl py-4 mt-6 font-bold text-lg transition-colors shadow-lg shadow-[#6C63FF]/30"
            >
              {loading ? "Authenticating..." : "Login to Account"}
            </button>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs font-bold text-slate-400 bg-[#F8FAFC] px-4 uppercase tracking-widest">or</div>
            </div>

            <Link href="/signup" className="block w-full">
              <button type="button" className="w-full bg-slate-200 hover:bg-slate-300 text-indigo-900 rounded-xl py-4 font-bold transition-colors">
                Register New Profile
              </button>
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}
