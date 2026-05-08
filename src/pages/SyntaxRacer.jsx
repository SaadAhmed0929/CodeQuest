import React,{useState,useEffect,useRef,useCallback}from'react';
import{Link,useNavigate}from'react-router-dom';
import Navbar from'../components/Navbar';

const STYLE=`
@keyframes sr-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes sr-pop{0%{transform:scale(0.92);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes sr-rocket{0%{transform:translateY(0px)}50%{transform:translateY(-3px)}100%{transform:translateY(0px)}}
.sr-cursor{animation:sr-blink 1s step-end infinite;}
.sr-pop{animation:sr-pop 0.25s ease forwards;}
.sr-rocket{animation:sr-rocket 0.6s ease-in-out infinite;}
`;

const SNIPPETS=[
  {
    id:1,label:'LEVEL 1 — Print',difficulty:'EASY',diffColor:'#FF2D00',
    code:`print("Hello, World!")`,
    concept:'Output',
  },
  {
    id:2,label:'LEVEL 2 — Variables',difficulty:'EASY',diffColor:'#FF2D00',
    code:`name = "Python"\nversion = 3.11\nprint(name, version)`,
    concept:'Variables',
  },
  {
    id:3,label:'LEVEL 3 — Function',difficulty:'MEDIUM',diffColor:'#FF2D00',
    code:`def greet(name):\n    return f"Hello, {name}!"`,
    concept:'Functions',
  },
  {
    id:4,label:'LEVEL 4 — For Loop',difficulty:'MEDIUM',diffColor:'#FF2D00',
    code:`for i in range(5):\n    print(i * i)`,
    concept:'Loops',
  },
  {
    id:5,label:'LEVEL 5 — List Comp',difficulty:'HARD',diffColor:'#FF2D00',
    code:`squares = [x**2 for x in range(10)]\nprint(squares)`,
    concept:'Comprehensions',
  },
];

function calcWPM(chars,seconds){return seconds>0?Math.round((chars/5)/(seconds/60)):0;}
function calcAcc(correct,total){return total>0?Math.round((correct/total)*100):100;}

export default function SyntaxRacer(){
  const[si,setSi]=useState(0);
  const[typed,setTyped]=useState('');   // what user has typed so far
  const[errors,setErrors]=useState(0);  // total error keystrokes
  const[phase,setPhase]=useState('waiting'); // waiting|racing|done
  const[elapsed,setElapsed]=useState(0);
  const[wpm,setWpm]=useState(0);
  const[acc,setAcc]=useState(100);
  const[bestWpm,setBestWpm]=useState({});
  const inputRef=useRef(null);
  const timerRef=useRef(null);
  const startRef=useRef(0);
  const errRef=useRef(0);

  const snippet=SNIPPETS[si];
  const target=snippet.code;
  const progress=typed.length/target.length;

  /* ── focus hidden input on mount/level change ── */
  useEffect(()=>{
    inputRef.current?.focus();
    setTyped('');setErrors(0);errRef.current=0;
    setPhase('waiting');setElapsed(0);setWpm(0);setAcc(100);
    clearInterval(timerRef.current);
  },[si]);

  /* ── timer ── */
  useEffect(()=>{
    if(phase==='racing'){
      startRef.current=Date.now()-elapsed*1000;
      timerRef.current=setInterval(()=>setElapsed(Math.floor((Date.now()-startRef.current)/1000)),200);
    }
    return()=>clearInterval(timerRef.current);
  },[phase]);

  /* ── keydown handler ── */
  const handleKey=useCallback((e)=>{
    if(phase==='done')return;
    if(e.key==='Tab'){e.preventDefault();return;}

    if(phase==='waiting'&&e.key.length===1){
      setPhase('racing');
      startRef.current=Date.now();
    }

    const cur=typed.length;
    if(e.key==='Backspace'){
      setTyped(t=>t.slice(0,-1));
      return;
    }
    if(e.key.length!==1)return;

    const expected=target[cur];
    if(e.key===expected){
      const newTyped=typed+e.key;
      setTyped(newTyped);
      if(newTyped.length===target.length){
        // done
        clearInterval(timerRef.current);
        const secs=Math.max(1,(Date.now()-startRef.current)/1000);
        const w=calcWPM(target.length,secs);
        const a=calcAcc(target.length,target.length+errRef.current);
        setWpm(w);setAcc(a);setPhase('done');
        setBestWpm(b=>({...b,[si]:Math.max(b[si]||0,w)}));
        setElapsed(Math.round(secs));
      }
    } else {
      errRef.current++;
      setErrors(v=>v+1);
    }
  },[typed,target,phase]);

  useEffect(()=>{
    const el=inputRef.current;
    if(!el)return;
    el.addEventListener('keydown',handleKey);
    return()=>el.removeEventListener('keydown',handleKey);
  },[handleKey]);

  /* ── render characters ── */
  function renderCode(){
    const lines=target.split('\n');
    let charIdx=0;
    return lines.map((line,li)=>(
      <div key={li} style={{display:'flex',flexWrap:'nowrap',whiteSpace:'pre',minHeight:'36px',alignItems:'center'}}>
        <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'#222',userSelect:'none',minWidth:'24px',textAlign:'right',marginRight:'12px',paddingRight:'8px',borderRight:'1px solid #1a1a1a'}}>{li+1}</span>
        {line.split('').map((ch,ci)=>{
          const idx=charIdx++;
          const isTyped=idx<typed.length;
          const isCurrent=idx===typed.length;
          const isWrong=isCurrent&&phase==='racing'&&false; // we halt not colorize
          const correctChar=isTyped?typed[idx]===ch:null;
          return(
            <span key={ci} style={{
              fontFamily:'var(--font-mono)',fontSize:'17px',letterSpacing:'0.05em',
              color:isTyped?(correctChar?'#E8DDD0':'#FF2D00'):'#2a2a2a',
              background:isCurrent?'#1a1a1a':'transparent',
              borderBottom:isCurrent?'2px solid #FF2D00':'2px solid transparent',
              transition:'color 0.08s',position:'relative',
            }}>
              {ch===' '?'\u00a0':ch}
              {isCurrent&&<span className="sr-cursor" style={{position:'absolute',right:0,bottom:0,width:'2px',height:'100%',background:'#FF2D00'}}/>}
            </span>
          );
        })}
        {/* newline marker as cursor if at end of line */}
        {(()=>{
          const nlIdx=charIdx; // the \n character position
          if(nlIdx===typed.length&&li<lines.length-1&&phase==='racing'){
            charIdx++; // account for \n in target
            return<span style={{fontFamily:'var(--font-mono)',fontSize:'17px',color:'#1e1e1e',borderBottom:'2px solid #FF2D00',background:'#1a1a1a'}}>↵<span className="sr-cursor" style={{position:'absolute',right:0,bottom:0,width:'2px',height:'100%',background:'#FF2D00'}}/></span>;
          } else if(li<lines.length-1){charIdx++;return null;}
          return null;
        })()}
      </div>
    ));
  }

  const pct=Math.min(100,Math.round(progress*100));

  return(
    <>
      <style>{STYLE}</style>
      <div style={{background:'#080808',minHeight:'100vh',display:'flex',flexDirection:'column',color:'#E8DDD0'}}>
        <Navbar/>
        {/* header */}
        <div style={{borderBottom:'1px solid #1a1a1a',padding:'10px 0',background:'#050505'}}>
          <div style={{maxWidth:'860px',margin:'0 auto',padding:'0 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
              <span className="label-tech" style={{color:'#FF2D00'}}>/ SYNTAX RACER</span>
              <span style={{width:'1px',height:'12px',background:'#1e1e1e'}}/>
              <span style={{fontFamily:'var(--font-display)',fontSize:'14px',fontWeight:900,color:'#22c55e',textTransform:'uppercase'}}>{snippet.label}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <button onClick={()=>navigate(-1)} style={{background:'none',border:'1px solid #1e1e1e',color:'#444',fontFamily:'var(--font-mono)',fontSize:'10px',padding:'4px 12px',cursor:'pointer',letterSpacing:'0.1em'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='#333';e.currentTarget.style.color='#888';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1e1e';e.currentTarget.style.color='#444';}}>← BACK</button>
            <Link to="/mini-games" className="label-tech" style={{color:'#333',textDecoration:'none'}}>GAMES HUB</Link>
          </div>
          </div>
        </div>

        <div style={{flex:1,maxWidth:'860px',margin:'0 auto',width:'100%',padding:'28px 40px'}}>

          {/* Level selector */}
          <div style={{display:'flex',gap:'2px',marginBottom:'20px'}}>
            {SNIPPETS.map((s,i)=>(
              <button key={i} onClick={()=>setSi(i)}
                style={{flex:1,padding:'6px 4px',background:si===i?'#FF2D00':'transparent',border:`1px solid ${si===i?'#FF2D00':bestWpm[i]?'#E8DDD0':'#1e1e1e'}`,color:si===i?'#080808':bestWpm[i]?'#E8DDD0':'#444',fontFamily:'var(--font-mono)',fontSize:'10px',cursor:'pointer',letterSpacing:'0.08em',textTransform:'uppercase',lineHeight:1.6}}>
                {bestWpm[i]?`✓ ${bestWpm[i]}w`:`LV${i+1}`}
              </button>
            ))}
          </div>

          {/* Stats bar */}
          <div style={{display:'flex',gap:'2px',marginBottom:'20px'}}>
            {[
              [phase==='done'?wpm:calcWPM(typed.length,elapsed),'WPM','#E8DDD0'],
              [String(elapsed).padStart(2,'0')+'s','TIME','#E8DDD0'],
              [acc+'%','ACC','#E8DDD0'],
              [errors,'ERRORS','#FF2D00'],
            ].map(([v,l,c])=>(
              <div key={l} style={{flex:1,padding:'12px',background:'#0a0a0a',border:'1px solid #1a1a1a',textAlign:'center'}}>
                <div style={{fontFamily:'var(--font-display)',fontSize:'26px',fontWeight:900,color:c,lineHeight:1}}>{v}</div>
                <div className="label-tech" style={{color:'#333',marginTop:'4px'}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Track / progress bar */}
          <div style={{marginBottom:'20px',padding:'12px 16px',background:'#0a0a0a',border:'1px solid #1a1a1a'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
              <span className="label-tech" style={{color:'#333'}}>TRACK PROGRESS</span>
              <span className="label-tech" style={{color:'#FF2D00'}}>{pct}%</span>
            </div>
            <div style={{position:'relative',height:'28px',background:'#060606',border:'1px solid #111',overflow:'visible'}}>
              {/* filled */}
              <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,rgba(255,45,0,0.1),rgba(255,45,0,0.3))',borderRight:pct>0?'1px solid rgba(255,45,0,0.4)':'none',transition:'width 0.1s'}}/>
              {/* checkered finish */}
              <div style={{position:'absolute',right:0,top:0,bottom:0,width:'16px',background:'repeating-conic-gradient(#1a1a1a 0% 25%, #333 0% 50%) 0 0/8px 8px'}}/>
              {/* rocket */}
              <div className={phase==='racing'?'sr-rocket':''} style={{position:'absolute',top:'50%',left:`calc(${pct}% - 14px)`,transform:'translateY(-50%)',fontSize:'20px',transition:'left 0.15s ease',filter:phase==='done'?'drop-shadow(0 0 6px #FF2D00)':'none',zIndex:2}}>🚀</div>
              {/* flag */}
              <div style={{position:'absolute',right:'18px',top:'50%',transform:'translateY(-50%)',fontSize:'14px',zIndex:2}}>🏁</div>
            </div>
          </div>

          {/* Code area */}
          <div style={{position:'relative',border:`2px solid ${phase==='done'?'#E8DDD0':'#1a1a1a'}`,background:'#060606',marginBottom:'20px',boxShadow:phase==='done'?'0 0 20px rgba(232,221,208,0.15)':'none',transition:'all 0.3s'}}
            onClick={()=>inputRef.current?.focus()}>
            {/* terminal header */}
            <div style={{padding:'8px 16px',borderBottom:'1px solid #111',display:'flex',gap:'8px',alignItems:'center'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#FF2D00'}}/>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#FF2D00'}}/>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#E8DDD0'}}/>
              <span className="label-tech" style={{color:'#222',marginLeft:'8px'}}>snippet.py</span>
              <span className="label-tech" style={{color:snippet.diffColor,marginLeft:'auto'}}>{snippet.difficulty} — {snippet.concept}</span>
            </div>
            {/* code lines */}
            <div style={{padding:'20px 20px 20px 0',cursor:'text',minHeight:'80px'}}>
              {renderCode()}
            </div>
            {/* hidden input */}
            <input ref={inputRef} style={{position:'absolute',opacity:0,width:'1px',height:'1px',top:0,left:0}} readOnly autoFocus/>
            {/* waiting hint */}
            {phase==='waiting'&&(
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                <div className="sr-cursor" style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'#333',letterSpacing:'0.15em'}}>CLICK HERE AND START TYPING...</div>
              </div>
            )}
          </div>

          {/* Done overlay */}
          {phase==='done'&&(
            <div className="sr-pop" style={{border:'2px solid #E8DDD0',background:'#0a0a0a',padding:'28px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'24px',flexWrap:'wrap',marginBottom:'20px'}}>
              <div>
                <div style={{fontFamily:'var(--font-display)',fontSize:'22px',fontWeight:900,color:'#E8DDD0',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'6px'}}>🏁 RACE COMPLETE!</div>
                <div style={{display:'flex',gap:'24px',marginTop:'8px'}}>
                  {[[wpm,'WPM','#E8DDD0'],[acc+'%','ACCURACY','#E8DDD0'],[elapsed+'s','TIME','#E8DDD0'],[errors,'ERRORS','#FF2D00']].map(([v,l,c])=>(
                    <div key={l}>
                      <div style={{fontFamily:'var(--font-display)',fontSize:'24px',fontWeight:900,color:c}}>{v}</div>
                      <div className="label-tech" style={{color:'#333'}}>{l}</div>
                    </div>
                  ))}
                </div>
                {bestWpm[si]&&wpm===bestWpm[si]&&<div className="label-tech" style={{color:'#FF2D00',marginTop:'8px'}}>⭐ NEW PERSONAL BEST!</div>}
              </div>
              <div style={{display:'flex',gap:'8px',flexShrink:0}}>
                <button onClick={()=>setSi(si)} style={{padding:'10px 20px',background:'transparent',border:'1px solid #E8DDD0',color:'#E8DDD0',fontFamily:'var(--font-display)',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}}>
                  RETRY
                </button>
                {si<SNIPPETS.length-1&&(
                  <button onClick={()=>setSi(si+1)} style={{padding:'10px 20px',background:'#FF2D00',border:'none',color:'#080808',fontFamily:'var(--font-display)',fontSize:'11px',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}}>
                    NEXT TRACK →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tips */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {[
              ['⚪ Correct','Characters turn white as you type them correctly'],
              ['🔴 Error','Wrong key? You must backspace before continuing'],
              ['⏱️ WPM','Words Per Minute: chars typed ÷ 5 ÷ minutes'],
              ['📊 Accuracy','Correct keystrokes ÷ total keystrokes × 100'],
            ].map(([t,d])=>(
              <div key={t} style={{padding:'10px 14px',background:'#0a0a0a',border:'1px solid #111'}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'#E8DDD0',marginBottom:'4px'}}>{t}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'#444',lineHeight:1.6}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
