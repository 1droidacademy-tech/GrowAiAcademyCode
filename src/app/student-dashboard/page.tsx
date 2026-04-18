import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("growaiedu_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden mb-8">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
           <h1 className="text-3xl font-bold tracking-tight mb-2 relative z-10">Welcome to GrowAiEdu.</h1>
           <p className="text-white/80 font-medium relative z-10">Your learning journey continues here.</p>
        </div>

        <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🚀</div>
          <h2 className="text-xl font-bold text-slate-800">You haven't enrolled in any courses yet.</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Visit the curriculum to discover modules that match your learning path.</p>
          <a href="/course/ai-bootcamp" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors">
            Explore Curriculum
          </a>
        </div>
      </div>
    </main>
  );
}
