import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeStatus, setResumeStatus] = useState(''); // 'uploaded' or ''
    const [resumeKeywords, setResumeKeywords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile');
            setName(res.data.name || '');
            setPhone(res.data.phone || '');
            setSkills(res.data.skills || []);
            setResumeKeywords(res.data.resumeKeywords || []);
            if (res.data.resumePath) {
                setResumeStatus('uploaded');
            }
        } catch (err) {
            console.error('Fetch profile error:', err);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!name.trim()) return setMessage({ type: 'error', text: 'Name is required' });
        if (!phone.trim()) return setMessage({ type: 'error', text: 'Phone is required' });
        if (skills.length === 0) return setMessage({ type: 'error', text: 'At least one skill is required' });

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.post('/profile', { name, phone, skills });
            updateUser({ ...user, name: res.data.user.name, profileCompleted: true });
            setMessage({ type: 'success', text: 'Profile saved successfully!' });
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to save profile',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResumeUpload = async (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setMessage({ type: 'error', text: 'Only PDF files are accepted' });
            return;
        }

        setUploadLoading(true);
        setMessage({ type: '', text: '' });
        setResumeFile(file);

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await api.post('/profile/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResumeKeywords(res.data.parsedData?.skills || []);
            setResumeStatus('uploaded');
            setMessage({
                type: 'success',
                text: `Resume uploaded and AI-parsed!`,
            });
            
            // Auto-fill from AI results
            if (res.data.parsedData?.name) setName(res.data.parsedData.name);
            if (res.data.parsedData?.phone) setPhone(res.data.parsedData.phone);
            if (res.data.parsedData?.skills?.length > 0) setSkills(res.data.parsedData.skills);
            
        } catch (err) {
            setResumeFile(null);
            setResumeStatus('');
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to upload resume',
            });
        } finally {
            setUploadLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleResumeUpload(file);
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const skill = skillInput.trim().toLowerCase();
            if (skill && !skills.includes(skill)) {
                setSkills([...skills, skill]);
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter((s) => s !== skillToRemove));
    };

    return (
        <div className="min-h-screen bg-[#0a0a1a]">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 py-12">
                <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-2">
                        👤 Your Profile
                    </h1>
                    <p className="text-slate-400 text-lg">Complete your profile and upload your resume to apply for jobs</p>
                </header>

                {message.text && (
                    <div className={`alert mb-8 animate-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column — Personal Info */}
                    <div className="glass-card p-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
                                <span className="text-indigo-400 text-2xl">📋</span>
                                Personal Information
                            </h2>
                            <p className="text-slate-500 text-sm">Update your basic contact details</p>
                        </div>
                        
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Full Name *</label>
                                <input
                                    type="text"
                                    className="glass-input"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    id="name-input"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                                <input
                                    type="email"
                                    className="glass-input opacity-60 cursor-not-allowed"
                                    value={user?.email || ''}
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    className="glass-input"
                                    placeholder="+91 98765 43210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    id="phone-input"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Skills * <span className="text-slate-500 text-xs font-normal">(press Enter or use commas)</span></label>
                                <div 
                                    className="glass-input flex flex-wrap gap-2 min-h-[100px] cursor-text"
                                    onClick={() => document.getElementById('skill-input')?.focus()}
                                >
                                    {skills.map((skill) => (
                                        <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-sm font-medium animate-in zoom-in-50 duration-200">
                                            {skill}
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                                                className="hover:text-red-400 transition-colors"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        id="skill-input"
                                        type="text"
                                        className="bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-sm flex-1 min-w-[120px]"
                                        placeholder={skills.length === 0 ? 'e.g. react, python, sql...' : 'Add more...'}
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={addSkill}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-premium w-full shadow-indigo-500/10"
                                disabled={loading}
                                id="save-profile-btn"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Saving Profile...</span>
                                    </div>
                                ) : (
                                    '💾 Save My Profile'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Column — Resume Upload */}
                    <div className="glass-card p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div>
                            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
                                <span className="text-indigo-400 text-2xl">📄</span>
                                Resume Upload
                            </h2>
                            <p className="text-slate-500 text-sm">Upload your CV to unlock AI-powered job matching</p>
                        </div>

                        {resumeStatus === 'uploaded' || resumeFile ? (
                            <div className={`px-6 py-4 rounded-xl flex items-center gap-4 border transition-all ${uploadLoading ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400 animate-pulse' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'}`}>
                                <span className="text-2xl">{uploadLoading ? '⏳' : '📄'}</span>
                                <span className="font-semibold text-sm truncate">
                                    {uploadLoading ? 'Analyzing your profile with AI...' : (resumeFile?.name || 'Resume Successfully Uploaded')}
                                </span>
                            </div>
                        ) : null}

                        {!resumeStatus && !uploadLoading && (
                            <div
                                className={`group relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${dragOver ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📤</div>
                                <p className="text-slate-200 font-bold text-lg mb-1">Drag & drop your resume</p>
                                <p className="text-slate-500 text-sm">or click to browse local files</p>
                                <p className="mt-4 text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-loose bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5">PDF Only • Max 5MB</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleResumeUpload(e.target.files[0])}
                                    style={{ display: 'none' }}
                                    id="resume-file-input"
                                />
                            </div>
                        )}

                        {uploadLoading && (
                            <div className="border-2 border-white/5 rounded-2xl p-12 text-center bg-white/5">
                                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
                                <p className="text-indigo-400 font-bold">Deep Scanning Resume...</p>
                                <p className="text-slate-500 text-sm mt-2">Our AI is extracting skills and contact info</p>
                            </div>
                        )}

                        {resumeStatus === 'uploaded' && !uploadLoading && (
                            <div 
                                className="group border-2 border-emerald-500/20 rounded-2xl p-10 text-center bg-emerald-500/5 cursor-pointer hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="text-5xl mb-4">✨</div>
                                <p className="text-emerald-400 font-bold text-lg">AI Parsing Complete</p>
                                <p className="text-emerald-500/60 text-sm">Click here to re-upload if needed</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleResumeUpload(e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        )}

                        {resumeKeywords.length > 0 && (
                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>AI-Extracted Expertise</span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">{resumeKeywords.length} tags</span>
                                </h3>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    {resumeKeywords.map((kw) => (
                                        <span key={kw} className="px-3 py-1 bg-white/5 border border-white/5 text-slate-400 rounded-md group hover:border-indigo-500/30 transition-colors">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            className="btn-premium w-full from-emerald-500 to-teal-600 shadow-emerald-500/10"
                            onClick={() => navigate('/dashboard')}
                            id="go-to-jobs-btn"
                        >
                            Browse Jobs 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
