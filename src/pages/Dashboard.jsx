import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const W = { maxWidth: '1200px', margin: '0 auto', padding: '0 48px' };

// ── Fallback curriculum shown when backend is unreachable ──────────────────────
const FALLBACK_CHAPTERS = [
    {
        chapter_id: 1, Title: 'Getting Started', Description: 'Your first steps in Python',
        levels: [
            { level_id:1,  Title:'Hello, World!',       points_value:10, order_num:1 },
            { level_id:2,  Title:'Print & Comments',    points_value:10, order_num:2 },
            { level_id:3,  Title:'Your First Bug',      points_value:15, order_num:3 },
            { level_id:4,  Title:'Running Scripts',     points_value:15, order_num:4 },
            { level_id:5,  Title:'Intro Quiz',          points_value:20, order_num:5 },
        ],
    },
    {
        chapter_id: 2, Title: 'Variables & Types', Description: 'Store and work with data',
        levels: [
            { level_id:6,  Title:'What is a Variable?', points_value:10, order_num:1 },
            { level_id:7,  Title:'Numbers & Math',       points_value:10, order_num:2 },
            { level_id:8,  Title:'Strings',              points_value:10, order_num:3 },
            { level_id:9,  Title:'Booleans',             points_value:15, order_num:4 },
            { level_id:10, Title:'Type Conversion',      points_value:15, order_num:5 },
            { level_id:11, Title:'User Input',           points_value:20, order_num:6 },
            { level_id:12, Title:'Variables Quiz',       points_value:20, order_num:7 },
        ],
    },
    {
        chapter_id: 3, Title: 'Collections', Description: 'Lists, tuples, and dictionaries',
        levels: [
            { level_id:13, Title:'Lists',            points_value:15, order_num:1 },
            { level_id:14, Title:'List Methods',     points_value:15, order_num:2 },
            { level_id:15, Title:'Tuples',           points_value:15, order_num:3 },
            { level_id:16, Title:'Dictionaries',     points_value:20, order_num:4 },
            { level_id:17, Title:'Collections Quiz', points_value:25, order_num:5 },
        ],
    },
    {
        chapter_id: 4, Title: 'Control Flow', Description: 'Make decisions and repeat actions',
        levels: [
            { level_id:18, Title:'If / Else',           points_value:15, order_num:1 },
            { level_id:19, Title:'Elif Chains',         points_value:15, order_num:2 },
            { level_id:20, Title:'For Loops',           points_value:15, order_num:3 },
            { level_id:21, Title:'While Loops',         points_value:20, order_num:4 },
            { level_id:22, Title:'Break & Continue',    points_value:20, order_num:5 },
        ],
    },
    {
        chapter_id: 5, Title: 'Functions', Description: 'Write reusable code blocks',
        levels: [
            { level_id:23, Title:'Defining Functions', points_value:20, order_num:1 },
            { level_id:24, Title:'Parameters',         points_value:20, order_num:2 },
            { level_id:25, Title:'Return Values',      points_value:20, order_num:3 },
            { level_id:26, Title:'Scope',              points_value:25, order_num:4 },
            { level_id:27, Title:'Functions Quiz',     points_value:30, order_num:5 },
        ],
    },
    {
        chapter_id: 6, Title: 'Modules & Errors', Description: 'Import libraries and handle errors',
        levels: [
            { level_id:28, Title:'Importing Modules', points_value:20, order_num:1 },
            { level_id:29, Title:'Try / Except',      points_value:20, order_num:2 },
            { level_id:30, Title:'File I/O',          points_value:25, order_num:3 },
            { level_id:31, Title:'pip Packages',      points_value:25, order_num:4 },
            { level_id:32, Title:'Errors Quiz',       points_value:30, order_num:5 },
        ],
    },
    {
        chapter_id: 7, Title: 'Strings & RegEx', Description: 'Master text manipulation',
        levels: [
            { level_id:33, Title:'String Methods',  points_value:20, order_num:1 },
            { level_id:34, Title:'Formatting',      points_value:20, order_num:2 },
            { level_id:35, Title:'Regex Basics',    points_value:30, order_num:3 },
        ],
    },
];

const Dashboard = () => {
    const { user, MAX_ENERGY } = useAuth();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    const completedLevels = user?.completedLevels || [];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/chapters');
                if (Array.isArray(res.data) && res.data.length > 0) setChapters(res.data);
                else setChapters(FALLBACK_CHAPTERS);
            } catch {
                setChapters(FALLBACK_CHAPTERS);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);


    const allLevels = chapters.flatMap(c => c.levels || []).sort((a, b) => a.level_id - b.level_id);

    const isLevelUnlocked = (levelId) => {
        const idx = allLevels.findIndex(l => l.level_id === levelId);
        if (idx === 0) return true;
        const prev = allLevels[idx - 1];
        return prev ? completedLevels.includes(prev.level_id) : false;
    };

    const getChapterProgress = (chapter) => {
        const lvls = chapter.levels || [];
        if (!lvls.length) return 0;
        return Math.round((lvls.filter(l => completedLevels.includes(l.level_id)).length / lvls.length) * 100);
    };

    const energy = user?.energy ?? MAX_ENERGY;
    const totalCompleted = completedLevels.length;
    const totalLevels = allLevels.length;

    return (
        <div style={{ background: '#080808', minHeight: '100vh', color: '#E8DDD0' }}>
            <Navbar />

            <div style={{ ...W, paddingTop: '48px', paddingBottom: '80px' }}>

                {/* ── HEADER ── */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid #1a1a1a' }}>

                    {/* Top label */}
                    <p className="label-tech" style={{ color: '#FF2D00', marginBottom: '10px' }}>/ YOUR LEARNING PATH</p>

                    {/* Name + stats in same row */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
                        <div className="headline-xl" style={{ fontSize: 'clamp(32px, 5vw, 72px)', color: '#E8DDD0', lineHeight: 1 }}>
                            {(user?.username || 'EXPLORER').toUpperCase()}
                        </div>

                        {/* Stat blocks in a tight row */}
                        <div style={{ display: 'flex', gap: '1px', background: '#1a1a1a', flexShrink: 0 }}>
                            {[
                                { label: 'XP', value: user?.total_points || 0, red: true },
                                { label: 'COINS', value: user?.coins || 0, red: false },
                                { label: 'STREAK', value: `${user?.current_streak || 0}D`, red: false },
                                { label: 'ENERGY', value: `${energy}/${MAX_ENERGY}`, red: energy <= 2 },
                            ].map(({ label, value, red }) => (
                                <div key={label} style={{ background: '#0a0a0a', padding: '12px 20px', textAlign: 'center', minWidth: '80px' }}>
                                    <div className="label-tech" style={{ color: '#333', marginBottom: '5px' }}>{label}</div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, lineHeight: 1, color: red ? '#FF2D00' : '#E8DDD0' }}>
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── OVERALL PROGRESS ── */}
                {!loading && totalLevels > 0 && (
                    <div style={{ marginBottom: '56px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className="label-tech">{totalCompleted}/{totalLevels} LEVELS COMPLETED</span>
                            <span className="label-tech" style={{ color: '#FF2D00' }}>
                                {Math.round((totalCompleted / totalLevels) * 100)}% COMPLETE
                            </span>
                        </div>
                        <div style={{ height: '2px', background: '#1e1e1e' }}>
                            <motion.div
                                initial={{ width: 0 }} animate={{ width: `${(totalCompleted / totalLevels) * 100}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                style={{ height: '100%', background: '#FF2D00' }} />
                        </div>
                    </div>
                )}

                {/* ── CHAPTERS ── */}
                {loading ? (
                    <div style={{ padding: '80px 0', textAlign: 'center' }}>
                        <p className="label-tech" style={{ color: '#333' }}>LOADING CURRICULUM...</p>
                        <div style={{ width: '40px', height: '2px', background: '#FF2D00', margin: '16px auto 0', animation: 'marquee 1s linear infinite' }} />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
                        {chapters.map((chapter, chIdx) => {
                            const progress = getChapterProgress(chapter);
                            const isDone = progress === 100;

                            return (
                                <motion.div key={chapter.chapter_id}
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: chIdx * 0.06 }}>

                                    {/* Chapter header */}
                                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${isDone ? '#1a3320' : '#1a1a1a'}` }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
                                            {/* Big chapter number */}
                                            <span className="headline-xl" style={{ fontSize: '52px', lineHeight: 1, color: isDone ? '#1a3320' : '#161616', userSelect: 'none' }}>
                                                {String(chIdx + 1).padStart(2, '0')}
                                            </span>
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#E8DDD0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {chapter.Title || chapter.Name}
                                                </div>
                                                <p className="label-tech" style={{ marginTop: '4px' }}>{chapter.Description}</p>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: isDone ? '#22c55e' : '#FF2D00', lineHeight: 1 }}>
                                                {progress}%
                                            </div>
                                            <div style={{ width: '72px', height: '2px', background: '#1e1e1e', marginTop: '6px', marginLeft: 'auto' }}>
                                                <div style={{ height: '100%', width: `${progress}%`, background: isDone ? '#22c55e' : '#FF2D00' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Level cards */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', background: '#111' }}>
                                        {(chapter.levels || []).map((level, lIdx) => {
                                            const isCompleted = completedLevels.includes(level.level_id);
                                            const unlocked = isLevelUnlocked(level.level_id);
                                            const isLocked = !unlocked;
                                            const noEnergy = energy === 0 && !isCompleted;

                                            const accentColor = isCompleted ? '#22c55e' : isLocked ? '#1a1a1a' : '#FF2D00';
                                            const textColor = isCompleted ? '#6ee7b7' : isLocked ? '#2a2a2a' : '#E8DDD0';
                                            const statusLabel = isCompleted ? '✓ MASTERED' : isLocked ? '⬡ LOCKED' : noEnergy ? '⚡ NO ENERGY' : '→ START';

                                            return (
                                                <motion.div key={level.level_id}
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                    transition={{ delay: chIdx * 0.04 + lIdx * 0.03 }}>
                                                    <Link
                                                        to={isLocked || noEnergy ? '#' : `/level/${level.level_id}`}
                                                        onClick={e => { if (isLocked || noEnergy) e.preventDefault(); }}
                                                        style={{
                                                            display: 'block', padding: '18px 16px',
                                                            background: isCompleted ? '#081508' : '#0a0a0a',
                                                            borderLeft: `3px solid ${accentColor}`,
                                                            opacity: isLocked ? 0.28 : noEnergy ? 0.5 : 1,
                                                            cursor: isLocked || noEnergy ? 'not-allowed' : 'pointer',
                                                            textDecoration: 'none', transition: 'background 0.1s',
                                                        }}
                                                        onMouseEnter={e => { if (!isLocked && !noEnergy) e.currentTarget.style.background = '#111'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = isCompleted ? '#081508' : '#0a0a0a'; }}>

                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                            <span className="label-tech" style={{ color: accentColor }}>
                                                                LV.{String(level.level_id).padStart(2, '0')}
                                                            </span>
                                                            <span className="label-tech" style={{ color: '#2a2a2a' }}>+{level.points_value || 10}</span>
                                                        </div>

                                                        <div style={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: textColor, lineHeight: 1.3, marginBottom: '12px' }}>
                                                            {level.Title}
                                                        </div>

                                                        <div className="label-tech" style={{ color: isCompleted ? '#22c55e' : isLocked ? '#1e1e1e' : '#444' }}>
                                                            {statusLabel}
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
