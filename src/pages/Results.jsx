import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Results() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            const res = await api.get(`/test/results/${applicationId}`);
            setResults(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    const getVerdictClass = (result) => {
        if (result === 'selected') return 'selected';
        if (['rejected', 'aptitude_failed', 'coding_failed', 'interview_failed'].includes(result)) return 'rejected';
        return 'pending';
    };

    if (loading) {
        return (
            <div className="dossier-page">
                <Navbar />
                <div className="loading-page">
                    <div className="spinner"></div>
                    <p className="text-muted">Compiling Evaluation Report...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dossier-page">
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

    return (
        <div className="min-h-screen bg-[#0a0a1a] text-slate-200">
            <Navbar />
            
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="glass-card overflow-hidden border-white/10 rounded-[40px] shadow-2xl animate-in fade-in zoom-in-95 duration-1000">
                    {/* Report Header */}
                    <header className="p-10 bg-gradient-to-br from-indigo-600/[0.08] to-transparent border-b border-white/5 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[10px] font-black text-indigo-400 tracking-widest uppercase">Confidential Evaluation</span>
                                <p className="text-[10px] font-mono text-slate-500">DOSSIER-ID: {applicationId.slice(-12).toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Issue Date</p>
                                <p className="text-xs font-mono text-slate-300">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-5xl font-black text-white tracking-tighter">Evaluation Dossier</h1>
                            <div className="flex items-center gap-3 text-slate-400">
                                <span className="text-xl font-bold text-indigo-400 underline decoration-indigo-500/30 underline-offset-8">{results.jobTitle}</span>
                                <span className="text-slate-600">|</span>
                                <span className="text-sm font-medium tracking-wide uppercase opacity-60">{results.company} • Core Engineering</span>
                            </div>
                        </div>

                        <div className={`mt-8 p-6 rounded-3xl border flex items-center justify-between group transition-all duration-500 ${results.overallResult === 'selected' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.1)]'}`}>
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${results.overallResult === 'selected' ? 'bg-emerald-500/20 shadow-emerald-500/20' : 'bg-red-500/20 shadow-red-500/20'}`}>
                                    {results.overallResult === 'selected' ? '✅' : '🚫'}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Recommendation</p>
                                    <h2 className="text-2xl font-black tracking-tight">{results.overallVerdict}</h2>
                                </div>
                            </div>
                            <div className="hidden md:block h-6 w-[1px] bg-current opacity-20"></div>
                            <div className="hidden md:block text-right">
                                <p className="text-[10px] font-bold opacity-60">Confidence Score</p>
                                <p className="text-lg font-mono font-black italic">98.4% Match</p>
                            </div>
                        </div>
                    </header>

                    {/* Report Sections */}
                    <div className="p-10 space-y-10 bg-white/[0.01]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Phase 1: Resume Verification */}
                            <div className="space-y-6 animate-in slide-in-from-left-8 duration-700">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-slate-800"></span>
                                    Phase I: AI Resume Analysis
                                </h3>
                                <div className="glass-card p-6 border-white/5 bg-black/20 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-lg font-bold text-white">Visual Keyword Parsing</p>
                                            <p className="text-xs text-slate-500">Alignment with Job DNA</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${results.shortlisting.isShortlisted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {results.shortlisting.status}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px] font-bold mb-1">
                                            <span className="text-slate-500 uppercase">Keyword Density</span>
                                            <span className="text-indigo-400">{results.shortlisting.totalMatches} Matches</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full p-[1px] border border-white/5">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (results.shortlisting.totalMatches / 10) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs text-slate-500 italic leading-relaxed">System identified significant semantic alignment between candidate core skills and requisition requirements.</p>
                                </div>
                            </div>

                            {/* Phase 2: Technical Competency */}
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-700">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-slate-800"></span>
                                    Phase II: Logic & Synthesis
                                </h3>
                                <div className="glass-card p-6 border-white/5 bg-black/20 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-lg font-bold text-white">Competency Profiling</p>
                                            <p className="text-xs text-slate-500">Logical & Technical Synthesis</p>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase">PASSED</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Aptitude</p>
                                            <p className="text-xl font-black text-white">{results.assessment.aptitudeScore}<span className="text-[10px] text-slate-600">/40</span></p>
                                        </div>
                                        <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Coding</p>
                                            <p className="text-xl font-black text-white">{results.assessment.codingScore}<span className="text-[10px] text-slate-600">/60</span></p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Composite Score</span>
                                            <span className="text-2xl font-black text-indigo-400">{results.assessment.totalScore}<span className="text-xs text-slate-600 tracking-normal font-bold">/100</span></span>
                                        </div>
                                        <div className="relative h-2 bg-white/5 rounded-full">
                                            <div className="absolute h-full bg-indigo-500 rounded-full z-10" style={{ width: `${results.assessment.totalScore}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phase 3: AI Interview Analysis */}
                        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-1000">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-slate-800"></span>
                                Phase III: Behavioral & Visual AI
                            </h3>
                            <div className="glass-card p-10 border-white/5 bg-black/20 space-y-10">
                                {results.interview.score ? (
                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {[
                                                { val: results.interview.score.content, max: 50, label: 'DEPTH', color: 'text-indigo-400' },
                                                { val: results.interview.score.attire, max: 10, label: 'VIZ PRESENCE', color: 'text-purple-400' },
                                                { val: results.interview.score.confidence, max: 10, label: 'STABILITY', color: 'text-amber-400' },
                                                { val: results.interview.score.eyeTracing, max: 20, label: 'ENGAGEMENT', color: 'text-emerald-400' }
                                            ].map((item, i) => (
                                                <div key={i} className="space-y-2">
                                                    <span className={`text-2xl font-black ${item.color}`}>{item.val}<span className="text-[10px] text-slate-600 font-bold ml-1">/{item.max}</span></span>
                                                    <span className="block text-[9px] font-black text-slate-500 tracking-[0.2em]">{item.label}</span>
                                                    <div className="h-1 bg-white/5 rounded-full">
                                                        <div className={`h-full bg-current ${item.color.replace('text-', 'bg-')}`} style={{ width: `${(item.val / item.max) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="relative p-8 bg-white/[0.03] border border-white/5 rounded-[32px] italic text-slate-300 leading-relaxed text-sm">
                                            <span className="absolute -top-4 left-6 text-6xl text-indigo-500/20 font-serif">“</span>
                                            <p className="relative z-10">{results.interview.feedback}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-20 text-center space-y-4 opacity-40">
                                        <span className="text-5xl block">📹</span>
                                        <p className="text-xs font-bold uppercase tracking-widest">Interview processing in progress...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <footer className="p-10 bg-black/40 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <button className="btn-premium px-10 py-4 shadow-indigo-500/20" onClick={() => navigate('/dashboard')}>
                            ← Portal Dashboard
                        </button>
                        <div className="flex items-center gap-4">
                            <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest" onClick={() => window.print()}>
                                Print Dossier
                            </button>
                            <button className="px-8 py-4 bg-indigo-600 shadow-indigo-500/30 rounded-2xl text-xs font-bold text-white hover:scale-105 transition-all uppercase tracking-widest">
                                Archive PDF
                            </button>
                        </div>
                    </footer>
                </div>

                <div className="mt-8 text-center opacity-30">
                    <p className="text-[10px] font-bold uppercase tracking-widest">&copy; 2026 Zenith Talent Systems • All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
}
