import React,{useState,useEffect,useRef,useCallback}from'react';
import{Link,useNavigate}from'react-router-dom';
import Navbar from'../components/Navbar';

const CELL=48,COLS=10,ROWS=10,CW=COLS*CELL,CH=ROWS*CELL;
const W2=(x,y,walls)=>x<0||x>=COLS||y<0||y>=ROWS||walls.has(`${x},${y}`);

const LV=[
{id:1,name:'FIRST CONTACT',concept:'Coordinates & Position',color:'#FF2D00',
 task:'Reach the 🏆 goal. Walls block your path — find the route.',
 tip:'WASD or arrow keys to move',shoot:false,goal:true,gx:9,gy:9,sx:0,sy:0,
 en:[],walls:[[2,0],[2,1],[2,2],[2,3],[5,3],[5,4],[5,5],[5,6],[0,5],[1,5],[2,5],[3,5],[7,6],[7,7],[7,8]],
 code:`player_x, player_y = 0, 0\n\n# On key press:\nplayer_x += 1  # move right\nplayer_y += 1  # move down\n\n# Every frame check:\nif player_x == goal_x and \\\n   player_y == goal_y:\n    win()`},
{id:2,name:'COLLISION THEORY',concept:'If Statements & Collision',color:'#FF2D00',
 task:'Shoot all 🟦 enemies! Press SPACE to fire.',
 tip:'Bullets travel in the direction you last moved',shoot:true,goal:false,sx:0,sy:4,
 en:[{x:5,y:1,t:'s',hp:1},{x:8,y:3,t:'s',hp:1},{x:3,y:7,t:'s',hp:1},{x:7,y:8,t:'s',hp:1}],
 walls:[[3,3],[3,4],[6,6],[6,7]],
 code:`def check_hit(bullet, enemy):\n  if bullet.x == enemy.x and \\\n     bullet.y == enemy.y:\n    enemy.hp -= 1\n    bullet.destroy()\n    if enemy.hp <= 0:\n      enemy.destroy()\n\nfor b in bullets:\n  for e in enemies:\n    check_hit(b, e)`},
{id:3,name:'THE PATROL',concept:'Loops & Moving Objects',color:'#FF2D00',
 task:'Enemies patrol back and forth. Time your shots!',
 tip:'Touching an enemy = instant death',shoot:true,goal:false,sx:0,sy:0,
 en:[{x:3,y:2,t:'ph',mx:1,Mx:8,hp:1},{x:6,y:7,t:'ph',mx:3,Mx:9,hp:1},{x:8,y:1,t:'pv',my:0,My:5,hp:1},{x:2,y:5,t:'pv',my:3,My:9,hp:1}],
 walls:[[4,4],[5,4],[0,3],[1,3],[2,3]],
 code:`direction = 1  # 1=right, -1=left\n\ndef patrol(enemy, dt):\n  enemy.x += direction * SPEED * dt\n  # Bounce at edges:\n  if enemy.x >= enemy.max_x:\n    direction = -1\n  elif enemy.x <= enemy.min_x:\n    direction = 1\n\nwhile game_running:\n  for e in enemies:\n    patrol(e, delta_time)`},
{id:4,name:'REACH AND CLEAR',concept:'Functions & Conditions',color:'#FF2D00',
 task:'Kill ALL enemies AND reach the 🏆 goal. Enemies shoot back!',
 tip:'Clear enemies before heading to goal',shoot:true,goal:true,gx:9,gy:0,sx:0,sy:9,
 en:[{x:3,y:3,t:'ph',mx:1,Mx:6,hp:2,sh:true},{x:7,y:6,t:'pv',my:3,My:9,hp:2,sh:true},{x:5,y:1,t:'s',hp:1,sh:false}],
 walls:[[2,2],[2,3],[6,5],[6,6],[8,2],[8,3]],
 code:`def check_win(state):\n  enemies_dead = len(state.enemies) == 0\n  at_goal = (\n    player.x == goal.x and\n    player.y == goal.y\n  )\n  return enemies_dead and at_goal\n\n# Enemy shoots toward player:\nif dist(enemy, player) < RANGE:\n  enemy.fire_at(player)`},
{id:5,name:'BOSS FIGHT',concept:'Classes & State Machines',color:'#FF2D00',
 task:'Hit the boss 5 times — it teleports after each hit!',
 tip:'Boss fires in 4 directions every 1.5 seconds',shoot:true,goal:false,sx:0,sy:4,
 en:[{x:5,y:5,t:'boss',hp:5,sh:true,tp:[{x:2,y:2},{x:7,y:2},{x:5,y:5},{x:2,y:7},{x:8,y:7}]}],
 walls:[[4,4],[5,4],[6,4],[4,5],[6,5],[4,6],[5,6],[6,6]],
 code:`class Boss:\n  def __init__(self):\n    self.hp = 5\n    self.positions = [\n      (2,2),(7,2),(5,5),(2,7),(8,7)\n    ]\n    self.index = 0\n\n  def take_hit(self):\n    self.hp -= 1\n    self.index = (self.index+1)%5\n    self.x,self.y = \\\n      self.positions[self.index]\n\n  def is_dead(self):\n    return self.hp <= 0`},
];

function mkE(ds){return(ds||[]).map((d,i)=>({
  id:i,x:d.x,y:d.y,t:d.t||'s',hp:d.hp,mhp:d.hp,
  mx:d.mx??0,Mx:d.Mx??9,my:d.my??0,My:d.My??9,
  dir:1,mt:0,st:Math.random()*3,sh:d.sh??false,
  tp:d.tp??[],tpi:0,flash:0,alive:true,
}));}

export default function PixelPath(){
  const[li,setLi]=useState(0);
  const[phase,setPhase]=useState('playing');
  const[done,setDone]=useState(new Set());
  const[showCode,setShowCode]=useState(true);
  const navigate=useNavigate();
  const cvs=useRef(null);
  const raf=useRef(null);
  const ts=useRef(0);
  const K=useRef({});
  const G=useRef(null);
  const lv=LV[li];

  const init=useCallback((i)=>{
    const l=LV[i];
    G.current={
      p:{x:l.sx,y:l.sy,dx:1,dy:0,mt:0,inv:0,sh:false},
      en:mkE(l.en),bul:[],ebul:[],pts:[],
      walls:new Set((l.walls||[]).map(([x,y])=>`${x},${y}`)),
    };
    setPhase('playing');
  },[]);

  useEffect(()=>{init(li);},[li,init]);

  useEffect(()=>{
    const dn=e=>{
      K.current[e.key]=true;
      if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault();
    };
    const up=e=>{K.current[e.key]=false;};
    window.addEventListener('keydown',dn);
    window.addEventListener('keyup',up);
    return()=>{window.removeEventListener('keydown',dn);window.removeEventListener('keyup',up);};
  },[]);

  useEffect(()=>{
    const h=e=>{
      if(e.key==='Enter'&&phase==='win'&&li<LV.length-1){setDone(d=>new Set([...d,li]));setLi(i=>i+1);}
      if((e.key==='r'||e.key==='R')&&phase==='lose'){init(li);}
    };
    window.addEventListener('keydown',h);
    return()=>window.removeEventListener('keydown',h);
  },[phase,li,init]);

  const draw=useCallback((ctx,g,l,ph)=>{
    ctx.clearRect(0,0,CW,CH);
    for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
      ctx.fillStyle=(r+c)%2===0?'#0a0a0a':'#0d0d0d';
      ctx.fillRect(c*CELL,r*CELL,CELL,CELL);
      ctx.strokeStyle='#111';ctx.lineWidth=0.5;
      ctx.strokeRect(c*CELL,r*CELL,CELL,CELL);
    }
    g.walls.forEach(k=>{
      const[cx,cy]=k.split(',').map(Number);
      ctx.fillStyle='#161616';ctx.fillRect(cx*CELL,cy*CELL,CELL,CELL);
      ctx.fillStyle='#1c1c1c';ctx.fillRect(cx*CELL+4,cy*CELL+4,CELL-8,CELL-8);
      ctx.strokeStyle='#222';ctx.lineWidth=1;ctx.strokeRect(cx*CELL+1,cy*CELL+1,CELL-2,CELL-2);
    });
    if(l.goal){
      const gx=l.gx*CELL,gy=l.gy*CELL;
      ctx.fillStyle='#2a0a0a';ctx.fillRect(gx,gy,CELL,CELL);
      ctx.strokeStyle='#FF2D00';ctx.lineWidth=2;ctx.strokeRect(gx+2,gy+2,CELL-4,CELL-4);
      ctx.font='26px serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('🏆',gx+CELL/2,gy+CELL/2);
    }
    g.pts.forEach(p=>{
      const a=p.l/p.ml;
      ctx.fillStyle=`rgba(255,140,0,${a})`;
      ctx.beginPath();ctx.arc(p.x*CELL,p.y*CELL,5*a,0,Math.PI*2);ctx.fill();
    });
    g.en.forEach(e=>{
      if(!e.alive)return;
      const ex=e.x*CELL,ey=e.y*CELL,boss=e.t==='boss';
      const col=e.flash>0?'#ffffff':boss?'#FF2D00':'#555555';
      const pad=boss?2:6;
      ctx.fillStyle=col+'22';ctx.fillRect(ex+1,ey+1,CELL-2,CELL-2);
      ctx.fillStyle=col;ctx.fillRect(ex+pad,ey+pad,CELL-pad*2,CELL-pad*2);
      ctx.fillStyle='#080808';ctx.fillRect(ex+pad+4,ey+pad+5,4,5);ctx.fillRect(ex+CELL-pad-8,ey+pad+5,4,5);
      if(e.mhp>1){
        ctx.fillStyle='#111';ctx.fillRect(ex+4,ey+2,CELL-8,3);
        ctx.fillStyle=boss?'#FF2D00':'#888888';ctx.fillRect(ex+4,ey+2,(CELL-8)*(e.hp/e.mhp),3);
      }
      if(boss){ctx.fillStyle='#FF2D00';ctx.font='bold 9px monospace';ctx.textAlign='center';ctx.fillText('BOSS',ex+CELL/2,ey+CELL-6);}
    });
    g.bul.forEach(b=>{
      ctx.fillStyle='rgba(255,215,0,0.25)';ctx.beginPath();ctx.arc(b.x*CELL,b.y*CELL,9,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(b.x*CELL,b.y*CELL,5,0,Math.PI*2);ctx.fill();
    });
    g.ebul.forEach(b=>{
      ctx.fillStyle='rgba(255,80,80,0.2)';ctx.beginPath();ctx.arc(b.x*CELL,b.y*CELL,7,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#FF6060';ctx.beginPath();ctx.arc(b.x*CELL,b.y*CELL,4,0,Math.PI*2);ctx.fill();
    });
    const p=g.p;
    const blink=p.inv>0&&Math.floor(p.inv*10)%2===0;
    if(!blink){
      const px=p.x*CELL,py=p.y*CELL;
      ctx.fillStyle='rgba(255,45,0,0.15)';ctx.fillRect(px+1,py+1,CELL-2,CELL-2);
      ctx.fillStyle='#FF2D00';ctx.fillRect(px+7,py+7,CELL-14,CELL-14);
      ctx.fillStyle='#FF5533';ctx.fillRect(px+10,py+10,CELL-20,CELL-20);
      ctx.fillStyle='#080808';ctx.fillRect(px+14,py+15,4,5);ctx.fillRect(px+CELL-18,py+15,4,5);
    }
    if(ph==='win'){
      ctx.fillStyle='rgba(255,45,0,0.18)';ctx.fillRect(0,0,CW,CH);
      ctx.fillStyle='#FF2D00';ctx.font='bold 32px monospace';ctx.textAlign='center';ctx.fillText('LEVEL CLEAR!',CW/2,CH/2-12);
      ctx.font='13px monospace';ctx.fillStyle='#cc2200';ctx.fillText('ENTER = next  |  R = retry',CW/2,CH/2+20);
    }
    if(ph==='lose'){
      ctx.fillStyle='rgba(255,45,0,0.18)';ctx.fillRect(0,0,CW,CH);
      ctx.fillStyle='#FF2D00';ctx.font='bold 32px monospace';ctx.textAlign='center';ctx.fillText('GAME OVER',CW/2,CH/2-12);
      ctx.font='13px monospace';ctx.fillStyle='#cc2200';ctx.fillText('R = retry',CW/2,CH/2+20);
    }
  },[]);

  const tick=useCallback((now)=>{
    const canvas=cvs.current;if(!canvas||!G.current)return;
    const ctx=canvas.getContext('2d');
    const dt=Math.min((now-ts.current)/1000,0.05);ts.current=now;
    const g=G.current,l=LV[li],p=g.p;
    const isW=(x,y)=>W2(x,y,g.walls);

    if(phase!=='playing'){draw(ctx,g,l,phase);raf.current=requestAnimationFrame(tick);return;}

    if(p.inv>0)p.inv=Math.max(0,p.inv-dt);
    p.mt=Math.max(0,p.mt-dt);
    if(p.mt<=0){
      let nx=p.x,ny=p.y,ndx=p.dx,ndy=p.dy,moved=false;
      if(K.current['ArrowRight']||K.current['d']){nx++;ndx=1;ndy=0;moved=true;}
      else if(K.current['ArrowLeft']||K.current['a']){nx--;ndx=-1;ndy=0;moved=true;}
      else if(K.current['ArrowDown']||K.current['s']){ny++;ndx=0;ndy=1;moved=true;}
      else if(K.current['ArrowUp']||K.current['w']){ny--;ndx=0;ndy=-1;moved=true;}
      if(moved){p.dx=ndx;p.dy=ndy;if(!isW(nx,ny)){p.x=nx;p.y=ny;}p.mt=0.12;}
    }
    if((K.current[' ']||K.current['z'])&&l.shoot){
      if(!p.sh){g.bul.push({x:p.x+0.5,y:p.y+0.5,dx:p.dx,dy:p.dy,age:0});p.sh=true;}
    }else{p.sh=false;}

    g.bul=g.bul.filter(b=>{
      b.x+=b.dx*10*dt;b.y+=b.dy*10*dt;b.age+=dt;
      if(b.age>1.8||isW(Math.floor(b.x),Math.floor(b.y)))return false;
      for(const e of g.en){
        if(!e.alive)continue;
        if(Math.floor(b.x)===e.x&&Math.floor(b.y)===e.y){
          e.hp--;e.flash=0.15;
          if(e.t==='boss'){const np=e.tp[e.tpi%e.tp.length];e.tpi++;setTimeout(()=>{e.x=np.x;e.y=np.y;},180);}
          if(e.hp<=0){e.alive=false;for(let i=0;i<8;i++)g.pts.push({x:e.x+0.5,y:e.y+0.5,vx:(Math.random()-0.5)*5,vy:(Math.random()-0.5)*5,l:0.7,ml:0.7});}
          return false;
        }
      }
      return true;
    });

    g.ebul=g.ebul.filter(b=>{
      b.x+=b.dx*7*dt;b.y+=b.dy*7*dt;b.age+=dt;
      if(b.age>2||isW(Math.floor(b.x),Math.floor(b.y)))return false;
      if(p.inv<=0&&Math.floor(b.x)===p.x&&Math.floor(b.y)===p.y){setPhase('lose');return false;}
      return true;
    });

    g.en.forEach(e=>{
      if(!e.alive)return;
      if(e.flash>0)e.flash=Math.max(0,e.flash-dt);
      e.mt+=dt;
      const spd=e.t==='boss'?0.6:1.8;
      if(e.mt>=1/spd){e.mt=0;
        if(e.t==='ph'){e.x+=e.dir;if(e.x>=e.Mx||e.x<=e.mx)e.dir*=-1;}
        if(e.t==='pv'){e.y+=e.dir;if(e.y>=e.My||e.y<=e.my)e.dir*=-1;}
        if(e.t==='boss'){const ddx=p.x>e.x?1:p.x<e.x?-1:0,ddy=p.y>e.y?1:p.y<e.y?-1:0;const nx=e.x+ddx,ny=e.y+ddy;if(!isW(nx,ny)){e.x=nx;e.y=ny;}}
      }
      if(e.sh){e.st-=dt;if(e.st<=0){
        e.st=e.t==='boss'?1.5:3.5;
        const dirs=e.t==='boss'?[[1,0],[-1,0],[0,1],[0,-1]]:[[p.x>=e.x?1:-1,0],[0,p.y>=e.y?1:-1]];
        dirs.forEach(([dx,dy])=>g.ebul.push({x:e.x+0.5,y:e.y+0.5,dx,dy,age:0}));
      }}
      if(p.inv<=0&&e.x===p.x&&e.y===p.y)setPhase('lose');
    });

    g.pts=g.pts.filter(pt=>{pt.l-=dt;pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;return pt.l>0;});

    const alive=g.en.filter(e=>e.alive);
    const allDead=alive.length===0&&g.en.length>0;
    const atGoal=l.goal&&p.x===l.gx&&p.y===l.gy;
    if(l.goal&&g.en.length>0){if(allDead&&atGoal)setPhase('win');}
    else if(l.goal){if(atGoal)setPhase('win');}
    else if(g.en.length>0){if(allDead)setPhase('win');}

    draw(ctx,g,l,phase,p);
    raf.current=requestAnimationFrame(tick);
  },[li,phase,draw]);

  useEffect(()=>{raf.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf.current);},[tick]);

  return(
    <div style={{background:'#080808',minHeight:'100vh',display:'flex',flexDirection:'column',color:'#E8DDD0'}}>
      <Navbar/>
      <div style={{borderBottom:'1px solid #1a1a1a',padding:'10px 0',background:'#050505'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <span className="label-tech" style={{color:'#FF2D00'}}>/ PIXEL PATH</span>
            <span style={{width:'1px',height:'12px',background:'#1e1e1e'}}/>
            <span style={{fontFamily:'var(--font-display)',fontSize:'16px',fontWeight:900,color:lv.color,textTransform:'uppercase'}}>{lv.name}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <button onClick={()=>navigate(-1)} style={{background:'none',border:'1px solid #1e1e1e',color:'#444',fontFamily:'var(--font-mono)',fontSize:'10px',padding:'4px 12px',cursor:'pointer',letterSpacing:'0.1em'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='#333';e.currentTarget.style.color='#888';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1e1e';e.currentTarget.style.color='#444';}}>← BACK</button>
            <Link to="/mini-games" className="label-tech" style={{color:'#333',textDecoration:'none'}}>GAMES HUB</Link>
          </div>
        </div>
      </div>
      <div style={{flex:1,maxWidth:'1100px',margin:'0 auto',width:'100%',padding:'24px 40px',display:'grid',gridTemplateColumns:`${CW}px 1fr`,gap:'32px',alignItems:'start'}}>
        <div>
          <div style={{display:'flex',gap:'2px',marginBottom:'10px',flexWrap:'wrap'}}>
            {LV.map((l,i)=>(
              <button key={i} onClick={()=>setLi(i)}
                style={{padding:'4px 10px',background:li===i?lv.color:'transparent',border:`1px solid ${li===i?lv.color:done.has(i)?'#22c55e':'#1e1e1e'}`,color:li===i?'#080808':done.has(i)?'#22c55e':'#444',fontFamily:'var(--font-mono)',fontSize:'10px',cursor:'pointer',letterSpacing:'0.08em'}}>
                {done.has(i)?'✓ ':''}{l.id}
              </button>
            ))}
            <span className="label-tech" style={{color:'#222',marginLeft:'8px',lineHeight:'26px'}}>{lv.name}</span>
          </div>
          <div style={{border:`2px solid ${phase==='win'?'#FF2D00':phase==='lose'?'#FF2D00':'#1a1a1a'}`,boxShadow:phase==='win'?'0 0 20px rgba(255,45,0,0.2)':phase==='lose'?'0 0 20px rgba(255,45,0,0.2)':'none',transition:'all 0.3s',lineHeight:0}}>
            <canvas ref={cvs} width={CW} height={CH} style={{display:'block'}}/>
          </div>
          <div style={{marginTop:'10px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
            {[['WASD/↑↓←→','Move'],lv.shoot&&['SPACE','Shoot'],phase==='win'&&['ENTER','Next'],phase==='lose'&&['R','Retry']].filter(Boolean).map(([k,v])=>(
              <span key={k} style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'#333'}}>
                <span style={{color:'#FF2D00',border:'1px solid #1e1e1e',padding:'1px 6px',marginRight:'5px'}}>{k}</span>{v}
              </span>
            ))}
            <button onClick={()=>init(li)} style={{marginLeft:'auto',padding:'4px 12px',background:'transparent',border:'1px solid #1e1e1e',color:'#444',fontFamily:'var(--font-mono)',fontSize:'10px',cursor:'pointer'}}>↺ RESTART</button>
            {phase==='win'&&li<LV.length-1&&<button onClick={()=>{setDone(d=>new Set([...d,li]));setLi(i=>i+1);}} style={{padding:'4px 14px',background:'#FF2D00',border:'none',color:'#080808',fontFamily:'var(--font-display)',fontSize:'10px',fontWeight:700,cursor:'pointer',letterSpacing:'0.1em'}}>NEXT →</button>}
          </div>
        </div>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'18px'}}>
            <div style={{width:'4px',height:'36px',background:lv.color}}/>
            <div>
              <div className="label-tech" style={{color:'#333',marginBottom:'3px'}}>PYTHON CONCEPT — LEVEL {lv.id}</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'16px',fontWeight:900,color:lv.color,textTransform:'uppercase'}}>{lv.concept}</div>
            </div>
          </div>
          <div style={{padding:'12px 14px',borderLeft:'3px solid #1a1a1a',background:'#0a0a0a',marginBottom:'16px'}}>
            <p className="label-tech" style={{color:'#FF2D00',marginBottom:'6px'}}>OBJECTIVE</p>
            <p style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'#777',lineHeight:1.7,margin:0}}>{lv.task}</p>
            <p style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'#444',marginTop:'6px',marginBottom:0}}>💡 {lv.tip}</p>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
            <span className="label-tech" style={{color:'#333'}}>/ HOW THIS WORKS IN PYTHON</span>
            <button onClick={()=>setShowCode(s=>!s)} style={{background:'none',border:'1px solid #1e1e1e',color:'#444',fontFamily:'var(--font-mono)',fontSize:'10px',padding:'3px 10px',cursor:'pointer'}}>{showCode?'HIDE':'SHOW'}</button>
          </div>
          {showCode&&(
            <pre style={{background:'#060606',border:'1px solid #111',padding:'16px',fontFamily:'var(--font-mono)',fontSize:'11px',lineHeight:2,overflowX:'auto',margin:0,whiteSpace:'pre-wrap',borderLeft:`3px solid ${lv.color}`}}>
              {lv.code.split('\n').map((line,i)=>{
                const isCmt=line.trim().startsWith('#');
                const isKw=/^(def |class |if |for |while |return |elif |else:)/.test(line.trim());
                return <span key={i} style={{display:'block',color:isCmt?'#2d2d2d':isKw?lv.color:'#666'}}>{line||'\u00a0'}</span>;
              })}
            </pre>
          )}
          <div style={{marginTop:'20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {[['Enemies','Move to their cell = death','#FF2D00'],['Bullets','SPACE fires in move dir','#FFD700'],['Boss','Teleports each hit','#FF2D00'],['Goal','Reach the 🏆','#FF2D00']].map(([t,d,c])=>(
              <div key={t} style={{padding:'10px',background:'#0a0a0a',border:'1px solid #111',borderLeft:`2px solid ${c}`}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:c,marginBottom:'4px',letterSpacing:'0.1em'}}>{t}</div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'#444',lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
