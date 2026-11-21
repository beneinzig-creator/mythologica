// v111: one Act III boss fight per run with proven decks (life 20 on arrival, like after the march's heal).
// usage: node a3boss.js n1.html BANKFILE RUNS BOSS(0..2 = generals, 3 = the Beast)
const vm=require('vm'),fs=require('fs'),path=require('path');const [html,bankf,Ns,bk]=process.argv.slice(2);
let src=fs.readFileSync(html,'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const ctx=vm.createContext({console,setTimeout:()=>{},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,localStorage:{getItem:()=>null,setItem:()=>{}},document:{getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[]}});
vm.runInContext(src,ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'bot.js'),'utf8'),ctx);const R=e=>vm.runInContext(e,ctx);
const B=fs.readFileSync(bankf,'utf8').split('\n').filter(Boolean).map(JSON.parse);const tick=()=>new Promise(r=>setImmediate(r));
(async()=>{let w=0,t=0,N=+Ns;for(let i=0;i<N;i++){const b=B[i%B.length];
 R(`setChar('${b.ch}');newRun();G.p.recs=${JSON.stringify(b.recs)};G.p.max=20;G.p.life=20;G.a2='${b.a2}';startAct3();`+(+bk==3?"G.phase='a3front';G.front='Michael';G.p.life=10;startFinale()":`G.boss=1;G.bi=A3.bo[${bk}];G.phase='main';fight()`));
 for(let g=0;g<4000;g++){const ph=R('G.phase');if(['victory','lost','a3front'].includes(ph))break;if(R('G.turn')>45)break;if(ph=='main')R('botMain()');else if(ph=='blockP')R('botBlock()');else if(ph=='dmgP')R("bt('res')");await tick()}
 const ph=R('G.phase');if(ph=='victory'||ph=='a3front')w++;t+=R('G.turn')}
 console.log(JSON.stringify({w,N,t}))})();
