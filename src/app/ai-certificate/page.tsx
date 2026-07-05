'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function CertificateVerifier() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      setCertId(queryId);
      verifyCertificate(queryId);
    }
  }, [searchParams]);

  const verifyCertificate = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setCertificate(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(id.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setCertificate(data);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Verification failed. Certificate ID not found.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    
    // Update URL query parameters for easy sharing
    const params = new URLSearchParams();
    params.set('id', certId.trim());
    router.push(`?${params.toString()}`);
    
    verifyCertificate(certId);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
          🎓 Credential Validation
        </span>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">AI Certificate Verification</h1>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">
          Enter the unique certificate serial number to authenticate the student completion record issued by GrowAiEdu.
        </p>
      </div>

      {/* Input Console */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-3.5 text-slate-400 text-sm">🎫</span>
            <input
              type="text"
              placeholder="Enter ID, e.g. GAE-2026-A4B7D"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-2xl px-4 py-3 pl-10 text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#3F3EE8] hover:bg-indigo-700 text-white font-bold rounded-2xl px-8 py-3.5 text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-indigo-200 rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              'Verify Credential'
            )}
          </button>
        </form>
      </div>

      {/* Verification Display */}
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-indigo-150 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-xs font-semibold">Running verification scripts...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-md text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 border border-rose-100 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
              ❌
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">Verification Failed</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                {error} Please check the spelling or format of the serial code and try again.
              </p>
            </div>
          </div>
        ) : certificate ? (
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-indigo-900/40 relative overflow-hidden animate-in zoom-in-95 duration-200 group">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/15 transition-all"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl"></div>
            
            {/* Certificate Header stamps */}
            <div className="flex justify-between items-start gap-4 border-b border-indigo-900/50 pb-6 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">GROWAIEDU VERIFIED CREDENTIAL</span>
                <h3 className="font-extrabold text-lg tracking-tight text-white">OFFICIAL GRADUATION CERTIFICATE</h3>
              </div>
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                ✓ VALID
              </div>
            </div>

            {/* Certificate Core details */}
            <div className="py-10 space-y-8 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-indigo-400/80 uppercase tracking-widest block">ISSUED TO STUDENT</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white font-serif">{certificate.student_name}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-indigo-900/30">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-400/80 uppercase tracking-widest block">COMPLETED COURSE MODULE</span>
                  <h4 className="text-lg font-bold text-white leading-snug">{certificate.course_title}</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-indigo-400/80 uppercase tracking-widest block">ISSUE DATE</span>
                    <p className="text-sm font-bold text-slate-200">
                      {new Date(certificate.issue_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {certificate.grade && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-indigo-400/80 uppercase tracking-widest block">AWARD GRADE</span>
                      <p className="text-sm font-bold text-emerald-400">{certificate.grade}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Certificate Footer metadata */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-indigo-900/50 pt-6 relative z-10 text-xs text-indigo-300 font-medium">
              <div className="space-y-1 text-center sm:text-left">
                <span>SERIAL: </span>
                <span className="font-mono font-bold text-white tracking-wider">{certificate.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-[10px] tracking-wider text-emerald-400 uppercase">growaiedu.com</span>
              </div>
            </div>
          </div>
        ) : searched && (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center text-slate-400 font-semibold italic text-sm">
            Please search for a credential above to display the validation report.
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicCertVerificationPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-150 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-xs font-semibold">Loading portal...</p>
          </div>
        }>
          <CertificateVerifier />
        </Suspense>
      </div>
    </main>
  );
}
