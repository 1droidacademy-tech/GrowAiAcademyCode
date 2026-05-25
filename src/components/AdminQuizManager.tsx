'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  topic: string;
  timeLimit: number;
  points: number;
}

interface Attempt {
  id: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  completed_at: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminQuizManager() {
  const [activeTab, setActiveTab] = useState<'questions' | 'results'>('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    option0: '',
    option1: '',
    option2: '',
    option3: '',
    correctOption: 0,
    topic: 'ML',
    timeLimit: 30,
    points: 10,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'questions') {
        const res = await fetch('/api/admin/quiz/questions');
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } else {
        const res = await fetch('/api/admin/quiz/attempts');
        if (res.ok) {
          const data = await res.json();
          setAttempts(data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormData({
      question: '',
      option0: '',
      option1: '',
      option2: '',
      option3: '',
      correctOption: 0,
      topic: 'ML',
      timeLimit: 30,
      points: 10,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      question: q.question,
      option0: q.options[0] || '',
      option1: q.options[1] || '',
      option2: q.options[2] || '',
      option3: q.options[3] || '',
      correctOption: q.correctOption,
      topic: q.topic,
      timeLimit: q.timeLimit,
      points: q.points,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const res = await fetch(`/api/admin/quiz/questions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setQuestions(questions.filter((q) => q.id !== id));
      } else {
        alert('Failed to delete question');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      question: formData.question,
      options: [formData.option0, formData.option1, formData.option2, formData.option3],
      correctOption: formData.correctOption,
      topic: formData.topic,
      timeLimit: formData.timeLimit,
      points: formData.points,
    };

    try {
      const url = editingQuestion
        ? `/api/admin/quiz/questions/${editingQuestion.id}`
        : '/api/admin/quiz/questions';
      const method = editingQuestion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save question');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const filteredAttempts = attempts.filter(
    (a) =>
      a.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        {/* Horizontal Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'questions'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🎮 Manage Questions
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'results'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏆 Student Results
          </button>
        </div>

        {activeTab === 'questions' ? (
          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-2xl px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <span className="text-xl leading-none">+</span> Add Question
          </button>
        ) : (
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder="Search by student name/email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
            />
            <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 text-sm font-medium">Fetching records...</p>
        </div>
      ) : activeTab === 'questions' ? (
        <div className="grid grid-cols-1 gap-6">
          {questions.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">📝</div>
              <h3 className="text-lg font-bold text-slate-800">No Questions Found</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">Get started by creating your first AI quiz question.</p>
              <button
                onClick={handleOpenAdd}
                className="mt-6 px-6 py-3 bg-[#3F3EE8] text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
              >
                + Add Question
              </button>
            </div>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {q.topic}
                    </span>
                    <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-lg tracking-wider">
                      ⏱️ {q.timeLimit}s
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg tracking-wider">
                      ✨ {q.points} Pts
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg leading-snug">{q.question}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {q.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-sm flex items-center gap-3 ${
                          idx === q.correctOption
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-semibold'
                            : 'bg-slate-50/50 border-slate-100 text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                            idx === q.correctOption
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col justify-end md:justify-start items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {filteredAttempts.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <span className="text-3xl">📝</span>
              <p className="mt-3 font-semibold text-slate-700">No attempts logged yet</p>
              <p className="text-xs text-slate-400">Results will populate as soon as students complete their quizzes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 tracking-wider uppercase">
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Score %</th>
                    <th className="px-6 py-4 text-center">Accuracy</th>
                    <th className="px-6 py-4 text-center">Speed</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAttempts.map((attempt) => {
                    const dateStr = new Date(attempt.completed_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    let scoreBadge = 'bg-red-50 text-red-600';
                    if (attempt.score >= 80) scoreBadge = 'bg-emerald-50 text-emerald-600';
                    else if (attempt.score >= 50) scoreBadge = 'bg-amber-50 text-amber-600';

                    return (
                      <tr key={attempt.id} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                        <td className="px-6 py-4.5 font-bold text-slate-800">
                          {attempt.user?.name || 'Anonymous Student'}
                        </td>
                        <td className="px-6 py-4.5 font-medium text-slate-500">{attempt.user?.email || 'N/A'}</td>
                        <td className="px-6 py-4.5 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${scoreBadge}`}>
                            {attempt.score}%
                          </span>
                        </td>
                        <td className="px-6 py-4.5 text-center font-bold text-slate-600">
                          {attempt.correctAnswers} / {attempt.totalQuestions}
                        </td>
                        <td className="px-6 py-4.5 text-center font-medium text-slate-500">
                          ⏱️ {attempt.timeTaken}s
                        </td>
                        <td className="px-6 py-4.5 text-right text-xs font-semibold text-slate-400">
                          {dateStr}
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

      {/* Modal Dialog for Add/Edit MCQ Question */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingQuestion ? '✏️ Edit AI Question' : '✨ Add New AI Question'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Topic Category</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                >
                  <option value="ML">Machine Learning (ML)</option>
                  <option value="NLP">Natural Language Processing (NLP)</option>
                  <option value="Prompting">Prompting Techniques</option>
                  <option value="Models">AI Models & Architectures</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question Description</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the quiz question..."
                  required
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder-slate-400 font-medium"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">MCQ Options</label>
                
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <input
                      type="text"
                      placeholder={`Enter Option ${String.fromCharCode(65 + idx)}`}
                      value={(formData as any)[`option${idx}`]}
                      onChange={(e) => setFormData({ ...formData, [`option${idx}`]: e.target.value })}
                      required
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium placeholder-slate-400"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correct Option</label>
                  <select
                    value={formData.correctOption}
                    onChange={(e) => setFormData({ ...formData, correctOption: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time Limit (Secs)</label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Award Points</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-xl px-8 py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
