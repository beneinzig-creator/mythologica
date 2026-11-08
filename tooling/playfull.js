const {chromium}=require('playwright');
const file=process.argv[2],w=+process.argv[3]||844,h=+process.argv[4]||390,ch=process.argv[5]||'ody',maxMs=(+process.argv[6]||240)*1000;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+file);await p.waitForTimeout(400);
const tap=async(sel,i=0)=>{const l=p.locator(sel);if(!await l.count()||i>=await l.count())return false;const bb=await l.nth(i).boundingBox();if(!bb)return false;await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(260);return true};
const two=async(sel,i=0)=>{await tap(sel,i);return tap(sel,i)};
const phase=()=>p.evaluate('G.phase');
let G_a2done=0;const seen={};const t0=Date.now();let last='',lastT=Date.now(),shots=0;
const shot=async n=>{if(shots<40){shots++;await p.screenshot({path:`play/full_${w}x${h}_${ch}_${n}.png`})}};
await tap(`[data-b="pick:${ch}"]`);await p.waitForTimeout(500);
while(Date.now()-t0<maxMs){
  const ph=await phase(),fi=await p.evaluate('G.fi'),key=ph+fi;seen[ph]=(seen[ph]||0)+1;
  if(key!==last){last=key;lastT=Date.now();await shot(ph+fi+'_'+seen[ph])}
  if(Date.now()-lastT>70000){console.log('STUCK in',ph,'fi',fi);await shot('stuck_'+ph);break}
  if(ph=='victory'&&!G_a2done){const c=await p.locator('button:has-text("Continue to Act II")').count();if(c){await tap('button:has-text("Continue to Act II")');G_a2done=1;await p.waitForTimeout(1500);await shot('act2start');continue}}
  if(ph=='victory'||ph=='lost'){console.log('END',ph,'fi',fi);await shot('end');break}
  if(ph=='draft'){const rw=await p.evaluate('G.dr.mode=="reward"');const left=await p.evaluate('G.dr.n<G.dr.rounds&&G.dr.off.length>0&&!G.dr.busy');
     if(left){if(rw&&Math.random()<.3&&await p.locator('[data-b="dpass"]').count())await tap('[data-b="dpass"]');else await two('.dw .cd',Math.floor(Math.random()*3))}await p.waitForTimeout(1200);continue}
  if(ph=='map'){if(fi>=4){const hop=await p.evaluate(`(()=>{const N=G.web.nodes,s=N.findIndex(n=>n.t=='start'),prev={},q=[G.pos];prev[G.pos]=-1;while(q.length){const x=q.shift();if(x==s)break;for(const y of N[x].adj)if(!(y in prev)){prev[y]=x;q.push(y)}}if(G.pos==s)return s;let c=s;while(prev[c]!=G.pos&&prev[c]!==-1&&prev[c]!==undefined)c=prev[c];return c})()`);await two(`[data-b="go${hop}"]`,0);await p.waitForTimeout(900);continue}const g=await p.locator('.wn.go').count();if(!g){console.log('no go nodes');break}
     const pick=Math.random()<.5&&await p.locator('.wn.go:not(.loc)').count()?'.wn.go:not(.loc)':'.wn.go';await two(pick,0);await p.waitForTimeout(800);continue}
  if(ph=='loc'){const used=await p.locator('[data-b="hdraft"]:not([disabled]),[data-b="hheal"]:not([disabled]),[data-b="hdup"]:not([disabled])').count();
     if(used&&Math.random()<.6)await tap('[data-b="hheal"]:not([disabled]),[data-b="hdraft"]:not([disabled])',0);else await tap('[data-b="hdone"]');await p.waitForTimeout(800);continue}
  if(ph=='nextf'){await tap('[data-b="fight"]');await p.waitForTimeout(800);continue}
  if(ph=='otg'){await tap('[data-b="otgy"]');await p.waitForTimeout(800);continue}
  if(ph=='bossp'){await tap('[data-b^="bpick"]',0);await p.waitForTimeout(1200);continue}
  if(ph=='hub'){const act=await p.evaluate('G.act');if(act>0&&await p.locator('[data-b="hdraft"]').count())await tap('[data-b="hdraft"]');else await tap('[data-b="hdone"]');await p.waitForTimeout(900);continue}
  if(ph=='remove'){if(await p.locator('.cfm').count()){await tap('[data-b="rmyes"]');}else if(await p.locator('.rmw').count()){await two('.rmw .cd',1);if(!(await p.locator('.cfm').count()))await tap('.rmw .cd',2)}else await tap('[data-b="hubback"]');await p.waitForTimeout(800);continue}
  if(ph=='kleos'){const o=await p.locator('.ko .b').count();if(o)await tap('.ko .b',0);else await tap('[data-b="next"]');await p.waitForTimeout(500);continue}
  if(ph=='blockP'||ph=='dmgP'){await tap('[data-b="res"]');await p.waitForTimeout(700);continue}
  if(ph=='main'){
    await p.waitForTimeout(400);
    for(let k=0;k<6;k++){const n=await p.locator('.hand .cd:not(.dim)').count();if(!n)break;const i=k%n;
      if(!await two('.hand .cd:not(.dim)',i))break;await p.waitForTimeout(400);
      for(let t=0;t<3;t++){const hasT=await p.locator('.cd.tgt').count(),face=await p.locator('[data-z="ef"][style*="outline"]').count();if(!hasT&&!face)break;if(hasT)await tap('.cd.tgt',0);else await tap('[data-z="ef"]');await p.waitForTimeout(400)}
      if(await p.locator('[data-b="cancel"]').count())await tap('[data-b="cancel"]');
      if(await p.locator('[data-b="ok"]').count())await tap('[data-b="ok"]');
    }
    if(process.argv[7]=='cheat'){await p.evaluate('G.e.life=0;chk();render()');await p.waitForTimeout(700);continue}
    if(await p.locator('[data-b="atkall"]').count()){await tap('[data-b="atkall"]');await p.waitForTimeout(1500)}
    await tap('[data-b="end"]');await p.waitForTimeout(800);continue}
  if(ph=='enemy'){if(await p.locator('[data-b="ok"]').count())await tap('[data-b="ok"]');await p.waitForTimeout(700);continue}
  await p.waitForTimeout(500)}
console.log(w+'x'+h,ch,'phases',JSON.stringify(seen),'errors',errs.slice(0,3),'fi',await p.evaluate('G.fi'));
await b.close()})()
