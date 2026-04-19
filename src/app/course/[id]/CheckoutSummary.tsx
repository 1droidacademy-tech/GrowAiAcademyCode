'use client';

import { useState } from 'react';
import EnrollButton from './EnrollButton';

interface CheckoutSummaryProps {
  courseId: string;
  isLoggedIn: boolean;
  basePrice: number;
  earlyDiscount: number;
}

export default function CheckoutSummary({ courseId, isLoggedIn, basePrice, earlyDiscount }: CheckoutSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setValidating(true);
    setError('');
    try {
      const res = await fetch('/api/promocodes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode })
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedPromo({ code: promoCode, discount: data.discount });
        setPromoCode('');
      } else {
        setError(data.message || 'Invalid promo code');
      }
    } catch (err) {
      setError('Error validating code');
    }
    setValidating(false);
  };

  const total = basePrice - earlyDiscount - (appliedPromo?.discount || 0);

  return (
    <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
      <h2 className="text-xl font-bold text-slate-800 mb-8">Enrollment Summary</h2>
      
      <div className="space-y-4 text-sm font-medium border-b border-slate-100 pb-6 mb-6">
        <div className="flex justify-between items-center">
            <span className="text-slate-500">Base Tuition</span>
            <span className="text-slate-800 font-bold">₹{basePrice.toLocaleString()}.00</span>
        </div>
        {earlyDiscount > 0 && (
          <div className="flex justify-between items-center">
              <span className="text-slate-500">Early Access Discount</span>
              <span className="text-indigo-600 font-bold">-₹{earlyDiscount.toLocaleString()}.00</span>
          </div>
        )}
        {appliedPromo && (
          <div className="flex justify-between items-center bg-emerald-50 p-2 rounded-lg border border-emerald-100">
              <span className="text-emerald-700 font-bold">Promo: {appliedPromo.code}</span>
              <span className="text-emerald-700 font-bold">-₹{appliedPromo.discount.toLocaleString()}.00</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end mb-8 text-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</div>
          <div className="flex items-center gap-3">
            <div className="text-4xl font-extrabold tracking-tight">₹{Math.max(0, total).toLocaleString()}.00</div>
            <div className="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest leading-none mb-1">Lifetime</div>
          </div>
      </div>

      {/* Promo Code Input */}
      {!appliedPromo && (
        <div className="mb-8">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="ENTER PROMO CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button 
                  onClick={handleApplyPromo}
                  disabled={validating || !promoCode}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  {validating ? '...' : 'APPLY'}
                </button>
            </div>
            {error && <p className="text-[10px] font-bold text-rose-500 mt-2 px-1">{error}</p>}
        </div>
      )}

      <div className="space-y-4 mb-8">
        <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-50 cursor-pointer transition-colors relative overflow-hidden">
          <input type="radio" name="paymentType" value="onetime" defaultChecked className="mt-1 w-5 h-5 accent-indigo-600" />
          <div>
              <div className="font-bold text-slate-900">One-time Payment</div>
              <div className="text-xs text-slate-500 mt-0.5">Full access immediately</div>
          </div>
        </label>
      </div>

      <EnrollButton 
        courseId={courseId} 
        isLoggedIn={isLoggedIn} 
        promoCode={appliedPromo?.code}
      />
      
      <div className="mt-4 flex justify-center text-xs font-medium text-slate-400">
        🔒 Encrypted secure 256-bit checkout by Razorpay
      </div>
    </div>
  );
}
