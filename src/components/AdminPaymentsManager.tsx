'use client';

import { useState, useEffect } from 'react';

export default function AdminPaymentsManager() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.set('q', searchQuery);
        if (statusFilter) queryParams.set('status', statusFilter);
        
        const url = `/api/admin/payments${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce for search
    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const calculateTotalVolume = () => {
    return payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex flex-col min-h-[600px]">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-1">
            <span className="text-indigo-600">💳</span> Transaction Ledger
          </h3>
          <p className="text-sm font-medium text-slate-500">Monitor all platform payments and enrollments</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Status Filter */}
          <select
            className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl bg-slate-50 font-medium text-slate-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search ID, Name, or Email..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-50">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Filtered Volume</div>
            <div className="text-2xl font-bold text-indigo-900">₹{calculateTotalVolume().toLocaleString()}</div>
         </div>
         <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Count</div>
            <div className="text-2xl font-bold text-slate-700">{payments.length}</div>
         </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 text-xs font-bold text-slate-400 tracking-widest pb-4 border-b border-slate-100 uppercase px-4">
          <div className="col-span-3">Date & Time</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Purchase</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        <div className="flex-1 overflow-y-auto mt-2 pr-2 custom-scrollbar space-y-2">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <span className="text-3xl mb-2">📄</span>
              <p className="font-medium">No transactions found</p>
            </div>
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="grid grid-cols-12 items-center p-4 border border-slate-100 bg-white rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                {/* Date & Time */}
                <div className="col-span-3">
                  <p className="font-semibold text-slate-800">{new Date(payment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  <p className="text-[10px] font-bold text-slate-400">{new Date(payment.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                {/* Customer */}
                <div className="col-span-3 pr-2">
                  <p className="font-bold text-slate-800 truncate" title={payment.user?.name}>{payment.user?.name || 'Unknown User'}</p>
                  <p className="text-xs font-medium text-slate-500 truncate" title={payment.user?.email}>{payment.user?.email || 'N/A'}</p>
                </div>

                {/* Purchase */}
                <div className="col-span-3 pr-2">
                  <p className="text-sm font-semibold text-slate-700 line-clamp-1" title={payment.course?.title}>{payment.course?.title || 'Unknown Course'}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 truncate" title={payment.razorpay_payment_id || payment.id}>
                    ID: {payment.razorpay_payment_id || payment.id.substring(0, 12)}
                  </p>
                </div>

                {/* Amount */}
                <div className="col-span-2 text-right">
                  <p className="text-lg font-bold text-slate-900">₹{payment.amount.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{payment.payment_gateway}</p>
                </div>

                {/* Status */}
                <div className="col-span-1 flex justify-end">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    payment.status === 'SUCCESS' ? 'bg-[#E6F5F2] text-[#00A389]' : 
                    payment.status === 'FAILED' ? 'bg-rose-50 text-rose-500' : 
                    'bg-amber-50 text-amber-500'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))
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
