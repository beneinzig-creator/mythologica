const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1280,height:800}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+process.argv[2]);await p.waitForTimeout(300);
await p.evaluate(`setChar('wukong');newRun();for(let i=0;i<11;i++)pickDraft(0);G.rt[0]=0;G.fi=0;fight();G.phase='main';G.p.mana=5;G.turn=4;render()`);await p.waitForTimeout(2500);
console.log(await p.evaluate(`[PHON,document.documentElement.className,getComputedStyle(document.getElementById('lbk')).display,getComputedStyle(document.getElementById('rotp')).display].join('|')`),errs);
await p.screenshot({path:'tour/desk.png'});await b.close()})()
