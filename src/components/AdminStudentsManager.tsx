'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminStudentsManager() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const url = searchQuery 
          ? `/api/admin/students?q=${encodeURIComponent(searchQuery)}`
          : '/api/admin/students';
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce for search
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedStudentId(expandedStudentId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex flex-col min-h-[600px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-600">👥</span> Student Directory
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and view all registered students</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 text-xs font-bold text-slate-400 tracking-widest pb-4 border-b border-slate-100 uppercase px-4">
          <div className="col-span-4">Student Details</div>
          <div className="col-span-3">Academics</div>
          <div className="col-span-3">Enrollment Status</div>
          <div className="col-span-2 text-right">Joined</div>
        </div>

        <div className="flex-1 overflow-y-auto mt-2 pr-2 custom-scrollbar space-y-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <span className="text-3xl mb-2">📭</span>
              <p className="font-medium">No students found</p>
            </div>
          ) : (
            students.map((student) => {
              const hasCompletedEnrollment = student.enrollments.some((e: any) => e.payment_status === "COMPLETED");
              const isExpanded = expandedStudentId === student.id;

              return (
                <div key={student.id} className={`border rounded-2xl transition-all duration-200 ${isExpanded ? 'border-indigo-300 shadow-md bg-indigo-50/10' : 'border-slate-100 bg-white hover:border-indigo-100 hover:bg-slate-50'}`}>
                  <div 
                    className="grid grid-cols-12 items-center p-4 cursor-pointer"
                    onClick={() => toggleExpand(student.id)}
                  >
                    {/* Student Details */}
                    <div className="col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden relative shrink-0">
                        <Image src="/hero_students.png" alt={student.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{student.name}</p>
                        <p className="text-xs font-medium text-slate-500 truncate">{student.email}</p>
                      </div>
                    </div>

                    {/* Academics */}
                    <div className="col-span-3">
                      <p className="text-sm font-semibold text-slate-700 truncate">{student.school_name || "Not specified"}</p>
                      <p className="text-xs font-medium text-slate-400">Class: {student.class_grade || "N/A"}</p>
                    </div>

                    {/* Enrollment Status */}
                    <div className="col-span-3">
                      {hasCompletedEnrollment ? (
                        <div className="flex flex-col items-start">
                          <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#E6F5F2] text-[#00A389] mb-1">
                            Enrolled
                          </span>
                          <span className="text-xs font-medium text-slate-500 truncate max-w-full">
                            {student.enrollments.find((e: any) => e.payment_status === "COMPLETED")?.course.title}
                          </span>
                        </div>
                      ) : (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-500">
                          Registered Only
                        </span>
                      )}
                    </div>

                    {/* Joined Date */}
                    <div className="col-span-2 flex items-center justify-end gap-3 text-right">
                      <div className="text-sm font-medium text-slate-500">
                        {new Date(student.created_at).toLocaleDateString()}
                      </div>
                      <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <span className="text-slate-400 text-xs">▼</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-white rounded-b-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        
                        {/* Contact Info */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contact Information</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">📞</span>
                              <span className="text-sm font-semibold text-slate-700">{student.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">✉️</span>
                              <span className="text-sm font-semibold text-slate-700">{student.email}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-2">
                            <a 
                              href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100 flex items-center gap-1"
                            >
                              Message WhatsApp
                            </a>
                          </div>
                        </div>

                        {/* Course Enrollments */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Enrollment History</h4>
                          {student.enrollments.length > 0 ? (
                            <div className="space-y-2">
                              {student.enrollments.map((enrollment: any) => (
                                <div key={enrollment.id} className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-lg">
                                  <div className="min-w-0 flex-1 pr-2">
                                    <p className="text-sm font-semibold text-slate-700 truncate">{enrollment.course.title}</p>
                                    <p className="text-[10px] font-medium text-slate-400">{new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                      enrollment.payment_status === 'COMPLETED' ? 'bg-[#E6F5F2] text-[#00A389]' : 'bg-rose-50 text-rose-500'
                                    }`}>
                                      {enrollment.payment_status === 'COMPLETED' ? 'PAID' : enrollment.payment_status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 italic">No courses enrolled yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
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
