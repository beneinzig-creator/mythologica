const vm=require('vm'),fs=require('fs');
let src=fs.readFileSync(process.argv[2]||'n1.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
src=src.replace("const wait=ms=>new Promise(r=>setTimeout(r,ms));","const wait=ms=>Promise.resolve();").replace("const reveal=c=>new Promise(res=>{G.rv={c,res};render()});","const reveal=c=>Promise.resolve(1);");
const store={};
const ctx=vm.createContext({innerWidth:1280,innerHeight:720,sendBeacon:()=>0,fetch:()=>Promise.resolve({}),window:{},console,setTimeout:()=>{},requestAnimationFrame:()=>{},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}},document:{getElementById:()=>({}),querySelector:()=>null,createElement:()=>({style:{},dataset:{}}),head:{appendChild:()=>{}},body:{appendChild:()=>{}},addEventListener:()=>{}}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);let f=0;const ok=(n,c)=>{console.log(c?'ok  ':'FAIL',n);if(!c)f++};
for(const [ch,realm] of [['ody','odin'],['ody','wukong'],['odin','ody'],['odin','wukong'],['wukong','odin'],['wukong','ody']]){
 R(`a2Realm=()=>'${realm}'`);R(`setChar('${ch}');newRun();for(let i=0;i<11;i++)pickDraft(0);G.p.life=9;G.fi=4;G.boss=1;G.phase='victory';persist()`);
 ok(ch+': act 1 victory saves the run',!!store['mythologica_run_v1']);
 for(let k=0;k<40;k++){R("G.p.life=9;G.fi=4;G.boss=1;G.phase='victory'");R('startAct2()');if(R(`G.web.nodes[0].adj.some(i=>G.web.nodes[i].t=='fight'&&!G.web.nodes[i].el)`))break};
 ok(ch+': act 2 starts on the map vs '+realm,R('G.phase')=='map'&&R('G.a2')==realm);
 ok(ch+': life +10 only',R('G.p.life')==19);
 ok(ch+': enemies are the '+realm+' realm',R(`EN.length==CHARS['${realm}'].en.length&&EN[0]===CHARS['${realm}'].en[0]`));
 ok(ch+': fresh web, fi 0, boss cleared',R('G.fi==0&&!G.boss&&G.pos==0&&G.web.nodes.length>=20'));
 ok(ch+': elite nodes use the '+realm+' elites',R(`G.web.nodes.filter(n=>n.el).length==CHARS['${realm}'].el.length&&G.web.nodes.filter(n=>n.el).every(n=>CHARS['${realm}'].el.includes(n.o-100))`));
 R(`var nb=G.web.nodes[0].adj.map(i=>G.web.nodes[i]).find(n=>n.t=='fight'&&!n.el);goNode(nb.id)`);
 ok(ch+': fight starts, scaled by act 2 table',R('G.phase')=='main'&&R(`G.e.max`)==R(`fo(nb.o).l`)+R('sclOf(4)[0]')+(R(`xAdj(fo(nb.o))`)?R(`xAdj(fo(nb.o))[0]`):0));
 R(`G.e.life=0;chk()`);ok(ch+': win -> kleos',R('G.phase')=='kleos');
 R(`persist();G.phase='map'`);
 // save/load round trip
 R(`G.phase='map';persist()`);R(`EN.length=0;A2R='';loadRun()`);
 ok(ch+': load restores act 2 enemies',R(`G.a2=='${realm}'&&A2R=='${realm}'&&EN[0]===CHARS['${realm}'].en[0]`));
 R(`G.fi=4;G.act=0;G.phase='otg';otgOffer()`);
 ok(ch+': guardians are the '+realm+' bosses',R(`G.bs.every(i=>CHARS['${realm}'].bo.includes(i))`));
 R(`bossPick(G.bs[0])`);ok(ch+': boss fight starts',R(`G.phase=='main'&&G.boss==1`));
 R(`G.e.life=0;chk()`);ok(ch+': act 2 victory has no further continue',R(`G.phase=='victory'&&G.a2`));
}
console.log(f?('FAILED '+f):'ALL OK');
