"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20 pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            Let's Build the <span className="text-cyan-600">Future</span> Together.
          </h1>
          <p className="text-lg text-slate-500">
            Have a question about our AI curriculum or want to partner with us? Our cosmic support team is ready to guide you.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Form */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 h-full">
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Name</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-100 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 font-medium"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-slate-100 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 font-medium"
                    placeholder="student@growaiedu.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 relative pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</label>
                <input
                  type="tel"
                  className="w-full bg-slate-100 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 font-medium"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2 flex-grow pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message</label>
                <textarea
                  required
                  className="w-full h-[140px] bg-slate-100 border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-indigo-500 font-medium resize-none"
                  placeholder="How can we help you explore GrowAiEdu?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-[#6C63FF] hover:bg-indigo-600 text-white rounded-2xl py-4 font-bold text-lg transition-colors flex items-center justify-center gap-2 mt-auto disabled:bg-indigo-300"
              >
                Launch Message 🚀
              </button>
              
              {status === "success" && (
                <p className="text-green-600 font-medium text-center pt-2">Message sent successfully!</p>
              )}
            </form>
          </div>

          {/* Right Column: Info & Map */}
          <div className="space-y-8 flex flex-col">
            
            {/* Contact Info Block */}
            <div className="bg-[#F8FAFC] p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Us</div>
                  <div className="font-bold text-slate-800">hello@growaiedu.com</div>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                  <div className="flex gap-2 text-lg text-slate-600 font-mono tracking-widest font-bold">
                    <span>X</span><span>D</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Social Channels</div>
                  <div className="flex gap-3 text-slate-400 mt-1">
                     <span>🌐</span>
                     <span>＠</span>
                     <span>👾</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Block */}
            <div className="relative flex-grow min-h-[220px] rounded-[2rem] overflow-hidden group">
              <Image src="/dark_map.png" alt="Map" fill className="object-cover transition-transform group-hover:scale-105 duration-700" />
              <div className="absolute top-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/20 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Our Lab</div>
                    <div className="font-semibold text-slate-800">88 Nebula Drive, Silicon Valley, CA</div>
                  </div>
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-md shadow-indigo-500/40">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat Block */}
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6C63FF] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg h-[160px] flex flex-col justify-center">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 opacity-20 transform rotate-12">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4ZM8 14H16V16H8V14ZM8 10H16V12H8V10Z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-1 relative z-10">Live Chat</h3>
              <p className="text-white/80 text-sm mb-4 relative z-10">Our AI Mentor is online.</p>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm self-start px-5 py-2 rounded-full font-semibold text-sm transition-colors border border-white/10 relative z-10">
                Start Session
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
