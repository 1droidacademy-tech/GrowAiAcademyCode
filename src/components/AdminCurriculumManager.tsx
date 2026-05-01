'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminCurriculumManager() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const url = searchQuery 
          ? `/api/admin/courses?q=${encodeURIComponent(searchQuery)}`
          : '/api/admin/courses';
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce for search
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex flex-col min-h-[600px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-600">📚</span> Curriculum Management
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Track course performance and active enrollments</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <span className="text-3xl mb-2">📭</span>
            <p className="font-medium">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="border border-slate-100 bg-white rounded-2xl p-6 hover:shadow-md hover:border-indigo-100 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{course.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-1">{course.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ml-4 ${course.status === 'ACTIVE' ? 'bg-[#E6F5F2] text-[#00A389]' : 'bg-slate-100 text-slate-500'}`}>
                      {course.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">
                    <span className="flex items-center gap-1">⏱️ {course.duration}</span>
                    <span className="flex items-center gap-1">📊 {course.level}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-50/50">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Active Students</div>
                    <div className="text-2xl font-bold text-indigo-900">{course.active_students}</div>
                  </div>
                  <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-50/50">
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-emerald-700">₹{course.total_revenue.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                   <div className="font-semibold text-slate-600">
                     Base Price: <span className="text-slate-800">₹{course.price.toLocaleString()}</span>
                   </div>
                   {course.early_discount > 0 && (
                     <div className="font-semibold text-orange-500">
                       Discount: ₹{course.early_discount.toLocaleString()}
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
