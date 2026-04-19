'use client';

import { useState, useEffect } from 'react';

export default function AdminPromoManager() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const res = await fetch('/api/admin/promocodes');
      if (!res.ok) {
        setPromos([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setPromos(data);
      } else {
        setPromos([]);
      }
    } catch (err) {
      setPromos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/promocodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, discount })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Promo code ' + code + ' added successfully!');
        setCode('');
        setDiscount(0);
        fetchPromos();
      } else {
        setMessage(data.message || 'Failed to add code.');
      }
    } catch (err) {
      setMessage('Network error while adding promo code.');
    }
    setAdding(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await fetch('/api/admin/promocodes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus })
      });
      fetchPromos();
    } catch (err) {
      console.error('Error toggling promo:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      await fetch(`/api/admin/promocodes?id=${id}`, {
        method: 'DELETE'
      });
      fetchPromos();
    } catch (err) {
      console.error('Error deleting promo:', err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="text-purple-600">🎟️</span> Promo Codes
      </h3>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="flex-1">
          <input 
            type="text"
            placeholder="PROMOCODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
        <div className="w-24">
          <input 
            type="number"
            placeholder="Disc"
            value={discount || ''}
            onChange={(e) => setDiscount(Number(e.target.value))}
            required
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
        </div>
        <button 
          type="submit"
          disabled={adding}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20 disabled:opacity-50"
        >
          {adding ? '...' : 'Add'}
        </button>
      </form>

      {message && <p className="text-xs font-bold text-center mb-4 text-rose-500">{message}</p>}

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <p className="text-center text-slate-400 text-sm py-8">Loading Promos...</p>
        ) : promos.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8 italic uppercase tracking-widest text-[10px]">No Active Promos</p>
        ) : promos.map((promo) => (
          <div key={promo.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-purple-200 transition-all group">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${promo.is_active ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-300'}`}></span>
                <span className={`font-black tracking-widest text-sm ${promo.is_active ? 'text-slate-800' : 'text-slate-400'}`}>{promo.code}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">₹{promo.discount.toLocaleString()} DISCOUNT</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleToggle(promo.id, promo.is_active)}
                className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-colors ${promo.is_active ? 'bg-slate-100 text-slate-500' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}
              >
                {promo.is_active ? 'DEACTIVATE' : 'ACTIVATE'}
              </button>
              <button 
                onClick={() => handleDelete(promo.id)}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
