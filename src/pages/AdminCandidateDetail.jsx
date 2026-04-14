import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function getAdminApi() {
    const instance = axios.create({ baseURL: '/api' });
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('adminToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
    return instance;
}

const adminApi = getAdminApi();

export default function AdminCandidateDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCandidate();
    }, [id]);

    const loadCandidate = async () => {
        try {
            const res = await adminApi.get(`/admin/candidates/${id}`);
            setData(res.data);
        } catch (err) {
            console.error('Load candidate error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getResultLabel = (result) => {
        const labels = {
            pending: { text: 'Pending', cls: 'badge-secondary' },
            shortlisted: { text: 'Shortlisted', cls: 'badge-info' },
            rejected: { text: 'Rejected', cls: 'badge-danger' },
            aptitude_passed: { text: 'Aptitude Passed', cls: 'badge-success' },
            aptitude_failed: { text: 'Aptitude Failed', cls: 'badge-danger' },
            coding_passed: { text: 'Coding Passed', cls: 'badge-success' },
            coding_failed: { text: 'Coding Failed', cls: 'badge-danger' },
            interview_passed: { text: 'Interview Passed', cls: 'badge-success' },
            interview_failed: { text: 'Interview Failed', cls: 'badge-danger' },
            selected: { text: '★ Selected', cls: 'badge-success' },
        };
        return labels[result] || { text: result, cls: 'badge-secondary' };
    };

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner"></div>
                <p className="text-muted">Loading candidate details...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="page-container">
                <div className="alert alert-error">Candidate not found</div>
                <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    const { candidate, applications } = data;

    return (
        <div className="min-h-screen bg-[#050510] text-slate-200 uppercase-label-system">
            <nav className="h-20 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 flex items-center justify-between px-10 shadow-lg">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                        <span className="text-xl">🛡️</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight italic">Zenith <span className="text-indigo-400 font-medium not-italic">Talent AI</span></h1>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Administrative Core</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button 
                        className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest hover:border-red-500/30 hover:bg-red-500/10" 
                        onClick={() => {
                            localStorage.removeItem('adminToken');
                            localStorage.removeItem('adminUser');
                            navigate('/admin/login');
                        }}
                    >
                        Secure Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-8 py-10 space-y-10 animate-in fade-in zoom-in-95 duration-700">
                <button 
                    className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors flex items-center gap-2 group" 
                    onClick={() => navigate('/admin/dashboard')}
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Intelligence Grid
                </button>

                {/* Candidate Hero Section */}
                <div className="glass-card p-10 border-white/5 bg-gradient-to-br from-indigo-600/[0.05] to-transparent flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 rounded-3xl bg-indigo-600 shadow-[0_0_40px_rgba(79,70,229,0.3)] flex items-center justify-center text-5xl font-black text-white border-2 border-white/10 italic">
                        {candidate.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{candidate.name || 'ANONYMOUS UNIT'}</h2>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500">
                                <span className="text-xs font-mono lowercase">{candidate.email}</span>
                                <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                                <span className="text-xs font-mono">{candidate.phone || 'NO_COMMS_INDEXED'}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                            {candidate.skills?.map((s, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-auto p-6 bg-black/20 rounded-[32px] border border-white/5 space-y-4">
                        <div className="flex justify-between items-center gap-10">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Assessments</span>
                            <span className="text-2xl font-black text-white tabular-nums">{applications.length}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-full opacity-30"></div>
                        </div>
                    </div>
                </div>

                {/* Resume DNA Analysis */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-slate-800"></span>
                        Resume DNA Matrix
                    </h3>
                    <div className="glass-card p-8 border-white/5 bg-black/20">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {candidate.resumeKeywords?.slice(0, 18).map((k, i) => (
                                <span key={i} className="px-3 py-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-[9px] font-bold text-indigo-400 uppercase tracking-tight text-center truncate">
                                    {k}
                                </span>
                            ))}
                            {candidate.resumeKeywords?.length > 18 && (
                                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-tight text-center">
                                    +{candidate.resumeKeywords.length - 18} MORE
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Application Evaluation Timeline */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-slate-800"></span>
                        Evaluation Chronicles
                    </h3>
                    
                    {applications.length === 0 ? (
                        <div className="glass-card p-20 text-center space-y-4 opacity-20">
                            <span className="text-5xl border-2 border-dashed border-white/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto">📄</span>
                            <p className="text-xs font-black uppercase tracking-widest">No active applications recovered</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {applications.map((app, i) => {
                                const badge = getResultLabel(app.overallResult);
                                const interviewFeedback = app.interviewFeedback ? JSON.parse(app.interviewFeedback) : null;
                                
                                return (
                                    <div key={app._id} className="glass-card border-white/5 overflow-hidden group">
                                        <header className="p-8 bg-white/[0.03] border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="space-y-1">
                                                <h4 className="text-xl font-black text-white tracking-tight uppercase italic">{app.jobId?.title || 'UNKNOWN_REQUISITION'}</h4>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{app.jobId?.company || 'QUANTUM_CORP'}</p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase border shadow-lg ${badge.cls.includes('success') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : badge.cls.includes('danger') ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                                {badge.text}
                                            </div>
                                        </header>

                                        <div className="p-8 space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {/* Phase Cards */}
                                                {[
                                                    { 
                                                        title: 'Shortlisting', 
                                                        icon: '📋', 
                                                        val: `${app.totalMatchCount} Matches`, 
                                                        status: app.isShortlisted ? 'PASSED' : 'FAILED', 
                                                        passed: app.isShortlisted 
                                                    },
                                                    { 
                                                        title: 'Logic Test', 
                                                        icon: '🧠', 
                                                        val: app.aptitudeScore !== null ? `${app.aptitudeScore}/10` : 'PENDING', 
                                                        status: app.aptitudePassed ? 'PASSED' : 'ACTIVE', 
                                                        passed: app.aptitudePassed 
                                                    },
                                                    { 
                                                        title: `Code (${app.codingLanguage || '—'})`, 
                                                        icon: '💻', 
                                                        val: app.codingScore !== null ? `${app.codingScore}%` : 'PENDING', 
                                                        status: app.codingPassed ? 'PASSED' : 'ACTIVE', 
                                                        passed: app.codingPassed 
                                                    },
                                                    { 
                                                        title: 'AI Interview', 
                                                        icon: '🎤', 
                                                        val: app.interviewScore !== null ? `${app.interviewScore}/10` : 'PENDING', 
                                                        status: app.interviewPassed ? 'PASSED' : 'ACTIVE', 
                                                        passed: app.interviewPassed 
                                                    }
                                                ].map((stage, idx) => (
                                                    <div key={idx} className={`p-6 bg-white/[0.02] border rounded-[32px] space-y-4 ${stage.passed ? 'border-emerald-500/20' : 'border-white/5'}`}>
                                                        <div className="flex justify-between items-center text-slate-600">
                                                            <span className="text-xl grayscale opacity-50">{stage.icon}</span>
                                                            <span className="text-[9px] font-black uppercase tracking-widest">{stage.title}</span>
                                                        </div>
                                                        <p className="text-2xl font-black text-white italic">{stage.val}</p>
                                                        <div className={`text-[8px] font-bold px-2 py-0.5 rounded-full inline-block ${stage.passed ? 'bg-emerald-500/20 text-emerald-400 uppercase' : 'bg-white/5 text-slate-600 uppercase'}`}>
                                                            {stage.status}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Detailed Insights Expansion */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                {/* Interview Analytics */}
                                                {interviewFeedback && (
                                                    <div className="space-y-6">
                                                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subsurface AI Insights</h5>
                                                        <div className="glass-card p-8 border-white/5 bg-black/40 space-y-6">
                                                            <p className="text-sm text-slate-300 italic leading-relaxed">“{interviewFeedback.feedback}”</p>
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <span className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest">Cognitive Strengths</span>
                                                                    <ul className="grid grid-cols-1 gap-2">
                                                                        {interviewFeedback.strengths?.map((s, i) => (
                                                                            <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                                                                                <span className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full"></span> {s}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                           </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Transcript Viewer */}
                                                {app.interviewTranscript?.length > 0 && (
                                                    <div className="space-y-6">
                                                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Transcript</h5>
                                                        <div className="glass-card border-white/5 bg-black/40 rounded-[32px] overflow-hidden">
                                                            <div className="h-80 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                                                {app.interviewTranscript.map((msg, i) => (
                                                                    <div key={i} className={`p-4 rounded-2xl ${msg.role === 'interviewer' ? 'bg-white/5 border border-white/5' : 'bg-indigo-600/10 border border-indigo-500/20'}`}>
                                                                        <p className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-40">{msg.role === 'interviewer' ? 'Agent AI' : 'Unit Data'}</p>
                                                                        <p className="text-xs text-slate-300 leading-relaxed font-mono">{msg.content}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <footer className="pt-10 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-800 font-bold uppercase tracking-[0.4em]">
                    <p>&copy; 2026 Zenith Dossier Systems</p>
                    <p className="italic">Candidate ID: {id}</p>
                </footer>
            </div>
        </div>
    );
}
