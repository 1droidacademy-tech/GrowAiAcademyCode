"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    school_name: "",
    class_grade: "Grade 8",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          throw new Error(data.message || "Registration failed");
        } else {
          const text = await res.text();
          console.error("Server returned non-JSON error:", text);
          throw new Error("Server error: " + text.substring(0, 100));
        }
      }

      router.push("/student-dashboard");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message);
      setLoading(false);
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
                 <Image src="/hero_students.png" alt="User" fill className="object-cover" />
              </div>
              <div className="text-sm text-cyan-400 font-medium">— Alex, 16</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6 float-right">
              👋
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="mt-2 text-slate-500">Enter your details and begin your journey.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-600">Full Name</label>
                 <input 
                   type="text" required
                   className="w-full bg-slate-100 rounded-xl px-4 py-3 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                   value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-600">Email Address</label>
                 <input 
                   type="email" required
                   className="w-full bg-slate-100 rounded-xl px-4 py-3 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                   value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                 />
              </div>
              <div className="space-y-1 mt-2">
                 <label className="text-xs font-bold text-slate-600">Phone Number</label>
                 <input 
                   type="tel" required
                   className="w-full bg-slate-100 rounded-xl px-4 py-3 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                   value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 />
              </div>
              <div className="space-y-1 mt-2">
                 <label className="text-xs font-bold text-slate-600">School Name</label>
                 <input 
                   type="text"
                   className="w-full bg-slate-100 rounded-xl px-4 py-3 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                   value={formData.school_name} onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                 />
              </div>
              <div className="space-y-1 mt-2">
                 <label className="text-xs font-bold text-slate-600">Class/Grade</label>
                 <select 
                   className="w-full bg-slate-100 rounded-xl px-4 py-3 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none" 
                   value={formData.class_grade} onChange={(e) => setFormData({...formData, class_grade: e.target.value})}
                 >
                    <option>Grade 6</option>
                    <option>Grade 7</option>
                    <option>Grade 8</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11</option>
                    <option>Grade 12</option>
                 </select>
              </div>
              <div className="space-y-1 mt-2">
                 <label className="text-xs font-bold text-slate-600">Password</label>
                 <input 
                   type="password" required
                   className="w-full bg-slate-100 rounded-xl px-4 py-3 bg-opacity-70 border-none focus:ring-2 focus:ring-indigo-500 font-medium tracking-widest" 
                   value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                 />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#6C63FF] hover:bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg transition-colors shadow-lg shadow-[#6C63FF]/30 mt-4"
            >
              {loading ? "Registering..." : "Register Now"}
            </button>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs font-bold text-slate-400 bg-[#F8FAFC] px-4 uppercase tracking-widest">or</div>
            </div>

            <Link href="/login" className="block w-full">
              <button type="button" className="w-full bg-slate-200 hover:bg-slate-300 text-indigo-900 rounded-xl py-4 font-bold transition-colors">
                Login to Account
              </button>
            </Link>
          </form>

          <div className="pt-8 flex items-center justify-center gap-4 text-sm font-medium text-slate-500">
             <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center border-[2px] border-white z-20"></div>
                 <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center border-[2px] border-white z-10"></div>
                 <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center border-[2px] border-white z-0"></div>
             </div>
             <span>Join 15k+ students today</span>
          </div>
        </div>
      </div>
    </main>
  );
}
