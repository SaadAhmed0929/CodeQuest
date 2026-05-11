import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Editor from '@monaco-editor/react';
import { ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactConfetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVEL_MAP } from '../data/curriculum';

const Level = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, deductEnergy, awardLevel, markLevelComplete, MAX_ENERGY } = useAuth();
    const [level, setLevel] = useState(null);
    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [testResults, setTestResults] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [antigravity, setAntigravity] = useState(false);
    const [wwe, setWwe] = useState(false);
    const [etrigan, setEtrigan] = useState(false);
    const hasFailed = useRef(false);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchLevel = async () => {
            try {
                const res = await api.get(`/levels/${id}`);
                if (res.data && res.data.Title) {
                    setLevel(res.data);
                    setCode(res.data.content?.initial_code || '# Write your code here\n');
                } else {
                    throw new Error('Empty response');
                }
            } catch {
                // Backend unreachable — use bundled curriculum fallback
                const fallback = LEVEL_MAP[parseInt(id)];
                if (fallback) {
                    setLevel(fallback);
            setCode(fallback.content?.initial_code || '# Write your code here\n');
                }
            }
            setResult(null);
            setTestResults([]);
            hasFailed.current = false;
        };
        fetchLevel();
    }, [id]);

    // ── Code runner: local backend → Piston API fallback ──────────
    const runCode = async (sourceCode) => {
        // 1. Try local backend
        try {
            const res = await api.post('/execute', {
                source_code: sourceCode,
                language_id: 71,
            });
            return (res.data.stdout || res.data.stderr || res.data.compile_output || '').trim();
        } catch { /* fall through */ }

        // 2. Piston public API (free, no key)
        const pistonRes = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: 'python',
                version: '3.10.0',
                files: [{ content: sourceCode }],
            }),
        });
        const pistonData = await pistonRes.json();
        return (pistonData.run?.stdout || pistonData.run?.stderr || '').trim();
    };


    const handleRunCode = async () => {
        // 🚀 EASTER EGG — antigravity
        if (code.trim().includes('import antigravity')) {
            setAntigravity(true);
            setShowConfetti(true);
            awardLevel(50, 20);
            setTimeout(() => setShowConfetti(false), 6000);
            return;
        }

        // 🏆 EASTER EGG — WWE
        if (code.trim().includes('import wwe')) {
            setWwe(true);
            awardLevel(75, 30);
            return;
        }

        // 🥊 EASTER EGG — ETRIGAN106
        const c = code.trim();
        if (c.includes('import etrigan106') || c.includes('from legends import etrigan106')) {
            // Play boxing bell sound
            const audio = new Audio('/boxing-bell.mp3'); // Mocking audio path
            audio.play().catch(()=>{}); // Ignore if browser blocks autoplay
            
            setEtrigan(true);
            awardLevel(150, 100);
            return;
        }

        if ((user?.energy ?? MAX_ENERGY) === 0) return;
        setIsRunning(true);
        setResult(null);
        setActiveTab(0);
        deductEnergy();

        const testCases = level?.content?.test_cases || [];

        try {
            const initialTabs = testCases.map((tc, idx) => ({
                name: tc.label || `Test ${idx + 1}`,
                output: 'In queue...',
                status: 'waiting',
                passed: false,
                expected: tc.expected_output,
            }));
            setTestResults([...initialTabs]);

            let allPassed = true;
            const completed = [...initialTabs];

            for (let i = 0; i < testCases.length; i++) {
                const tc = testCases[i];
                setActiveTab(i);
                completed[i] = { ...completed[i], status: 'running', output: 'Executing...' };
                setTestResults([...completed]);

                const compoundCode = (tc.hidden_code ? tc.hidden_code + '\n\n' : '') + code.trimEnd();

                try {
                    const trimmedOut = await runCode(compoundCode);
                    const normalize = (s) => (s || '').replace(/\r/g, '').trim();
                    const isAccepted = normalize(trimmedOut) === normalize(tc.expected_output);
                    if (!isAccepted) allPassed = false;
                    completed[i] = { ...completed[i], output: trimmedOut, passed: isAccepted, status: 'done' };
                } catch (err) {
                    allPassed = false;
                    completed[i] = { ...completed[i], output: `Error: ${err.message}`, passed: false, status: 'done' };
                }
                setTestResults([...completed]);
            }

            let badge = null;
            const hour = new Date().getHours();
            if (allPassed && hasFailed.current) badge = { icon: '🐛', name: 'Syntax Squasher', desc: 'Failed once, then nailed it!' };
            if (allPassed && hour >= 0 && hour < 5) badge = { icon: '🦉', name: 'Night Owl', desc: 'Coding after midnight!' };

            if (allPassed) {
                const pts = level.points_value || 10;
                const coins = level.coins_value || 5;
                awardLevel(pts, coins);
                markLevelComplete(parseInt(id));
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
                setResult({ success: true, message: 'All tests passed!', points: pts, coins, badge });
            } else {
                hasFailed.current = true;
                setResult({ success: false, message: 'Not all tests passed. Check your output and try again.' });
            }
        } catch {
            setTestResults([{ name: 'Error', output: 'Could not connect to execution server.', status: 'done', passed: false }]);
        } finally {
            setIsRunning(false);
        }
    };

    // ── Loading state ─────────────────────────────────────────────
    if (!level) {
        return (
            <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '32px', height: '2px', background: '#FF2D00', margin: '0 auto 16px' }} />
                        <p className="label-tech" style={{ color: '#333' }}>LOADING LEVEL...</p>
                    </div>
                </div>
            </div>
        );
    }

    const noEnergy = (user?.energy ?? MAX_ENERGY) === 0;
    const nextLevelId = parseInt(id) + 1;

    // ── Render ────────────────────────────────────────────────────
    return (
        <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#E8DDD0' }}>

            {/* Confetti */}
            {showConfetti && (
                <ReactConfetti width={windowSize.width} height={windowSize.height}
                    recycle={false} numberOfPieces={350} gravity={0.25}
                    colors={['#FF2D00','#d4a017','#E8DDD0','#7cc47a','#e8623a']} />
            )}
            
            {/* 🚀 ANTIGRAVITY EASTER EGG */}
            <AnimatePresence>
                {antigravity && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        style={{ position:'fixed', inset:0, zIndex:999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#000' }}>
                        
                        {/* 🌌 Nebula Glows */}
                        <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle, rgba(255,45,0,0.08) 0%, transparent 70%)', filter:'blur(60px)' }} />
                        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'50%', height:'50%', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,100,255,0.05) 0%, transparent 70%)', filter:'blur(60px)' }} />

                        {/* 🌟 Dynamic Starfield */}
                        {Array.from({length:80}).map((_,i) => {
                            const size = Math.random()*2 + 1;
                            const duration = 2 + Math.random()*4;
                            return (
                                <motion.div key={i}
                                    style={{ position:'absolute', borderRadius:'50%', background:'white',
                                        width:`${size}px`, height:`${size}px`,
                                        top:`${Math.random()*100}%`, left:`${Math.random()*100}%` }}
                                    animate={{ 
                                        y: [0, window.innerHeight + 100],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{ duration, repeat:Infinity, delay:Math.random()*duration, ease:'linear' }} />
                            );
                        })}

                        {/* 📦 Floating Code Block */}
                        <motion.div initial={{ y: 200, opacity:0 }} animate={{ y: -window.innerHeight - 300, opacity:[0,1,1,0] }}
                            transition={{ duration:4, delay:0.5, ease:'easeIn' }}
                            style={{ position:'absolute', top:'60%', left:'50%', transform:'translateX(-50%)', zIndex:5 }}>
                            <div style={{ width:'240px', border:'1px solid rgba(255,45,0,0.3)', background:'rgba(10,10,10,0.8)', backdropFilter:'blur(4px)' }}>
                                <div style={{ background:'rgba(255,45,0,0.1)', padding:'6px 12px', display:'flex', gap:'5px', alignItems:'center' }}>
                                    {['#ff5f57','#febc2e','#28c840'].map((c,i)=><div key={i} style={{width:'7px',height:'7px',borderRadius:'50%',background:c}}/>)}
                                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'#555', marginLeft:'6px' }}>antigravity.py</span>
                                </div>
                                <div style={{ padding:'16px', fontFamily:'var(--font-mono)', fontSize:'12px' }}>
                                    <span style={{color:'#FF2D00'}}>import</span>
                                    <span style={{color:'#E8DDD0'}}> antigravity</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 🚀 Rocket with Trail */}
                        <motion.div initial={{ y: 100, scale:0 }} animate={{ y: -window.innerHeight - 200, scale:[0, 1.2, 1] }}
                            transition={{ duration:3.5, delay:0.2, ease:'easeIn' }}
                            style={{ position:'absolute', bottom:'20%', fontSize:'80px', zIndex:6, filter:'drop-shadow(0 0 20px rgba(255,45,0,0.4))' }}>
                            🚀
                            <motion.div animate={{ opacity:[0.4, 0.8, 0.4], scale:[1, 1.2, 1] }} transition={{ duration:0.1, repeat:Infinity }}
                                style={{ position:'absolute', top:'100%', left:'50%', transform:'translateX(-50%)', width:'20px', height:'40px', background:'linear-gradient(to bottom, #FF2D00, transparent)', filter:'blur(5px)', borderRadius:'50%' }} />
                        </motion.div>

                        {/* 🪐 Main Card */}
                        <motion.div initial={{ opacity:0, scale:0.8, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
                            transition={{ delay:1.2, type:'spring', bounce:0.4 }}
                            style={{ textAlign:'center', padding:'40px', position:'relative', zIndex:10, background:'rgba(8,8,8,0.7)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.05)', boxShadow:'0 20px 50px rgba(0,0,0,0.5)' }}>
                            
                            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                                style={{fontSize:'72px', marginBottom:'20px', display:'inline-block'}}>🪐</motion.div>
                            
                            <div style={{ fontFamily:'var(--font-display)', fontSize:'36px', fontWeight:900, color:'#FF2D00', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'12px' }}>
                                Zero Gravity Detected
                            </div>
                            
                            <p style={{ fontFamily:'var(--font-mono)', fontSize:'13px', color:'#888', marginBottom:'32px', lineHeight:1.8, maxWidth:'400px' }}>
                                <span style={{color:'#E8DDD0'}}>import antigravity</span> is a legendary Python Easter egg. <br/>
                                In a real Python console, it teleports you to a secret XKCD comic about the joy of Python.
                            </p>

                            <motion.div whileHover={{ scale:1.02 }}
                                style={{ display:'inline-flex', alignItems:'center', gap:'16px', padding:'16px 28px', background:'rgba(255,45,0,0.1)', border:'1px solid #FF2D00', marginBottom:'32px', textAlign:'left' }}>
                                <span style={{fontSize:'28px'}}>🏆</span>
                                <div>
                                    <p style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'#E8DDD0', textTransform:'uppercase', fontSize:'15px', letterSpacing:'0.05em' }}>Secret Badge: SPACE EXPLORER</p>
                                    <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'#FF2D00', marginTop:'2px' }}>+50 XP &nbsp;•&nbsp; +20 COINS</p>
                                </div>
                            </motion.div>

                            <br />
                            <button onClick={() => setAntigravity(false)}
                                style={{ padding:'12px 32px', border:'1px solid #333', background:'transparent', color:'#E8DDD0', fontFamily:'var(--font-mono)', fontSize:'11px', letterSpacing:'0.2em', cursor:'pointer', textTransform:'uppercase', transition:'all 0.2s' }}
                                onMouseEnter={e => {e.currentTarget.style.borderColor='#FF2D00'; e.currentTarget.style.color='#FF2D00';}}
                                onMouseLeave={e => {e.currentTarget.style.borderColor='#333'; e.currentTarget.style.color='#E8DDD0';}}>
                                RETURN TO BASE
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🏆 WWE EASTER EGG */}
            <AnimatePresence>
                {wwe && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        style={{ position:'fixed', inset:0, zIndex:999, background:'#030303',
                            overflowY:'auto', display:'flex', flexDirection:'column', alignItems:'center' }}>

                        {/* ── Gold pyrotechnic sparks ── */}
                        {Array.from({ length: 28 }).map((_, i) => {
                            const left = `${Math.random() * 100}%`;
                            const delay = Math.random() * 2;
                            const dur = 2.5 + Math.random() * 2;
                            const size = Math.random() * 4 + 2;
                            return (
                                <motion.div key={`spark-${i}`}
                                    style={{ position:'fixed', bottom: 0, left, width:`${size}px`, height:`${size}px`,
                                        borderRadius:'50%', background: i % 3 === 0 ? '#d4a017' : i % 3 === 1 ? '#FF2D00' : '#fff',
                                        pointerEvents:'none', zIndex:1 }}
                                    animate={{ y:[0, -(300 + Math.random()*400)], opacity:[0, 1, 0], scale:[0, 1.5, 0] }}
                                    transition={{ duration: dur, repeat: Infinity, delay, ease:'easeOut' }} />
                            );
                        })}

                        {/* ── Sweeping spotlight ── */}
                        <motion.div
                            animate={{ x:['0%','120%','0%'], opacity:[0.05, 0.15, 0.05] }}
                            transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
                            style={{ position:'fixed', top:0, left:'-40%', width:'80%', height:'100%',
                                background:'linear-gradient(90deg,transparent,rgba(255,215,0,0.1),transparent)',
                                pointerEvents:'none', zIndex:2 }} />

                        {/* ── Content ── */}
                        <div style={{ width:'100%', maxWidth:'820px', padding:'48px 24px 80px',
                            position:'relative', zIndex:10 }} onClick={e => e.stopPropagation()}>

                            {/* ── Header ── */}
                            <motion.div initial={{ opacity:0, y:-40, scale:0.9 }}
                                animate={{ opacity:1, y:0, scale:1 }}
                                transition={{ type:'spring', bounce:0.4, delay:0.1 }}
                                style={{ textAlign:'center', marginBottom:'16px' }}>
                                <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', letterSpacing:'0.4em',
                                    color:'#d4a017', marginBottom:'20px', textTransform:'uppercase' }}>
                                    ⚡ CODEQUEST SECRET MODULE ⚡
                                </div>

                                {/* Animated belt emoji */}
                                <motion.div animate={{ scale:[1,1.12,1], filter:['brightness(1)','brightness(1.6)','brightness(1)'] }}
                                    transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
                                    style={{ fontSize:'52px', marginBottom:'16px', display:'block' }}>🏆</motion.div>

                                <motion.div
                                    animate={{ textShadow:['0 0 20px rgba(212,160,23,0.2)','0 0 60px rgba(212,160,23,0.7)','0 0 20px rgba(212,160,23,0.2)'] }}
                                    transition={{ duration:2.5, repeat:Infinity }}
                                    style={{ fontFamily:'var(--font-display)', fontSize:'clamp(40px,8vw,80px)',
                                        fontWeight:900, color:'#d4a017', textTransform:'uppercase',
                                        letterSpacing:'0.08em', lineHeight:1 }}>
                                    WWE LEGENDS
                                </motion.div>

                                <div style={{ fontFamily:'var(--font-display)', fontSize:'13px', color:'#444',
                                    textTransform:'uppercase', letterSpacing:'0.25em', marginTop:'14px' }}>
                                    A FAREWELL TO THE IMMORTALS
                                </div>

                                {/* Animated divider */}
                                <motion.div initial={{ width:0 }} animate={{ width:'120px' }}
                                    transition={{ delay:0.6, duration:0.8, ease:'easeOut' }}
                                    style={{ height:'2px', background:'linear-gradient(90deg,transparent,#d4a017,transparent)',
                                        margin:'20px auto 0' }} />
                            </motion.div>

                            {/* ── Wrestler cards ── */}
                            {[
                                {
                                    name: 'JOHN CENA',
                                    tag: '17× WORLD CHAMPION',
                                    years: '2002 – 2025',
                                    careerYrs: 23,
                                    accent: '#4a9eff',
                                    emoji: '🎖️',
                                    final: "Saturday Night's Main Event Vol. 1 — 2026",
                                    quote: '"Never Give Up"',
                                    facts: [
                                        '17-time world champion — record-holder',
                                        'Granted over 650 Make-A-Wish requests',
                                        'Hollywood: F9, Peacemaker, Suicide Squad',
                                        'The face of WWE for over two decades',
                                    ],
                                },
                                {
                                    name: 'AJ STYLES',
                                    tag: 'THE PHENOMENAL ONE',
                                    years: '1998 – 2026',
                                    careerYrs: 28,
                                    accent: '#FF2D00',
                                    emoji: '🔥',
                                    final: 'Royal Rumble — Career vs. Title — Jan 2026',
                                    quote: '"I am Phenomenal!"',
                                    facts: [
                                        'TNA/Impact: 2002–2014 — multiple world titles',
                                        'NJPW IWGP Heavyweight Champion: 2014–2016',
                                        'WWE Champion in his debut year at age 38',
                                        'Now coaching the next generation of superstars',
                                    ],
                                },
                                {
                                    name: 'BROCK LESNAR',
                                    tag: 'THE BEAST INCARNATE',
                                    years: '2000 – 2026',
                                    careerYrs: 26,
                                    accent: '#22c55e',
                                    emoji: '💀',
                                    final: 'WrestleMania 42 — Left boots & gloves in the ring',
                                    quote: '"Suplex City, Bitch."',
                                    facts: [
                                        'NCAA Division I Heavyweight Wrestling Champion',
                                        'UFC Heavyweight Champion — conquered two worlds',
                                        "Ended The Undertaker's legendary 21-0 streak",
                                        'Moved to WWE Alumni — an era truly over',
                                    ],
                                },
                            ].map((w, i) => (
                                <motion.div key={w.name}
                                    initial={{ opacity:0, y:50, scale:0.95 }}
                                    animate={{ opacity:1, y:0, scale:1 }}
                                    transition={{ delay: 0.4 + i * 0.22, type:'spring', bounce:0.35 }}
                                    style={{ marginBottom:'16px', position:'relative' }}>

                                    {/* Pulsing border glow */}
                                    <motion.div
                                        animate={{ opacity:[0.3, 0.8, 0.3], boxShadow:[`0 0 0px ${w.accent}00`,`0 0 16px ${w.accent}50`,`0 0 0px ${w.accent}00`] }}
                                        transition={{ duration:2.5, repeat:Infinity, delay: i * 0.7 }}
                                        style={{ position:'absolute', inset:0, pointerEvents:'none', borderLeft:`4px solid ${w.accent}` }} />

                                    <div style={{ background:'#0a0a0a', borderLeft:`4px solid ${w.accent}`, padding:'24px 24px 0' }}>

                                        {/* Name header row */}
                                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                                            marginBottom:'14px', flexWrap:'wrap', gap:'8px' }}>
                                            <div>
                                                {/* Dramatic name entrance */}
                                                <motion.div initial={{ x:-20, opacity:0 }} animate={{ x:0, opacity:1 }}
                                                    transition={{ delay: 0.5 + i * 0.22, type:'spring' }}
                                                    style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                                                    <motion.span animate={{ scale:[1,1.3,1] }}
                                                        transition={{ duration:1.8, repeat:Infinity, delay: i*0.5 }}
                                                        style={{ fontSize:'22px' }}>{w.emoji}</motion.span>
                                                    <div style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:900,
                                                        color:'#E8DDD0', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                                                        {w.name}
                                                    </div>
                                                </motion.div>
                                                <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px',
                                                    color:w.accent, letterSpacing:'0.25em', textTransform:'uppercase' }}>
                                                    {w.tag}
                                                </div>
                                            </div>
                                            <div style={{ textAlign:'right' }}>
                                                <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'#333' }}>{w.years}</div>
                                                <motion.div animate={{ rotate:[0,5,-5,0] }}
                                                    transition={{ duration:3, repeat:Infinity, delay: i*0.4 }}
                                                    style={{ fontSize:'22px', marginTop:'4px' }}>🏆</motion.div>
                                            </div>
                                        </div>

                                        {/* Career bar */}
                                        <div style={{ marginBottom:'16px' }}>
                                            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                                                <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'#333',
                                                    letterSpacing:'0.2em', textTransform:'uppercase' }}>CAREER SPAN</span>
                                                <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color: w.accent }}>{w.careerYrs} YEARS</span>
                                            </div>
                                            <div style={{ height:'2px', background:'#111', overflow:'hidden' }}>
                                                <motion.div initial={{ width:0 }}
                                                    animate={{ width:`${(w.careerYrs / 28) * 100}%` }}
                                                    transition={{ delay: 0.7 + i * 0.22, duration:1.2, ease:'easeOut' }}
                                                    style={{ height:'100%', background:w.accent }} />
                                            </div>
                                        </div>

                                        {/* Quote */}
                                        <motion.div
                                            animate={{ borderColor:[`${w.accent}33`,w.accent,`${w.accent}33`] }}
                                            transition={{ duration:3, repeat:Infinity, delay: i * 0.8 }}
                                            style={{ fontFamily:'var(--font-display)', fontSize:'15px', fontStyle:'italic',
                                                color:w.accent, marginBottom:'16px', padding:'10px 14px',
                                                border:`1px solid ${w.accent}33` }}>
                                            {w.quote}
                                        </motion.div>

                                        {/* Facts */}
                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 16px', marginBottom:'16px' }}>
                                            {w.facts.map((f, fi) => (
                                                <motion.div key={fi} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                                                    transition={{ delay: 0.8 + i * 0.22 + fi * 0.07 }}
                                                    style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
                                                    <span style={{ color:w.accent, fontSize:'10px', marginTop:'3px', flexShrink:0 }}>▸</span>
                                                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'#666', lineHeight:1.5 }}>{f}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Final match bar */}
                                        <div style={{ padding:'10px 14px', background:'#060606',
                                            borderTop:'1px solid #0f0f0f', margin:'0 -24px' }}>
                                            <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'#2a2a2a',
                                                letterSpacing:'0.2em', textTransform:'uppercase' }}>FINAL MATCH — </span>
                                            <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'#555' }}>{w.final}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* ── Footer ── */}
                            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
                                style={{ textAlign:'center', marginTop:'40px' }}>

                                {/* Animated trophy row */}
                                <div style={{ display:'flex', justifyContent:'center', gap:'24px', marginBottom:'20px' }}>
                                    {['🎖️','🏆','💀'].map((e, i) => (
                                        <motion.span key={i}
                                            animate={{ y:[0,-8,0], opacity:[0.6,1,0.6] }}
                                            transition={{ duration:1.5, repeat:Infinity, delay: i * 0.4 }}
                                            style={{ fontSize:'28px' }}>{e}</motion.span>
                                    ))}
                                </div>

                                <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'#222',
                                    letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:'28px' }}>
                                    +75 XP &nbsp;·&nbsp; +30 COINS &nbsp;·&nbsp; BADGE: HARDCORE CODER
                                </div>

                                <motion.button onClick={() => setWwe(false)}
                                    whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                                    animate={{ boxShadow:['0 0 0px #d4a01700','0 0 20px #d4a01740','0 0 0px #d4a01700'] }}
                                    transition={{ duration:2.5, repeat:Infinity }}
                                    style={{ padding:'14px 40px', border:'1px solid #d4a017', background:'transparent',
                                        color:'#d4a017', fontFamily:'var(--font-display)', fontSize:'12px',
                                        fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer' }}>
                                    BACK TO THE RING
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 🥊 ETRIGAN106 EASTER EGG */}
            <AnimatePresence>
                {etrigan && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        style={{ position:'fixed', inset:0, zIndex:999, background:'#000', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                        
                        {/* Terminal Boot Sequence */}
                        <motion.div initial={{ opacity:1 }} animate={{ opacity:0, transitionEnd: { display: 'none' } }} transition={{ delay: 3.8, duration: 0.5 }}
                            style={{ position:'absolute', inset:0, padding:'40px', fontFamily:'var(--font-mono)', fontSize:'18px', color:'#d4af37', background:'#000', zIndex:1000, display:'flex', flexDirection:'column', gap:'12px' }}>
                            <motion.div initial={{opacity:0}} animate={{opacity:1}}> {'>'} Executing sequence...</motion.div>
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}}> {'>'} JAB...</motion.div>
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4}}> {'>'} CROSS...</motion.div>
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.0}}> {'>'} SLIPPING EXCEPTIONS...</motion.div>
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.6}}> {'>'} KNOCKOUT BLOW DELIVERED.</motion.div>
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:3.2}}> {'>'} Accessing The Ring...</motion.div>
                        </motion.div>

                        {/* Main Gym Screen */}
                        <motion.div initial={{ opacity:0, scale:0.9, y:30 }} animate={{ opacity:1, scale:1, y:0 }} transition={{ delay: 4.0, duration: 0.8, type:'spring', bounce:0.3 }}
                            style={{ width:'100%', maxWidth:'600px', padding:'40px', background:'#050505', border:'1px solid #222', position:'relative', boxShadow:'0 20px 60px rgba(212,175,55,0.05)' }}>
                            
                            {/* Gritty lighting overlay */}
                            <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'300px', height:'100px', background:'radial-gradient(ellipse at top, rgba(212,175,55,0.15), transparent)', pointerEvents:'none' }} />

                            <div style={{ textAlign:'center', marginBottom:'30px' }}>
                                <motion.div animate={{ y:[-5,5,-5] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                                    style={{ fontSize:'64px', marginBottom:'16px' }}>🥊</motion.div>
                                <div style={{ fontFamily:'var(--font-display)', fontSize:'32px', fontWeight:900, color:'#d4af37', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                                    The Mythic Architect
                                </div>
                                <div style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'#555', letterSpacing:'0.2em', marginTop:'4px' }}>ETRIGAN106</div>
                            </div>

                            <div style={{ borderLeft:'3px solid #d4af37', padding:'24px', background:'#0a0a0a', marginBottom:'30px', position:'relative' }}>
                                <motion.div initial={{ width:0 }} animate={{ width:'100%' }} transition={{ delay:4.8, duration:3, ease:'linear' }}
                                    style={{ position:'absolute', top:0, left:0, height:'1px', background:'linear-gradient(90deg, #d4af37, transparent)' }} />
                                <p style={{ fontFamily:'var(--font-mono)', fontSize:'14px', color:'#d4af37', lineHeight:1.7, fontStyle:'italic' }}>
                                    "You found the architect. In the ring and in the terminal, the rule is the same: keep your hands up, protect your core, and never stay down on the canvas. Every bug is just a sparring partner making you sharper. Welcome to the deep end."
                                </p>
                                <div style={{ textAlign:'right', marginTop:'16px', fontFamily:'var(--font-mono)', fontSize:'11px', color:'#666', textTransform:'uppercase', letterSpacing:'0.1em' }}>— etrigan106</div>
                            </div>

                            <motion.div whileHover={{ scale:1.02 }}
                                style={{ display:'flex', alignItems:'center', gap:'16px', padding:'16px 20px', background:'rgba(212,175,55,0.05)', border:'1px solid rgba(212,175,55,0.3)', marginBottom:'30px' }}>
                                <span style={{fontSize:'32px'}}>👑</span>
                                <div>
                                    <p style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'#d4af37', textTransform:'uppercase', fontSize:'15px', letterSpacing:'0.05em' }}>The Champion's Grit Unlocked</p>
                                    <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'#888', marginTop:'4px' }}>+150 XP &nbsp;•&nbsp; +100 COINS &nbsp;•&nbsp; GOLDEN STREAK ACTIVE</p>
                                </div>
                            </motion.div>

                            <div style={{ textAlign:'center' }}>
                                <button onClick={() => setEtrigan(false)}
                                    style={{ padding:'14px 36px', background:'transparent', border:'2px solid #d4af37', color:'#d4af37', fontFamily:'var(--font-display)', fontWeight:800, fontSize:'14px', letterSpacing:'0.15em', cursor:'pointer', textTransform:'uppercase', transition:'all 0.2s' }}
                                    onMouseEnter={e => {e.currentTarget.style.background='#d4af37'; e.currentTarget.style.color='#000'; e.currentTarget.style.boxShadow='0 0 20px rgba(212,175,55,0.4)';}}
                                    onMouseLeave={e => {e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#d4af37'; e.currentTarget.style.boxShadow='none';}}>
                                    STEP OUT OF THE RING
                                </button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Navbar />



            {/* ── TWO PANEL LAYOUT ── */}
            <div style={{ flex:1, display:'flex', overflow:'hidden', height:'calc(100vh - 76px)' }}>

                {/* ─────────── LEFT PANEL: Lesson + Task ─────────── */}
                <div style={{ width:'38%', minWidth:'300px', display:'flex', flexDirection:'column', borderRight:'1px solid #1a1a1a' }}>

                    {/* Badge strip */}
                    <div style={{ padding:'10px 24px', borderBottom:'1px solid #1a1a1a', background:'#060606', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                            <span className="label-tech" style={{ color:'#FF2D00' }}>LV.{String(id).padStart(2,'0')}</span>
                            <span style={{ width:'1px', height:'10px', background:'#1e1e1e' }} />
                            <span className="label-tech" style={{ color:'#d4a017' }}>+{level.points_value||10} XP</span>
                            <span className="label-tech" style={{ color:'#444' }}>+{level.coins_value||5} COINS</span>
                        </div>
                        <Link to="/dashboard" className="label-tech"
                            style={{ color:'#333', textDecoration:'none', transition:'color 0.1s' }}
                            onMouseEnter={e=>e.currentTarget.style.color='#666'}
                            onMouseLeave={e=>e.currentTarget.style.color='#333'}>← BACK</Link>
                    </div>

                    {/* Level title */}
                    <div style={{ padding:'16px 24px', borderBottom:'1px solid #1a1a1a', flexShrink:0 }}>
                        <div style={{ fontFamily:'var(--font-display)', fontSize:'20px', fontWeight:700, color:'#E8DDD0', textTransform:'uppercase', letterSpacing:'0.04em', lineHeight:1.2 }}>
                            {level.Title}
                        </div>
                    </div>

                    {/* Concept */}
                    <div style={{ padding:'16px 24px', flex:1, overflowY:'auto' }}>
                        <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'14px' }}>/ CONCEPT</p>
                        <div className="prose prose-sm prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {level.content?.concept || ''}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Task box */}
                    <div style={{ margin:'0 24px 16px', padding:'16px', background:'#0a0a0a', borderLeft:'3px solid #FF2D00', flexShrink:0 }}>
                        <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'10px' }}>/ YOUR MISSION</p>
                        <div className="prose prose-sm prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                                {level.content?.task || ''}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Result banner */}
                    {result && (
                        <div style={{ margin:'0 24px 16px', padding:'16px', borderLeft:`3px solid ${result.success?'#22c55e':'#FF2D00'}`, background:result.success?'#081508':'#150505', flexShrink:0 }}>
                            <div style={{ fontFamily:'var(--font-display)', fontSize:'15px', fontWeight:700, color:result.success?'#22c55e':'#FF2D00', textTransform:'uppercase', marginBottom:'6px' }}>
                                {result.success ? '✓ LEVEL MASTERED' : '✗ NOT QUITE'}
                            </div>
                            <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'#555', marginBottom:result.success?'12px':0 }}>
                                {result.message}
                            </p>
                            {result.success && (
                                <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
                                    <span className="label-tech" style={{ color:'#d4a017' }}>+{result.points} XP</span>
                                    <span className="label-tech" style={{ color:'#444' }}>+{result.coins} COINS</span>
                                    <Link to={`/level/${nextLevelId}`}
                                        style={{ marginLeft:'auto', padding:'7px 16px', background:'#FF2D00', color:'#080808', fontFamily:'var(--font-display)', fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textDecoration:'none', textTransform:'uppercase' }}>
                                        NEXT →
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Energy warning */}
                    {noEnergy && (
                        <div style={{ margin:'0 24px 16px', padding:'14px 16px', border:'1px solid #e8623a', background:'#130a05', flexShrink:0 }}>
                            <p className="label-tech" style={{ color:'#e8623a' }}>⚡ OUT OF ENERGY</p>
                            <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'#555', marginTop:'4px' }}>
                                <Link to="/shop" style={{ color:'#e8623a' }}>Visit the Shop</Link> to refill.
                            </p>
                        </div>
                    )}
                </div>

                {/* ─────────── RIGHT PANEL: Editor + Console ─────────── */}
                <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

                    {/* Toolbar */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', height:'40px', borderBottom:'1px solid #1a1a1a', background:'#060606', flexShrink:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            {['#ff5f57','#febc2e','#28c840'].map((c,i)=>(
                                <div key={i} style={{width:'9px',height:'9px',borderRadius:'50%',background:c,opacity:0.7}}/>
                            ))}
                            <span className="label-tech" style={{ color:'#333', marginLeft:'6px' }}>main.py</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <span className="label-tech" style={{ color:noEnergy?'#FF2D00':'#333' }}>
                                ⚡ {user?.energy ?? MAX_ENERGY}/{MAX_ENERGY}
                            </span>
                            <button
                                onClick={() => setCode(level.content?.initial_code || '')}
                                style={{ padding:'4px 12px', background:'transparent', border:'1px solid #1e1e1e', color:'#444', fontFamily:'var(--font-mono)', fontSize:'10px', letterSpacing:'0.1em', cursor:'pointer', textTransform:'uppercase', transition:'all 0.1s' }}
                                onMouseEnter={e=>{e.currentTarget.style.borderColor='#333';e.currentTarget.style.color='#888';}}
                                onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1e1e';e.currentTarget.style.color='#444';}}>
                                RESET
                            </button>
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning || noEnergy}
                                style={{ padding:'5px 20px', background:noEnergy?'#111':'#FF2D00', color:noEnergy?'#333':'#080808', fontFamily:'var(--font-display)', fontSize:'12px', fontWeight:700, letterSpacing:'0.12em', border:'none', cursor:noEnergy||isRunning?'not-allowed':'pointer', textTransform:'uppercase', opacity:isRunning?0.7:1, transition:'opacity 0.1s' }}>
                                {isRunning ? 'RUNNING...' : '▶ RUN CODE'}
                            </button>
                        </div>
                    </div>

                    {/* Monaco editor */}
                    <div style={{ flex:1, minHeight:0 }}>
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            value={code}
                            onChange={(v) => setCode(v || '')}
                            theme="vs-dark"
                            options={{
                                minimap:{enabled:false}, fontSize:14, lineNumbers:'on',
                                scrollBeyondLastLine:false, padding:{top:12},
                                fontFamily:'JetBrains Mono, monospace',
                            }}
                        />
                    </div>

                    {/* Console / Test results */}
                    <div style={{ height:'30vh', display:'flex', flexDirection:'column', borderTop:'1px solid #1a1a1a', background:'#050505', flexShrink:0 }}>

                        {/* Tabs */}
                        <div style={{ display:'flex', borderBottom:'1px solid #111', background:'#060606', flexShrink:0, overflowX:'auto' }}>
                            {testResults.length > 0 ? testResults.map((tr,idx) => (
                                <button key={idx} onClick={() => setActiveTab(idx)}
                                    style={{
                                        padding:'6px 16px', fontSize:'10px', fontFamily:'var(--font-mono)',
                                        letterSpacing:'0.1em', textTransform:'uppercase', border:'none',
                                        borderRight:'1px solid #111', cursor:'pointer', whiteSpace:'nowrap',
                                        background: activeTab===idx ? '#080808' : 'transparent',
                                        color: activeTab===idx ? (tr.passed?'#22c55e':tr.status==='done'?'#FF2D00':'#E8DDD0') : '#333',
                                        borderTop: activeTab===idx ? `2px solid ${tr.passed?'#22c55e':tr.status==='done'?'#FF2D00':'#444'}` : '2px solid transparent',
                                    }}>
                                    {tr.status==='running' && <span style={{color:'#d4a017',marginRight:'4px'}}>●</span>}
                                    {tr.status==='done' && (tr.passed
                                        ? <span style={{color:'#22c55e',marginRight:'4px'}}>✓</span>
                                        : <span style={{color:'#FF2D00',marginRight:'4px'}}>✗</span>)}
                                    {tr.name}
                                </button>
                            )) : (
                                <div style={{ padding:'6px 16px', fontSize:'10px', fontFamily:'var(--font-mono)', letterSpacing:'0.1em', color:'#222', textTransform:'uppercase' }}>
                                    CONSOLE OUTPUT
                                </div>
                            )}
                        </div>

                        {/* Output content */}
                        <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', fontFamily:'var(--font-mono)', fontSize:'12px' }}>
                            {testResults[activeTab] ? (
                                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                                    <div>
                                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                                            <span className="label-tech">OUTPUT</span>
                                            {testResults[activeTab].status==='done' && (
                                                <span className="label-tech" style={{ color:testResults[activeTab].passed?'#22c55e':'#FF2D00' }}>
                                                    {testResults[activeTab].passed ? '✓ ACCEPTED' : '✗ WRONG ANSWER'}
                                                </span>
                                            )}
                                        </div>
                                        <pre style={{
                                            padding:'12px', background:'#080808', margin:0,
                                            borderLeft:`2px solid ${testResults[activeTab].status==='done'?(testResults[activeTab].passed?'#22c55e':'#FF2D00'):'#1e1e1e'}`,
                                            color: testResults[activeTab].passed ? '#6ee7b7' : testResults[activeTab].status==='done' ? '#fca5a5' : '#888',
                                            fontSize:'12px', whiteSpace:'pre-wrap',
                                        }}>
                                            {testResults[activeTab].output}
                                        </pre>
                                    </div>
                                    {testResults[activeTab].status==='done' && !testResults[activeTab].passed && (
                                        <div>
                                            <span className="label-tech" style={{ color:'#22c55e', display:'block', marginBottom:'6px' }}>EXPECTED</span>
                                            <pre style={{ padding:'12px', background:'#081508', borderLeft:'2px solid #22c55e', color:'#6ee7b7', fontSize:'12px', whiteSpace:'pre-wrap', margin:0 }}>
                                                {testResults[activeTab].expected || 'No expected output'}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <span className="label-tech" style={{ color:'#1e1e1e' }}>PRESS ▶ RUN CODE TO EXECUTE</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Level;
