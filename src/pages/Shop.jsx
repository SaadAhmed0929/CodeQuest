import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SHOP_ITEMS = [
    {
        id: 'energy_refill',
        name: 'Energy Refill',
        tag: 'ENERGY',
        description: 'Instantly restore all 10 Energy so you can keep solving challenges without waiting.',
        price: 30,
        accent: '#d4a017',   // gold
    },
    {
        id: 'streak_freeze',
        name: 'Streak Freeze',
        tag: 'STREAK_FREEZE',
        description: "Protect your streak for one day if you miss a coding session. Don't lose your hard-earned progress!",
        price: 50,
        accent: '#4a9eff',   // blue
    },
    {
        id: 'double_xp',
        name: 'Double XP',
        tag: 'DOUBLE_XP',
        description: 'Earn 2× the XP points on your next level completion. Stack your score fast!',
        price: 75,
        accent: '#FF2D00',   // red
    },
];

const Shop = () => {
    const { user, spendCoins, refillEnergy, addStreakFreeze, MAX_ENERGY } = useAuth();
    const [confirmItem, setConfirmItem] = useState(null);
    const [toast, setToast] = useState(null);
    const [purchasing, setPurchasing] = useState(false);

    const showToast = (text, success = true) => {
        setToast({ text, success });
        setTimeout(() => setToast(null), 3000);
    };

    const executeBuy = () => {
        if (!confirmItem) return;
        if ((user?.coins || 0) < confirmItem.price) {
            showToast('NOT ENOUGH COINS', false);
            setConfirmItem(null);
            return;
        }
        setPurchasing(true);
        spendCoins(confirmItem.price);
        if (confirmItem.tag === 'ENERGY') refillEnergy();
        if (confirmItem.tag === 'STREAK_FREEZE') addStreakFreeze();
        setTimeout(() => {
            setPurchasing(false);
            setConfirmItem(null);
            showToast(`${confirmItem.name} purchased!`);
        }, 500);
    };

    const coins = user?.coins || 0;
    const energy = user?.energy ?? MAX_ENERGY;
    const freezes = user?.streak_freeze_count || 0;

    return (
        <div style={{ background: '#080808', minHeight: '100vh', color: '#E8DDD0' }}>
            <Navbar />

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
                        style={{ position:'fixed', top:'88px', left:'50%', transform:'translateX(-50%)', zIndex:999,
                            padding:'10px 24px', background:toast.success?'#22c55e':'#FF2D00',
                            color:'#080808', fontFamily:'var(--font-display)', fontSize:'12px', fontWeight:700,
                            letterSpacing:'0.12em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                        {toast.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'48px 48px 80px' }}>

                {/* Header */}
                <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
                    style={{ marginBottom:'48px', paddingBottom:'24px', borderBottom:'1px solid #1a1a1a' }}>
                    <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'8px' }}>/ QUEST SHOP</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'16px' }}>
                        <div className="headline-xl" style={{ fontSize:'clamp(32px,5vw,64px)', color:'#E8DDD0', lineHeight:1 }}>
                            POWER-UPS
                        </div>
                        <p className="label-tech" style={{ color:'#444' }}>SPEND YOUR COINS ON UPGRADES</p>
                    </div>
                </motion.div>

                {/* Wallet strip */}
                <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                    style={{ display:'flex', gap:'1px', background:'#111', marginBottom:'48px' }}>
                    {[
                        { label:'COIN BALANCE', value:coins, accent:'#d4a017' },
                        { label:'ENERGY',        value:`${energy}/${MAX_ENERGY}`, accent:energy<=2?'#FF2D00':'#E8DDD0' },
                        { label:'STREAK FREEZES',value:freezes, accent:'#4a9eff' },
                    ].map(({ label, value, accent }) => (
                        <div key={label} style={{ flex:1, padding:'16px 20px', background:'#0a0a0a', textAlign:'center' }}>
                            <p className="label-tech" style={{ color:'#333', marginBottom:'6px' }}>{label}</p>
                            <div style={{ fontFamily:'var(--font-display)', fontSize:'26px', fontWeight:700, color:accent, lineHeight:1 }}>
                                {value}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Shop items grid */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1px', background:'#111', marginBottom:'48px' }}>
                    {SHOP_ITEMS.map((item, idx) => {
                        const canAfford = coins >= item.price;
                        const shortage = item.price - coins;
                        return (
                            <motion.div key={item.id}
                                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                                transition={{ delay: 0.1 + idx * 0.07 }}
                                style={{ background:'#0a0a0a', padding:'28px 24px', display:'flex', flexDirection:'column', borderLeft:`3px solid ${canAfford ? item.accent : '#1e1e1e'}` }}>

                                {/* Tag + price */}
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                                    <span className="label-tech" style={{ color: canAfford ? item.accent : '#2a2a2a' }}>{item.tag.replace('_',' ')}</span>
                                    <span className="label-tech" style={{ color:'#444' }}>{item.price} COINS</span>
                                </div>

                                {/* Name */}
                                <div style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, color:canAfford?'#E8DDD0':'#2a2a2a', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'12px', lineHeight:1.1 }}>
                                    {item.name}
                                </div>

                                {/* Description */}
                                <p style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'#555', lineHeight:1.6, flex:1, marginBottom:'24px' }}>
                                    {item.description}
                                </p>

                                {/* Buy button */}
                                <button
                                    onClick={() => canAfford && setConfirmItem(item)}
                                    disabled={!canAfford}
                                    style={{
                                        padding:'12px', background:canAfford?item.accent:'#111',
                                        color:canAfford?'#080808':'#2a2a2a',
                                        fontFamily:'var(--font-display)', fontSize:'12px', fontWeight:700,
                                        letterSpacing:'0.12em', textTransform:'uppercase', border:'none',
                                        cursor:canAfford?'pointer':'not-allowed', transition:'opacity 0.1s',
                                    }}
                                    onMouseEnter={e=>{ if(canAfford) e.currentTarget.style.opacity='0.85'; }}
                                    onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                                    {canAfford ? `BUY FOR ${item.price} COINS` : `NEED ${shortage} MORE COINS`}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Earn coins tip */}
                <div style={{ padding:'20px 24px', borderLeft:'3px solid #1e1e1e', background:'#060606' }}>
                    <p className="label-tech" style={{ color:'#333' }}>
                        EARN MORE COINS BY COMPLETING LEVELS ON THE{' '}
                        <Link to="/dashboard" style={{ color:'#FF2D00', textDecoration:'none' }}>DASHBOARD</Link>.
                        {' '}EACH LEVEL REWARDS BOTH XP AND COINS.
                    </p>
                </div>
            </div>

            {/* Confirm modal */}
            <AnimatePresence>
                {confirmItem && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.85)', padding:'24px' }}
                        onClick={() => !purchasing && setConfirmItem(null)}>
                        <motion.div initial={{ scale:0.95, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95, y:16 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background:'#0a0a0a', border:'1px solid #1e1e1e', borderLeft:`3px solid ${confirmItem.accent}`, padding:'32px', width:'100%', maxWidth:'380px' }}>

                            <p className="label-tech" style={{ color:confirmItem.accent, marginBottom:'12px' }}>/ CONFIRM PURCHASE</p>
                            <div style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:700, color:'#E8DDD0', textTransform:'uppercase', marginBottom:'8px' }}>
                                {confirmItem.name}
                            </div>
                            <p style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'#555', marginBottom:'24px' }}>
                                This will deduct <span style={{ color:confirmItem.accent }}>{confirmItem.price} coins</span> from your balance.
                                Remaining: <span style={{ color:'#E8DDD0' }}>{coins - confirmItem.price}</span> coins.
                            </p>

                            <div style={{ display:'flex', gap:'8px' }}>
                                <button onClick={() => setConfirmItem(null)} disabled={purchasing}
                                    style={{ flex:1, padding:'12px', background:'transparent', border:'1px solid #1e1e1e', color:'#444', fontFamily:'var(--font-display)', fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.1s' }}
                                    onMouseEnter={e=>{e.currentTarget.style.borderColor='#333';e.currentTarget.style.color='#888';}}
                                    onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1e1e';e.currentTarget.style.color='#444';}}>
                                    CANCEL
                                </button>
                                <button onClick={executeBuy} disabled={purchasing}
                                    style={{ flex:1, padding:'12px', background:confirmItem.accent, color:'#080808', fontFamily:'var(--font-display)', fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', border:'none', cursor:purchasing?'wait':'pointer', opacity:purchasing?0.7:1 }}>
                                    {purchasing ? 'PROCESSING...' : 'CONFIRM'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
