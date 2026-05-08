import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
    '> INITIALIZING CODEQUEST...',
    '> LOADING PYTHON ENGINE...',
    '> CALIBRATING LEVELS...',
    '> READY.',
];

const SplashScreen = ({ onDone }) => {
    const [lineIdx, setLineIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [barWidth, setBarWidth] = useState(0);
    const [exiting, setExiting] = useState(false);

    /* ── type out each line ── */
    useEffect(() => {
        if (lineIdx >= LINES.length) return;
        const line = LINES[lineIdx];
        if (charIdx < line.length) {
            const t = setTimeout(() => setCharIdx(c => c + 1), 28);
            return () => clearTimeout(t);
        }
        // line done — pause then move to next
        if (lineIdx < LINES.length - 1) {
            const t = setTimeout(() => { setLineIdx(l => l + 1); setCharIdx(0); }, 160);
            return () => clearTimeout(t);
        }
    }, [lineIdx, charIdx]);

    /* ── progress bar ── */
    useEffect(() => {
        const pct = Math.round(((lineIdx + charIdx / (LINES[lineIdx]?.length || 1)) / LINES.length) * 100);
        setBarWidth(Math.min(100, pct));
    }, [lineIdx, charIdx]);

    /* ── exit after all lines typed ── */
    useEffect(() => {
        if (lineIdx === LINES.length - 1 && charIdx >= LINES[LINES.length - 1].length) {
            const t = setTimeout(() => { setExiting(true); setTimeout(onDone, 600); }, 500);
            return () => clearTimeout(t);
        }
    }, [lineIdx, charIdx, onDone]);

    const displayedLines = LINES.slice(0, lineIdx).concat(
        lineIdx < LINES.length ? [LINES[lineIdx].slice(0, charIdx)] : []
    );

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: '#080808',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
            }}>

            {/* Scanline overlay */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
                zIndex: 1,
            }} />

            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%', maxWidth: '480px', padding: '0 32px' }}>

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ marginBottom: '48px' }}>
                    <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(56px, 12vw, 96px)',
                        fontWeight: 900, lineHeight: 1.0,
                        letterSpacing: '-0.02em',
                        userSelect: 'none',
                    }}>
                        <span style={{ color: '#FF2D00' }}>CODE</span>
                        <span style={{ color: '#E8DDD0' }}>QUEST</span>
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: '11px',
                        color: '#333', letterSpacing: '0.35em',
                        textTransform: 'uppercase', marginTop: '20px',
                    }}>
                        PYTHON GAMIFIED — VOL. 1 / 2026
                    </div>
                </motion.div>

                {/* Terminal lines */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        background: '#060606', border: '1px solid #1a1a1a',
                        padding: '16px 20px', marginBottom: '20px',
                        textAlign: 'left', minHeight: '108px',
                    }}>
                    {displayedLines.map((line, i) => {
                        const isDone = i < lineIdx;
                        const isLast = i === lineIdx;
                        const isReady = line.includes('READY');
                        return (
                            <div key={i} style={{
                                fontFamily: 'var(--font-mono)', fontSize: '12px',
                                lineHeight: 1.9,
                                color: isReady ? '#22c55e' : isDone ? '#2a2a2a' : '#666',
                                transition: 'color 0.3s',
                            }}>
                                {line}
                                {isLast && !isDone && (
                                    <span style={{
                                        display: 'inline-block', width: '8px', height: '13px',
                                        background: '#FF2D00', marginLeft: '2px',
                                        animation: 'cq-blink 0.9s step-end infinite',
                                        verticalAlign: 'middle',
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </motion.div>

                {/* Progress bar */}
                <div style={{ height: '2px', background: '#111', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{
                        height: '100%',
                        width: `${barWidth}%`,
                        background: 'linear-gradient(90deg, #FF2D00, #FF5533)',
                        transition: 'width 0.2s ease',
                        boxShadow: '0 0 8px rgba(255,45,0,0.6)',
                    }} />
                </div>

                <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    color: '#222', letterSpacing: '0.2em', textAlign: 'right',
                }}>
                    {barWidth}%
                </div>
            </div>

            <style>{`
                @keyframes cq-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </motion.div>
    );
};

export default SplashScreen;
