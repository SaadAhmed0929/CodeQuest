import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const W = { maxWidth: '1200px', margin: '0 auto', padding: '0 48px' };

const Navbar = () => {
    const { user, MAX_ENERGY } = useAuth();
    const location = useLocation();

    const links = [
        { to: '/dashboard', label: 'LEARN' },
        { to: '/syntax-sorter', label: 'MINI GAME' },
        { to: '/shop', label: 'SHOP' },
    ];

    const energy = user?.energy ?? MAX_ENERGY;
    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{ background: '#080808', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, zIndex: 50 }}>

            {/* Main row */}
            <div style={W}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px' }}>

                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, lineHeight: 1 }}>
                            <span style={{ color: '#FF2D00' }}>CODE</span>
                            <span style={{ color: '#E8DDD0' }}>QUEST</span>
                        </span>
                        <span className="label-tech" style={{ borderLeft: '1px solid #2a2a2a', paddingLeft: '14px', color: '#333' }}>
                            PYTHON GAMIFIED
                        </span>
                    </Link>

                    {/* Nav links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        {links.map(({ to, label }) => (
                            <Link key={to} to={to}
                                className="label-tech"
                                style={{ textDecoration: 'none', color: isActive(to) ? '#FF2D00' : '#444', transition: 'color 0.1s' }}
                                onMouseEnter={e => !isActive(to) && (e.currentTarget.style.color = '#888')}
                                onMouseLeave={e => !isActive(to) && (e.currentTarget.style.color = '#444')}>
                                {isActive(to) && <span style={{ marginRight: '5px' }}>/</span>}
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Right stats */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>

                        {/* XP */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 14px', borderRight: '1px solid #1a1a1a', minWidth: '64px' }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#FF2D00', lineHeight: 1 }}>
                                {user?.total_points || 0}
                            </span>
                            <span className="label-tech" style={{ color: '#444', marginTop: '2px' }}>XP</span>
                        </div>

                        {/* Coins */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 14px', borderRight: '1px solid #1a1a1a', minWidth: '64px' }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#d4a017', lineHeight: 1 }}>
                                {user?.coins || 0}
                            </span>
                            <span className="label-tech" style={{ color: '#444', marginTop: '2px' }}>COINS</span>
                        </div>

                        {/* Streak */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 14px', borderRight: '1px solid #1a1a1a', minWidth: '64px' }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#e8623a', lineHeight: 1 }}>
                                {user?.current_streak || 0}
                            </span>
                            <span className="label-tech" style={{ color: '#444', marginTop: '2px' }}>STREAK</span>
                        </div>

                        {/* Energy bar */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 14px', borderRight: '1px solid #1a1a1a', minWidth: '80px' }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: energy > 3 ? '#7cc47a' : '#FF2D00', lineHeight: 1 }}>
                                {energy}/{MAX_ENERGY}
                            </span>
                            <div style={{ width: '36px', height: '2px', background: '#1e1e1e', marginTop: '4px' }}>
                                <div style={{ height: '100%', width: `${(energy / MAX_ENERGY) * 100}%`, background: energy > 3 ? '#7cc47a' : '#FF2D00', transition: 'width 0.3s' }} />
                            </div>
                        </div>

                        {/* Avatar */}
                        <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0 4px 14px' }}>
                            <img src={user?.profile_picture_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'}
                                alt={user?.username}
                                style={{ width: '26px', height: '26px', border: '1px solid #FF2D00', display: 'block' }} />
                            <span className="label-tech" style={{ color: '#E8DDD0' }}>
                                {(user?.username || 'GUEST').toUpperCase()}
                            </span>
                        </Link>
                    </div>

                </div>
            </div>

            {/* Meta bottom strip */}
            <div style={{ background: '#050505', borderTop: '1px solid #111' }}>
                <div style={{ ...W, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '24px' }}>
                    <span className="label-tech" style={{ color: '#222' }}>P. 001</span>
                    <span className="label-tech" style={{ color: '#FF2D00' }}>
                        🔥 {user?.current_streak || 0}-DAY STREAK
                    </span>
                    <span className="label-tech" style={{ color: '#222' }}>VOL. 1 / 2025</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
