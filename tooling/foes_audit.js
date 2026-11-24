// Opponent audit: every deck, every card's rules, and creatures without rules text.
// usage: node foes_audit.js n1.html [--dump out.txt]
const vm=require('vm'),fs=require('fs');
const html=process.argv[2]||'n1.html';
let src=fs.readFileSync(html,'utf8').match(/<script>([\s\S]*)<\/script>/)[1];
const W=[];
const ctx=vm.createContext({console:{log(){},warn(...a){W.push(a.join(' '))}},setTimeout:()=>{},requestAnimationFrame:()=>{},document:{getElementById:()=>({}),querySelector:()=>null}});
vm.runInContext(src,ctx);
const R=e=>vm.runInContext(e,ctx);
const decks=R(`(()=>{const L=[];for(const h of Object.keys(CHARS)){CHARS[h].en.forEach(e=>L.push([h,'reg',e]));(CHARS[h].el||[]).forEach(i=>L.push([h,'elite',ELITES[i]]));(CHARS[h].bo||[]).forEach(i=>L.push([h,'boss',BOSS[i]]))}
A3.en.forEach(e=>L.push(['a3','reg',e]));A3.el.forEach(i=>L.push(['a3','elite',ELITES[i]]));A3.bo.forEach(i=>L.push(['a3','boss',BOSS[i]]));L.push(['a3','fin',BOSS[A3.fin]]);
return L.map(([r,k,x])=>({r,k,n:x.n,l:x.l,hint:x.hint||'',t:x.trump||x.mt||'',t2:x.trump2||'',d:x.d}))})()`);
const card=id=>R(`(()=>{const d=D['${id}'];return d?{n:d[0],c:d[1],ty:d[2],a:d[3],h:d[4],f:d[5],t:d[6]}:null})()`);
let tot=0,bare=[],out=[];
for(const x of decks){const cnt={};x.d.forEach(k=>cnt[k]=(cnt[k]||0)+1);
 out.push(`## ${x.r}/${x.k} ${x.n} (life ${x.l}) ${x.hint}`);
 for(const t of [x.t,x.t2].filter(Boolean)){const c=card(t);out.push(`  TRUMP ${c.n}: ${c.t}`)}
 for(const [k,n] of Object.entries(cnt)){const c=card(k);if(!c){out.push('  ?? '+k);continue}
  const kw=c.f;if(c.ty=='C'){tot++;if(!(c.t||'').trim())bare.push(x.n+': '+c.n)}
  out.push(`  ${n}x ${c.n} [${c.ty}${c.c}${c.ty=='C'?' '+c.a+'/'+c.h:''}${kw?' '+kw:''}] ${c.t}`)}}
console.log('opponents',decks.length,'creature entries',tot,'without rules text',bare.length);bare.forEach(b=>console.log('  BARE',b));
if(W.length)console.log('warnings:\n'+W.slice(0,20).join('\n'));
const di=process.argv.indexOf('--dump');if(di>0)fs.writeFileSync(process.argv[di+1],out.join('\n'));
