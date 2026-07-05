'use client';

import { useState, useEffect } from 'react';

interface Certificate {
  id: string;
  student_name: string;
  course_title: string;
  grade: string | null;
  issue_date: string;
  created_at: string;
}

export default function AdminCertificateManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    course_title: 'AI Essentials for School Students',
    grade: '',
    issue_date: new Date().toISOString().substring(0, 10),
    custom_id: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/certificates');
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      student_name: '',
      course_title: 'AI Essentials for School Students',
      grade: '',
      issue_date: new Date().toISOString().substring(0, 10),
      custom_id: '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the certificate for ${name} (${id})?`)) return;

    try {
      const res = await fetch(`/api/admin/certificates/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCertificates(certificates.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete certificate');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchCertificates();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to issue certificate');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while issuing certificate');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const filteredCertificates = certificates.filter(
    (c) =>
      c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-600">🎓</span> Certificate Registry
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Issue and manage student AI completion records</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-2xl px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          <span className="text-xl leading-none">+</span> Issue Certificate
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Search by student name, course, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400 font-semibold"
          />
          <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total Issued: <span className="font-bold text-slate-800">{certificates.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 text-sm font-medium">Fetching certificates...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {filteredCertificates.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <span className="text-3xl">📭</span>
              <p className="font-semibold text-slate-700">No certificates found</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Issue a new certificate or adjust your search filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 tracking-wider uppercase">
                    <th className="px-6 py-4">Certificate ID</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Course Module</th>
                    <th className="px-6 py-4 text-center">Grade</th>
                    <th className="px-6 py-4 text-center">Issue Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCertificates.map((cert) => {
                    const dateStr = new Date(cert.issue_date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });

                    // Verification Link
                    const verifyUrl = `${window.location.origin}/ai-certificate?id=${cert.id}`;

                    return (
                      <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors text-slate-700 text-sm">
                        <td className="px-6 py-4.5 font-mono font-bold text-indigo-600 tracking-wider">
                          {cert.id}
                        </td>
                        <td className="px-6 py-4.5 font-bold text-slate-800">
                          {cert.student_name}
                        </td>
                        <td className="px-6 py-4.5 font-medium text-slate-500 truncate max-w-[200px]">
                          {cert.course_title}
                        </td>
                        <td className="px-6 py-4.5 text-center">
                          {cert.grade ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-xs font-bold uppercase">
                              {cert.grade}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium italic text-xs">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4.5 text-center font-medium text-slate-600">
                          {dateStr}
                        </td>
                        <td className="px-6 py-4.5 text-right flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => copyToClipboard(cert.id)}
                            title="Copy Serial ID"
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => copyToClipboard(verifyUrl)}
                            title="Copy Public Verification Link"
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                          >
                            🔗
                          </button>
                          <button
                            onClick={() => handleDelete(cert.id, cert.student_name)}
                            title="Delete Record"
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Issuing Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                🎓 Issue AI Certificate
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificate ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. GAE-AI-2026-0001 (leave blank to auto-generate)"
                  value={formData.custom_id}
                  onChange={(e) => setFormData({ ...formData, custom_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 placeholder-slate-400 uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter student's graduation name"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Title</label>
                <select
                  value={formData.course_title}
                  onChange={(e) => setFormData({ ...formData, course_title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                >
                  <option value="AI Essentials for School Students">AI Essentials for School Students</option>
                  <option value="Advanced Prompt Engineering Bootcamp">Advanced Prompt Engineering Bootcamp</option>
                  <option value="Machine Learning & Deep Learning Foundations">Machine Learning & Deep Learning Foundations</option>
                  <option value="NLP & Conversational AI Systems">NLP & Conversational AI Systems</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Award Grade (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. A+, Distinction"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-xl px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50 text-sm"
                >
                  {saving ? 'Issuing...' : 'Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
