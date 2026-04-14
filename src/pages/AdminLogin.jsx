import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/admin-login', { email, password });
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('adminUser', JSON.stringify(res.data.user));
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-indigo-500/20 border border-indigo-500/30 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-2xl shadow-indigo-500/20">🛡️</div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-white tracking-tighter italic">ADMIN <span className="text-indigo-400 font-medium not-italic">CORE</span></h1>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">Zenith Intelligence Systems</p>
                    </div>
                </div>

                <div className="glass-card p-10 border-white/10 shadow-3xl bg-[#0a0a1a]/40 backdrop-blur-2xl rounded-[40px] space-y-8">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold animate-in slide-in-from-top-2">
                            <span>⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Administrative ID</label>
                            <input
                                id="admin-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="os.admin@zenith.sys"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-slate-800 italic"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Secure Passkey</label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all font-medium placeholder:text-slate-800"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-premium w-full py-5 flex items-center justify-center gap-3 shadow-indigo-500/20"
                            disabled={loading}
                            id="admin-login-btn"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span className="text-lg">🔐</span>
                                    <span className="text-xs font-black uppercase tracking-widest">Authorize Access</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-white/5 text-center">
                        <button
                            className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-indigo-400 transition-colors flex items-center gap-2 mx-auto"
                            onClick={() => navigate('/')}
                        >
                            ← Switch to Candidate Portal
                        </button>
                    </div>
                </div>

                <div className="text-center opacity-20 hover:opacity-100 transition-opacity duration-500">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Classified • System Level 9</p>
                </div>
            </div>
        </div>
    );
}
