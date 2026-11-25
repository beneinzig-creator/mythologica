// glscan: lists effect words in card text that the hover/loupe box does not explain.
// For every card in D it takes the rules text (TXT/DYN-free), finds capitalised words that are not the first word of a
// sentence, plus a list of known status/mechanic terms, and checks whether a glossary line (GLS) would explain it.
// Card names, keywords and archetype words that are already covered are skipped. Usage: node glscan.js [n1.html] [--all]
const vm=require('vm'),fs=require('fs');
const file=process.argv.find(a=>a.endsWith('.html'))||'n1.html',ALL=process.argv.includes('--all');
let src=fs.readFileSync(file,'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const store={};const el=()=>({style:{setProperty(){}},classList:{add(){},remove(){},contains(){return false},toggle(){}},appendChild(){},setAttribute(){},addEventListener(){},querySelectorAll:()=>[],querySelector:()=>null,dataset:{}});
const ctx=vm.createContext({console:{log(){},warn(){},error(){}},setTimeout:()=>{},clearTimeout(){},setInterval(){},requestAnimationFrame:()=>{},innerWidth:1400,innerHeight:900,
 localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem(){}},
 document:{getElementById:()=>el(),querySelector:()=>null,querySelectorAll:()=>[],createElement:el,body:el(),documentElement:el(),addEventListener(){}},
 addEventListener(){},matchMedia:()=>({matches:false,addEventListener(){}}),navigator:{userAgent:''},location:{search:''},MutationObserver:function(){this.observe=()=>{}}});
vm.runInContext(src,ctx);const R=e=>vm.runInContext(e,ctx);
// terms that are statuses or mechanics even when written in lower case
const TERMS=['blind','blinded','sealed','seal','sunder','sundered','marked','mark','momentum','inscribe','inscribed','glyph','glyphs','foresee','foreseen','preempt','preempted','record','recorded',
 'erase','erased','reunite','reunited','akh','speak','silk','cocoon','cocooned','cursed','curse','possessed','possess','quarry','disintegrate','burn','burning','ruin','marked','fade','fading',
 'frozen','freeze','enthralled','bounce','mimic','mimicked','swine','shabti','khrafstra','locust','lie','bargain','herald','fly','name','body','spirit','wounded','carve','fallen','clock','sentinel','berserker'];
const out=R(`(()=>{const G2=GLS(),KN=new Set(Object.values(KWT).map(x=>x.replace('.','').toLowerCase()));
 const names=new Set();for(const id in D){D[id][0].split(/[ ,']+/).forEach(w=>{if(w.length>2)names.add(w.toLowerCase())})}
 const PLAIN=new Set(['i','my','we','here','x','f','name','body','spirit','soldiers','wood','weights','curse','burn','bargain','fly']);const T=new Set(${JSON.stringify(TERMS)});const miss={};
 const covered=(w,tx)=>G2.some(([re])=>re.test(w)||(re.test(tx)&&new RegExp(re.source,'i').test(w)));
 for(const id in D){const d=D[id];const tx=String(TXT[id]||d[6]||'');if(!tx)continue;
  const spans=[];for(const [re] of G2){const g=new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g');let m;while((m=g.exec(tx))){spans.push([m.index,m.index+m[0].length]);if(!m[0].length)g.lastIndex++}}
  const words=[];tx.replace(/(^|[.!?:;]\\s+|\\()?([A-Za-z][A-Za-z'-]*)/g,(m,pre,w,off)=>{const start=pre!==undefined&&pre!=='';const at=off+(pre||'').length;
   if(spans.some(([x,y])=>at>=x&&at<y))return m;if((/^[A-Z]/.test(w)&&!start&&off>0)||T.has(w.toLowerCase()))words.push(w);return m});
  for(const w of words){const lw=w.toLowerCase().replace(/'s$/,'');if(KN.has(lw)||PLAIN.has(lw)&&!/^[A-Z]/.test(w)||['i','my','we','here','x','f'].includes(lw))continue;
   if(/^[A-Z]/.test(w)&&names.has(lw)&&!T.has(lw)&&!${ALL})continue;
   (miss[lw]=miss[lw]||new Set()).add(id)}}
 return JSON.stringify(Object.entries(miss).map(([w,s])=>[w,[...s]]).sort((a,b)=>b[1].length-a[1].length))})()`);
const L=JSON.parse(out);
if(!L.length){console.log('glscan: every effect word is explained.');process.exit(0)}
for(const [w,ids] of L)console.log(w.padEnd(16),String(ids.length).padStart(3),' ',ids.slice(0,8).join(' '));
console.log('glscan:',L.length,'words without an explanation');
