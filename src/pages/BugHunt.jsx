import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BUGS = [
  {
    id: 1,
    concept: 'Syntax Error',
    code: [
      'def greet(name)',
      '    print("Hello, " + name)',
      '    return True',
      '',
      'greet("Explorer")'
    ],
    bugIdx: 0,
    correction: 'def greet(name):',
    explanation: 'Missing colon (:) at the end of the function definition.'
  },
  {
    id: 2,
    concept: 'Indentation',
    code: [
      'for i in range(5):',
      'print(i)',
      'print("Done!")'
    ],
    bugIdx: 1,
    correction: '    print(i)',
    explanation: 'Python requires code inside a loop to be indented.'
  },
  {
    id: 3,
    concept: 'Strings',
    code: [
      'message = "Welcome to CodeQuest',
      'print(message)',
      'score = 100'
    ],
    bugIdx: 0,
    correction: 'message = "Welcome to CodeQuest"',
    explanation: 'Unclosed string literal. Missing the closing quote (").'
  },
  {
    id: 4,
    concept: 'Variables',
    code: [
      'player_health = 100',
      'damage = 25',
      'player_health = player_health - damge',
      'print(player_health)'
    ],
    bugIdx: 2,
    correction: 'player_health = player_health - damage',
    explanation: 'Variable "damage" was misspelled as "damge".'
  },
  {
    id: 5,
    concept: 'Comparison',
    code: [
      'x = 10',
      'if x = 10:',
      '    print("X is ten!")',
      'else:',
      '    print("Not ten.")'
    ],
    bugIdx: 1,
    correction: 'if x == 10:',
    explanation: 'Use == for comparison, not = (which is for assignment).'
  }
];

const BugHunt = () => {
  const navigate = useNavigate();
  const [levelIdx, setLevelIdx] = useState(0);
  const [gameState, setGameState] = useState('idle'); // idle, playing, paused, gameover, complete
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [flashLine, setFlashLine] = useState(null);
  const [flashType, setFlashType] = useState(null); // 'correct' | 'incorrect'
  
  const timerRef = useRef(null);

  const bug = BUGS[levelIdx];

  const startGame = () => {
    setLevelIdx(0);
    setScore(0);
    setTimeLeft(15);
    setGameState('playing');
    setFlashLine(null);
    setFlashType(null);
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('gameover');
            clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, timeLeft]);

  const handleLineClick = (idx) => {
    if (gameState !== 'playing' || flashType !== null) return;

    if (idx === bug.bugIdx) {
      // Correct click
      setFlashLine(idx);
      setFlashType('correct');
      setScore(s => s + 100 + (timeLeft * 10));
      clearInterval(timerRef.current);

      setTimeout(() => {
        if (levelIdx < BUGS.length - 1) {
          setLevelIdx(l => l + 1);
          setTimeLeft(15);
          setFlashLine(null);
          setFlashType(null);
          setGameState('playing');
        } else {
          setGameState('complete');
        }
      }, 2000);
    } else {
      // Incorrect click
      if (!bug.code[idx].trim()) return; // Ignore empty lines
      setFlashLine(idx);
      setFlashType('incorrect');
      setTimeLeft(t => Math.max(0, t - 3)); // -3 seconds penalty
      
      setTimeout(() => {
        if (gameState === 'playing') {
          setFlashLine(null);
          setFlashType(null);
        }
      }, 500);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#E8DDD0', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @keyframes bh-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .bh-shaking {
          animation: bh-shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
        }
        .bh-line:hover {
          background: #1a1a1a;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '700px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="label-tech" style={{ color: '#FF2D00' }}>/ BUG HUNT</span>
              <span style={{ width: '1px', height: '12px', background: '#1e1e1e' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 900, color: '#FF2D00', textTransform: 'uppercase' }}>
                {gameState !== 'idle' ? `LVL ${levelIdx + 1} - ${bug?.concept}` : 'ARCADE MODE'}
              </span>
            </div>
          </div>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid #1e1e1e', color: '#444', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '4px 12px', cursor: 'pointer', letterSpacing: '0.1em' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#444'; }}>
            ← BACK
          </button>
        </div>

        {gameState === 'idle' && (
          <div style={{ padding: '40px', border: '2px solid #1a1a1a', background: '#0a0a0a', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐛</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 900, color: '#E8DDD0', textTransform: 'uppercase', marginBottom: '16px' }}>
              Bug Hunt
            </h1>
            <p className="label-tech" style={{ color: '#888', marginBottom: '32px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 32px' }}>
              A fatal syntax error hides in the code.<br />
              Find it and click it before time runs out.<br />
              Incorrect clicks cost you precious seconds!
            </p>
            <button onClick={startGame} style={{ padding: '16px 32px', background: '#FF2D00', border: 'none', color: '#080808', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
              START HUNT
            </button>
          </div>
        )}

        {gameState !== 'idle' && (
          <>
            {/* Stats Bar */}
            <div style={{ display: 'flex', gap: '2px', marginBottom: '24px' }}>
              <div style={{ flex: 1, padding: '16px 20px', background: '#0a0a0a', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                <div className="label-tech" style={{ color: '#333', marginBottom: '6px' }}>TIME</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 900, color: timeLeft <= 5 ? '#FF2D00' : '#E8DDD0', lineHeight: 1 }}>
                  {timeLeft}s
                </div>
              </div>
              <div style={{ flex: 1, padding: '16px 20px', background: '#0a0a0a', border: '1px solid #1a1a1a', textAlign: 'center' }}>
                <div className="label-tech" style={{ color: '#333', marginBottom: '6px' }}>SCORE</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 900, color: '#E8DDD0', lineHeight: 1 }}>
                  {score}
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className={flashType === 'incorrect' ? 'bh-shaking' : ''} style={{ border: '2px solid #1e1e1e', background: '#060606', marginBottom: '24px', transition: 'border-color 0.2s' }}>
              {/* Terminal header */}
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #111', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF2D00' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF2D00' }} />
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E8DDD0' }} />
                <span className="label-tech" style={{ color: '#444', marginLeft: '8px' }}>script.py</span>
                <span className="label-tech" style={{ color: '#FF2D00', marginLeft: 'auto' }}>
                  TARGET: 1 FATAL BUG
                </span>
              </div>
              
              {/* Code */}
              <div style={{ padding: '20px 0' }}>
                {bug.code.map((line, idx) => {
                  const isFlashed = flashLine === idx;
                  const isEmpty = !line.trim();
                  
                  let bg = 'transparent';
                  let color = '#E8DDD0';
                  if (isFlashed) {
                    if (flashType === 'correct') {
                      bg = '#E8DDD0';
                      color = '#080808';
                    } else if (flashType === 'incorrect') {
                      bg = '#FF2D00';
                      color = '#080808';
                    }
                  }

                  const displayLine = (isFlashed && flashType === 'correct') ? bug.correction : line;

                  return (
                    <div 
                      key={idx} 
                      className={!isEmpty && gameState === 'playing' ? 'bh-line' : ''}
                      onClick={() => handleLineClick(idx)}
                      style={{ 
                        display: 'flex', 
                        padding: '4px 20px', 
                        background: bg,
                        color: color,
                        cursor: (!isEmpty && gameState === 'playing') ? 'crosshair' : 'default',
                        transition: 'background 0.1s, color 0.1s'
                      }}
                    >
                      <div style={{ width: '30px', color: isFlashed ? '#080808' : '#333', fontFamily: 'var(--font-mono)', fontSize: '14px', flexShrink: 0, textAlign: 'right', paddingRight: '12px', userSelect: 'none' }}>
                        {idx + 1}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', whiteSpace: 'pre' }}>
                        {displayLine}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation / Feedback */}
            {flashType === 'correct' && (
              <div style={{ padding: '16px 20px', borderLeft: '3px solid #E8DDD0', background: '#1a1a1a', marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 900, color: '#E8DDD0', textTransform: 'uppercase', marginBottom: '4px' }}>
                  ✓ BUG SQUASHED!
                </div>
                <div className="label-tech" style={{ color: '#888' }}>
                  {bug.explanation}
                </div>
              </div>
            )}

            {/* Game Over / Complete Screen */}
            {(gameState === 'gameover' || gameState === 'complete') && (
              <div style={{ padding: '32px', border: `2px solid ${gameState === 'complete' ? '#E8DDD0' : '#FF2D00'}`, background: gameState === 'complete' ? '#1a1a1a' : '#150505', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: gameState === 'complete' ? '#E8DDD0' : '#FF2D00', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  {gameState === 'complete' ? '🏆 ALL BUGS CLEAR' : '💀 TIME EXPIRED'}
                </div>
                <div className="label-tech" style={{ color: '#888', marginBottom: '24px' }}>
                  FINAL SCORE: <span style={{ color: '#E8DDD0' }}>{score}</span>
                </div>
                <button onClick={startGame} style={{ padding: '12px 32px', background: gameState === 'complete' ? '#E8DDD0' : '#FF2D00', border: 'none', color: '#080808', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  PLAY AGAIN
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default BugHunt;
