'use client';

import { useState, useEffect } from 'react';

export default function AdminContactMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (!res.ok) {
        setMessages([]);
        return;
      }
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="text-indigo-600">📩</span> Student Inquiries
        </h3>
        <button onClick={fetchMessages} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Refresh</button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-[500px]">
        {loading ? (
          <p className="text-center text-slate-400 text-sm py-8 italic uppercase tracking-widest text-[10px]">Loading Messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8 italic uppercase tracking-widest text-[10px]">No messages yet</p>
        ) : messages.map((msg) => (
          <div 
            key={msg.id} 
            onClick={() => setSelectedMessage(msg.id === selectedMessage?.id ? null : msg)}
            className={`cursor-pointer p-4 bg-white border rounded-2xl transition-all group ${selectedMessage?.id === msg.id ? 'border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-slate-100 hover:border-indigo-200'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-slate-900 text-sm">{msg.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-300">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
                <button 
                  onClick={(e) => handleDelete(msg.id, e)}
                  className="w-6 h-6 flex items-center justify-center text-slate-200 hover:text-rose-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <p className={`text-xs text-slate-600 leading-relaxed ${selectedMessage?.id === msg.id ? '' : 'line-clamp-2'}`}>
              {msg.message}
            </p>
            
            {selectedMessage?.id === msg.id && (
              <div className="mt-4 pt-4 border-t border-indigo-50 space-y-3">
                <div className="flex items-center gap-2">
                   <div className="text-[10px] font-bold text-indigo-400">PHONE:</div>
                   <div className="text-xs font-bold text-slate-700">{msg.phone}</div>
                </div>
                <div className="flex gap-2">
                   <a 
                     href={`mailto:${msg.email}`} 
                     className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                   >
                     Reply via Email
                   </a>
                   <a 
                     href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`} 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                   >
                     WhatsApp
                   </a>
                </div>
              </div>
            )}
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
