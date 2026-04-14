import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="sticky top-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/10 px-8 py-4 flex items-center justify-between">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 hover:opacity-80 transition-opacity">
                <span className="text-2xl">🛡️</span>
                Autonomous AI Platform
            </Link>
            <div className="flex items-center gap-1 md:gap-6">
                {user ? (
                    <>
                        <Link to="/dashboard" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>Dashboard</Link>
                        <Link to="/applications" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/applications' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>My Records</Link>
                        <Link to="/profile" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/profile' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>Profile</Link>
                        <button 
                            className="ml-4 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <a href="#pillars" className="px-4 py-2 text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest hidden md:block">The Trinity</a>
                        <a href="#team" className="px-4 py-2 text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest hidden md:block">Creators</a>
                        <Link to="/login" className="px-6 py-2 bg-indigo-500 text-white rounded-lg text-[10px] font-black hover:bg-indigo-600 transition-all uppercase tracking-widest ml-4">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
