import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('login'); // 'login' | 'register'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username.trim()) { setError('Username is required.'); return; }
        if (!password.trim()) { setError('Password is required.'); return; }

        setLoading(true);
        try {
            await login(username.trim(), password.trim(), tab === 'register');
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = () => {
        login('Guest Explorer', '', false, true); // guestMode = true
        navigate('/dashboard');
    };

    return (
        <div style={{ background:'#080808', minHeight:'100vh', display:'flex', flexDirection:'column', color:'#E8DDD0' }}>

            {/* Top bar */}
            <div style={{ borderBottom:'1px solid #1a1a1a', padding:'7px 0', background:'#060606' }}>
                <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 48px', display:'flex', justifyContent:'space-between' }}>
                    <Link to="/" style={{ textDecoration:'none' }}>
                        <span style={{ fontFamily:'var(--font-display)', fontSize:'18px', fontWeight:700 }}>
                            <span style={{ color:'#FF2D00' }}>CODE</span>
                            <span style={{ color:'#E8DDD0' }}>QUEST</span>
                        </span>
                    </Link>
                    <span className="label-tech">VOL. 1 / 2026</span>
                </div>
            </div>

            {/* Centered form */}
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
                <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                    style={{ width:'100%', maxWidth:'420px' }}>

                    {/* Header */}
                    <div style={{ marginBottom:'32px' }}>
                        <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'8px' }}>/ PLAYER ACCESS</p>
                        <div className="headline-xl" style={{ fontSize:'clamp(28px,6vw,48px)', lineHeight:1, color:'#E8DDD0' }}>
                            {tab === 'login' ? 'SIGN IN' : 'REGISTER'}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display:'flex', gap:'1px', background:'#1a1a1a', marginBottom:'24px' }}>
                        {[['login','SIGN IN'],['register','REGISTER']].map(([key,label]) => (
                            <button key={key} onClick={() => { setTab(key); setError(''); }}
                                style={{ flex:1, padding:'10px', background:tab===key?'#0a0a0a':'#060606', fontFamily:'var(--font-display)', fontSize:'12px', fontWeight:700, letterSpacing:'0.1em', color:tab===key?'#FF2D00':'#333', border:'none', cursor:'pointer', borderTop:`2px solid ${tab===key?'#FF2D00':'transparent'}`, transition:'all 0.1s' }}>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'16px' }}>
                        <div>
                            <label className="label-tech" style={{ display:'block', marginBottom:'6px', color:'#444' }}>USERNAME</label>
                            <input
                                type="text" value={username} onChange={e => setUsername(e.target.value)}
                                placeholder="enter username"
                                style={{ width:'100%', padding:'12px 14px', background:'#0a0a0a', border:'1px solid #1e1e1e', color:'#E8DDD0', fontFamily:'var(--font-mono)', fontSize:'13px', outline:'none', boxSizing:'border-box', transition:'border-color 0.1s' }}
                                onFocus={e=>e.target.style.borderColor='#FF2D00'}
                                onBlur={e=>e.target.style.borderColor='#1e1e1e'}
                            />
                        </div>
                        <div>
                            <label className="label-tech" style={{ display:'block', marginBottom:'6px', color:'#444' }}>PASSWORD</label>
                            <input
                                type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="enter password"
                                style={{ width:'100%', padding:'12px 14px', background:'#0a0a0a', border:'1px solid #1e1e1e', color:'#E8DDD0', fontFamily:'var(--font-mono)', fontSize:'13px', outline:'none', boxSizing:'border-box', transition:'border-color 0.1s' }}
                                onFocus={e=>e.target.style.borderColor='#FF2D00'}
                                onBlur={e=>e.target.style.borderColor='#1e1e1e'}
                            />
                        </div>

                        {error && (
                            <div style={{ padding:'10px 14px', borderLeft:'3px solid #FF2D00', background:'#150505' }}>
                                <p className="label-tech" style={{ color:'#FF2D00' }}>{error}</p>
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            style={{ marginTop:'4px', padding:'14px', background:'#FF2D00', color:'#080808', fontFamily:'var(--font-display)', fontSize:'13px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', border:'none', cursor:loading?'wait':'pointer', opacity:loading?0.7:1, transition:'opacity 0.1s' }}>
                            {loading ? 'LOADING...' : tab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'20px 0' }}>
                        <div style={{ flex:1, height:'1px', background:'#1a1a1a' }} />
                        <span className="label-tech" style={{ color:'#2a2a2a' }}>OR</span>
                        <div style={{ flex:1, height:'1px', background:'#1a1a1a' }} />
                    </div>

                    {/* Guest */}
                    <button onClick={handleGuest}
                        style={{ width:'100%', padding:'12px', background:'transparent', border:'1px solid #1e1e1e', color:'#444', fontFamily:'var(--font-display)', fontSize:'12px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.1s' }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor='#333';e.currentTarget.style.color='#888';}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1e1e';e.currentTarget.style.color='#444';}}>
                        CONTINUE AS GUEST
                    </button>

                    <p className="label-tech" style={{ textAlign:'center', marginTop:'24px', color:'#1e1e1e' }}>
                        PYTHON GAMIFIED — CODEQUEST © 2026
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
