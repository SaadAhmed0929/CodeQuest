import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

// ─── Puzzle Bank ──────────────────────────────────────────────────────────────
const PUZZLES = [
    {
        title: 'Score Checker',
        description: 'Arrange the code to check if a score passes or fails.',
        blocks: [
            { id: 'a', code: 'score = 85' },
            { id: 'b', code: 'if score >= 60:' },
            { id: 'c', code: '    print("Pass!")' },
            { id: 'd', code: 'else:' },
            { id: 'e', code: '    print("Fail. Try again.")' },
        ],
        correctOrder: ['a','b','c','d','e'],
        points: 20, coins: 8,
    },
    {
        title: 'Sum Machine',
        description: 'Arrange the loop to sum numbers from 0 to 4.',
        blocks: [
            { id: 'a', code: 'total = 0' },
            { id: 'b', code: 'for i in range(5):' },
            { id: 'c', code: '    total = total + i' },
            { id: 'd', code: 'print(total)' },
        ],
        correctOrder: ['a','b','c','d'],
        points: 25, coins: 10,
    },
    {
        title: 'Greeter Function',
        description: 'Build a working function that greets a user by name.',
        blocks: [
            { id: 'a', code: 'def greet(name):' },
            { id: 'b', code: '    message = "Hello, " + name + "!"' },
            { id: 'c', code: '    print(message)' },
            { id: 'd', code: 'greet("Python")' },
        ],
        correctOrder: ['a','b','c','d'],
        points: 30, coins: 12,
    },
    {
        title: 'Fruit Basket',
        description: 'Arrange the list operations in the correct order.',
        blocks: [
            { id: 'a', code: 'fruits = ["apple", "banana"]' },
            { id: 'b', code: 'fruits.append("cherry")' },
            { id: 'c', code: 'fruits.sort()' },
            { id: 'd', code: 'print(fruits)' },
        ],
        correctOrder: ['a','b','c','d'],
        points: 25, coins: 10,
    },
    {
        title: 'Countdown Rocket',
        description: 'Build a countdown from 3 to 1 then launch!',
        blocks: [
            { id: 'a', code: 'count = 3' },
            { id: 'b', code: 'while count > 0:' },
            { id: 'c', code: '    print(count)' },
            { id: 'd', code: '    count = count - 1' },
            { id: 'e', code: 'print("Launch!")' },
        ],
        correctOrder: ['a','b','c','d','e'],
        points: 35, coins: 14,
    },
];

// ─── Syntax Highlighter ───────────────────────────────────────────────────────
const KEYWORDS = ['def','for','while','if','else','elif','return','in','range','not','and','or','True','False','None','import','from','class','pass','break','continue'];
const BUILTINS = ['print','len','str','int','float','list','dict','type','input','append','sort'];

function tokenize(code) {
    const tokens = [];
    const indentMatch = code.match(/^(\s+)/);
    const indent = indentMatch ? indentMatch[1] : '';
    const rest = code.slice(indent.length);
    if (indent) tokens.push({ type: 'indent', text: indent });

    const regex = /(#.*$|"""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+\.?\d*\b|\b[a-zA-Z_]\w*\b|[=<>!+\-*/%,\[\]():.]+|\s+)/g;
    let match;
    while ((match = regex.exec(rest)) !== null) {
        const t = match[0];
        if (t.startsWith('#')) tokens.push({ type: 'comment', text: t });
        else if (t.startsWith('"') || t.startsWith("'")) tokens.push({ type: 'string', text: t });
        else if (/^\d/.test(t)) tokens.push({ type: 'number', text: t });
        else if (KEYWORDS.includes(t)) tokens.push({ type: 'keyword', text: t });
        else if (BUILTINS.includes(t)) tokens.push({ type: 'builtin', text: t });
        else if (/^[=<>!+\-*/%]+/.test(t)) tokens.push({ type: 'operator', text: t });
        else tokens.push({ type: 'plain', text: t });
    }
    return tokens;
}

const TOKEN_COLORS = {
    keyword: '#FF6B35',  // warm red-orange
    builtin: '#E8DDD0',  // cream
    string:  '#a8c5a0',  // muted green
    number:  '#d4a017',  // gold
    comment: '#3a3a3a',  // very dim
    operator:'#FF2D00',  // accent red
    indent:  'transparent',
    plain:   '#888',
};

function CodeLine({ code }) {
    return (
        <code style={{ fontFamily:'var(--font-mono)', fontSize:'13px', whiteSpace:'pre' }}>
            {tokenize(code).map((t,i) => (
                <span key={i} style={{ color: TOKEN_COLORS[t.type] || '#888' }}>{t.text}</span>
            ))}
        </code>
    );
}

// ─── Code Block (draggable + click-to-reorder) ───────────────────────────────
function CodeBlock({ block, index, total, onDragStart, onDragEnter, onDragEnd, isDragging, isOver, status, onMoveUp, onMoveDown }) {
    const accentColor =
        status === 'correct' ? '#22c55e' :
        status === 'wrong'   ? '#FF2D00' :
        isOver               ? '#FF2D00' :
        isDragging           ? '#d4a017' : '#1e1e1e';

    return (
        <motion.div
            layout
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnter={() => onDragEnter(index)}
            onDragEnd={onDragEnd}
            onDragOver={e => e.preventDefault()}
            animate={status === 'wrong' ? { x:[0,-8,8,-6,6,-3,3,0] } : { x:0 }}
            transition={status === 'wrong' ? { duration:0.4 } : { layout:{ duration:0.15 } }}
            style={{ userSelect:'none', touchAction:'none' }}>
            <div style={{
                display:'flex', alignItems:'center', gap:'10px',
                padding:'9px 12px',
                background: status === 'correct' ? '#081508' : isDragging ? '#111' : '#0a0a0a',
                borderLeft:`3px solid ${accentColor}`,
                borderTop:'1px solid #111', borderRight:'1px solid #111', borderBottom:'1px solid #111',
                opacity: isDragging ? 0.5 : 1,
                transition:'background 0.1s',
            }}>
                {/* ▲▼ click controls */}
                <div style={{ display:'flex', flexDirection:'column', gap:'1px', flexShrink:0 }}>
                    <button onClick={onMoveUp} disabled={index === 0}
                        style={{ width:'20px', height:'18px', background:'transparent', border:'none',
                            cursor:index===0?'not-allowed':'pointer',
                            color:index===0?'#1e1e1e':'#555', fontSize:'9px', padding:0,
                            display:'flex', alignItems:'center', justifyContent:'center', transition:'color 0.1s' }}
                        onMouseEnter={e=>{ if(index>0) e.currentTarget.style.color='#FF2D00'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.color=index===0?'#1e1e1e':'#555'; }}>▲</button>
                    <button onClick={onMoveDown} disabled={index === total - 1}
                        style={{ width:'20px', height:'18px', background:'transparent', border:'none',
                            cursor:index===total-1?'not-allowed':'pointer',
                            color:index===total-1?'#1e1e1e':'#555', fontSize:'9px', padding:0,
                            display:'flex', alignItems:'center', justifyContent:'center', transition:'color 0.1s' }}
                        onMouseEnter={e=>{ if(index<total-1) e.currentTarget.style.color='#FF2D00'; }}
                        onMouseLeave={e=>{ e.currentTarget.style.color=index===total-1?'#1e1e1e':'#555'; }}>▼</button>
                </div>

                {/* line number */}
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'#2a2a2a', width:'16px', textAlign:'center', flexShrink:0 }}>
                    {index + 1}
                </span>

                {/* drag handle */}
                <div style={{ display:'flex', flexDirection:'column', gap:'3px', flexShrink:0, cursor:'grab' }}>
                    {[0,1,2].map(i => <div key={i} style={{width:'14px',height:'1.5px',background:'#2a2a2a'}} />)}
                </div>

                {/* code */}
                <CodeLine code={block.code} />

                {/* status */}
                {status === 'correct' && (
                    <span style={{ marginLeft:'auto', color:'#22c55e', fontFamily:'var(--font-mono)', fontSize:'12px', flexShrink:0 }}>✓</span>
                )}
            </div>
        </motion.div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const SyntaxSorter = () => {
    const { awardLevel } = useAuth();
    const [puzzleIdx, setPuzzleIdx] = useState(0);
    const puzzle = PUZZLES[puzzleIdx];

    const shuffle = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        const isCorrect = a.every((b, i) => b.id === puzzle.correctOrder[i]);
        return isCorrect ? shuffle(a) : a;
    };

    const [blocks, setBlocks] = useState(() => shuffle([...puzzle.blocks]));
    const [status, setStatus] = useState('idle');
    const [attempts, setAttempts] = useState(0);
    const [solved, setSolved] = useState([]);

    const dragIndex = useRef(null);
    const [dragging, setDragging] = useState(null);
    const [hovering, setHovering] = useState(null);

    const handleDragStart = useCallback((i) => { dragIndex.current = i; setDragging(i); }, []);
    const handleDragEnter = useCallback((i) => {
        if (dragIndex.current === null || dragIndex.current === i) return;
        setHovering(i);
        setBlocks(prev => {
            const next = [...prev];
            const [moved] = next.splice(dragIndex.current, 1);
            next.splice(i, 0, moved);
            dragIndex.current = i;
            return next;
        });
    }, []);
    const handleDragEnd = useCallback(() => { dragIndex.current = null; setDragging(null); setHovering(null); }, []);

    const moveBlock = useCallback((from, to) => {
        setBlocks(prev => {
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        });
    }, []);

    const checkLogic = () => {
        const isCorrect = blocks.map(b => b.id).every((id, i) => id === puzzle.correctOrder[i]);
        setAttempts(a => a + 1);
        if (isCorrect) {
            setStatus('correct');
            setSolved(s => [...s, puzzleIdx]);
            awardLevel(puzzle.points, puzzle.coins);
        } else {
            setStatus('wrong');
            setTimeout(() => setStatus('idle'), 700);
        }
    };

    const goNext = () => {
        if (puzzleIdx < PUZZLES.length - 1) {
            const nextIdx = puzzleIdx + 1;
            const nextPuzzle = PUZZLES[nextIdx];
            setPuzzleIdx(nextIdx);
            setBlocks(shuffle([...nextPuzzle.blocks]));
            setStatus('idle');
            setAttempts(0);
        }
    };

    const reset = () => { setBlocks(shuffle([...puzzle.blocks])); setStatus('idle'); };
    const isComplete = puzzleIdx >= PUZZLES.length - 1 && status === 'correct';

    return (
        <div style={{ background:'#080808', minHeight:'100vh', color:'#E8DDD0' }}>
            <Navbar />

            <div style={{ maxWidth:'760px', margin:'0 auto', padding:'40px 48px 80px' }}>

                {/* Header */}
                <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
                    style={{ marginBottom:'40px', paddingBottom:'24px', borderBottom:'1px solid #1a1a1a' }}>
                    <p className="label-tech" style={{ color:'#FF2D00', marginBottom:'8px' }}>/ MINI GAME</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                        <div className="headline-xl" style={{ fontSize:'clamp(28px,5vw,52px)', color:'#E8DDD0', lineHeight:1 }}>
                            SYNTAX SORTER
                        </div>
                        <p className="label-tech" style={{ color:'#444' }}>USE ▲▼ OR DRAG TO REORDER</p>
                    </div>
                </motion.div>

                {/* Progress pips */}
                <div style={{ display:'flex', gap:'1px', background:'#111', marginBottom:'32px' }}>
                    {PUZZLES.map((p,i) => (
                        <div key={i} onClick={() => { if (solved.includes(i) || i <= puzzleIdx) { setPuzzleIdx(i); setBlocks(shuffle([...PUZZLES[i].blocks])); setStatus('idle'); setAttempts(0); }}}
                            style={{ flex:1, padding:'10px', textAlign:'center', background:i===puzzleIdx?'#0a0a0a':'#060606', borderTop:`2px solid ${solved.includes(i)?'#22c55e':i===puzzleIdx?'#FF2D00':'#1a1a1a'}`, cursor:'pointer' }}>
                            <span className="label-tech" style={{ color:solved.includes(i)?'#22c55e':i===puzzleIdx?'#FF2D00':'#2a2a2a' }}>
                                {solved.includes(i) ? '✓' : `0${i+1}`}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Puzzle card */}
                <AnimatePresence mode="wait">
                    <motion.div key={puzzleIdx}
                        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}>

                        {/* Card header */}
                        <div style={{ padding:'16px 20px', background:'#060606', borderTop:'1px solid #1a1a1a', borderLeft:'1px solid #1a1a1a', borderRight:'1px solid #1a1a1a', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <div>
                                <div style={{ fontFamily:'var(--font-display)', fontSize:'17px', fontWeight:700, color:'#E8DDD0', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                                    {puzzle.title}
                                </div>
                                <p className="label-tech" style={{ color:'#444', marginTop:'3px' }}>{puzzle.description}</p>
                            </div>
                            <div style={{ display:'flex', gap:'12px', flexShrink:0 }}>
                                <span className="label-tech" style={{ color:'#FF2D00' }}>+{puzzle.points} XP</span>
                                <span className="label-tech" style={{ color:'#d4a017' }}>+{puzzle.coins} COINS</span>
                            </div>
                        </div>

                        {/* Drag area */}
                        <div style={{ border:'1px solid #1a1a1a', borderTop:'none', marginBottom:'1px' }}>
                            {blocks.map((block, idx) => (
                                <CodeBlock key={block.id} block={block} index={idx} total={blocks.length}
                                    onDragStart={handleDragStart} onDragEnter={handleDragEnter} onDragEnd={handleDragEnd}
                                    isDragging={dragging===idx} isOver={hovering===idx} status={status}
                                    onMoveUp={()   => idx > 0              && moveBlock(idx, idx - 1)}
                                    onMoveDown={()  => idx < blocks.length - 1 && moveBlock(idx, idx + 1)} />
                            ))}
                        </div>

                        {/* Feedback */}
                        <AnimatePresence>
                            {status === 'correct' && (
                                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                                    style={{ padding:'16px 20px', background:'#081508', borderLeft:'3px solid #22c55e', border:'1px solid #1a3320', marginBottom:'1px' }}>
                                    <div style={{ fontFamily:'var(--font-display)', fontSize:'15px', fontWeight:700, color:'#22c55e', textTransform:'uppercase', marginBottom:'6px' }}>
                                        ✓ PERFECT LOGIC
                                    </div>
                                    <div style={{ display:'flex', gap:'16px' }}>
                                        <span className="label-tech" style={{ color:'#FF2D00' }}>+{puzzle.points} XP</span>
                                        <span className="label-tech" style={{ color:'#d4a017' }}>+{puzzle.coins} COINS</span>
                                        {attempts === 1 && <span className="label-tech" style={{ color:'#22c55e' }}>⚡ FIRST TRY BONUS</span>}
                                    </div>
                                </motion.div>
                            )}
                            {status === 'wrong' && (
                                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                                    style={{ padding:'12px 20px', borderLeft:'3px solid #FF2D00', background:'#150505', border:'1px solid #2a1010', marginBottom:'1px' }}>
                                    <p className="label-tech" style={{ color:'#FF2D00' }}>✗ NOT QUITE — KEEP REARRANGING</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Controls */}
                        <div style={{ display:'flex', gap:'8px', marginTop:'16px' }}>
                            {status !== 'correct' ? (
                                <>
                                    <button onClick={checkLogic}
                                        style={{ flex:1, padding:'14px', background:'#FF2D00', color:'#080808', fontFamily:'var(--font-display)', fontSize:'13px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', border:'none', cursor:'pointer', transition:'opacity 0.1s' }}
                                        onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
                                        onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                                        CHECK LOGIC
                                    </button>
                                    <button onClick={reset}
                                        style={{ padding:'14px 20px', background:'transparent', border:'1px solid #1e1e1e', color:'#444', fontFamily:'var(--font-mono)', fontSize:'10px', letterSpacing:'0.1em', cursor:'pointer', textTransform:'uppercase', transition:'all 0.1s' }}
                                        onMouseEnter={e=>{e.currentTarget.style.borderColor='#333';e.currentTarget.style.color='#888';}}
                                        onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1e1e';e.currentTarget.style.color='#444';}}>
                                        SHUFFLE
                                    </button>
                                </>
                            ) : isComplete ? (
                                <div style={{ flex:1, padding:'14px', background:'#d4a017', color:'#080808', fontFamily:'var(--font-display)', fontSize:'13px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', textAlign:'center' }}>
                                    🏆 ALL PUZZLES COMPLETE
                                </div>
                            ) : (
                                <button onClick={goNext}
                                    style={{ flex:1, padding:'14px', background:'#22c55e', color:'#080808', fontFamily:'var(--font-display)', fontSize:'13px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', border:'none', cursor:'pointer', transition:'opacity 0.1s' }}
                                    onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
                                    onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                                    NEXT PUZZLE →
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Tip */}
                <p className="label-tech" style={{ textAlign:'center', marginTop:'28px', color:'#1e1e1e' }}>
                    DRAG BLOCKS BY THE ≡ HANDLE — ORDER MATTERS IN PYTHON
                </p>
            </div>
        </div>
    );
};

export default SyntaxSorter;
