"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-20">
      {/* Navigation Space */}
      <div className="pt-24 lg:pt-32" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm">
            Future-Ready Education India
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            The Best <span className="gradient-text">AI Course for School Students</span> in India.
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl">
            Learn Artificial Intelligence with our beginner friendly live online AI course for school students. Explore AI tools, projects and future skills with GrowAiEdu.
          </p>
          <div className="pt-4">
            <Link href="/ai-course-for-school-students/ai-bootcamp">
              <button className="bg-[#6C63FF] hover:bg-indigo-600 transition-colors text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 group">
                Join the Mission
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-1 relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-slate-900/5 rotate-2 hover:rotate-0 transition-transform duration-500">
          <Image 
            src="/hero-indian-students.jpg" 
            alt="AI course for school students learning artificial intelligence online in India" 
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Value Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Mission */}
        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
              🚀
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-slate-600 mb-8">
              To democratize AI literacy by teaching practical, ethics-first engineering and design skills. We break down the black box of algorithms into tangible, creative building blocks that any student can master.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
            <div>
              <div className="text-2xl font-bold text-indigo-600">15k+</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-500">40+</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">AI Tools</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">100%</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Hands-on</div>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-[2rem] p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-10 w-32 h-32 border-[20px] border-white/10 rounded-full blur-sm"></div>
          <h3 className="text-3xl font-bold mb-6 relative z-10">Our Vision</h3>
          <p className="text-xl text-white/90 italic font-medium leading-relaxed relative z-10">
            "To be the launchpad for the next wave of creative engineers who see AI not as a superpower."
          </p>
        </div>

        {/* Why AI Now? */}
        <div className="bg-indigo-50/50 rounded-[2rem] p-10 border border-indigo-100 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-indigo-900 mb-4">Online AI Course for Students India</h3>
            <p className="text-indigo-900/70 text-sm leading-relaxed mb-6">
              The job market is shifting. AI education isn't just about coding; it's about critical thinking, data literacy, and understanding the systems that shape our world.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-indigo-50 text-indigo-900 font-semibold text-sm">
            <span className="text-indigo-500">📈</span> 90% of future jobs will require AI literacy
          </div>
        </div>

        {/* Creativity & Innovation */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-12 shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex-1 space-y-4">
            <h3 className="text-3xl font-bold">Creativity & Innovation</h3>
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
              We prioritize the 'Human' in AI. Students don't just learn to prompt, they learn to innovate and solve real-world problems.
            </p>
          </div>
          <div className="flex-1 w-full relative h-[300px] md:h-auto md:min-h-[250px] rounded-[1.5rem] overflow-hidden bg-slate-900">
             <Image 
              src="/learn-ai-online-course.png" 
              alt="Artificial intelligence course for kids India learning AI tools" 
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* AI Tools Marquee Section */}
      <section className="mt-40 overflow-hidden py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Master the <span className="text-cyan-400">Future</span> of Technology
          </h2>
          <p className="text-slate-400 text-lg">Harness the power of industry-leading AI tools used by professionals worldwide.</p>
        </div>

        {/* Marquee effect */}
        <div className="flex flex-col gap-10">
          <div className="flex animate-marquee space-x-6 md:space-x-12 whitespace-nowrap">
            {[
              "ChatGPT", "Gemini", "NotebookLM", "Claude AI", "Heygen", 
              "Kling", "Google Veo", "Custom Gems", "Canva AI", "Midjourney",
              "ChatGPT", "Gemini", "NotebookLM", "Claude AI", "Heygen", 
              "Kling", "Google Veo", "Custom Gems", "Canva AI", "Midjourney"
            ].map((tool, index) => (
              <div key={index} className="flex items-center gap-2 md:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3 md:px-8 md:py-5 rounded-xl md:rounded-2xl">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                <span className="text-base md:text-2xl font-bold text-white tracking-wide">{tool}</span>
              </div>
            ))}
          </div>
          
          <div className="flex animate-marquee-reverse space-x-6 md:space-x-12 whitespace-nowrap">
            {[
              "Luma AI", "Replit", "ElevenLabs", "Suno", "Gamma", "Perplexity", 
              "Adobe Firefly", "Runway Gen-3", "Microsoft Copilot",
              "Luma AI", "Replit", "ElevenLabs", "Suno", "Gamma", "Perplexity", 
              "Adobe Firefly", "Runway Gen-3", "Microsoft Copilot"
            ].map((tool, index) => (
              <div key={index} className="flex items-center gap-2 md:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3 md:px-8 md:py-5 rounded-xl md:rounded-2xl">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_#818cf8]"></div>
                <span className="text-base md:text-2xl font-bold text-white tracking-wide">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beginner Friendly Section */}
      <section className="max-w-4xl mx-auto px-6 mt-32 text-center text-slate-800">
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8">
          Beginner-Friendly AI Course. <span className="text-indigo-600">Future-Focused.</span>
        </h2>
        <p className="text-lg text-slate-600">
          We've spent years refining our curriculum to ensure that even a complete novice can go from "Zero" to "AI Developer" with our AI course without coding India.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-indigo-600 mb-2">
              🎓
            </div>
            <h4 className="text-xl font-bold">Scaffolded Learning</h4>
            <p className="text-slate-500 text-sm">Complex concepts broken down into bite-sized, interactive modules that build confidence gradually.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-blue-500 mb-2">
              💬
            </div>
            <h4 className="text-xl font-bold">Live AI Classes</h4>
            <p className="text-slate-500 text-sm">Real-time feedback from industry professionals who have worked at top-tier tech firms through our live AI classes for kids India.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-purple-500 mb-2">
              🎨
            </div>
            <h4 className="text-xl font-bold">AI Certification</h4>
            <p className="text-slate-500 text-sm">Earn your AI certification for students India by completing impact-driven creative projects.</p>
          </div>
        </div>
      </section>

      {/* Giant CTA Wrap up */}
      <section className="max-w-7xl mx-auto px-6 mt-32 mb-10">
         <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-10"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">Join the best AI training for school students India.</h2>
              <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
                Join thousands of students building the future today with GrowAiEdu – the premier learn AI for beginners India destination.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/ai-course-for-school-students/ai-bootcamp">
                  <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg">
                    Enroll Now
                  </button>
                </Link>
                <Link href="/ai-course-for-school-students/ai-bootcamp">
                  <button className="bg-indigo-800/40 text-white px-8 py-4 rounded-full font-bold text-lg border border-indigo-400 hover:bg-indigo-800/60 transition-colors">
                    View Curriculum
                  </button>
                </Link>
              </div>
            </div>
         </div>
      </section>
    </main>
  );
}
