import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── Interactive light-mesh grid ─────────────────────────────────────────────
// GridMesh receives a shared mouseRef from the parent section
const GridMesh = ({ mouseRef }) => {
    const canvasRef = useRef(null);
    const rafRef    = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx    = canvas.getContext('2d');
        const CELL   = 55;

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { x: mx, y: my } = mouseRef.current;
            const GLOW_R  = 220;
            const INNER_R = 90;
            const cols = Math.ceil(canvas.width  / CELL) + 1;
            const rows = Math.ceil(canvas.height / CELL) + 1;

            for (let ci = 0; ci <= cols; ci++) {
                for (let ri = 0; ri <= rows; ri++) {
                    const ix = ci * CELL;
                    const iy = ri * CELL;
                    const d  = Math.hypot(ix - mx, iy - my);

                    ctx.strokeStyle = 'rgba(80,20,10,0.35)';
                    ctx.lineWidth   = 0.5;
                    if (ci < cols) { ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ix + CELL, iy); ctx.stroke(); }
                    if (ri < rows) { ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ix, iy + CELL); ctx.stroke(); }

                    if (d < GLOW_R) {
                        const t = 1 - d / GLOW_R;
                        const dotAlpha = t * t * 0.9;
                        const dotSize  = 1.5 + t * 3;
                        const grad = ctx.createRadialGradient(ix, iy, 0, ix, iy, dotSize * 3);
                        grad.addColorStop(0, `rgba(255,60,0,${dotAlpha})`);
                        grad.addColorStop(1, 'rgba(255,60,0,0)');
                        ctx.fillStyle = grad;
                        ctx.beginPath(); ctx.arc(ix, iy, dotSize * 3, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = `rgba(255,90,20,${dotAlpha})`;
                        ctx.beginPath(); ctx.arc(ix, iy, dotSize, 0, Math.PI * 2); ctx.fill();

                        if (d < INNER_R) {
                            const lt = 1 - d / INNER_R;
                            ctx.strokeStyle = `rgba(255,55,0,${lt * lt * 0.55})`;
                            ctx.lineWidth   = 1.2 + lt * 1.5;
                            if (ci < cols) { ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ix + CELL, iy); ctx.stroke(); }
                            if (ri < rows) { ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ix, iy + CELL); ctx.stroke(); }
                        }
                    }
                }
            }
            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
    }, [mouseRef]);

    return (
        <canvas
            ref={canvasRef}
            // ⚠️ pointerEvents NONE — parent section handles all mouse tracking
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
        />
    );
};

// ─── Marquee data ─────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
    'HELLO WORLD','VARIABLES','DATA TYPES','LOOPS','FUNCTIONS',
    'CONDITIONALS','LISTS','DICTIONARIES','CLASSES','MODULES',
    'EXCEPTIONS','FILE I/O','REGEX','APIs','JSON',
];

const CHAPTERS = [
    { num:'01', title:'Getting Started',    levels:5 },
    { num:'02', title:'Variables & Types',  levels:7 },
    { num:'03', title:'Collections',        levels:5 },
    { num:'04', title:'Control Flow',       levels:5 },
    { num:'05', title:'Functions',          levels:5 },
    { num:'06', title:'Modules & Errors',   levels:5 },
    { num:'07', title:'Strings & RegEx',    levels:3 },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
const Home = () => {
    const [scrollY, setScrollY] = useState(0);
    // Shared mouse position for the whole hero section
    const heroMouseRef = useRef({ x: -9999, y: -9999 });
    const heroRef      = useRef(null);

    useEffect(() => {
        const h = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);

    const onHeroMove = useCallback((e) => {
        const rect = heroRef.current.getBoundingClientRect();
        heroMouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, []);

    const onHeroLeave = useCallback(() => {
        heroMouseRef.current = { x: -9999, y: -9999 };
    }, []);

    return (
        <div style={{ background: '#080808', minHeight: '100vh', color: '#E8DDD0' }}>

            {/* ── TOP META BAR ── */}
            <div style={{ borderBottom: '1px solid #1a1a1a', padding: '7px 0', background: '#060606', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 48px', display:'flex', justifyContent:'space-between' }}>
                    <span className="label-tech">CODEQUEST.DEV</span>
                    <span className="label-tech">VOL. 1 / 2025</span>
                </div>
            </div>

            {/* ── HERO ── */}
            {/* onMouseMove on the section catches ALL movement — text, canvas, everything */}
            <section
                ref={heroRef}
                onMouseMove={onHeroMove}
                onMouseLeave={onHeroLeave}
                style={{ minHeight: '93vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', overflow: 'hidden', cursor: 'crosshair' }}
            >
                {/* Canvas is purely visual — no pointer events */}
                <GridMesh mouseRef={heroMouseRef} />

                {/* Vignette overlay so text pops */}
                <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, #080808 100%)', pointerEvents:'none', zIndex:1 }} />

                {/* Headline — sits above canvas */}
                <div style={{ position:'relative', zIndex:2, maxWidth:'1200px', margin:'0 auto', width:'100%', padding:'0 48px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 70 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                    >
                        <div className="headline-xl" style={{ fontSize: 'clamp(90px, 17vw, 240px)', lineHeight: 0.88, userSelect: 'none' }}>
                            <div style={{ color: '#FF2D00' }}>CODE</div>
                            <div style={{ color: '#E8DDD0' }}>QUEST</div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    style={{ position:'relative', zIndex:2, borderTop:'1px solid #1e1e1e', marginTop:'40px', background:'rgba(6,6,6,0.95)', backdropFilter:'blur(8px)' }}
                >
                    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'20px 48px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', alignItems:'center', gap:'24px' }}>

                        <div>
                            <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'4px' }}>/ PYTHON GAMIFIED</p>
                            <p className="label-tech">→ LEARN TO CODE BY PLAYING</p>
                        </div>

                        <div style={{ display:'flex', justifyContent:'center', gap:'36px' }}>
                            {[{num:'35',label:'LEVELS'},{num:'7',label:'CHAPTERS'},{num:'∞',label:'CURIOSITY'}].map(({num,label})=>(
                                <div key={label} style={{ textAlign:'center' }}>
                                    <div className="headline-xl" style={{ fontSize:'34px', color:'#E8DDD0', lineHeight:1 }}>{num}</div>
                                    <div className="label-tech" style={{ marginTop:'4px' }}>{label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px' }}>
                            <Link to="/dashboard" className="btn-accent"
                                style={{ padding:'12px 28px', fontFamily:'var(--font-display)', fontSize:'13px', letterSpacing:'0.1em', display:'block', textDecoration:'none' }}>
                                START PLAYING
                            </Link>
                            <Link to="/login" className="btn-ghost"
                                style={{ padding:'12px 24px', fontFamily:'var(--font-display)', fontSize:'13px', letterSpacing:'0.1em', display:'block', textDecoration:'none' }}>
                                SIGN IN
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Page number */}
                <div className="label-tech" style={{ position:'absolute', bottom:'88px', left:'48px', zIndex:2 }}>P. 001</div>
            </section>

            {/* ── MARQUEE ── */}
            <div style={{ borderTop:'1px solid #1e1e1e', borderBottom:'1px solid #1e1e1e', background:'#0a0a0a', padding:'12px 0', overflow:'hidden' }}>
                <div className="marquee-track">
                    {[...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS].map((item,i)=>(
                        <span key={i} className="label-tech" style={{ marginRight:'56px', color: i%4===0 ? '#FF2D00' : '#2e2e2e' }}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── WHAT IS CODEQUEST ── */}
            <section style={{ borderBottom:'1px solid #1a1a1a', padding:'100px 0' }}>
                <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 48px', display:'grid', gridTemplateColumns:'300px 1fr', gap:'80px', alignItems:'start' }}>
                    <div>
                        <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'20px' }}>/ WHAT IT IS</p>
                        <div className="headline-xl" style={{ fontSize:'clamp(28px,4vw,52px)', color:'#E8DDD0' }}>
                            PYTHON.<br/>THE GAME.
                        </div>
                    </div>
                    <div>
                        <p style={{ fontSize:'1.05rem', lineHeight:1.75, color:'#777', marginBottom:'24px' }}>
                            CodeQuest turns Python into a progression game. Every concept is a level. Every level has a challenge. Complete it, earn XP and Coins — unlock the next one.
                        </p>
                        <p style={{ fontSize:'0.95rem', lineHeight:1.75, color:'#444', marginBottom:'48px' }}>
                            No boring tutorials. No passive reading. You write real code, run it, and see the result instantly. Built for people who learn by doing.
                        </p>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'#1e1e1e' }}>
                            {[
                                {icon:'⚡',title:'ENERGY SYSTEM',desc:'10 plays per session. Use wisely.'},
                                {icon:'🪙',title:'COIN ECONOMY', desc:'Earn coins. Spend in the shop.'},
                                {icon:'🔥',title:'DAILY STREAKS', desc:'Come back every day. Stay sharp.'},
                            ].map(({icon,title,desc})=>(
                                <div key={title} style={{ background:'#0a0a0a', padding:'24px 18px' }}>
                                    <div style={{ fontSize:'18px', marginBottom:'10px' }}>{icon}</div>
                                    <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'8px' }}>{title}</p>
                                    <p style={{ fontSize:'0.78rem', color:'#555', lineHeight:1.5 }}>{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CURRICULUM ── */}
            <section style={{ padding:'100px 0', borderBottom:'1px solid #1a1a1a' }}>
                <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 48px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'48px' }}>
                        <div>
                            <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'12px' }}>/ CURRICULUM</p>
                            <div className="headline-xl" style={{ fontSize:'clamp(24px,3.5vw,50px)', color:'#E8DDD0' }}>
                                7 CHAPTERS. 35 LEVELS.
                            </div>
                        </div>
                        <Link to="/dashboard" className="label-tech" style={{ color:'#FF2D00', textDecoration:'none' }}>VIEW ALL →</Link>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:'1px', background:'#1a1a1a' }}>
                        {CHAPTERS.map(({num,title,levels})=>(
                            <Link to="/dashboard" key={num}
                                style={{ display:'block', padding:'24px 18px', background:'#0a0a0a', textDecoration:'none', transition:'background 0.12s' }}
                                onMouseEnter={e=>e.currentTarget.style.background='#111'}
                                onMouseLeave={e=>e.currentTarget.style.background='#0a0a0a'}>
                                <div className="label-tech" style={{ color:'#FF2D00', marginBottom:'12px' }}>{num}</div>
                                <div style={{ fontWeight:700, color:'#E8DDD0', fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'8px', lineHeight:1.3 }}>
                                    {title}
                                </div>
                                <div className="label-tech">{levels} LEVELS</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding:'120px 0' }}>
                <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 48px', textAlign:'center' }}>
                    <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'20px' }}>/ START NOW</p>
                    <div className="headline-xl" style={{ fontSize:'clamp(36px,8vw,110px)', color:'#E8DDD0', marginBottom:'48px', lineHeight:0.9 }}>
                        WRITE YOUR<br/><span style={{ color:'#FF2D00' }}>FIRST LINE.</span>
                    </div>
                    <Link to="/dashboard" className="btn-accent"
                        style={{ display:'inline-block', padding:'18px 48px', fontFamily:'var(--font-display)', fontSize:'16px', letterSpacing:'0.12em', textDecoration:'none' }}>
                        ENTER CODEQUEST
                    </Link>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ borderTop:'1px solid #1a1a1a', padding:'20px 0', background:'#060606' }}>
                <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 48px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span className="label-tech"><span style={{color:'#FF2D00'}}>CODE</span>QUEST © 2025</span>
                    <span className="label-tech">PYTHON GAMIFIED</span>
                    <span className="label-tech" style={{color:'#FF2D00'}}>→ SCROLL TO TUNE IN</span>
                </div>
            </footer>
        </div>
    );
};

export default Home;
