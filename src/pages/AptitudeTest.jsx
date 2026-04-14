import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function AptitudeTest() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [aptQuestions, setAptQuestions] = useState([]);
    const [techQuestions, setTechQuestions] = useState([]);
    const [aptAnswers, setAptAnswers] = useState({});
    const [techAnswers, setTechAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        loadQuestions();
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if ((aptQuestions.length > 0 || techQuestions.length > 0) && !result) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmit(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [aptQuestions, techQuestions, result]);

    const loadQuestions = async () => {
        try {
            const res = await api.get(`/test/aptitude/${applicationId}`);
            setAptQuestions(res.data.aptitudeQuestions || []);
            setTechQuestions(res.data.technicalQuestions || []);
            setTimeLeft(res.data.timeLimit || 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load questions');
        } finally {
            setLoading(false);
        }
    };

    const selectAptAnswer = (idx, optionIdx) => {
        if (result) return;
        setAptAnswers({ ...aptAnswers, [idx]: optionIdx });
    };

    const selectTechAnswer = (idx, optionIdx) => {
        if (result) return;
        setTechAnswers({ ...techAnswers, [idx]: optionIdx });
    };

    const handleSubmit = async (autoSubmit = false) => {
        if (result) return;
        clearInterval(timerRef.current);

        const aptAnswersArray = aptQuestions.map((_, i) => aptAnswers[i] ?? -1);
        const techAnswersArray = techQuestions.map((_, i) => techAnswers[i] ?? -1);
        const answeredCount = aptAnswersArray.filter(a => a !== -1).length + techAnswersArray.filter(a => a !== -1).length;

        if (!autoSubmit && answeredCount < 20) {
            if (!confirm(`Answered ${answeredCount}/20. Submit?`)) return;
        }

        setSubmitting(true);
        try {
            const res = await api.post(`/test/aptitude/${applicationId}`, {
                aptitudeAnswers: aptAnswersArray,
                technicalAnswers: techAnswersArray,
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="assessment-mode">
                <Navbar />
                <div className="loading-page">
                    <div className="spinner"></div>
                    <p className="text-muted">Generating AI Assessment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assessment-mode">
                <Navbar />
                <div className="page-container glass-card mt-12 text-center" style={{ padding: 40 }}>
                    <div className="alert alert-error glass-alert">⚠️ {error}</div>
                    <button className="btn-premium" onClick={() => navigate('/dashboard')}>
                        ← Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const answeredCount = Object.keys(aptAnswers).length + Object.keys(techAnswers).length;

    return (
        <div className="min-h-screen bg-[#0a0a1a] text-slate-200">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
                {/* Sticky Sidebar Navigation */}
                <aside className="lg:w-80 flex-shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <div className="glass-card p-6 border-indigo-500/20">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Live Progress</h3>
                            <div className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <span className="text-2xl font-bold text-white">{answeredCount}<span className="text-slate-500 text-sm">/20</span></span>
                                    <span className="text-xs font-bold text-indigo-400">{Math.round((answeredCount / 20) * 100)}% Complete</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                    <div 
                                        className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(79,70,229,0.4)]"
                                        style={{ width: `${(answeredCount / 20) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Question Map</h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase mb-2">Section I: Aptitude</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {aptQuestions.map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${aptAnswers[i] !== undefined ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                            >
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-600 uppercase mb-2">Section II: Technical</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {techQuestions.map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${techAnswers[i] !== undefined ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                            >
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!result && (
                            <div className={`p-4 rounded-2xl flex items-center justify-center gap-3 border transition-all duration-300 ${timeLeft < 120 ? 'bg-red-500/10 border-red-500 text-red-400 animate-pulse' : 'bg-white/5 border-white/10 text-emerald-400'}`}>
                                <span className="text-xl">⏱️</span>
                                <span className="text-2xl font-mono font-bold tracking-wider">{formatTime(timeLeft)}</span>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Assessment Area */}
                <main className="flex-1 max-w-3xl">
                    {result ? (
                        <div className="glass-card p-12 text-center space-y-8 animate-in zoom-in-95 duration-700">
                            <div className="w-24 h-24 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-5xl mx-auto shadow-[0_0_40px_rgba(79,70,229,0.2)]">🎯</div>
                            <div className="space-y-2">
                                <h1 className="text-4xl font-extrabold text-white">Section I Completed</h1>
                                <p className="text-slate-400">Your initial assessment score has been recorded.</p>
                            </div>
                            
                            <div className="flex items-center justify-center gap-6">
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 w-40">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total Score</p>
                                    <p className="text-4xl font-black text-white">{result.score}<span className="text-sm text-slate-500">/40</span></p>
                                </div>
                                <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 w-40">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Status</p>
                                    <p className="text-lg font-bold text-indigo-300">Proceeding</p>
                                </div>
                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
                                Excellent effort. The next phase is the **Coding Challenge** where you will demonstrate your implementation skills in a professional IDE environment.
                            </p>
                            
                            <button 
                                className="btn-premium px-12 py-4 text-lg shadow-indigo-500/20 hover:scale-105 transition-transform" 
                                onClick={() => navigate(`/coding/${applicationId}`)}
                            >
                                Launch Coding Environment 🚀
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-12 pb-24">
                            <div>
                                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-8 h-[1px] bg-indigo-500/30"></div>
                                    Part 1: Logical Reasoning
                                </h2>
                                <p className="text-slate-400 text-sm">Evaluation of your problem-solving and logical deduction capabilities.</p>
                            </div>

                            <div className="space-y-6">
                                {aptQuestions.map((q, i) => (
                                    <div key={`apt-${i}`} className="glass-card p-8 group hover:border-indigo-500/30 transition-all duration-300">
                                        <div className="flex items-start justify-between mb-6">
                                            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Question {i + 1}</span>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase">2 Marks</span>
                                        </div>
                                        <p className="text-lg text-slate-100 font-medium leading-relaxed mb-8">{q.question}</p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {q.options && q.options.map((opt, oi) => (
                                                <div 
                                                    key={oi} 
                                                    className={`group/opt relative flex items-center p-4 rounded-xl border transition-all cursor-pointer ${aptAnswers[i] === oi ? 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.08]'}`}
                                                    onClick={() => selectAptAnswer(i, oi)}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-all ${aptAnswers[i] === oi ? 'bg-indigo-500 border-indigo-400' : 'bg-white/5 border-white/20 group-hover/opt:border-white/40'}`}>
                                                        {aptAnswers[i] === oi && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                    </div>
                                                    <span className={`text-sm tracking-tight ${aptAnswers[i] === oi ? 'text-white font-semibold' : 'text-slate-400 font-medium'}`}>{opt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-10 border-t border-white/5">
                                <h2 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-8 h-[1px] bg-purple-500/30"></div>
                                    Part 2: Technical Proficiency
                                </h2>
                                <p className="text-slate-400 text-sm">Role-specific technical questions designed by AI based on the job requirements.</p>
                            </div>

                            <div className="space-y-6">
                                {techQuestions.map((q, i) => (
                                    <div key={`tech-${i}`} className="glass-card p-8 group hover:border-purple-500/30 transition-all duration-300">
                                        <div className="flex items-start justify-between mb-6">
                                            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-[10px] font-bold text-purple-400 uppercase tracking-tighter">Technical Q{i + 1}</span>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase">2 Marks</span>
                                        </div>
                                        <p className="text-lg text-slate-100 font-medium leading-relaxed mb-8">{q.question}</p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {q.options && q.options.map((opt, oi) => (
                                                <div 
                                                    key={oi} 
                                                    className={`group/opt relative flex items-center p-4 rounded-xl border transition-all cursor-pointer ${techAnswers[i] === oi ? 'bg-purple-500/10 border-purple-500 ring-1 ring-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.08]'}`}
                                                    onClick={() => selectTechAnswer(i, oi)}
                                                >
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-all ${techAnswers[i] === oi ? 'bg-purple-500 border-purple-400' : 'bg-white/5 border-white/20 group-hover/opt:border-white/40'}`}>
                                                        {techAnswers[i] === oi && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                    </div>
                                                    <span className={`text-sm tracking-tight ${techAnswers[i] === oi ? 'text-white font-semibold' : 'text-slate-400 font-medium'}`}>{opt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="glass-card p-10 mt-16 border-indigo-500/10 bg-gradient-to-br from-indigo-500/[0.03] to-transparent flex flex-col items-center text-center space-y-6">
                                <p className="text-slate-500 text-sm max-w-sm">Ensure all responses are finalized. The system will auto-submit when the timer reaches zero.</p>
                                <button 
                                    className="btn-premium px-16 py-4 text-lg shadow-indigo-500/10" 
                                    onClick={() => handleSubmit()} 
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Submitting...</span>
                                        </div>
                                    ) : '🚀 Submit Assessment'}
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
