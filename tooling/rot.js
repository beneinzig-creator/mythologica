const {chromium}=require('playwright');let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
let p=await b.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(300);
await p.evaluate(`setChar('wukong');newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';render()`);await p.waitForTimeout(2200);
const st=()=>p.evaluate(`[document.documentElement.className,getComputedStyle(document.getElementById('rotp')).display,getComputedStyle(document.getElementById('app')).visibility].join('|')`);
console.log('land',await st());
await p.setViewportSize({width:390,height:844});await p.waitForTimeout(500);const s2=await st();console.log('port',s2);
ok('portrait shows rotate prompt',/block|flex/.test(s2.split('|')[1])&&/phr/.test(s2));ok('portrait hides app',/hidden/.test(s2));
await p.screenshot({path:'tour/rot_portrait.png'});
await p.setViewportSize({width:844,height:390});await p.waitForTimeout(600);const s3=await st();console.log('back',s3);
ok('landscape restored',/ph phl/.test(s3)&&/none/.test(s3.split('|')[1])&&/visible/.test(s3));
ok('game state intact',await p.evaluate(`G.phase==='main'&&G.p.hand.length>0`));
await p.screenshot({path:'tour/rot_back.png'});
ok('no errors '+errs,errs.length==0);
// desktop narrow: no touch
const p2=await b.newPage({viewport:{width:500,height:800}});await p2.goto('file://'+process.argv[2]);await p2.waitForTimeout(300);
ok('desktop narrow not PHON, no rotate prompt',await p2.evaluate(`!PHON&&getComputedStyle(document.getElementById('rotp')).display=='none'`));
// tablet-size touch (1024x768) not phone mode
const p3=await b.newPage({viewport:{width:1024,height:768},isMobile:true,hasTouch:true});await p3.goto('file://'+process.argv[2]);await p3.waitForTimeout(300);
ok('tablet not PHON',await p3.evaluate(`!PHON`));
console.log(f?'FAILS '+f:'ALL OK');await b.close()})()
