import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

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

  // Fetch actual user and enrollments
  const user = await prisma.user.findUnique({ where: { id: decoded.id as string } });
  
  const enrollments = await prisma.enrollment.findMany({
    where: { 
      user_id: decoded.id as string, 
      payment_status: "COMPLETED" 
    },
    include: {
      course: true,
    }
  });

  const firstName = user?.name ? user.name.split(" ")[0] : "Student";

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-[2rem] p-10 text-white shadow-xl relative overflow-hidden mb-8">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
           <h1 className="text-3xl font-bold tracking-tight mb-2 relative z-10">Welcome back, {firstName}.</h1>
           <p className="text-white/80 font-medium relative z-10">Your learning journey continues here.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Your Enrolled Courses</h2>
            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((enrollment, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                     <div>
                       <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl mb-4 shadow-inner border border-indigo-100">
                         🧠
                       </div>
                       <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{enrollment.course.title}</h3>
                       <p className="text-sm text-slate-500 mb-6 line-clamp-2">{enrollment.course.description}</p>
                     </div>
                     
                     <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                       <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">ACTIVE</div>
                       <button className="text-sm font-bold text-[#3F3EE8] hover:text-indigo-800 transition-colors cursor-pointer">Start Learning →</button>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🚀</div>
                <h3 className="text-lg font-bold text-slate-800">No courses enrolled yet.</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Explore our syllabus and start learning the future of AI today.</p>
                <a href="/course/ai-bootcamp" className="inline-block mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors">
                  Curriculum
                </a>
              </div>
            )}
          </div>

          {/* AI Game Zone Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[340px] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all border border-indigo-800/30 group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-2xl group-hover:bg-indigo-600/30 transition-all"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-2xl border border-indigo-400/20 shadow-lg">
                  🎮
                </div>
                <h3 className="text-2xl font-bold tracking-tight">AI Game Zone</h3>
                <p className="text-indigo-200/80 text-sm font-medium leading-relaxed">
                  Put your AI expertise to the test! Play interactive, time-bound quizzes on Prompting, Machine Learning, AI Models, and NLP. Emerge on top and earn elite mastery badges.
                </p>
              </div>

              <div className="relative z-10 pt-8">
                <a 
                  href="/student-dashboard/games" 
                  className="w-full py-4 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm cursor-pointer"
                >
                  🚀 Enter Game Zone
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
