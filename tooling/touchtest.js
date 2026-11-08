const {chromium}=require('playwright');
const file=process.argv[2];let fails=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)fails++};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [w,h] of [[844,390],[667,375],[932,430]]){
const p=await b.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+file);await p.waitForTimeout(300);
await p.evaluate(`setChar('ody');newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';G.p.mana=2;G.turn=4;G.e.bf=[];G.e.hand=[];const mkc=(s,id)=>{const c=mk(id);enter(s,c);c.sick=0};['spear','sailor','phal'].forEach(()=>{});const pool=CHARS[G.ch].pool;pool.filter(k=>D[k][2]=='C').slice(0,3).forEach(i=>mkc(G.p,i));EN[0].d.filter(k=>D[k][2]=='C').slice(0,3).forEach(i=>mkc(G.e,i));G.p.hand=[];pool.filter(k=>D[k][2]!='C').slice(0,4).forEach(i=>G.p.hand.push(mk(i)));render()`);
await p.waitForTimeout(2600);
const T=async(sel,i=0)=>{const bb=await p.locator(sel).nth(i).boundingBox();await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(350)};
const lo=()=>p.evaluate(`document.getElementById('loupe').classList.contains('on')`);
const tag=`[${w}x${h}] `;
ok(tag+'PHON on',await p.evaluate('PHON===true'));
// 1 tap field card -> loupe
await T('.fp .cd',0);ok(tag+'first tap shows loupe',await lo());
const box=await p.evaluate(`(()=>{const r=document.querySelector('#loupe .cd').getBoundingClientRect();return [r.left,r.top,r.right,r.bottom].map(Math.round)})()`);
ok(tag+'loupe card within viewport '+box,box[0]>=0&&box[1]>=0&&box[2]<=w&&box[3]<=h);
const sideBox=await p.evaluate(`(()=>{const r=document.querySelector('#loupe .lside').getBoundingClientRect();return [r.left,r.top,r.right,r.bottom].map(Math.round)})()`);
ok(tag+'loupe side within viewport '+sideBox,sideBox[2]<=w&&sideBox[3]<=h);
const nact=await p.locator('#loupe .lacts .b').count();ok(tag+'loupe has offer+stance buttons ('+nact+')',nact>=2);
// offer via loupe button
const m0=await p.evaluate('G.p.mana'),n0=await p.evaluate('G.p.bf.length');
await T('#loupe .lacts .b',0);
ok(tag+'offer via loupe gives mana',await p.evaluate('G.p.mana')>m0);ok(tag+'offered creature leaves',await p.evaluate('G.p.bf.length')<n0);ok(tag+'loupe hidden after',!(await lo()));
// stance via loupe
await T('.fp .cd',0);const dd0=await p.evaluate('G.p.bf[0].def');
const idx=await p.evaluate(`[...document.querySelectorAll('#loupe .lacts .b')].findIndex(b=>/Switch/.test(b.textContent))`);
if(idx>=0){await T('#loupe .lacts .b',idx);ok(tag+'stance switch via loupe',await p.evaluate('G.p.bf[0].def')!=dd0)}else ok(tag+'stance button exists',false);
await p.evaluate('G.p.bf.forEach(c=>{c.def=0});render()');await p.waitForTimeout(500);
await p.evaluate(`G.p.bf=G.p.bf.filter(c=>!has(c,'k'));render()`);await p.waitForTimeout(500);await T('.fp .cd:not(.df):not(.tap)',0);await T('.fp .cd:not(.df):not(.tap)',0);console.log('DBG',await p.evaluate(`JSON.stringify(G.sel)+' '+document.getElementById('loupe').className+' '+G.p.bf.map(c=>c.id+':'+c.def+':'+c.sick+':'+c.tap).join()+' mana='+G.p.mana+' atkd='+G.atkd+' mode='+JSON.stringify(G.mode)`));ok(tag+'second tap selects',await p.evaluate('G.sel.length')>=1||await p.evaluate(`!!document.querySelector('.fp .cd.sel')`));
// hand: two taps to play
const hc0=await p.evaluate('G.p.hand.length');await p.evaluate('G.p.mana=6;render()');await p.waitForTimeout(500);
await T('.hand .cd:not(.dim)',0);ok(tag+'hand loupe on',await lo());const hint=await p.evaluate(`document.querySelector('#loupe .lh').textContent`);ok(tag+'hint shown: '+hint,/play/.test(hint));
await p.evaluate(`window.LOG=[];document.addEventListener('click',e=>LOG.push('click '+(e.target.id||e.target.className||e.target.tagName)+' @'+Math.round(e.clientX)+','+Math.round(e.clientY)),true)`);console.log('HANDDBG',await p.evaluate(`JSON.stringify([...document.querySelectorAll('.hand .cd:not(.dim)')].slice(0,1).map(e=>{const r=e.getBoundingClientRect();return [r.left,r.top,r.right,r.bottom].map(Math.round)}))+' loupe '+JSON.stringify([...document.querySelectorAll('#loupe .cd,#loupe .lside')].map(e=>{const r=e.getBoundingClientRect();return [r.left,r.top,r.right,r.bottom].map(Math.round)}))`));await T('.hand .cd:not(.dim)',0);await p.waitForTimeout(600);console.log('AFTER',await p.evaluate(`JSON.stringify(window.__d)+' '+LOG.join(' ; ')+' || '+G.p.hand.length+' '+JSON.stringify(G.mode)+' '+G.msg`));
const tgtMode=await p.evaluate('!!(G.mode&&G.mode.tgt)');ok(tag+'second tap plays or enters targeting',await p.evaluate('G.p.hand.length')<hc0||tgtMode);

// tapping the big loupe card acts as second tap
await p.evaluate('G.sel=[];G.p.mana=6;render()');await p.waitForTimeout(500);
await T('.fp .cd:not(.df):not(.tap)',0);ok(tag+'loupe up for loupe-tap test',await lo());
{const bb=await p.locator('#loupe .cd').boundingBox();await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(400)}
ok(tag+'tapping big loupe card selects creature',await p.evaluate('G.sel.length')>=1);
// backdrop tap on End turn must not end the turn
await p.evaluate('G.sel=[];render()');await p.waitForTimeout(500);
await T('.fp .cd:not(.df):not(.tap)',0);const tn=await p.evaluate('G.turn+":"+G.phase');
{const bb=await p.locator('[data-b="end"]').boundingBox();await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(400)}
ok(tag+'backdrop tap over End turn only closes loupe',(await p.evaluate('G.turn+":"+G.phase'))==tn&&!(await lo()));
// tapping empty space closes loupe
await T('.fe .cd',0);ok(tag+'enemy card loupe',await lo());await T('.mid');await p.waitForTimeout(300);
ok(tag+'tap background closes loupe',!(await lo()));
// menu button reachable
const mb=await p.evaluate(`(()=>{const e=document.querySelector('#menuBtn,.menu,[id^=mnu]');return e?1:0})()`);
ok(tag+'no page errors '+errs.join('|'),errs.length==0);
await p.close()}
console.log(fails?'FAILS '+fails:'ALL OK');await b.close()})()
