import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Landing() {
    const [counts, setCounts] = useState({ days: 18, mins: 60, efficiency: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCounts(prev => ({
                days: Math.max(10, prev.days - 0.5),
                mins: Math.max(33, prev.mins - 1),
                efficiency: Math.min(50, prev.efficiency + 1)
            }));
        }, 80);
        return () => clearInterval(interval);
    }, []);

    const team = [
        { name: "Ankit Kumar", uid: "12210033", role: "Team Lead, Patent Supervision, and Full-Stack Development", icon: "🚀" },
        { name: "Sunidhi Tiwari", uid: "12215927", role: "ML Engineer (Cognitive Scoring) and Patent Drafting", icon: "🧠" },
        { name: "Anshuman Kashyap", uid: "12206758", role: "Cloud Architect and Patent Content Development", icon: "☁️" },
        { name: "Snigdha Roy", uid: "12216594", role: "NLP Specialist and Resume Parser Developer", icon: "📄" },
        { name: "Awal Manga", uid: "12211666", role: "Full-Stack and Cloud Infrastructure Engineer", icon: "⚙️" }
    ];

    return (
        <div className="min-h-screen bg-[#06060e] text-slate-100 selection:bg-indigo-500/30 font-sans">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#06060e]/80 backdrop-blur-2xl border-b border-white/5 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xl font-black tracking-tighter text-white">
                    <span className="text-2xl">🛡️</span>
                    Autonomous AI Recruitment Platform
                </div>
                <div className="hidden lg:flex items-center gap-8">
                    <a href="#home" className="text-[10px] font-black text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-[0.3em]">Home</a>
                    <a href="#pillars" className="text-[10px] font-black text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-[0.3em]">Pillars</a>
                    <a href="#compliance" className="text-[10px] font-black text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-[0.3em]">Compliance</a>
                    <a href="#team" className="text-[10px] font-black text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-[0.3em]">Creators</a>
                    <Link to="/login" className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-[10px] font-black text-white transition-all uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20">Login</Link>
                </div>
            </nav>

            {/* Hero */}
            <section id="home" className="relative pt-52 pb-32 px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="relative z-10 space-y-12">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
                            Professional Tech-Elegance Architecture
                        </div>
                        <h1 className="text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.85] italic">
                            The Future of <br/>
                            Ethical Talent Acquisition is <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Autonomous.</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl leading-relaxed font-medium border-l-2 border-indigo-500/30 pl-6">
                            Harnessing <span className="text-white font-bold">Swin Transformers</span> and <span className="text-white font-bold">Adversarial Debiasing</span> to deliver a 95% accurate, fair, and human-free hiring experience through a unified, human-free ecosystem.
                        </p>
                        <div className="flex items-center gap-6">
                            <button className="btn-premium py-4 px-10 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/10">Book a Demo</button>
                            <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Transparency Log (XAI)</button>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/10 blur-[150px] group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
                        <div className="relative glass-card border-white/5 p-2 rounded-[48px] shadow-2xl overflow-hidden grayscale-[30%] hover:grayscale-0 transition-all duration-700">
                            <img src="/assets/landing-hero.png" alt="Platform Matrix" className="w-full h-auto rounded-[46px] opacity-70" />
                            <div className="absolute bottom-10 left-10 glass-card p-6 border-indigo-500/20 bg-black/60 backdrop-blur-3xl space-y-2">
                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Suitability Index (CSI)</p>
                                <p className="text-3xl font-black text-white italic tracking-tighter">AI-ROM Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-20 bg-white/[0.01] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="space-y-3">
                        <div className="flex items-end gap-3">
                            <p className="text-5xl font-black text-white tracking-tighter italic">18 <span className="text-indigo-500">→</span> {Math.floor(counts.days)}</p>
                            <p className="text-xl font-black text-slate-600 italic mb-1 uppercase tracking-tighter">Days</p>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Reduction in Time-to-Hire</p>
                    </div>
                    <div className="space-y-3 border-x border-white/5 px-16">
                        <div className="flex items-end gap-3">
                            <p className="text-5xl font-black text-white tracking-tighter italic">40%</p>
                            <p className="text-xl font-black text-emerald-500 italic mb-1 uppercase tracking-tighter">Growth</p>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Bias Reduction vs. Traditional AI</p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-end gap-3">
                            <p className="text-5xl font-black text-white tracking-tighter italic">30-50%</p>
                            <p className="text-xl font-black text-slate-600 italic mb-1 uppercase tracking-tighter">Faster</p>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Assessment Duration Efficiency</p>
                    </div>
                </div>
            </section>

            {/* Pillars */}
            <section id="pillars" className="py-48 px-8">
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="space-y-6">
                        <h2 className="text-6xl font-black text-white tracking-tighter italic"><span className="text-indigo-500 underline decoration-indigo-500/20 underline-offset-8">The Trinity</span> Architecture.</h2>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em]">Human-Free Hiring Ecosystem</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { 
                                id: 'MIVM', 
                                title: 'Multi-Modal Integrity', 
                                desc: 'Real-time proctoring using Swin Transformers for lip-sync analysis and eye-gaze tracking to ensure 95%+ fraud detection accuracy.',
                                accent: 'indigo'
                            },
                            { 
                                id: 'BM-CSE', 
                                title: 'Bias-Mitigated Scoring', 
                                desc: 'Adaptive testing via Bayesian Item Response Theory (BIRT) that mathematically decouples protected attributes from performance metrics.',
                                accent: 'emerald'
                            },
                            { 
                                id: 'AI-ROM', 
                                title: 'The Decision Engine', 
                                desc: 'Fuses multi-sensory data into a unified Candidate Suitability Index (CSI) for instant, autonomous shortlisting decisions.',
                                accent: 'purple'
                            }
                        ].map((pillar, i) => (
                            <div key={i} className="group glass-card p-12 space-y-10 hover:border-white/10 transition-all duration-500">
                                <span className={`text-[11px] font-black text-${pillar.accent}-500 uppercase tracking-[0.4em]`}>{pillar.id}</span>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-white italic tracking-tighter leading-none">{pillar.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">{pillar.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section id="team" className="py-48 px-8 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="flex justify-between items-end">
                        <div className="space-y-4">
                            <h2 className="text-6xl font-black text-white tracking-tighter italic">The Creators.</h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em]">Innovation & Patent Development Team</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Supervised By</p>
                            <p className="text-xl font-black text-white italic">Dr. Ruby Singh</p>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">School of CSE, LPU</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {team.map((member, i) => (
                            <div key={i} className="glass-card p-8 border-white/5 hover:border-indigo-500/20 transition-all group">
                                <div className="text-3xl mb-6 group-hover:scale-110 transition-transform inline-block">{member.icon}</div>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-lg font-black text-white leading-none">{member.name}</h4>
                                        <p className="text-[9px] font-bold text-indigo-500/60 mt-1">UID: {member.uid}</p>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Compliance */}
            <section id="compliance" className="py-48 px-8 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">EU AI Act & EEOC Standard Compliance</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Our architecture is built on the principle of Explainable AI (XAI). Every decision is backed by a transparency log that ensures legal auditable compliance across all jurisdictions.
                        </p>
                    </div>
                    <div className="flex justify-center gap-12 opacity-20">
                        <span className="text-xl font-black tracking-[0.5em] italic">ISO-27001</span>
                        <span className="text-xl font-black tracking-[0.5em] italic">SOC-2</span>
                        <span className="text-xl font-black tracking-[0.5em] italic">GDPR</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 px-8 bg-black/40 border-t border-white/5 space-y-16">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
                    <div className="space-y-8">
                        <div className="text-2xl font-black tracking-tighter text-white">Autonomous AI Platform.</div>
                        <p className="text-slate-500 max-w-sm text-sm font-medium">
                            Designed and developed at Lovely Professional University. Pushing the boundaries of ethical talent acquisition.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Lead Contact</p>
                            <p className="text-xs text-slate-400 font-bold">Ankit Kumar</p>
                            <p className="text-xs text-indigo-400 font-medium">+91 8320253367</p>
                            <p className="text-[10px] text-slate-600 truncate">ankit.12210033@lpu.in</p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Secondary Contact</p>
                            <p className="text-xs text-slate-400 font-bold">Anshuman Kashyap</p>
                            <p className="text-xs text-indigo-400 font-medium">+91 9142082020</p>
                            <p className="text-[10px] text-slate-600 truncate">anshuman.kashyap@lpu.in</p>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-16 border-t border-white/5">
                    <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.6em]">&copy; 2026 Autonomous AI Recruitment Platform • Established at LPU</p>
                </div>
            </footer>
        </div>
    );
}
