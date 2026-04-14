import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState({});
    const [loading, setLoading] = useState(true);
    const [applyLoading, setApplyLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/jobs'),
                api.get('/jobs/applications'),
            ]);
            setJobs(jobsRes.data);
            const appMap = {};
            appsRes.data.forEach((app) => {
                if (app.jobId) {
                    appMap[app.jobId._id || app.jobId] = app;
                }
            });
            setApplications(appMap);
        } catch (err) {
            console.error('Load data error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        setApplyLoading(jobId);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.post(`/jobs/apply/${jobId}`);
            setMessage({
                type: res.data.isShortlisted ? 'success' : 'error',
                text: res.data.message,
            });
            // Reload applications
            const appsRes = await api.get('/jobs/applications');
            const appMap = {};
            appsRes.data.forEach((app) => {
                if (app.jobId) {
                    appMap[app.jobId._id || app.jobId] = app;
                }
            });
            setApplications(appMap);
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to apply',
            });
        } finally {
            setApplyLoading(null);
        }
    };

    const getApplicationStatus = (jobId) => {
        const app = applications[jobId];
        if (!app) return null;
        return app;
    };

    const renderStatusBadge = (app) => {
        if (!app) return null;

        const statusMap = {
            pending: { color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', text: 'Pending' },
            shortlisted: { color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', text: 'Shortlisted' },
            aptitude_passed: { color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', text: 'Aptitude Passed' },
            aptitude_failed: { color: 'bg-red-500/10 border-red-500/20 text-red-400', text: 'Aptitude Failed' },
            coding_passed: { color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', text: 'Coding Passed' },
            coding_failed: { color: 'bg-red-500/10 border-red-500/20 text-red-400', text: 'Coding Failed' },
            selected: { color: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300', text: '🎉 Selected' },
            rejected: { color: 'bg-slate-500/10 border-slate-500/20 text-slate-400', text: 'Not Shortlisted' },
        };

        const status = statusMap[app.overallResult] || { color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400', text: app.overallResult };
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.color}`}>{status.text}</span>;
    };

    const renderActionButton = (job) => {
        const app = getApplicationStatus(job._id);

        if (!app) {
            return (
                <button
                    className="btn-premium w-full md:w-auto"
                    onClick={() => handleApply(job._id)}
                    disabled={applyLoading === job._id}
                    id={`apply-btn-${job._id}`}
                >
                    {applyLoading === job._id ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Applying...</span>
                        </div>
                    ) : (
                        'Apply Now 🚀'
                    )}
                </button>
            );
        }

        if (app.isShortlisted && app.currentStage === 'aptitude') {
            return (
                <button
                    className="btn-premium w-full md:w-auto from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-emerald-500/40"
                    onClick={() => navigate(`/aptitude/${app._id}`)}
                >
                    📝 Take Aptitude Test
                </button>
            );
        }

        if (app.aptitudePassed && app.currentStage === 'coding') {
            return (
                <button
                    className="btn-premium w-full md:w-auto from-indigo-500 to-blue-600 shadow-indigo-500/20 hover:shadow-indigo-500/40"
                    onClick={() => navigate(`/coding/${app._id}`)}
                >
                    💻 Coding Challenge
                </button>
            );
        }

        if (app.currentStage === 'completed') {
            return (
                <button
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all w-full md:w-auto"
                    onClick={() => navigate(`/results/${app._id}`)}
                >
                    📊 View Results
                </button>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a1a]">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 animate-pulse">Scanning the horizon for opportunities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a1a]">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6 py-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                            Career Opportunities
                        </h1>
                        <p className="text-slate-400 text-lg">Discover roles that match your expertise and ambition</p>
                    </div>
                    <div className="relative group w-full md:w-80">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search roles, skills..." 
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                        />
                    </div>
                </header>

                {message.text && (
                    <div className={`alert mb-8 animate-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                    </div>
                )}

                {jobs.length === 0 ? (
                    <div className="glass-card flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-6xl mb-6 grayscale opacity-50">📭</div>
                        <h3 className="text-2xl font-bold text-slate-200 mb-2">No Opportunities Found</h3>
                        <p className="text-slate-400">We're currently preparing new roles. Check back shortly!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => {
                            const app = getApplicationStatus(job._id);
                            return (
                                <div key={job._id} className="glass-card p-6 flex flex-col h-full hover:border-white/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-xl font-bold text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                                {job.company.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-100 text-lg leading-tight mb-1 group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                                                <span className="text-indigo-400/80 text-sm font-medium">{job.company}</span>
                                            </div>
                                        </div>
                                        {renderStatusBadge(app)}
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                            <span className="w-5 text-center">📍</span>
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                            <span className="w-5 text-center">💰</span>
                                            <span>{job.salary}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                            <span className="w-5 text-center">⏱️</span>
                                            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md text-xs border border-indigo-500/20 font-bold uppercase tracking-wider">{job.type}</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {job.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                                        {job.keywords && job.keywords.map((kw, index) => (
                                            <span key={index} className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] text-slate-500 font-bold uppercase tracking-wider group-hover:border-white/10 transition-colors">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex justify-end">
                                        {renderActionButton(job)}
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
