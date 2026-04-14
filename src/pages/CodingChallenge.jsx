import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const LANGUAGES = [
    { id: 'python', label: 'Python', icon: '🐍' },
    { id: 'cpp', label: 'C++', icon: '⚡' },
    { id: 'java', label: 'Java', icon: '☕' },
];

const formatValue = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
};

export default function CodingChallenge() {
    const { applicationId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [solutions, setSolutions] = useState([
        { language: 'python', code: '' },
        { language: 'python', code: '' }
    ]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const res = await api.get(`/test/coding/${applicationId}`);
                const qs = res.data.questions || [];
                setQuestions(qs);
                
                if (qs.length > 0) {
                    const initialSolutions = qs.map(q => ({
                        language: 'python',
                        code: q.starterCode?.['python'] || ''
                    }));
                    setSolutions(initialSolutions);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load questions');
            } finally {
                setLoading(false);
            }
        };
        loadQuestions();
    }, [applicationId]);

    const handleLanguageChange = (newLang) => {
        const newSolutions = [...solutions];
        const currentQ = questions[activeIdx];
        const sc = currentQ.starterCode || {};
        
        const isDefault = Object.values(sc).some(s => 
            newSolutions[activeIdx].code.trim() === s.trim() || !newSolutions[activeIdx].code.trim()
        );
        
        newSolutions[activeIdx].language = newLang;
        if (isDefault) {
            newSolutions[activeIdx].code = sc[newLang] || '';
        }
        setSolutions(newSolutions);
    };

    const handleCodeChange = (newCode) => {
        const newSolutions = [...solutions];
        newSolutions[activeIdx].code = newCode ?? '';
        setSolutions(newSolutions);
    };

    const runCode = async () => {
        const sol = solutions[activeIdx];
        if (!sol.code.trim()) return;
        setRunning(true);
        setOutput('');
        setError('');
        try {
            const testCase = questions[activeIdx].testCases[0];
            const res = await api.post('/compiler/execute', {
                language: sol.language,
                code: sol.code,
                testCase: testCase
            });
            const out = res.data.stdout || '';
            const status = res.data.status ? `[${res.data.status}] ` : '';
            setOutput(status + (out || 'No output produced.'));
            if (res.data.stderr) setOutput(prev => prev + '\nError: ' + res.data.stderr);
        } catch (err) {
            setError('Execution Error: ' + (err.response?.data?.message || err.message));
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            const res = await api.post(`/test/coding/${applicationId}`, {
                solutions
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="compiler-container">
                <Navbar />
                <div className="loading-page">
                    <div className="spinner"></div>
                    <p className="text-muted">Generating AI Coding Challenges...</p>
                </div>
            </div>
        );
    }

    if (error && questions.length === 0) {
        return (
            <div className="compiler-container">
                <Navbar />
                <div className="page-container" style={{ padding: 40 }}>
                    <div className="alert alert-error" style={{ maxWidth: 600, margin: '0 auto' }}>⚠️ {error}</div>
                    <div className="text-center mt-6">
                        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[activeIdx];
    const currentSolution = solutions[activeIdx];

    return (
        <div className="h-screen flex flex-col bg-[#0a0a0a] text-slate-200 overflow-hidden">
            <Navbar />
            
            {/* Split IDE Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Pane: Problem Description */}
                <aside className="w-[40%] flex flex-col border-r border-white/5 bg-[#0f0f1f]/50 overflow-y-auto custom-scrollbar">
                    <div className="p-6 space-y-8 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-3">
                            {questions.map((_, i) => (
                                <button 
                                    key={i} 
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeIdx === i ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.2)]' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}
                                    onClick={() => setActiveIdx(i)}
                                >
                                    Challenge {i + 1}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-black text-white tracking-tight">{currentQuestion?.title}</h1>
                                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-[10px] font-bold text-amber-500 uppercase tracking-tighter">Medium</span>
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none text-slate-400 leading-relaxed">
                                {currentQuestion?.description}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                                Constraints
                            </h3>
                            <ul className="space-y-2">
                                {currentQuestion?.constraints?.map((c, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                                        <span className="text-indigo-500 mt-1.5">•</span>
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                                Examples
                            </h3>
                            <div className="space-y-4">
                                {currentQuestion?.testCases?.slice(0, 2).map((tc, i) => (
                                    <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-2 font-mono text-xs">
                                        <div className="flex gap-2">
                                            <span className="text-indigo-400 font-bold w-12">Input:</span>
                                            <span className="text-slate-300 break-all">{formatValue(tc.input)}</span>
                                        </div>
                                        <div className="flex gap-2 border-t border-white/5 pt-2">
                                            <span className="text-emerald-400 font-bold w-12">Output:</span>
                                            <span className="text-slate-300">{formatValue(tc.expected)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className="mt-auto p-6 bg-indigo-500/10 border-t border-indigo-500/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="space-y-6">
                                <h2 className="text-xl font-black text-white">Assessment Final Report</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-[#0a0a1a] rounded-xl border border-white/5">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Aptitude</p>
                                        <p className="text-lg font-bold text-white">{result.aptitudeScore}<span className="text-[10px] text-slate-600">/40</span></p>
                                    </div>
                                    <div className="p-3 bg-[#0a0a1a] rounded-xl border border-white/5">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Coding</p>
                                        <p className="text-lg font-bold text-white">{result.codingScore}<span className="text-[10px] text-slate-600">/60</span></p>
                                    </div>
                                </div>

                                <div className={`py-4 rounded-xl text-center font-black tracking-widest text-sm border ${result.shortlisted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                    {result.shortlisted ? 'SHORTLISTED ✅' : 'NOT SHORTLISTED ❌'}
                                </div>

                                <button 
                                    className="btn-premium w-full py-4 text-sm shadow-indigo-500/20" 
                                    onClick={() => navigate(result.shortlisted ? `/interview/${applicationId}` : `/results/${applicationId}`)}
                                >
                                    {result.shortlisted ? 'Start Video Interview →' : 'View Full Report'}
                                </button>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Right Pane: IDE Interface */}
                <main className="flex-1 flex flex-col bg-[#050505]">
                    {/* IDE Toolbar */}
                    <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0a0a]">
                        <div className="flex items-center gap-2">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.id}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border ${currentSolution.language === lang.id ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'}`}
                                    onClick={() => handleLanguageChange(lang.id)}
                                >
                                    <span className="text-sm">{lang.icon}</span>
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50" 
                                onClick={runCode} 
                                disabled={running || result}
                            >
                                {running ? 'Running...' : 'Run Code'}
                            </button>
                            <button 
                                className="btn-premium px-6 py-2 text-xs shadow-indigo-500/20" 
                                onClick={handleSubmit} 
                                disabled={submitting || result}
                            >
                                {submitting ? 'Submitting...' : 'Submit All Solution'}
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 relative group">
                        <Editor
                            height="100%"
                            language={currentSolution.language}
                            value={currentSolution.code}
                            theme="vs-dark"
                            onChange={(value) => handleCodeChange(value)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 16,
                                padding: { top: 20 },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 4,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                renderLineHighlight: 'all',
                                roundedSelection: true,
                                lineNumbersMinChars: 3,
                                readOnly: !!result
                            }}
                        />
                        {result && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none"></div>}
                    </div>

                    {/* Console Output */}
                    <div className="h-[30%] border-t border-white/10 bg-[#080808] flex flex-col">
                        <div className="h-10 px-6 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                                Output Console
                            </span>
                            <button 
                                className="text-[10px] text-slate-600 hover:text-slate-400 font-bold flex items-center gap-1"
                                onClick={() => setOutput('')}
                            >
                                <span className="text-xs">🗑️</span> Clear
                            </button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-3 custom-scrollbar">
                            {output && (
                                <div className="animate-in fade-in duration-300">
                                    <p className="text-emerald-400 font-bold mb-2 text-xs uppercase opacity-80 border-b border-emerald-500/10 pb-1 w-fit">Standard Output:</p>
                                    <pre className="text-slate-300 whitespace-pre-wrap pl-2 border-l-2 border-emerald-500/20">{output}</pre>
                                </div>
                            )}
                            {!output && !error && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-40">
                                    <span className="text-3xl mb-2">💻</span>
                                    <p className="text-xs italic tracking-tight">Execute your code to monitor output here...</p>
                                </div>
                            )}
                            {error && (
                                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl animate-in slide-in-from-top-2">
                                    <p className="text-red-400 font-bold text-xs uppercase mb-1">Runtime Error:</p>
                                    <p className="text-red-300/80 text-xs italic">{error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
