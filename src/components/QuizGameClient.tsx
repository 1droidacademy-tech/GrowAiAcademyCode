'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  options: string[];
  topic: string;
  timeLimit: number;
  points: number;
}

export default function QuizGameClient({ studentName }: { studentName: string }) {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'summary'>('lobby');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);

  // Score keeping
  const [studentAnswers, setStudentAnswers] = useState<
    { questionId: string; selectedOption: number }[]
  >([]);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    pointsScored: number;
    maxPoints: number;
    timeTaken: number;
  } | null>(null);

  // Time tracking
  const [totalTimeTaken, setTotalTimeTaken] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Confetti particles generator
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; size: number; delay: number }[]>([]);

  useEffect(() => {
    if (gameState === 'playing') {
      // Start total timer
      totalTimerRef.current = setInterval(() => {
        setTotalTimeTaken((prev) => prev + 1);
      }, 1000);
    } else {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    }

    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && questions.length > 0) {
      const currentQuestion = questions[currentIdx];
      setTimeLeft(currentQuestion.timeLimit);
      setIsAnswered(false);
      setSelectedOption(null);

      // Question Countdown Timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentIdx, questions]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    // Log as skipped (-1)
    setStudentAnswers((prev) => [
      ...prev,
      { questionId: questions[currentIdx].id, selectedOption: -1 },
    ]);
  };

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const url = selectedTopic === 'All' 
        ? '/api/student/quiz/questions' 
        : `/api/student/quiz/questions?topic=${encodeURIComponent(selectedTopic)}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0) {
          alert('No questions found in this category! Please choose another category or manage questions in the Admin dashboard.');
        } else {
          setQuestions(data);
          setCurrentIdx(0);
          setStudentAnswers([]);
          setTotalTimeTaken(0);
          setGameState('playing');
        }
      } else {
        alert('Failed to load quiz questions.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optIdx: number) => {
    if (isAnswered) return; // Prevent clicking multiple options
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSelectedOption(optIdx);
    setIsAnswered(true);

    setStudentAnswers((prev) => [
      ...prev,
      { questionId: questions[currentIdx].id, selectedOption: optIdx },
    ]);
  };

  const handleNext = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // End of Quiz - Submit results to server
      setLoading(true);
      try {
        const res = await fetch('/api/student/quiz/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: studentAnswers,
            timeTaken: totalTimeTaken,
          }),
        });

        if (res.ok) {
          const results = await res.json();
          setQuizResults(results);
          
          // Generate Confetti if they scored well!
          if (results.score >= 50) {
            triggerConfetti();
          }

          setGameState('summary');
        } else {
          alert('Failed to submit quiz results.');
        }
      } catch (err) {
        console.error(err);
        alert('Error submitting quiz answers');
      } finally {
        setLoading(false);
      }
    }
  };

  const triggerConfetti = () => {
    const colors = ['#6C63FF', '#00F5FF', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    const particles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: -10 - Math.random() * 20, // start above screen
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 6,
      delay: Math.random() * 3,
    }));
    setConfetti(particles);
  };

  const getRankBadge = (score: number) => {
    if (score === 100) return { title: '🏆 AI Architect', desc: 'Flawless performance! You possess supreme machine intelligence.', style: 'from-amber-400 to-orange-500' };
    if (score >= 80) return { title: '🧙‍♂️ AI Wizard', desc: 'Spectacular scoring! Your neural pathways are highly optimized.', style: 'from-purple-500 to-indigo-600' };
    if (score >= 60) return { title: '🦾 AI Practitioner', desc: 'Well done! Solid understanding of standard intelligence principles.', style: 'from-blue-500 to-cyan-500' };
    return { title: '🌱 AI Enthusiast', desc: 'Good attempt! Keep reviewing concepts to strengthen your knowledge base.', style: 'from-slate-500 to-slate-700' };
  };

  const topics = [
    { value: 'All', label: '🌍 All Topics', desc: 'Comprehensive mix of AI knowledge modules' },
    { value: 'Prompting', label: '✍️ Prompting', desc: 'In-context learning & prompt engineering' },
    { value: 'ML', label: '🤖 Machine Learning', desc: 'Supervised, unsupervised, & data models' },
    { value: 'Models', label: '🧠 AI Models', desc: 'Transformers, networks, & neural systems' },
    { value: 'NLP', label: '💬 NLP', desc: 'Tokenization, syntax, & text processing' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto font-sans relative">
      {/* Confetti Rain Layer */}
      {gameState === 'summary' && confetti.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40 h-[600px]">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute rounded-sm animate-fall"
              style={{
                left: `${c.x}%`,
                top: `${c.y}px`,
                width: `${c.size}px`,
                height: `${c.size * 0.4}px`,
                backgroundColor: c.color,
                animationDelay: `${c.delay}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {gameState === 'lobby' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100 shadow-sm">
              Arena Level 1
            </span>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">AI Trivia Challenge</h1>
            <p className="text-slate-500 max-w-lg mx-auto font-medium">
              Pick a domain category and prove your artificial intelligence expertise. Each question is time-bound!
            </p>
          </div>

          {/* Topics Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Quiz Domain</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedTopic(t.value)}
                  className={`group rounded-3xl p-6 text-left border-2 transition-all flex flex-col justify-between h-44 cursor-pointer relative overflow-hidden ${
                    selectedTopic === t.value
                      ? 'border-indigo-600 bg-indigo-900 text-white shadow-xl shadow-indigo-600/10'
                      : 'border-slate-100 bg-white text-slate-700 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="space-y-2 relative z-10">
                    <h4 className="font-bold text-lg">{t.label}</h4>
                    <p className={`text-xs ${selectedTopic === t.value ? 'text-indigo-200/80' : 'text-slate-400'} font-medium`}>
                      {t.desc}
                    </p>
                  </div>
                  <div className="relative z-10 flex justify-between items-center w-full pt-4 border-t border-slate-100/10">
                    <span className="text-xs font-bold tracking-wider uppercase opacity-80">TIME BOUND</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      selectedTopic === t.value ? 'bg-white text-indigo-900' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      →
                    </span>
                  </div>
                  {/* Decorative glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Rules and Launch Bar */}
          <div className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <h4 className="font-bold text-indigo-900 text-lg flex items-center gap-2">⚠️ Arena Rules</h4>
              <ul className="text-xs text-slate-500 font-semibold space-y-1.5 list-disc pl-4">
                <li>Every question is time-bound (standard 20s to 30s limits).</li>
                <li>Failing to answer within the timer results in auto-skipping.</li>
                <li>Your speed and accuracy are synchronized to the admin leaderboard.</li>
                <li>Correct answers are evaluated server-side to guarantee integrity.</li>
              </ul>
            </div>
            
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="w-full md:w-auto bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-2xl px-10 py-4 font-bold text-base transition-colors flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-indigo-200 rounded-full animate-spin"></div>
                  Generating Arena...
                </>
              ) : (
                '🚀 Start AI Challenge'
              )}
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && questions.length > 0 && (
        <div className="space-y-8 animate-in zoom-in-95 duration-200">
          {/* Header Stats */}
          <div className="flex justify-between items-center gap-4 bg-white/70 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">PROGRESSION</span>
              <div className="font-bold text-slate-800 text-sm">
                Question <span className="text-indigo-600">{currentIdx + 1}</span> of {questions.length}
              </div>
            </div>

            {/* Circular Timer Display */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">TIME LIMIT</span>
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`transition-all duration-1000 ${
                      timeLeft > 10 ? 'text-emerald-500' : timeLeft > 5 ? 'text-amber-500' : 'text-red-500'
                    }`}
                    strokeDasharray={`${(timeLeft / questions[currentIdx].timeLimit) * 100}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className={`absolute text-sm font-extrabold ${timeLeft <= 5 ? 'animate-ping scale-110 text-red-600' : 'text-slate-800'}`}>
                  {timeLeft}s
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-lg border border-slate-100/80 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
              <div 
                className="bg-indigo-600 h-full transition-all duration-500" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                  {questions[currentIdx].topic}
                </span>
                <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                  ✨ {questions[currentIdx].points} Pts
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-snug">
                {questions[currentIdx].question}
              </h2>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentIdx].options.map((option, idx) => {
                let borderStyle = 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-400 hover:shadow-md hover:scale-[1.01]';
                let indicatorStyle = 'bg-slate-100 text-slate-400 border-slate-200';

                if (selectedOption === idx) {
                  borderStyle = 'border-indigo-600 bg-indigo-50/50 shadow-md scale-[1.01]';
                  indicatorStyle = 'bg-indigo-600 text-white border-indigo-600';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isAnswered}
                    className={`p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all duration-200 cursor-pointer text-slate-700 font-semibold text-sm ${borderStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs shadow-sm transition-all ${indicatorStyle}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Timer Expired Banner / Actions */}
            {isAnswered && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 animate-in fade-in duration-300">
                <div className="text-sm font-semibold text-slate-500">
                  {selectedOption === null ? (
                    <span className="text-red-500 flex items-center gap-1.5">⏱️ Time's Up! Question Skipped.</span>
                  ) : (
                    <span className="text-indigo-600 flex items-center gap-1.5">✨ Selection Saved. Reviewing...</span>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl px-10 py-4 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-indigo-200 rounded-full animate-spin"></div>
                      Evaluating Quiz...
                    </>
                  ) : currentIdx + 1 === questions.length ? (
                    '🏁 Submit Results'
                  ) : (
                    'Next Question →'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {gameState === 'summary' && quizResults && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Rank Ribbon Card */}
          {(() => {
            const badge = getRankBadge(quizResults.score);
            return (
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                {/* Visual Gauge */}
                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="url(#indigoGrad)"
                      strokeWidth="3"
                      strokeDasharray={`${quizResults.score}, 100`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6C63FF" />
                        <stop offset="100%" stopColor="#00F5FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-slate-800">{quizResults.score}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ACCURACY</span>
                  </div>
                </div>

                {/* Score Summary */}
                <div className="space-y-3 flex-1 text-center md:text-left">
                  <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${badge.style} uppercase tracking-wider`}>
                    {badge.title}
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">Excellent Arena Run, {studentName}!</h2>
                  <p className="text-slate-500 font-medium text-sm max-w-md">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Detailed Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-1">
              <span className="text-2xl">🎯</span>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correct Answers</div>
              <div className="text-2xl font-bold text-slate-800">
                {quizResults.correctAnswers} <span className="text-slate-400 font-medium text-sm">/ {quizResults.totalQuestions}</span>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-1">
              <span className="text-2xl">⚡</span>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Award Points</div>
              <div className="text-2xl font-bold text-indigo-600">
                {quizResults.pointsScored} <span className="text-slate-400 font-medium text-sm">/ {quizResults.maxPoints}</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-1">
              <span className="text-2xl">⏱️</span>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Duration</div>
              <div className="text-2xl font-bold text-slate-800">{quizResults.timeTaken}s</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-1">
              <span className="text-2xl">🏃‍♂️</span>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Speed</div>
              <div className="text-2xl font-bold text-slate-800">
                {Math.round(quizResults.timeTaken / quizResults.totalQuestions)}s / Q
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => {
                setGameState('lobby');
                setQuestions([]);
              }}
              className="w-full sm:w-auto bg-[#3F3EE8] hover:bg-indigo-700 text-white rounded-2xl px-10 py-4 font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer text-center text-sm"
            >
              🔄 Play Another Category
            </button>
            
            <Link 
              href="/student-dashboard" 
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl px-10 py-4 transition-all text-center text-sm cursor-pointer"
            >
              🏠 Dashboard Home
            </Link>
          </div>
        </div>
      )}

      {/* Embedded CSS Confetti Drop Keyframes */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(650px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
}
