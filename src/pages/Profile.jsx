import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

const W = { maxWidth: '1200px', margin: '0 auto', padding: '0 48px' };

// ── Rank system ──────────────────────────────────────────────────
const getRank = (pts) => {
    if (pts >= 1000) return { label: 'SPACE CODER',  num: '04', color: '#7cc47a' };
    if (pts >= 500)  return { label: 'CODE WARRIOR', num: '03', color: '#d4a017' };
    if (pts >= 200)  return { label: 'RISING DEV',   num: '02', color: '#e8623a' };
    return             { label: 'BEGINNER',       num: '01', color: '#E8DDD0' };
};

// ── Achievement badges ───────────────────────────────────────────
const getBadges = (user, completedCount) => {
    const badges = [];
    if (completedCount >= 1)  badges.push({ tag: 'FIRST LEVEL',     desc: 'Cleared level 1' });
    if (completedCount >= 5)  badges.push({ tag: 'ON A ROLL',        desc: '5 levels done' });
    if (completedCount >= 10) badges.push({ tag: 'DEDICATED CODER',  desc: '10 levels done' });
    if (completedCount >= 20) badges.push({ tag: 'HARDCORE',         desc: '20 levels done' });
    if ((user?.current_streak || 0) >= 3) badges.push({ tag: '3-DAY STREAK', desc: 'Logged in 3 days' });
    if ((user?.coins || 0) >= 100)        badges.push({ tag: 'COIN HOARDER',  desc: '100+ coins' });
    if (badges.length === 0)  badges.push({ tag: 'JUST ARRIVED',     desc: 'Welcome to CodeQuest' });
    return badges;
};

const Profile = () => {
    const { user, logout, MAX_ENERGY } = useAuth();

    if (!user) {
        return (
            <div style={{ background: '#080808', minHeight: '100vh', color: '#E8DDD0' }}>
                <Navbar />
                <div style={{ ...W, paddingTop: '80px', textAlign: 'center' }}>
                    <p className="label-tech" style={{ color: '#444', marginBottom: '24px' }}>NOT LOGGED IN</p>
                    <Link to="/login" className="btn-accent"
                        style={{ display: 'inline-block', padding: '12px 32px', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
                        SIGN IN
                    </Link>
                </div>
            </div>
        );
    }

    const completedCount = (user.completedLevels || []).length;
    const energy = user.energy ?? MAX_ENERGY;
    const rank = getRank(user.total_points || 0);
    const badges = getBadges(user, completedCount);
    const xpToNext = rank.label !== 'SPACE CODER' ? Math.max(0, (rank.label === 'BEGINNER' ? 200 : rank.label === 'RISING DEV' ? 500 : 1000) - (user.total_points || 0)) : 0;
    const rankThresholds = { BEGINNER: [0, 200], 'RISING DEV': [200, 500], 'CODE WARRIOR': [500, 1000], 'SPACE CODER': [1000, 1000] };
    const [lo, hi] = rankThresholds[rank.label] || [0, 200];
    const rankPct = rank.label === 'SPACE CODER' ? 100 : Math.round(((user.total_points || 0) - lo) / (hi - lo) * 100);

    return (
        <div style={{ background: '#080808', minHeight: '100vh', color: '#E8DDD0' }}>
            <Navbar />

            <div style={{ ...W, paddingTop: '48px', paddingBottom: '80px' }}>

                {/* ── PAGE LABEL ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ marginBottom: '48px', paddingBottom: '24px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <p className="label-tech" style={{ color: '#FF2D00', marginBottom: '8px' }}>/ PLAYER PROFILE</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <img src={user.profile_picture_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'}
                                alt={user.username}
                                style={{ width: '56px', height: '56px', border: '2px solid #FF2D00', display: 'block' }} />
                            <div>
                                <div className="headline-xl" style={{ fontSize: 'clamp(28px, 4vw, 56px)', color: '#E8DDD0', lineHeight: 1 }}>
                                    {(user.username || 'EXPLORER').toUpperCase()}
                                </div>
                                <div className="label-tech" style={{ marginTop: '6px', color: rank.color }}>
                                    {rank.num} / {rank.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={logout}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'transparent', border: '1px solid #FF2D00', color: '#FF2D00', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,45,0,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={14} /> LOGOUT
                    </button>
                </motion.div>

                {/* ── RANK PROGRESS ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{ marginBottom: '56px', padding: '28px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderLeft: `3px solid ${rank.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                            <p className="label-tech" style={{ color: '#444', marginBottom: '4px' }}>CURRENT RANK</p>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: rank.color }}>{rank.label}</div>
                        </div>
                        {rank.label !== 'SPACE CODER' && (
                            <div style={{ textAlign: 'right' }}>
                                <p className="label-tech" style={{ color: '#444', marginBottom: '4px' }}>NEXT RANK IN</p>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#E8DDD0' }}>{xpToNext} XP</div>
                            </div>
                        )}
                    </div>
                    <div style={{ height: '3px', background: '#1e1e1e' }}>
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: `${rankPct}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                            style={{ height: '100%', background: rank.color }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span className="label-tech">{lo} XP</span>
                        <span className="label-tech" style={{ color: rank.color }}>{rankPct}%</span>
                        <span className="label-tech">{rank.label === 'SPACE CODER' ? '∞' : hi + ' XP'}</span>
                    </div>
                </motion.div>

                {/* ── STATS GRID ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#1a1a1a', marginBottom: '56px' }}>
                    {[
                        { label: 'TOTAL XP',  value: user.total_points || 0,  color: '#FF2D00' },
                        { label: 'COINS',     value: user.coins || 0,          color: '#d4a017' },
                        { label: 'DAY STREAK',value: user.current_streak || 0, color: '#e8623a' },
                        { label: 'ENERGY',    value: `${energy}/${MAX_ENERGY}`, color: energy > 3 ? '#7cc47a' : '#FF2D00' },
                        { label: 'LEVELS DONE',value: completedCount,          color: '#E8DDD0' },
                        { label: 'FREEZES',   value: user.streak_freeze_count || 0, color: '#E8DDD0' },
                        { label: 'ACCOUNT',   value: (user.role || 'STUDENT').toUpperCase(), color: '#E8DDD0' },
                        { label: 'JOINED',    value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'TODAY', color: '#E8DDD0' },
                    ].map(({ label, value, color }) => (
                        <div key={label} style={{ background: '#0a0a0a', padding: '20px 18px' }}>
                            <p className="label-tech" style={{ color: '#333', marginBottom: '8px' }}>{label}</p>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color, lineHeight: 1 }}>
                                {value}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* ── ACHIEVEMENTS ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #1a1a1a' }}>
                        <div>
                            <p className="label-tech" style={{ color: '#FF2D00', marginBottom: '4px' }}>/ ACHIEVEMENTS</p>
                            <p className="label-tech" style={{ color: '#333' }}>{badges.length} BADGE{badges.length !== 1 ? 'S' : ''} EARNED</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1px', background: '#1a1a1a' }}>
                        {badges.map(({ tag, desc }) => (
                            <div key={tag} style={{ background: '#0a0a0a', padding: '20px 18px', borderLeft: '3px solid #FF2D00' }}>
                                <p className="label-tech" style={{ color: '#FF2D00', marginBottom: '6px' }}>{tag}</p>
                                <p style={{ fontSize: '0.78rem', color: '#555' }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ── QUICK ACTIONS ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    style={{ display: 'flex', gap: '10px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #1a1a1a' }}>
                    <Link to="/dashboard" className="btn-accent"
                        style={{ padding: '12px 28px', fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.1em', textDecoration: 'none' }}>
                        CONTINUE LEARNING
                    </Link>
                    <Link to="/shop" className="btn-ghost"
                        style={{ padding: '12px 24px', fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.1em', textDecoration: 'none' }}>
                        VISIT SHOP
                    </Link>
                    <Link to="/syntax-sorter" className="btn-ghost"
                        style={{ padding: '12px 24px', fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.1em', textDecoration: 'none' }}>
                        🧩 MINI GAME
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
