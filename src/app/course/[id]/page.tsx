import Link from "next/link";
import { cookies } from "next/headers";
// import EnrollButton from "./EnrollButton";
import Image from "next/image";

export default async function CourseEnrollment({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("growaiedu_token")?.value;
  const isLoggedIn = !!token;

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans pb-20 pt-24 px-6 text-slate-800">
      
      {/* Top Banner Progress step (Mock UI) */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4 bg-white px-8 py-3 rounded-full shadow-sm border border-slate-100 italic text-sm font-semibold tracking-wide">
          <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center not-italic">1</span> Summary</div>
          <div className="w-8 h-[2px] bg-slate-200"></div>
          <div className="flex items-center gap-2 text-slate-400"><span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center not-italic">2</span> Payment</div>
          <div className="w-8 h-[2px] bg-slate-200"></div>
          <div className="flex items-center gap-2 text-slate-400"><span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center not-italic">3</span> Success</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Course Detail Block */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-[2rem] border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-6 relative z-10 w-10/12">
            Mastering Neural <span className="text-[#3F3EE8]">Architectures</span>
          </h1>
          
          <p className="text-slate-600 text-lg leading-relaxed mb-10 w-11/12 relative z-10">
            Journey through the deep layers of modern AI. Learn to build, optimize, and deploy transformers that redefine intelligence.
          </p>

          <div className="flex flex-wrap gap-4 mb-10 relative z-10">
             <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-50 w-[140px]">
               <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs mb-2">⏱</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Duration</div>
               <div className="font-bold text-sm">12 Weeks</div>
             </div>
             <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-50 w-[140px]">
               <div className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs mb-2">🎓</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Level</div>
               <div className="font-bold text-sm">Advanced</div>
             </div>
             <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-50 w-[140px]">
               <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs mb-2">🏅</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Credential</div>
               <div className="font-bold text-sm">Verified</div>
             </div>
          </div>

          <div className="mb-10 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden relative border-2 border-white shadow-sm">
                 <Image src="/hero_students.png" alt="Instructor" fill className="object-cover" />
               </div>
               <div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Lead Mentor</div>
                 <div className="font-bold text-slate-800">Bharathi</div>
               </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-white flex justify-between items-center cursor-pointer hover:bg-white/80 transition-colors relative z-10 group">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">📚</div>
               <div>
                 <div className="font-bold text-sm">Curriculum Access</div>
                 <div className="text-xs text-slate-500 font-medium tracking-wide">Instant access to 48 modules</div>
               </div>
             </div>
             <div className="text-slate-400 group-hover:translate-x-1 transition-transform">→</div>
           </div>
        </div>

        {/* Right Side: Summary Block */}
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
           <h2 className="text-xl font-bold text-slate-800 mb-8">Enrollment Summary</h2>
           
           <div className="space-y-4 text-sm font-medium border-b border-slate-100 pb-6 mb-6">
              <div className="flex justify-between items-center">
                 <span className="text-slate-500">Base Tuition</span>
                 <span className="text-slate-800 font-bold">₹599.00</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-slate-500">Cloud Lab Credits</span>
                 <span className="text-slate-800 font-bold">₹45.00</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-slate-500">Early Access Discount</span>
                 <span className="text-indigo-600 font-bold">-₹100.00</span>
              </div>
           </div>

           <div className="flex justify-between items-end mb-10 text-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</div>
              <div className="flex items-center gap-3">
                 <div className="text-4xl font-extrabold tracking-tight">₹544.00</div>
                 <div className="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest leading-none mb-1">Lifetime</div>
              </div>
           </div>

           <div className="space-y-4 mb-8">
             <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-50 cursor-pointer transition-colors relative overflow-hidden">
               <input type="radio" name="paymentType" value="onetime" defaultChecked className="mt-1 w-5 h-5 accent-indigo-600" />
               <div>
                  <div className="font-bold text-slate-900">One-time Payment</div>
                  <div className="text-xs text-slate-500 mt-0.5">Full access immediately</div>
               </div>
             </label>
           </div>

           <button className="w-full bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-2xl py-4 font-bold text-lg transition-colors shadow-lg shadow-indigo-500/30">
              Complete Enrollment
           </button>
           
           <div className="mt-4 flex justify-center text-xs font-medium text-slate-400">
             🔒 Encrypted secure 256-bit checkout by Razorpay
           </div>
        </div>

      </div>
    </main>
  );
}
