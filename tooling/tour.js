const {chromium}=require('playwright');
const file=process.argv[2]||require('path').join(__dirname,'m_test.html');
const sizes=(process.argv[3]||'667x375,740x360,844x390,915x412,932x430').split(',').map(s=>s.split('x').map(Number));
const only=process.argv[4]?process.argv[4].split(','):null;
const AUD=()=>{const W=innerWidth,H=innerHeight,out=[];
 const vis=e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&cs.opacity!=='0'};
 if(document.documentElement.scrollWidth>W+1)out.push('hscroll '+document.documentElement.scrollWidth);
 if(document.documentElement.scrollHeight>H+1)out.push('vscroll '+document.documentElement.scrollHeight);
 const seen=new Set();
 document.querySelectorAll('body *').forEach(e=>{if(!vis(e))return;if(e.closest('.dummy'))return;const r=e.getBoundingClientRect();
  const nm=(e.id?'#'+e.id:'')+(e.className&&typeof e.className=='string'?'.'+e.className.split(' ').join('.'):'')||e.tagName;
  if((r.right>W+2||r.bottom>H+2||r.left<-2||r.top<-2)&&!e.closest('#loupe')&&getComputedStyle(e).position!=='fixed'||(e.closest('#loupe')&&(r.right>W+1||r.bottom>H+1))){
    const k='oob '+nm;if(!seen.has(k)&&out.length<12){seen.add(k);out.push(k+' ['+[r.left,r.top,r.right,r.bottom].map(Math.round)+']')}}
  const t=[...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim().length>1);
  if(t){const sc=(e.offsetWidth?r.width/e.offsetWidth:1);const fs=parseFloat(getComputedStyle(e).fontSize)*(sc>0.2&&sc<5?sc:1);if(fs<8.5){const k='tiny '+nm;if(!seen.has(k)&&out.length<12){seen.add(k);out.push(k+' '+fs.toFixed(1)+'px "'+e.textContent.trim().slice(0,20)+'"')}}}
  if(e.tagName=='BUTTON'||e.classList.contains('b')){if(r.height<26||r.width<26){const k='small '+nm;if(!seen.has(k)&&out.length<12){seen.add(k);out.push(k+' '+Math.round(r.width)+'x'+Math.round(r.height)+' "'+e.textContent.trim().slice(0,15)+'"')}}}
 });return out};
const SC={
 title:`localStorage.clear&&0;showChars()`,
 char:`showChars();G.lib=0`,
 draft:`setChar(CH);newRun()`,
 map:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.phase='map';render()`,
 hub:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.act=3;G.used={};G.phase='hub';render()`,
 remove:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.phase='remove';render()`,
 nextf:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.phase='nextf';render()`,
 otg:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.phase='otg';render()`,
 bossp:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.bs=CHARS[G.ch].bo.slice(0,2);G.phase='bossp';render()`,
 fight:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';G.p.mana=5;G.turn=4;G.e.bf=[];G.e.hand=[];const mkc=(s,id)=>{const c=mk(id);enter(s,c);c.sick=0};const pool=CHARS[G.ch].pool;pool.filter(k=>D[k][2]=='C').slice(0,5).forEach(i=>mkc(G.p,i));EN[0].d.filter(k=>D[k][2]=='C').slice(0,5).forEach(i=>mkc(G.e,i));G.p.hand=[];pool.filter(k=>D[k][2]!='C').slice(0,8).forEach(i=>G.p.hand.push(mk(i)));render()`,
 rmcfm:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.phase='remove';G.rm=2;G.rmMode='rem';render()`,
 upcfm:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.phase='remove';G.rm=2;G.rmMode='upg';render()`,
 lib:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';G.lib=1;render()`,
 gy:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';G.p.gy=G.p.deck.splice(0,9);G.gv='p';render()`,
 loc:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.web.nodes.forEach((n,i)=>{if(n.t=='altar'&&G.pos!=i){G.pos=i}});G.phase='loc';render()`,
 kleos:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';G.turn=4;G.e.bf=[];G.p.recs.filter(r=>D[r.id][2]=='C').slice(0,3).forEach(r=>{const c=mk(r.id,r);enter(G.p,c);c.sick=0});G.e.life=0;chk();render()`,
 victory:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.boss=1;G.phase='main';G.turn=4;G.e.life=0;chk()`,
 menu:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';render();document.getElementById('mnub').click()`,
 qs:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.p.mana=5;G.turn=4;const mkc=(s,id)=>{const c=mk(id);enter(s,c);c.sick=0};const pool=CHARS[G.ch].pool;pool.filter(k=>D[k][2]=='C').slice(0,3).forEach(i=>mkc(G.p,i));EN[0].d.filter(k=>D[k][2]=='C').slice(0,3).forEach(i=>mkc(G.e,i));G.p.hand=[];[...pool.filter(k=>D[k][2]=='I'),...pool.filter(k=>D[k][2]!='C')].slice(0,6).forEach(i=>G.p.hand.push(mk(i)));G.phase='enemy';render();setTimeout(()=>{document.querySelector('[data-b="qs"]')&&document.querySelector('[data-b="qs"]').click()},2400)`,
 lost:`setChar(CH);newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.p.life=0;G.phase='lost';render()`,
};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [w,h] of sizes){const p=await b.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true,deviceScaleFactor:1});p.on('pageerror',e=>console.log('ERR',e.message));
 for(const ch of ['ody','odin','wukong']){for(const [k,code] of Object.entries(SC)){if(only&&!only.includes(k))continue;if((k=='title'||k=='char')&&ch!='ody')continue;
  await p.goto('file://'+file);await p.waitForTimeout(250);
  try{await p.evaluate(code.replace(/\bCH\b/g,"'"+ch+"'"))}catch(e){console.log(w+'x'+h,ch,k,'EVALERR',e.message.slice(0,100));continue}
  await p.waitForTimeout(900);const a=await p.evaluate(AUD);
  await p.screenshot({path:`tour/${w}x${h}_${ch}_${k}.png`});
  console.log(w+'x'+h,ch,k,a.length?a.join(' ; '):'clean')}}
 await p.close()}
await b.close()})()
