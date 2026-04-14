import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
    const [step, setStep] = useState('email'); // 'email' | 'otp'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const otpRefs = useRef([]);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/send-otp', { email });
            setMessage(res.data.message);
            setStep('otp');
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits filled
        if (newOtp.every((d) => d !== '')) {
            verifyOtp(newOtp.join(''));
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            const newOtp = pasted.split('');
            setOtp(newOtp);
            otpRefs.current[5]?.focus();
            verifyOtp(pasted);
        }
    };

    const verifyOtp = async (otpString) => {
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/verify-otp', { email, otp: otpString });
            login(res.data.token, res.data.user);

            if (res.data.user.profileCompleted) {
                navigate('/dashboard');
            } else {
                navigate('/profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
            setOtp(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-10 w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="glass-card p-8 md:p-12 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-indigo-500/10 rounded-2xl flex items-center justify-center text-4xl mb-6 border border-indigo-500/20 shadow-inner">
                        <span className="animate-pulse">{step === 'email' ? '📧' : '🔐'}</span>
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                        {step === 'email' ? 'Welcome Back' : 'Verify Identity'}
                    </h1>
                    <p className="text-slate-400">
                        {step === 'email' 
                            ? 'Enter your email to access the recruitment portal' 
                            : `We've sent a code to ${email}`}
                    </p>
                </div>

                {error && <div className="alert alert-error mb-6">⚠️ {error}</div>}
                {message && <div className="alert alert-success mb-6">✅ {message}</div>}

                {step === 'email' ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Professional Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    className="glass-input transition-all duration-300 group-hover:border-indigo-500/30"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    id="email-input"
                                />
                                <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn-premium w-full group"
                            disabled={loading || !email.trim()}
                            id="send-otp-btn"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Authenticating...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Request Access Code</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-8">
                        <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (otpRefs.current[i] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    className="otp-input-v2"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    id={`otp-input-${i}`}
                                />
                            ))}
                        </div>

                        {loading && (
                            <div className="flex items-center justify-center gap-3 text-indigo-400">
                                <div className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
                                <span className="text-sm">Securing your session...</span>
                            </div>
                        )}

                        <div className="text-center">
                            <button
                                className="btn-text-link text-sm"
                                onClick={() => {
                                    setStep('email');
                                    setOtp(['', '', '', '', '', '']);
                                    setError('');
                                    setMessage('');
                                }}
                                id="back-to-email-btn"
                            >
                                ← Try a different email
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-8 text-center">
                <button
                    className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm hover:bg-white/10 hover:text-indigo-300 transition-all active:scale-95"
                    onClick={() => navigate('/admin/login')}
                >
                    🛡️ Enterprise Admin Access
                </button>
            </div>
        </div>
    );
}
