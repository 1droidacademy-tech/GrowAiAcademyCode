import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import CheckoutSummary from "./CheckoutSummary";
import Image from "next/image";
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id }
  });

  return {
    title: `Learn AI: ${course?.title || "AI Essentials"}`,
    description: `Master AI Tools with our beginner-friendly course. ${course?.description.slice(0, 150)}...`,
  }
}

export default async function CourseEnrollment({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("growaiedu_token")?.value;
  const isLoggedIn = !!token;

  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id }
  });

  const basePrice = course?.price || 3000;
  const earlyDiscount = course?.early_discount || 500;

  let isEnrolled = false;
  if (isLoggedIn && token) {
     const decoded = verifyToken(token);
     if (decoded) {
        const enrollment = await prisma.enrollment.findUnique({
           where: { user_id_course_id: { user_id: decoded.id as string, course_id: resolvedParams.id } }
        });
        if (enrollment && enrollment.payment_status === "COMPLETED") {
           isEnrolled = true;
        }
     }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans pb-20 pt-24 px-6 text-slate-800">
      
      {/* Top Banner Progress step (Mock UI) */}
      <div className="flex justify-center mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 bg-white px-6 md:px-8 py-3 md:py-3 rounded-2xl md:rounded-full shadow-sm border border-slate-100 italic text-xs md:text-sm font-semibold tracking-wide w-full md:w-auto">
          <div className="flex items-center gap-2"><span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center not-italic text-[10px] md:text-xs">1</span> Summary</div>
          <div className="hidden md:block w-8 h-[2px] bg-slate-200"></div>
          <div className="flex items-center gap-2 text-slate-400"><span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center not-italic text-[10px] md:text-xs">2</span> Payment</div>
          <div className="hidden md:block w-8 h-[2px] bg-slate-200"></div>
          <div className="flex items-center gap-2 text-slate-400"><span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center not-italic text-[10px] md:text-xs">3</span> Success</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Course Detail Block */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6 relative z-10 w-full md:w-10/12">
            AI Essentials for <span className="text-[#3F3EE8]">School Students</span>
          </h1>
          
          <p className="text-slate-600 text-sm md:text-lg leading-relaxed mb-10 w-full md:w-11/12 relative z-10 whitespace-pre-line">
            AI Essentials for School Students is a beginner-friendly course designed to introduce school students to the exciting world of Artificial Intelligence. Students will learn how AI works, explore popular AI tools, and complete fun hands-on activities that build creativity and future-ready skills.

            No prior coding knowledge is required. This course makes AI simple, practical, and enjoyable.
          </p>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 md:gap-4 mb-10 relative z-10">
             <div className="bg-white px-4 md:px-6 py-4 rounded-2xl shadow-sm border border-slate-50">
               <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs mb-2">⏱</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Duration</div>
               <div className="font-bold text-xs md:text-sm">12 Weeks</div>
             </div>
             <div className="bg-white px-4 md:px-6 py-4 rounded-2xl shadow-sm border border-slate-50">
               <div className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs mb-2">🎓</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Level</div>
               <div className="font-bold text-xs md:text-sm">Advanced</div>
             </div>
             <div className="bg-white px-4 md:px-6 py-4 rounded-2xl shadow-sm border border-slate-50 col-span-2 sm:col-span-1">
               <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs mb-2">🏅</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Credential</div>
               <div className="font-bold text-xs md:text-sm">Verified</div>
             </div>
          </div>

          <div className="mb-10 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden relative border-2 border-white shadow-sm">
                 <Image src="/hero_students.png" alt="Bharathi, Lead AI Mentor at GrowAiEdu" fill className="object-cover" />
               </div>
               <div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Lead Mentor</div>
                 <div className="font-bold text-slate-800">Bharathi</div>
               </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-6 relative z-10">What You'll Achieve</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 relative z-10">
            {[
              { icon: "💡", color: "text-blue-600 bg-blue-50", title: "AI Fundamentals", desc: "Understand what Artificial Intelligence is and how it functions from the ground up." },
              { icon: "🌍", color: "text-teal-600 bg-teal-50", title: "Real-World Impact", desc: "Learn how AI is used in real life across industries like healthcare, finance, and tech." },
              { icon: "🛠️", color: "text-indigo-600 bg-indigo-50", title: "Modern AI Toolset", desc: "Explore popular AI tools and platforms used by leading research labs and startups." },
              { icon: "✨", color: "text-purple-600 bg-purple-50", title: "Content Synthesis", desc: "Master the ability to create high-quality content using generative AI technologies." },
              { icon: "💬", color: "text-cyan-600 bg-cyan-50", title: "Prompt Engineering", desc: "Learn prompt writing skills to extract the best possible results from LLMs." },
              { icon: "🚀", color: "text-rose-600 bg-rose-50", title: "Practical Projects", desc: "Complete mini AI projects that build a portfolio-ready body of work." },
              { icon: "⚖️", color: "text-red-600 bg-red-50", title: "Ethical Frameworks", desc: "Understand responsible AI usage and the ethical implications of automation." },
              { icon: "💼", color: "text-emerald-600 bg-emerald-50", title: "Career Development", desc: "Gain awareness about AI careers and navigating the evolving job market." }
            ].map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-slate-50 flex items-start gap-4">
                <div className={`w-10 h-10 shrink-0 ${item.color} rounded-full flex items-center justify-center text-lg`}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-100/50 backdrop-blur-md px-6 py-5 rounded-2xl shadow-sm border border-white flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors relative z-10 group">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-indigo-100/50 text-indigo-600 rounded-full flex items-center justify-center">📚</div>
               <div>
                 <div className="font-bold text-slate-800 text-sm">Curriculum Access</div>
                 <div className="text-xs text-slate-500 font-medium tracking-wide">Instant access to 48 modules</div>
               </div>
             </div>
             <div className="text-slate-400 group-hover:translate-x-1 transition-transform">→</div>
           </div>
        </div>

        {/* Right Side: Summary Block */}
        {isEnrolled ? (
           <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center flex flex-col justify-center items-center">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-6">🎉</div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">You're Enrolled!</h2>
             <p className="text-slate-500 mb-8 max-w-sm">You have full access to this course. Let's start building the future together.</p>
             <Link href="/student-dashboard" className="w-full">
               <button className="w-full bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-2xl py-4 font-bold text-lg transition-colors shadow-lg shadow-indigo-500/30">
                  Go to Dashboard
               </button>
             </Link>
           </div>
        ) : (
           <CheckoutSummary 
             courseId={resolvedParams.id}
             isLoggedIn={isLoggedIn}
             basePrice={basePrice}
             earlyDiscount={earlyDiscount}
           />
        )}

      </div>
    </main>
  );
}
