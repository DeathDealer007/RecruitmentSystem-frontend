import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function getAdminApi() {
    const instance = axios.create({ baseURL: '/api' });
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('adminToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });
    instance.interceptors.response.use(
        (r) => r,
        (error) => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/admin/login';
            }
            return Promise.reject(error);
        }
    );
    return instance;
}

const adminApi = getAdminApi();

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStage, setFilterStage] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, candidatesRes] = await Promise.all([
                adminApi.get('/admin/stats'),
                adminApi.get('/admin/candidates'),
            ]);
            setStats(statsRes.data);
            setCandidates(candidatesRes.data);
        } catch (err) {
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const filteredCandidates = candidates.filter((c) => {
        const matchesSearch =
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase());

        if (filterStage === 'all') return matchesSearch;
        if (filterStage === 'no-application') return matchesSearch && c.applicationCount === 0;
        return matchesSearch && c.applications?.some(a => a.currentStage === filterStage || a.overallResult === filterStage);
    });

    const getStageColor = (stage) => {
        const colors = {
            applied: '#94a3b8',
            shortlisting: '#60a5fa',
            aptitude: '#a78bfa',
            coding: '#f59e0b',
            interview: '#06b6d4',
            completed: '#10b981',
        };
        return colors[stage] || '#94a3b8';
    };

    const getResultBadge = (result) => {
        const badges = {
            pending: { text: 'Pending', cls: 'badge-secondary' },
            shortlisted: { text: 'Shortlisted', cls: 'badge-info' },
            rejected: { text: 'Rejected', cls: 'badge-danger' },
            aptitude_passed: { text: 'Aptitude ✓', cls: 'badge-success' },
            aptitude_failed: { text: 'Aptitude ✗', cls: 'badge-danger' },
            coding_passed: { text: 'Coding ✓', cls: 'badge-success' },
            coding_failed: { text: 'Coding ✗', cls: 'badge-danger' },
            interview_passed: { text: 'Interview ✓', cls: 'badge-success' },
            interview_failed: { text: 'Interview ✗', cls: 'badge-danger' },
            selected: { text: 'Selected ★', cls: 'badge-success' },
        };
        return badges[result] || { text: result, cls: 'badge-secondary' };
    };

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner"></div>
                <p className="text-muted">Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050510] text-slate-200">
            {/* Professional Admin Navbar */}
            <nav className="h-20 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 flex items-center justify-between px-10 shadow-lg">
                <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                        <span className="text-xl">🛡️</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight italic">Zenith <span className="text-indigo-400 font-medium not-italic">Talent AI</span></h1>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">Administrative Core</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/10">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Systems Nominal</span>
                    </div>
                    <button 
                        className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest hover:border-red-500/30 hover:bg-red-500/10" 
                        onClick={handleLogout}
                    >
                        Secure Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
                {/* Stats Analytics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    {[
                        { label: 'Total Candidates', val: stats?.totalCandidates, icon: '👥', color: 'from-blue-500/20' },
                        { label: 'Assessment Entries', val: stats?.totalApplications, icon: '📋', color: 'from-indigo-500/20' },
                        { label: 'Shortlisted', val: stats?.shortlisted, icon: '✅', color: 'from-emerald-500/20' },
                        { label: 'Final Selected', val: stats?.selected, icon: '🎉', color: 'from-amber-500/20' }
                    ].map((s, i) => (
                        <div key={i} className={`glass-card p-6 border-white/5 bg-gradient-to-br ${s.color} to-transparent group hover:scale-[1.02] transition-all`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
                            </div>
                            <p className="text-4xl font-black text-white tabular-nums">{s.val || 0}</p>
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase">
                                <span>Real-time Sync</span>
                                <span className="text-indigo-400">Live</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-indigo-500/50"></span>
                        <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">Candidate Database</h2>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm italic">🔍</span>
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-slate-700 placeholder:italic"
                                placeholder="Query name or identifier..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                id="candidate-search"
                            />
                        </div>
                        <select
                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-xs font-bold text-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-widest cursor-pointer"
                            value={filterStage}
                            onChange={(e) => setFilterStage(e.target.value)}
                            id="stage-filter"
                        >
                            <option value="all" className="bg-[#0a0a1a]">All Stages</option>
                            <option value="no-application" className="bg-[#0a0a1a]">No Applications</option>
                            <option value="shortlisted" className="bg-[#0a0a1a]">Shortlisted</option>
                            <option value="selected" className="bg-[#0a0a1a]">Selected</option>
                            <option value="rejected" className="bg-[#0a0a1a]">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Main Data Table */}
                <div className="glass-card border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-700">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate Intelligence</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Index</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Skill Matrix</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Evaluation Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {filteredCandidates.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="opacity-20 flex flex-col items-center gap-4">
                                                <span className="text-5xl">🌑</span>
                                                <p className="text-xs font-black uppercase tracking-[0.2em]">Zero Data Points Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCandidates.map((candidate, i) => {
                                        const latestApp = candidate.applications?.[0];
                                        const badge = latestApp ? getResultBadge(latestApp.overallResult) : null;
                                        
                                        return (
                                            <tr key={candidate._id} className="group hover:bg-indigo-500/[0.02] transition-colors duration-300">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xs font-black text-slate-400 border border-white/5 group-hover:border-indigo-500/30 transition-all">
                                                            {candidate.name?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight italic">{candidate.name || 'ANONYMOUS'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors lowercase italic">{candidate.email}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex gap-2">
                                                        {candidate.skills?.slice(0, 2).map((s, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                                                                {s}
                                                            </span>
                                                        ))}
                                                        {candidate.skills?.length > 2 && (
                                                            <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[8px] font-black text-indigo-400 uppercase tracking-tighter">
                                                                +{candidate.skills.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {badge ? (
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase border animate-in fade-in duration-500 ${badge.cls.includes('success') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : badge.cls.includes('danger') ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${badge.cls.includes('success') ? 'bg-emerald-500' : badge.cls.includes('danger') ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                                                            {badge.text}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-800 uppercase italic tracking-widest">Inactive</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <button
                                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all hover:scale-105"
                                                        onClick={() => navigate(`/admin/candidate/${candidate._id}`)}
                                                        id={`view-candidate-${candidate._id}`}
                                                    >
                                                        Details dossier
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer className="pt-10 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">
                    <p>&copy; 2026 Zenith Talent Systems Core</p>
                    <p className="flex items-center gap-2 italic">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        Encrypted Administrative Session Active
                    </p>
                </footer>
            </div>
        </div>
    );
}
