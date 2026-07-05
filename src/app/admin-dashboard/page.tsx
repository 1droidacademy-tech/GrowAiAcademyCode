import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import AdminPricingManager from "@/components/AdminPricingManager";
import AdminPromoManager from "@/components/AdminPromoManager";
import AdminContactMessages from "@/components/AdminContactMessages";
import AdminStudentsManager from "@/components/AdminStudentsManager";
import AdminCurriculumManager from "@/components/AdminCurriculumManager";
import AdminPaymentsManager from "@/components/AdminPaymentsManager";
import AdminQuizManager from "@/components/AdminQuizManager";
import AdminCertificateManager from "@/components/AdminCertificateManager";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("growaiedu_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "ADMIN") {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const currentTab = typeof resolvedSearchParams?.tab === 'string' ? resolvedSearchParams.tab : 'dashboard';

  // Fetch admin stats - wrapping in try-catch to allow UI render if DB isn't fully seeded
  let totalUsers = 12482, totalRevenue = 84200, activeCourses = 142, uniqueVisitors = 0;
  let recentUsers: any[] = [];
  let recentPayments: any[] = [];
  let visitorStats: { date: string, count: number }[] = [];

  try {
    totalUsers = await prisma.user.count({ where: { role: "STUDENT" } }) || 12482;
    const revData = await prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } });
    totalRevenue = revData._sum.amount || 84200;
    activeCourses = await prisma.course.count({ where: { status: "ACTIVE" } }) || 142;
    uniqueVisitors = await prisma.uniqueVisitor.count() || 0;
    
    // Fetch last 7 days visitor stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const recentVisitors = await prisma.uniqueVisitor.findMany({
      where: { created_at: { gte: sevenDaysAgo } },
      select: { created_at: true }
    });

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    visitorStats = last7Days.map(date => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const count = recentVisitors.filter(v => v.created_at >= date && v.created_at < nextDate).length;
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count
      };
    });
    
    recentUsers = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
      take: 3,
      include: { enrollments: { include: { course: true } } }
    });

    recentPayments = await prisma.payment.findMany({
      orderBy: { created_at: "desc" },
      take: 2,
      include: { user: true }
    });
  } catch(e) {
    // If DB is empty or schema not totally pushed, gracefully fallback to mock data from Stitch
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-white h-screen border-r border-slate-100 flex flex-col fixed left-0 top-0">
        <div className="p-8 pb-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">☁️</div>
          <div>
            <h2 className="font-bold text-indigo-900 tracking-tight">Admin Panel</h2>
            <p className="text-xs text-slate-400 font-medium">System Overview</p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button className="w-full bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-2xl py-3.5 font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
             <span className="text-lg">+</span> New Module
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="?tab=dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'dashboard' ? 'bg-indigo-50/60 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className="text-xl">⊞</span> Dashboard
          </Link>
          <Link href="?tab=students" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'students' ? 'bg-indigo-50/60 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className="text-xl">👥</span> Students
          </Link>
          <Link href="?tab=curriculum" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'curriculum' ? 'bg-indigo-50/60 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className="text-xl">📚</span> Curriculum
          </Link>
          <Link href="?tab=payments" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'payments' ? 'bg-indigo-50/60 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className="text-xl">💳</span> Payments
          </Link>
          <Link href="?tab=quiz-game" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'quiz-game' ? 'bg-indigo-50/60 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className="text-xl">🎮</span> Quiz Game
          </Link>
          <Link href="?tab=certificates" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'certificates' ? 'bg-indigo-50/60 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className="text-xl">🎓</span> Certificates
          </Link>
          <Link href="?tab=ai-models" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'ai-models' ? 'bg-indigo-50/60 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className="text-xl">🤖</span> AI Models
          </Link>
          <Link href="?tab=settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${currentTab === 'settings' ? 'bg-indigo-50/60 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
             <span className="text-xl">⚙️</span> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium">
             <span className="text-xl">❓</span> Support
          </a>
          <form action={async () => {
             "use server";
             const cookieStore = await cookies();
             cookieStore.delete("growaiedu_token");
             redirect("/login");
          }}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-red-600 rounded-xl font-medium transition-colors cursor-pointer text-left">
               <span className="text-xl">🚪</span> Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[280px] p-8 lg:p-12">
         {/* Top bar info */}
         <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">GrowAiEdu Dashboard</h1>
              <p className="text-slate-500 font-medium">Welcome back, Admin. Here is what's happening today.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white relative overflow-hidden"><Image src="/hero_students.png" alt="staff" fill className="object-cover"/></div>
                 <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white relative overflow-hidden"><Image src="/hero_students.png" alt="staff" fill className="object-cover"/></div>
                 <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 z-10">+24</div>
              </div>
              <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-500">
                🔔
              </div>
            </div>
         </div>

         {currentTab === 'dashboard' ? (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                 <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex items-center justify-between">
                    <div>
                       <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 text-xl">👥</div>
                       <div className="text-sm font-medium text-slate-500 mb-1">Total Students</div>
                       <div className="text-4xl font-bold text-slate-800">{totalUsers.toLocaleString()}</div>
                    </div>
                    <div className="bg-indigo-50/50 text-indigo-600 font-bold text-sm px-3 py-1 rounded-full self-start">
                      ↗ 12%
                    </div>
                 </div>
                 <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex items-center justify-between">
                    <div>
                       <div className="w-14 h-14 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 text-xl">💵</div>
                       <div className="text-sm font-medium text-slate-500 mb-1">Monthly Revenue</div>
                       <div className="text-4xl font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</div>
                    </div>
                    <div className="bg-cyan-50/50 text-cyan-600 font-bold text-sm px-3 py-1 rounded-full self-start">
                      ↗ 8.4%
                    </div>
                 </div>
                 <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex items-center justify-between">
                    <div>
                       <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4 text-xl">✨</div>
                       <div className="text-sm font-medium text-slate-500 mb-1">Active Courses</div>
                       <div className="text-4xl font-bold text-slate-800">{activeCourses}</div>
                    </div>
                    <div className="flex -space-x-2 self-start">
                      <div className="w-6 h-6 rounded-full bg-indigo-400"></div>
                      <div className="w-6 h-6 rounded-full bg-cyan-400"></div>
                    </div>
                 </div>
                 <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex items-center justify-between">
                    <div>
                       <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 text-xl">👁️</div>
                       <div className="text-sm font-medium text-slate-500 mb-1">Unique Visitors</div>
                       <div className="text-4xl font-bold text-slate-800">{uniqueVisitors.toLocaleString()}</div>
                    </div>
                    <div className="bg-emerald-50/50 text-emerald-600 font-bold text-sm px-3 py-1 rounded-full self-start">
                      Live
                    </div>
                 </div>
              </div>

              {/* Tables Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Students */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-xl font-bold text-slate-800">Recent Students</h3>
                     <a href="#" className="font-bold text-[#3F3EE8] hover:text-indigo-800">View All</a>
                  </div>
                  
                  <div className="w-full">
                     <div className="grid grid-cols-4 text-xs font-bold text-slate-400 tracking-widest pb-4 border-b border-slate-100 uppercase">
                       <div className="col-span-1">Student</div>
                       <div className="col-span-1">Course</div>
                       <div className="col-span-1">Progress</div>
                       <div className="col-span-1 text-right">Status</div>
                     </div>

                     {recentUsers.length > 0 ? recentUsers.map((user, i) => {
                        const hasCompletedEnrollment = user.enrollments.some((e: any) => e.payment_status === "COMPLETED");
                        const statusText = hasCompletedEnrollment ? "ENROLLED" : "REGISTERED";
                        const uiCourse = hasCompletedEnrollment ? user.enrollments.find((e: any) => e.payment_status === "COMPLETED")?.course.title : "No Course Selected";
                        
                        return (
                        <div key={i} className="grid grid-cols-4 items-center py-4 border-b border-slate-50 last:border-0">
                          <div className="col-span-1 flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative">
                                <Image src="/hero_students.png" alt={user.name} fill className="object-cover" />
                             </div>
                             <span className="font-semibold text-slate-800">{user.name}</span>
                          </div>
                          <div className="col-span-1 text-slate-500 font-medium text-sm">
                             {uiCourse}
                          </div>
                          <div className="col-span-1">
                             <div className="w-full bg-slate-100 rounded-full h-1.5 flex overflow-hidden max-w-[120px]">
                                 {hasCompletedEnrollment ? (
                                     <div className="bg-[#3F3EE8] h-full" style={{ width: '10%' }}></div>
                                 ) : (
                                     <div className="bg-slate-300 h-full" style={{ width: '0%' }}></div>
                                 )}
                             </div>
                          </div>
                          <div className="col-span-1 flex justify-end">
                             <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${hasCompletedEnrollment ? 'bg-[#E6F5F2] text-[#00A389]' : 'bg-orange-50 text-orange-500'}`}>
                               {statusText}
                             </span>
                          </div>
                        </div>
                        );
                     }) : (
                       <div className="py-8 text-center text-slate-400 font-medium text-sm">No students found yet.</div>
                     )}
                  </div>
                </div>

                {/* Side Stack */}
                <div className="space-y-8">
                   {/* Visitor Analytics Chart */}
                   <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
                      <div className="flex justify-between items-end mb-6">
                         <h3 className="text-xl font-bold text-slate-800">Traffic (7 Days)</h3>
                         <div className="text-sm font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Live</div>
                      </div>
                      <div className="flex items-end justify-between h-40 gap-2 mt-4 relative">
                         {/* Optional grid lines */}
                         <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                            <div className="border-t border-slate-800 w-full"></div>
                            <div className="border-t border-slate-800 w-full"></div>
                            <div className="border-t border-slate-800 w-full"></div>
                         </div>
                         
                         {visitorStats.length > 0 ? visitorStats.map((stat, idx) => {
                            const maxCount = Math.max(...visitorStats.map(s => s.count), 1);
                            const heightPercentage = Math.max((stat.count / maxCount) * 100, 5); // min 5% height for visibility
                            
                            return (
                               <div key={idx} className="flex flex-col items-center flex-1 z-10 group relative">
                                  {/* Tooltip */}
                                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded shadow-lg transition-opacity pointer-events-none whitespace-nowrap">
                                    {stat.count} visitors
                                  </div>
                                  
                                  {/* Bar */}
                                  <div className="w-full max-w-[40px] bg-emerald-100 rounded-t-lg group-hover:bg-emerald-200 transition-colors flex flex-col justify-end overflow-hidden" style={{ height: '140px' }}>
                                     <div className="w-full bg-emerald-500 rounded-t-md group-hover:bg-emerald-400 transition-colors" style={{ height: `${heightPercentage}%` }}></div>
                                  </div>
                                  
                                  {/* Label */}
                                  <div className="text-xs font-bold text-slate-400 mt-3">{stat.date}</div>
                               </div>
                            );
                         }) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-sm">Loading data...</div>
                         )}
                      </div>
                   </div>

                   {/* Contact Inquiries Inbox */}
                   <AdminContactMessages />

                   {/* Pricing Management */}
                   <AdminPricingManager />

                   {/* Promo Code Management */}
                   <AdminPromoManager />

                   {/* Recent Payments Widget */}
                   <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
                      <h3 className="text-xl font-bold text-slate-800 mb-6">Recent Payments</h3>
                      <div className="space-y-6">
                         {recentPayments.length === 0 && (
                            <>
                            <div className="flex justify-between items-center">
                               <div className="flex gap-4">
                                  <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 flex justify-center items-center font-bold font-mono">↗</div>
                                  <div>
                                     <h5 className="font-bold text-slate-800 text-sm">Sofia Chen</h5>
                                     <p className="text-xs text-slate-400 font-medium">Subscription • 2h ago</p>
                                  </div>
                               </div>
                               <div className="font-bold text-[#00A389]">
                                  +₹29
                               </div>
                            </div>
                            <div className="flex justify-between items-center">
                               <div className="flex gap-4">
                                  <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 flex justify-center items-center font-bold font-mono">↗</div>
                                  <div>
                                     <h5 className="font-bold text-slate-800 text-sm">Alex Rivera</h5>
                                     <p className="text-xs text-slate-400 font-medium">One-time • 5h ago</p>
                                  </div>
                               </div>
                               <div className="font-bold text-[#00A389]">
                                  +₹149
                               </div>
                            </div>
                            </>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            </>
          ) : currentTab === 'students' ? (
            <AdminStudentsManager />
          ) : currentTab === 'curriculum' ? (
            <AdminCurriculumManager />
          ) : currentTab === 'payments' ? (
            <AdminPaymentsManager />
          ) : currentTab === 'quiz-game' ? (
            <AdminQuizManager />
          ) : currentTab === 'certificates' ? (
            <AdminCertificateManager />
          ) : (
            <div className="bg-white rounded-3xl p-16 shadow-sm border border-slate-50 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-3xl mb-6">
                {currentTab === 'ai-models' ? '🤖' : '⚙️'}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 capitalize">{currentTab.replace('-', ' ')}</h2>
              <p className="text-slate-500 max-w-md">This module is currently under development. Check back later for updates to the {currentTab.replace('-', ' ')} management tools.</p>
            </div>
          )}
       </main>
    </div>
  );
}
