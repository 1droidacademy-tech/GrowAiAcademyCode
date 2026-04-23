export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans pb-20 pt-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-pulse">
        
        {/* Left Side Skeleton */}
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 h-[600px]">
          <div className="h-10 bg-slate-100 rounded-xl w-3/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-slate-50 rounded w-full"></div>
            <div className="h-4 bg-slate-50 rounded w-full"></div>
            <div className="h-4 bg-slate-50 rounded w-3/4"></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="h-20 bg-slate-50 rounded-2xl"></div>
            <div className="h-20 bg-slate-50 rounded-2xl"></div>
            <div className="h-20 bg-slate-50 rounded-2xl"></div>
          </div>
        </div>

        {/* Right Side Skeleton */}
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 h-[400px]">
          <div className="h-8 bg-slate-100 rounded-xl w-1/2 mb-8"></div>
          <div className="space-y-6">
            <div className="h-12 bg-slate-50 rounded-xl w-full"></div>
            <div className="h-12 bg-slate-50 rounded-xl w-full"></div>
            <div className="h-16 bg-slate-200 rounded-2xl w-full mt-12"></div>
          </div>
        </div>

      </div>
    </main>
  );
}
