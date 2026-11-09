/* ===== v102: synthesized sound (Web Audio, no files) ===== */
const SFX=(()=>{let ctx=null,master=null,noiseBuf=null;
 let muted=false;try{muted=localStorage.getItem('myth_mute')==='1'}catch(e){}
 const ok=()=>typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext);
 function init(){if(ctx||!ok())return ctx;try{ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=muted?0:.55;
  const comp=ctx.createDynamicsCompressor();master.connect(comp);comp.connect(ctx.destination);
  noiseBuf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){ctx=null}return ctx}
 const live=()=>ctx&&!muted&&ctx.state==='running';
 function env(g,t,a,peak,dec){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec)}
 function tone(f,{type='sine',t=0,a=.005,dec=.3,vol=.3,f2=null,dest=master}={}){const n=ctx.currentTime+t,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+a+dec);env(g,n,a,vol,dec);o.connect(g);g.connect(dest);o.start(n);o.stop(n+a+dec+.05)}
 function noise({t=0,a=.005,dec=.2,vol=.3,type='lowpass',f=800,f2=null,q=1}={}){const n=ctx.currentTime+t,s=ctx.createBufferSource(),fl=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noiseBuf;fl.type=type;fl.frequency.setValueAtTime(f,n);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,n+a+dec);fl.Q.value=q;env(g,n,a,vol,dec);s.connect(fl);fl.connect(g);g.connect(master);s.start(n,Math.random());s.stop(n+a+dec+.05)}
 const P={
  thud(){noise({f:260,dec:.18,vol:.5});tone(90,{f2:45,dec:.22,vol:.45})},
  slide(){noise({type:'bandpass',f:1800,f2:600,dec:.22,vol:.18,q:.8})},
  click(){tone(1400,{type:'triangle',dec:.04,vol:.06})},
  coin(i=0){const t=i*.07;tone(2093,{t,dec:.25,vol:.12});tone(3136,{t:t+.01,dec:.18,vol:.07});tone(4186,{t:t+.015,dec:.12,vol:.04})},
  smoke(){noise({type:'bandpass',f:500,f2:1400,a:.08,dec:.7,vol:.12,q:.5})},
  swing(){noise({type:'bandpass',f:600,f2:2400,a:.02,dec:.16,vol:.16,q:1.2})},
  hit(){noise({f:1400,f2:200,dec:.25,vol:.55});tone(120,{type:'triangle',f2:50,dec:.25,vol:.4})},
  hurt(){tone(160,{type:'sawtooth',f2:70,dec:.35,vol:.18});noise({f:500,dec:.3,vol:.25})},
  chime(){[523.3,659.3,784,1046.5].forEach((f,i)=>tone(f,{t:i*.06,dec:.9,vol:.09,type:'sine'}));noise({type:'highpass',f:5000,a:.05,dec:.6,vol:.05})},
  crack(){noise({type:'highpass',f:2500,dec:.08,vol:.5});noise({t:.03,f:900,f2:200,dec:.35,vol:.4});tone(70,{t:.02,f2:40,dec:.3,vol:.3})},
  gong(){[110,165.2,220.7,296,370].forEach((f,i)=>tone(f,{a:.01,dec:3.2-i*.4,vol:.22/(i+1),type:'sine'}));noise({f:300,dec:1.2,vol:.15})},
  stamp(){noise({f:180,dec:.3,vol:.7});tone(60,{f2:30,dec:.4,vol:.6})},
  fanfare(){[[392,0],[523.3,.16],[659.3,.32],[784,.48],[1046.5,.7]].forEach(([f,t])=>{tone(f,{t,dec:t>.6?1.4:.35,vol:.14,type:'triangle'});tone(f*2,{t,dec:t>.6?1:.25,vol:.04})})},
  win(){[[523.3,0],[659.3,.12],[784,.24]].forEach(([f,t])=>tone(f,{t,dec:.5,vol:.12,type:'triangle'}))},
  dirge(){[[220,0],[207.7,.6],[164.8,1.2]].forEach(([f,t])=>{tone(f,{t,a:.15,dec:1.6,vol:.16,type:'sine'});tone(f/2,{t,a:.2,dec:1.8,vol:.12,type:'triangle'})})},
 };
 function play(n,...a){try{if(!live())return;P[n]&&P[n](...a)}catch(e){}}
 function setMuted(m){muted=m;try{localStorage.setItem('myth_mute',m?'1':'0')}catch(e){}if(master)master.gain.value=m?0:.55;btn()}
 function btn(){if(typeof document==='undefined'||!document.body)return;let b=document.getElementById('sndb');
  if(!b){b=document.createElement('button');b.id='sndb';b.setAttribute('aria-label','Sound');b.onclick=e=>{e.stopPropagation();init();if(ctx&&ctx.state!=='running')ctx.resume();setMuted(!muted);if(!muted)play('click')};document.body.appendChild(b)}
  b.innerHTML=muted?'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>':'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  b.title=muted?'Sound off':'Sound on'}
 if(typeof document!=='undefined'&&document.addEventListener){
  const unlock=()=>{init();if(ctx&&ctx.state!=='running')ctx.resume()};
  ['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,unlock,{capture:true,passive:true}));
  document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('.b,.wn.go,.wn.walk,.htile');if(t)play('click')},true)}
 return{play,btn,setMuted,get muted(){return muted}}})();
