import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const res = await api.get('/jobs/applications');
            setApplications(res.data);
        } catch (err) {
            console.error('Load applications error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (app) => {
        const map = {
            pending: { badge: 'badge-warning', text: 'Pending', icon: '⏳' },
            shortlisted: { badge: 'badge-success', text: 'Shortlisted', icon: '✅' },
            aptitude_passed: { badge: 'badge-success', text: 'Aptitude Passed', icon: '🧠' },
            aptitude_failed: { badge: 'badge-danger', text: 'Aptitude Failed', icon: '❌' },
            coding_passed: { badge: 'badge-success', text: 'Coding Passed', icon: '💻' },
            coding_failed: { badge: 'badge-danger', text: 'Coding Failed', icon: '❌' },
            interview_passed: { badge: 'badge-success', text: 'Interview Passed', icon: '🎤' },
            interview_failed: { badge: 'badge-danger', text: 'Interview Failed', icon: '❌' },
            selected: { badge: 'badge-success', text: 'Selected!', icon: '🎉' },
            rejected: { badge: 'badge-danger', text: 'Not Shortlisted', icon: '❌' },
        };
        return map[app.overallResult] || { badge: 'badge-info', text: app.overallResult, icon: '📋' };
    };

    const getNextAction = (app) => {
        if (app.currentStage === 'aptitude' && app.isShortlisted) {
            return (
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/aptitude/${app._id}`)}>
                    📝 Take Aptitude Test
                </button>
            );
        }
        if (app.currentStage === 'coding' && app.aptitudePassed) {
            return (
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/coding/${app._id}`)}>
                    💻 Coding Challenge
                </button>
            );
        }
        if (app.currentStage === 'interview' && app.codingPassed) {
            return (
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/interview/${app._id}`)}>
                    🎤 AI Interview
                </button>
            );
        }
        if (app.currentStage === 'completed') {
            return (
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/results/${app._id}`)}>
                    📊 View Results
                </button>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-page">
                    <div className="spinner"></div>
                    <p className="text-muted">Loading applications...</p>
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a1a] text-slate-200">
            <Navbar />
            
            <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
                <header className="space-y-2 animate-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-[2px] bg-indigo-500/50"></span>
                        <h1 className="text-4xl font-black text-white tracking-tighter">My Applications</h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium pl-13 uppercase tracking-widest opacity-80">Track your journey across open requisitions</p>
                </header>

                {applications.length === 0 ? (
                    <div className="glass-card p-20 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-4xl shadow-xl">📭</div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white">No active applications</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Your journey begins with a single application. Explore new opportunities on the dashboard.</p>
                        </div>
                        <button 
                            className="btn-premium px-10 py-3 text-xs" 
                            onClick={() => navigate('/dashboard')}
                        >
                            Browse Open Jobs 🚀
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {applications.map((app, i) => {
                            const status = getStatusInfo(app);
                            const statusColor = status.badge.includes('success') ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                                               status.badge.includes('warning') ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 
                                               'text-red-400 bg-red-500/10 border-red-500/20';
                            
                            return (
                                <div 
                                    key={app._id} 
                                    className="glass-card p-8 group hover:border-indigo-500/30 transition-all duration-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{app.jobId?.title || 'Job'}</h3>
                                                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${statusColor}`}>
                                                    {status.icon} {status.text}
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                                {app.jobId?.company}
                                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                                {app.jobId?.location}
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4">
                                            <div className="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-400">Match Accuracy</span>
                                                <span className="text-xs font-black text-indigo-400">{(app.totalMatchCount / 10 * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-xl flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-400">Applied On</span>
                                                <span className="text-xs font-black text-slate-200">{new Date(app.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto flex flex-col items-center gap-3">
                                        {getNextAction(app) ? (
                                            <div className="w-full">
                                                {/* Re-styling getNextAction buttons to match premium look if they were returned as elements */}
                                                {/* But since getNextAction returns buttons with specific classes, I'll rely on the global btn overrides */}
                                                {getNextAction(app)}
                                            </div>
                                        ) : (
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-600 uppercase mb-1 tracking-widest text-center">Process Complete</p>
                                                <button className="px-6 py-2 bg-white/5 border border-white/5 text-slate-600 rounded-xl text-xs font-bold cursor-default">
                                                    Results Logged
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
