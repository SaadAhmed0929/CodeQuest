import React,{useState,useEffect,useRef,useCallback}from'react';
import{Link,useNavigate}from'react-router-dom';
import Navbar from'../components/Navbar';

/* ── shake + pulse CSS injected once ── */
const STYLE=`
@keyframes vv-shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(8px)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}90%{transform:translateX(3px)}}
@keyframes vv-pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.vv-shake{animation:vv-shake 0.5s ease;}
.vv-pulse{animation:vv-pulse 0.8s ease infinite;}
`;

/* ── Vault levels ── */
const VAULTS=[
  {
    id:1,name:'SECTOR ALPHA',time:18,
    concept:'Dictionary Access',
    hint:'vault["key"]',
    data:{score:9001},
    target:9001,
    path:`vault['score']`,
    display:`vault = {\n  "score": 9001\n}`,
  },
  {
    id:2,name:'SECTOR BRAVO',time:16,
    concept:'Nested Dict — 2 Levels',
    hint:'vault["key1"]["key2"]',
    data:{user:{age:42}},
    target:42,
    path:`vault['user']['age']`,
    display:`vault = {\n  "user": {\n    "age": 42\n  }\n}`,
  },
  {
    id:3,name:'SECTOR CHARLIE',time:14,
    concept:'Nested Dict — 3 Levels',
    hint:'vault["a"]["b"]["c"]',
    data:{sector_7:{passcode:{pin:80085}}},
    target:80085,
    path:`vault['sector_7']['passcode']['pin']`,
    display:`vault = {\n  "sector_7": {\n    "passcode": {\n      "pin": 80085\n    }\n  }\n}`,
  },
  {
    id:4,name:'SECTOR DELTA',time:12,
    concept:'Mixed Types in Nested Dict',
    hint:'Watch the types — strings vs ints',
    data:{db:{users:{count:512}}},
    target:512,
    path:`vault['db']['users']['count']`,
    display:`vault = {\n  "db": {\n    "users": {\n      "count": 512,\n      "active": True\n    },\n    "version": "2.1"\n  }\n}`,
  },
  {
    id:5,name:'SECTOR OMEGA',time:10,
    concept:'Deep Nesting — 4 Levels',
    hint:'Four keys deep — read carefully!',
    data:{gov:{intel:{agent:{id:7}}}} ,
    target:7,
    path:`vault['gov']['intel']['agent']['id']`,
    display:`vault = {\n  "gov": {\n    "intel": {\n      "agent": {\n        "id": 7,\n        "name": "redacted"\n      },\n      "level": "classified"\n    },\n    "status": "active"\n  }\n}`,
  },
];

/* ── Syntax-highlight a dict display string ── */
function HighlightDict({text}){
  return(
    <pre style={{fontFamily:'var(--font-mono)',fontSize:'13px',lineHeight:2,margin:0,padding:0,whiteSpace:'pre-wrap'}}>
      {text.split('\n').map((line,i)=>{
        const parts=[];
        let rest=line;
        // key strings (in quotes before colon)
        rest=rest.replace(/"([^"]+)"(\s*:)/g,(_,k,c)=>`\x01STR\x01${k}\x01END\x01${c}`);
        // value strings
        rest=rest.replace(/:\s*"([^"]+)"/g,(_,v)=>`: \x01VAL\x01${v}\x01END\x01`);
        // numbers
        rest=rest.replace(/:\s*(\d+)/g,(_,n)=>`: \x01NUM\x01${n}\x01END\x01`);
        // booleans
        rest=rest.replace(/:\s*(True|False)/g,(_,b)=>`: \x01BOOL\x01${b}\x01END\x01`);
        const seg=rest.split(/(\x01\w+\x01[^\x01]*\x01END\x01)/);
        return(
          <span key={i} style={{display:'block'}}>
            {seg.map((s,j)=>{
              if(s.startsWith('\x01STR\x01'))return <span key={j} style={{color:'#FFD700'}}>"{s.replace(/\x01STR\x01|\x01END\x01/g,'')}"</span>;
              if(s.startsWith('\x01VAL\x01'))return <span key={j}>: <span style={{color:'#FFD700'}}>"{s.replace(/\x01VAL\x01|\x01END\x01/g,'')}"</span></span>;
              if(s.startsWith('\x01NUM\x01'))return <span key={j}>: <span style={{color:'#4a9eff'}}>{s.replace(/\x01NUM\x01|\x01END\x01/g,'')}</span></span>;
              if(s.startsWith('\x01BOOL\x01'))return <span key={j}>: <span style={{color:'#FF2D00'}}>{s.replace(/\x01BOOL\x01|\x01END\x01/g,'')}</span></span>;
              return <span key={j} style={{color:'#666'}}>{s}</span>;
            })}
          </span>
        );
      })}
    </pre>
  );
}

export default function VariableVault(){
  const[vi,setVi]=useState(0);
  const[input,setInput]=useState('');
  const[lives,setLives]=useState(3);
  const[score,setScore]=useState(0);
  const[time,setTime]=useState(VAULTS[0].time);
  const[vaultState,setVaultState]=useState('idle'); // idle|success|fail|gameover|complete
  const[shake,setShake]=useState(false);
  const[attempts,setAttempts]=useState(0);
  const inputRef=useRef(null);
  const timerRef=useRef(null);
  const vault=VAULTS[vi];

  /* ── Timer ── */
  const startTimer=useCallback(()=>{
    clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>{
      setTime(t=>{
        if(t<=1){clearInterval(timerRef.current);handleFail('timeout');return 0;}
        return t-1;
      });
    },1000);
  },[]);

  const stopTimer=()=>clearInterval(timerRef.current);

  useEffect(()=>{
    if(vaultState==='idle')startTimer();
    return()=>stopTimer();
  },[vi,vaultState]);

  useEffect(()=>{
    if(vaultState==='idle')inputRef.current?.focus();
  },[vaultState,vi]);

  useEffect(()=>()=>stopTimer(),[]);

  /* ── Fail logic ── */
  function handleFail(reason){
    stopTimer();
    setShake(true);setTimeout(()=>setShake(false),600);
    setAttempts(a=>a+1);
    const newLives=lives-1;
    setLives(newLives);
    if(newLives<=0){setVaultState('gameover');}
    else{setVaultState('fail');setTimeout(()=>{setInput('');setTime(vault.time);setVaultState('idle');},1800);}
  }

  /* ── Submit ── */
  function handleSubmit(){
    if(vaultState!=='idle')return;
    const normalize=s=>s.replace(/\s/g,'').replace(/"/g,"'");
    const clean=normalize(input);
    const correct=normalize(vault.path);
    if(clean===correct){
      stopTimer();
      const bonus=Math.max(0,time)*10;
      setScore(s=>s+100+bonus);
      setVaultState('success');
      setTimeout(()=>{
        if(vi<VAULTS.length-1){setVi(i=>i+1);setInput('');setTime(VAULTS[vi+1].time);setVaultState('idle');}
        else{setVaultState('complete');}
      },1600);
    } else {
      handleFail('wrong');
    }
  }

  function restart(){setVi(0);setInput('');setLives(3);setScore(0);setTime(VAULTS[0].time);setVaultState('idle');setAttempts(0);}

  const borderCol=vaultState==='success'?'#E8DDD0':vaultState==='fail'||vaultState==='gameover'?'#FF2D00':'#1e1e1e';
  const glowCol=vaultState==='success'?'rgba(232,221,208,0.2)':vaultState==='fail'?'rgba(255,45,0,0.2)':'transparent';
  const urgent=time<=5&&vaultState==='idle';

  return(
    <>
      <style>{STYLE}</style>
      <div style={{background:'#080808',minHeight:'100vh',display:'flex',flexDirection:'column',color:'#E8DDD0'}}>
        <Navbar/>
        {/* Header */}
        <div style={{borderBottom:'1px solid #1a1a1a',padding:'10px 0',background:'#050505'}}>
          <div style={{maxWidth:'900px',margin:'0 auto',padding:'0 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
              <span className="label-tech" style={{color:'#FF2D00'}}>/ VARIABLE VAULT</span>
              <span style={{width:'1px',height:'12px',background:'#1e1e1e'}}/>
              <span style={{fontFamily:'var(--font-display)',fontSize:'14px',fontWeight:900,color:'#FF2D00',textTransform:'uppercase'}}>{vault.name}</span>
            </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <button onClick={() => navigate('/mini-games')} style={{ background: 'none', border: '1px solid #1e1e1e', color: '#444', fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '4px 12px', cursor: 'pointer', letterSpacing: '0.1em' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#444'; }}>
                ← BACK
            </button>
            <Link to="/mini-games" className="label-tech" style={{color:'#333',textDecoration:'none'}}>GAMES HUB</Link>
          </div>
          </div>
        </div>

        <div style={{flex:1,maxWidth:'900px',margin:'0 auto',width:'100%',padding:'32px 40px'}}>

          {/* Stats row */}
          <div style={{display:'flex',gap:'2px',marginBottom:'24px',alignItems:'stretch'}}>
            {/* Timer */}
            <div style={{flex:1,padding:'16px 20px',background:'#0a0a0a',border:'1px solid #1a1a1a',textAlign:'center'}}>
              <div className="label-tech" style={{color:'#333',marginBottom:'6px'}}>TIME</div>
              <div className={urgent?'vv-pulse':''} style={{fontFamily:'var(--font-display)',fontSize:'40px',fontWeight:900,color:urgent?'#FF2D00':time<=8?'#FF2D00':'#E8DDD0',lineHeight:1,transition:'color 0.5s'}}>
                {String(time).padStart(2,'0')}
              </div>
            </div>
            {/* Lives */}
            <div style={{flex:1,padding:'16px 20px',background:'#0a0a0a',border:'1px solid #1a1a1a',textAlign:'center'}}>
              <div className="label-tech" style={{color:'#333',marginBottom:'6px'}}>LIVES</div>
              <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'4px'}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:'16px',height:'16px',borderRadius:'50%',background:i<lives?'#FF2D00':'#1a1a1a',border:`1px solid ${i<lives?'#FF2D00':'#222'}`,transition:'all 0.3s'}}/>
                ))}
              </div>
            </div>
            {/* Score */}
            <div style={{flex:1,padding:'16px 20px',background:'#0a0a0a',border:'1px solid #1a1a1a',textAlign:'center'}}>
              <div className="label-tech" style={{color:'#333',marginBottom:'6px'}}>SCORE</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'28px',fontWeight:900,color:'#E8DDD0',lineHeight:1}}>{score}</div>
            </div>
            {/* Level */}
            <div style={{flex:1,padding:'16px 20px',background:'#0a0a0a',border:'1px solid #1a1a1a',textAlign:'center'}}>
              <div className="label-tech" style={{color:'#333',marginBottom:'6px'}}>VAULT</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'28px',fontWeight:900,color:'#FF2D00',lineHeight:1}}>{vi+1}<span style={{fontSize:'14px',color:'#222'}}>/{VAULTS.length}</span></div>
            </div>
          </div>

          {/* Level dots */}
          <div style={{display:'flex',gap:'4px',marginBottom:'24px'}}>
            {VAULTS.map((_,i)=>(
              <div key={i} style={{flex:1,height:'3px',background:i<vi?'#E8DDD0':i===vi?'#FF2D00':'#1a1a1a',transition:'background 0.3s'}}/>
            ))}
          </div>

          {/* Vault card */}
          <div className={shake?'vv-shake':''} style={{border:`2px solid ${borderCol}`,boxShadow:`0 0 24px ${glowCol}`,transition:'border-color 0.3s, box-shadow 0.3s',marginBottom:'24px',background:'#060606'}}>
            {/* Vault header */}
            <div style={{padding:'12px 20px',borderBottom:'1px solid #111',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#FF2D00'}}/>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#FF2D00'}}/>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#E8DDD0'}}/>
                <span className="label-tech" style={{color:'#222',marginLeft:'8px'}}>vault.py</span>
              </div>
              <span className="label-tech" style={{color:'#FF2D00'}}>{vault.concept}</span>
            </div>
            {/* Dict display */}
            <div style={{padding:'20px 24px',minHeight:'140px'}}>
              <HighlightDict text={vault.display}/>
            </div>
            {/* Target */}
            <div style={{padding:'12px 20px',borderTop:'1px solid #111',background:'#050505',display:'flex',alignItems:'center',gap:'16px'}}>
              <span className="label-tech" style={{color:'#333'}}>TARGET VALUE:</span>
              <span style={{fontFamily:'var(--font-mono)',fontSize:'20px',fontWeight:900,color:'#FF2D00'}}>{vault.target}</span>
              <span className="label-tech" style={{color:'#222',marginLeft:'auto'}}>💡 {vault.hint}</span>
            </div>
          </div>

          {/* Result messages */}
          {vaultState==='success'&&(
            <div style={{padding:'14px 20px',borderLeft:'3px solid #E8DDD0',background:'#1a1a1a',marginBottom:'20px'}}>
              <span style={{fontFamily:'var(--font-display)',fontSize:'15px',fontWeight:900,color:'#E8DDD0',textTransform:'uppercase',letterSpacing:'0.06em'}}>✓ VAULT CRACKED! +{100+Math.max(0,time)*10} PTS</span>
            </div>
          )}
          {vaultState==='fail'&&(
            <div style={{padding:'14px 20px',borderLeft:'3px solid #FF2D00',background:'#130808',marginBottom:'20px'}}>
              <span style={{fontFamily:'var(--font-display)',fontSize:'15px',fontWeight:900,color:'#FF2D00',textTransform:'uppercase',letterSpacing:'0.06em'}}>✗ WRONG PATH — LOCKDOWN!</span>
            </div>
          )}
          {(vaultState==='gameover'||vaultState==='complete')&&(
            <div style={{padding:'32px',border:`2px solid ${vaultState==='complete'?'#E8DDD0':'#FF2D00'}`,background:vaultState==='complete'?'#1a1a1a':'#130808',textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:'28px',fontWeight:900,color:vaultState==='complete'?'#E8DDD0':'#FF2D00',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>
                {vaultState==='complete'?'🏆 ALL VAULTS CRACKED!':'🔒 SYSTEM LOCKDOWN'}
              </div>
              <div className="label-tech" style={{color:'#555',marginBottom:'20px'}}>FINAL SCORE: <span style={{color:'#E8DDD0'}}>{score}</span> &nbsp;·&nbsp; ATTEMPTS: <span style={{color:'#FF2D00'}}>{attempts}</span></div>
              <button onClick={restart} style={{padding:'12px 32px',background:vaultState==='complete'?'#E8DDD0':'#FF2D00',border:'none',color:'#080808',fontFamily:'var(--font-display)',fontSize:'13px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',cursor:'pointer'}}>
                PLAY AGAIN
              </button>
            </div>
          )}

          {/* Input */}
          {(vaultState==='idle'||vaultState==='success'||vaultState==='fail')&&vaultState!=='gameover'&&vaultState!=='complete'&&(
            <div>
              <div className="label-tech" style={{color:'#333',marginBottom:'8px'}}>/ ENTER KEY PATH TO EXTRACT TARGET</div>
              <div style={{display:'flex',gap:'8px'}}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
                  placeholder={`vault['key']`}
                  disabled={vaultState!=='idle'}
                  spellCheck={false}
                  style={{flex:1,padding:'14px 16px',background:'#060606',border:`1px solid ${vaultState==='idle'?'#1e1e1e':'#333'}`,color:'#E8DDD0',fontFamily:'var(--font-mono)',fontSize:'14px',outline:'none',letterSpacing:'0.03em',transition:'border-color 0.15s'}}
                  onFocus={e=>e.target.style.borderColor='#FF2D00'}
                  onBlur={e=>e.target.style.borderColor='#1e1e1e'}
                />
                <button onClick={handleSubmit} disabled={vaultState!=='idle'||!input.trim()}
                  style={{padding:'14px 28px',background:input.trim()&&vaultState==='idle'?'#FF2D00':'#111',border:'none',color:input.trim()&&vaultState==='idle'?'#080808':'#333',fontFamily:'var(--font-display)',fontSize:'13px',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',cursor:input.trim()&&vaultState==='idle'?'pointer':'not-allowed',transition:'all 0.15s'}}>
                  HACK
                </button>
              </div>
              <div style={{marginTop:'8px',fontFamily:'var(--font-mono)',fontSize:'11px',color:'#2a2a2a'}}>
                ENTER or click HACK to submit &nbsp;·&nbsp; Extra spaces are ignored
              </div>
            </div>
          )}

          {/* How-to */}
          <div style={{marginTop:'28px',padding:'16px 20px',borderLeft:'3px solid #FF2D00',background:'#0c0505'}}>
            <div className="label-tech" style={{color:'#FF2D00',marginBottom:'10px'}}>/ HOW PYTHON DICT ACCESS WORKS</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {[
                [`vault['key']`,'Access a top-level value'],
                [`vault['a']['b']`,'Access nested dict (2 deep)'],
                [`vault['a']['b']['c']`,'Access nested dict (3 deep)'],
                [`type(vault['k'])`,'Check what type the value is'],
              ].map(([code,desc])=>(
                <div key={code} style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
                  <code style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'#FF2D00',flexShrink:0}}>{code}</code>
                  <span className="label-tech" style={{color:'#333'}}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
