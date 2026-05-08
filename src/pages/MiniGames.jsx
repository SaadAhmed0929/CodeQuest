import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const GAMES = [
    {
        id: 'syntax-sorter',
        path: '/syntax-sorter',
        emoji: '🔀',
        name: 'SYNTAX SORTER',
        tag: 'ORDERING CHALLENGE',
        accent: '#FF2D00',
        description:
            'Scrambled lines of Python code are dropped in front of you. Drag — or use ▲▼ — to sort them into the correct order, then submit.',
        skills: ['Logic', 'Syntax', 'Structure'],
        difficulty: 'MEDIUM',
        diffColor: '#FF2D00',
        plays: '∞',
    },
    {
        id: 'pixel-path',
        path: '/pixel-path',
        emoji: '👾',
        name: 'PIXEL PATH',
        tag: 'CODE TRAVERSAL',
        accent: '#FF2D00',
        description:
            'Write Python pseudo-code commands to guide your player through a 5×5 grid. Avoid obstacles, reach the goal — one command at a time.',
        skills: ['Sequencing', 'Algorithms', 'Debugging'],
        difficulty: 'HARD',
        diffColor: '#FF2D00',
        plays: '3 Levels',
    },
    {
        id: 'variable-vault',
        path: '/variable-vault',
        emoji: '🔐',
        name: 'VARIABLE VAULT',
        tag: 'DICT ACCESS DRILL',
        accent: '#FF2D00',
        description:
            'A nested Python dictionary is shown. Race against a countdown timer to type the exact key path that extracts the target value. Wrong answer = lockdown.',
        skills: ['Dictionaries', 'Key Access', 'Nesting'],
        difficulty: 'MEDIUM',
        diffColor: '#FF2D00',
        plays: '5 Vaults',
    },
    {
        id: 'syntax-racer',
        path: '/syntax-racer',
        emoji: '🚀',
        name: 'SYNTAX RACER',
        tag: 'TYPING SPEED DRILL',
        accent: '#FF2D00',
        description:
            'Type Python code snippets as fast as you can. Characters turn green when correct, halt red on mistakes. Track WPM, accuracy, and personal bests across 5 levels.',
        skills: ['Typing Speed', 'Syntax Memory', 'Accuracy'],
        difficulty: 'EASY',
        diffColor: '#FF2D00',
        plays: '5 Tracks',
    },
    {
        id: 'bug-hunt',
        path: '/bug-hunt',
        emoji: '🐛',
        name: 'BUG HUNT',
        tag: 'DEBUGGING DRILL',
        accent: '#FF2D00',
        description:
            'A fatal syntax error hides in the code. Find it and click it before time runs out. Incorrect clicks cost you precious seconds!',
        skills: ['Debugging', 'Syntax Error', 'Analysis'],
        difficulty: 'MEDIUM',
        diffColor: '#FF2D00',
        plays: '5 Bugs',
    },
];

const MiniGames = () => {
    const [hovered, setHovered] = useState(null);
    const navigate = useNavigate();

    return (
        <div style={{ background: '#080808', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#E8DDD0' }}>
            <Navbar />

            {/* ── Header strip ── */}
            <div style={{ borderBottom: '1px solid #1a1a1a', padding: '12px 0', background: '#050505' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="label-tech" style={{ color: '#FF2D00' }}>/ MINI GAMES</span>
                        <span style={{ width: '1px', height: '12px', background: '#1e1e1e' }} />
                        <span className="label-tech" style={{ color: '#333' }}>CHOOSE YOUR CHALLENGE</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => navigate(-1)}
                            style={{ background:'none', border:'1px solid #1e1e1e', color:'#444', fontFamily:'var(--font-mono)', fontSize:'10px', padding:'4px 12px', cursor:'pointer', letterSpacing:'0.1em' }}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor='#333';e.currentTarget.style.color='#888';}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1e1e';e.currentTarget.style.color='#444';}}>
                            ← BACK
                        </button>
                        <span className="label-tech" style={{ color: '#222' }}>{GAMES.length} GAMES AVAILABLE</span>
                    </div>
                </div>
            </div>

            {/* ── Page title ── */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '56px 48px 32px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    <p className="label-tech" style={{ color: '#FF2D00', marginBottom: '12px' }}>/ ARCADE</p>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, color: '#E8DDD0', textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.01em', marginBottom: '20px' }}>
                        MINI<br /><span style={{ color: '#FF2D00' }}>GAMES</span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#444', maxWidth: '480px', lineHeight: 1.7 }}>
                        Sharpen your Python instincts through play. Each game targets a different skill — pick one and get to work.
                    </p>
                </motion.div>
            </div>

            {/* ── Game cards ── */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '0 48px 80px',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '2px' }}>

                {GAMES.map((g, i) => (
                    <motion.div key={g.id}
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        onMouseEnter={() => setHovered(g.id)}
                        onMouseLeave={() => setHovered(null)}
                        style={{ position: 'relative' }}>

                        {/* Accent left border that grows on hover */}
                        <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: hovered === g.id ? '4px' : '2px',
                            background: g.accent,
                            transition: 'width 0.2s, box-shadow 0.3s',
                            boxShadow: hovered === g.id ? `0 0 16px ${g.accent}60` : 'none',
                        }} />

                        <div style={{
                            background: hovered === g.id ? '#0a0a0a' : '#080808',
                            border: '1px solid #1a1a1a',
                            borderLeft: 'none',
                            padding: '36px 36px 32px 40px',
                            transition: 'background 0.15s',
                            height: '100%',
                            boxSizing: 'border-box',
                            display: 'flex', flexDirection: 'column',
                        }}>
                            {/* Top row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <motion.span
                                            animate={{ scale: hovered === g.id ? [1, 1.2, 1] : 1 }}
                                            transition={{ duration: 0.4 }}
                                            style={{ fontSize: '28px' }}>
                                            {g.emoji}
                                        </motion.span>
                                        <div>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 900, color: '#E8DDD0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {g.name}
                                            </div>
                                            <div className="label-tech" style={{ color: g.accent, marginTop: '2px' }}>{g.tag}</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: g.diffColor, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
                                        {g.difficulty}
                                    </div>
                                    <div className="label-tech" style={{ color: '#222' }}>{g.plays}</div>
                                </div>
                            </div>

                            {/* Description */}
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#555', lineHeight: 1.8, marginBottom: '24px', flex: 1 }}>
                                {g.description}
                            </p>

                            {/* Skills */}
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', flexWrap: 'wrap' }}>
                                {g.skills.map(s => (
                                    <span key={s} style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '3px 10px', border: `1px solid ${g.accent}30`, color: g.accent, background: `${g.accent}08` }}>
                                        {s}
                                    </span>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link to={g.path}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px',
                                    background: hovered === g.id ? g.accent : 'transparent',
                                    border: `1px solid ${g.accent}`,
                                    color: hovered === g.id ? '#080808' : g.accent,
                                    fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700,
                                    letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
                                    transition: 'all 0.15s' }}>
                                <span>PLAY NOW</span>
                                <span style={{ fontSize: '16px' }}>→</span>
                            </Link>
                        </div>
                    </motion.div>
                ))}

                {/* Coming soon placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ border: '1px solid #111', padding: '36px 36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '200px', background: '#060606' }}>
                    <div style={{ fontSize: '24px', marginBottom: '12px', opacity: 0.3 }}>🔒</div>
                    <div className="label-tech" style={{ color: '#1e1e1e', marginBottom: '6px' }}>MORE COMING SOON</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#1a1a1a', textAlign: 'center', lineHeight: 1.6 }}>
                        Bug Hunt · Type Racer · Variable Vault
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MiniGames;
