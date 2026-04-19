'use client';

import { useState, useEffect } from 'react';

export default function AdminPricingManager() {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [earlyDiscount, setEarlyDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/course')
      .then(res => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.json();
      })
      .then(data => {
        setCourse(data);
        setPrice(data.price ?? 0);
        setEarlyDiscount(data.early_discount ?? 0);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setMessage('Failed to load course data.');
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/course', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: course.id,
          price: Number(price),
          early_discount: Number(earlyDiscount)
        })
      });
      if (res.ok) {
        setMessage('Pricing updated successfully!');
      } else {
        setMessage('Failed to update pricing.');
      }
    } catch (err) {
      setMessage('Error updating pricing.');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-slate-500">Loading Pricing...</div>;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="text-indigo-600">🏷️</span> Course Pricing
      </h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Base Tuition (₹)</label>
            <input 
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Early Discount (₹)</label>
            <input 
              type="number"
              value={earlyDiscount}
              onChange={(e) => setEarlyDiscount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-sm font-bold text-indigo-900">Calculated Student Price:</span>
            <span className="text-xl font-black text-indigo-600">₹{(price - earlyDiscount).toLocaleString()}</span>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3.5 font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Base Pricing'}
        </button>

        {message && (
          <p className={`text-center text-sm font-bold ${message.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
