/* ===== v82: opening trumps (regular fights) ===== */
const MT=['lhz','canto','mouth','blackship','hdead','hitr','pgrow','rwall','ffire','bland','corp','ltax'];
Object.assign(D,{
lhz:['Lotus Haze',0,'E',0,0,'w','Ward. The first army member you play each turn enters tapped.','🪷','G'],
hdead:['The Hungry Dead',1,'E',0,0,'w','Ward. Whenever an army member dies, the Shades gain 1 extra mana on their next turn (up to 2).','🥀','B'],
hitr:['Hit and Run',0,'E',0,0,'w','Ward. Marauders that deal combat damage to you return to their owner\'s hand and can be played again for free.','🏃','R'],
pgrow:['The Pack Grows',1,'E',0,0,'w','Ward. At the start of their turn, their weakest army member gets +1/+1 permanently.','🐾','B'],
rwall:['Rimewall',0,'E',0,0,'w','Ward. Combat damage dealt to their Giants is reduced by 1.','🧊','U'],
ffire:['The Forge-Fire',1,'E',0,0,'w','Ward. Whenever they play an item or modifier, their strongest army member gets +1/+1 permanently.','🔥','A'],
bland:['Scorched Earth',1,'E',0,0,'w','Ward. At the start of each of your turns, you lose 1 life.','🌋','F'],
corp:['Corpse-Cold',1,'E',0,0,'w','Ward. At the start of each of your turns, each of your army members that has damage on it takes 1 more damage.','🥶','H'],
ltax:['Loki\'s Toll',0,'E',0,0,'w','Ward. The first spell you cast each turn costs 1 more.','🎭','M']
});
D.canto[1]=1;D.mouth[1]=1;D.blackship[1]=1;D.lhz[1]=1;
Object.assign(LORE,Object.fromEntries(MT.map(k=>[k,'Opening trump'])));
Object.assign(IV,Object.fromEntries(MT.map(k=>[k,40])));
function mtUp(s,o){const n=id=>s.bf.filter(x=>x.id==id).length;
 if(n('pgrow')){const L=cr(s);if(L.length){const t=L.slice().sort((a,b)=>(pw(a)+th(a))-(pw(b)+th(b)))[0];t.pa++;t.pd++;log('The Pack grows: '+D[t.id][0]+' gets +1/+1.')}}
 if(o&&s===G.p&&o.bf.some(x=>x.id=='bland')){s.life-=1;log('Scorched Earth: you lose 1 life.')}
 if(o&&o.bf.some(x=>x.id=='corp')){const L=cr(s).filter(c=>c.dmg>0);if(L.length){L.forEach(c=>{c.dmg+=1});log('Corpse-Cold: each wounded army member takes 1 more damage.');sweep()}}}
function ltx(c){if(!G||!G.e||!G.p||!G.e.bf||!G.p.hand)return 0;const t=D[c.id][2];if(t!='S'&&t!='I')return 0;if(!G.p.hand.includes(c))return 0;return(G.p.sp===G.turn||!G.e.bf.some(x=>x.id=='ltax'))?0:1}
function hdDie(){for(const o of[G.p,G.e])if(o&&o.bf&&o.bf.some(x=>x.id=='hdead'))o.hd=Math.min(2,(o.hd||0)+1)}
function hdb(e){const n=e.hd||0;e.hd=0;if(n)log('The Hungry Dead feed the Shades: +'+n+' mana.');return n}
function ffGrow(e,pl){if(pl.id=='ffire'||!'EA'.includes(D[pl.id][2])||!e.bf.some(x=>x.id=='ffire'))return;const t=best(cr(e));if(t){t.pa++;t.pd++;log('The Forge-Fire flares: '+D[t.id][0]+' gets +1/+1.')}}
function hitRun(c){if(!c||c.side!='e'||!G.e.bf.some(x=>x.id=='hitr'))return;const e=G.e;for(const u of c.atk){const a=e.bf.find(x=>x.u==u);if(!a||!has(a,'m')||c.blk[u]||(c.bx&&c.bx[u])||(c.tg&&c.tg[u]))continue;e.bf.splice(e.bf.indexOf(a),1);Object.assign(a,{tap:0,dmg:0,def:0,att:0,sw:0,sick:1,frz:0,pa:0,pd:0,ta:0,td:0,vn:0,rs:0,forced:0,free:1});e.hand.push(a);log(D[a.id][0]+' hits and runs back to its owner\'s hand (it can be played again for free).')}}
function startHand(f){const e=G.e;if(!G.boss&&f.mt){e.hand.push(mk(f.mt));draw(e,3)}else draw(e,4)}
{const set=(R,i,d,mt,l)=>{const o=CHARS[R].en[i];o.d=ids(d);o.mt=mt;if(l)o.l=l};
set('ody',0,'isl:2,lot:2,priest,reaper:2,titan,sip,dream,censer,garden,fog,breeze,lbow:2,nshade','lhz');
set('ody',1,'scout:3,song:3,siren:3,eel,lyre,skies,shoal,melody:2,lure,dirge','canto');
set('ody',2,'sheep:3,cscout,cave,brute:2,elder,poly,hurl:2,milk:2,club,forge','mouth',20);
set('ody',3,'shade1:2,mourner:2,warden:2,tiresias,libation,pit,shroud,curse:2','hdead',11);
set('ody',4,'oarsman:3,navig:3,phguard:3,nausi,alcinous,sails,gift,tide,trident','blackship',10);
set('ody',5,'mraid:2,mskirm:2,mpill:2,chief,drums,burn:2,javel,cbow','hitr',17);
set('odin',0,'pup:3,wolf:4,hati,skoll,fenr,maul','pgrow',9);
set('odin',1,'ithrl:3,rimew:2,hgnt:2,fgnt:2,ymir,icesp','rwall',9);
set('odin',2,'dmin:2,dsmith:3,dxbow:3,brokk,golem,anvl,dshld,drpn,dbolt:2','ffire',17);
set('odin',3,'ember:3,fraid:3,lava:2,mgnt:2,surtr,fbolt:2,mspear','bland');
set('odin',4,'draug:4,wight:3,hgrd:3,nidh,hel,hgrasp:2','corp',11);
set('odin',5,'lrav:2,imp:3,skinw:2,lokis,lsnare,lcurse,lgale:2,lokib:2','ltax');
}
