# v127 (patch_glossary): the hover/loupe box explains every effect a card's text mentions.
# tooling/glscan.js lists words in card text that no glossary line explains; this patch adds one short line for each
# real mechanic, status or token it found (Blinded, Silk, Sunder, Body/Spirit/Name, Inscribe, Foresee, Preempt, Record,
# Possessed, Locust, ...). Proper names and plain words are left alone.
# It also adds live status lines to the hover box of a card that currently has the status (Blinded, Silk, Cocooned,
# Burning, Possessed, Marked, Cursed, Can't be blocked, White bull), and keeps a long hover box from overflowing:
# it tightens its type, and the loupe's info panel scrolls.

_b3("GL(c,L);return`<div class=\"fxp", "stFxp(c,L);GL(c,L);return`<div class=\"fxp")

_JSGL = r"""
/* ===== v127 (patch_glossary): glossary lines for every mechanic, live status lines, hover box fit ===== */
{const f=GLX.find(x=>x[1]=='Fallen');if(f)f[0]=/\bfallen\b(?! angel)|have died this fight/i}
GLX.push(
 [/\bblind(ed|s)?\b/i,'Blinded','a blinded army member can\'t block. Killing the Yellow Wind Monster cures every blinded army member.'],
 [/\bsilk\b/i,'Silk','each silk gives -1 power (never below 0). At 3 silk the army member is Cocooned.'],
 [/\bcocoon(ed|s)?\b/i,'Cocooned','an army member with 3 silk is wrapped up: it stays tapped while it has 3 silk.'],
 [/keeps burning|\bburning\b/i,'Burning','it takes 1 damage at the start of each of its controller\'s turns.'],
 [/\bpossess(ed|es)?\b/i,'Possessed','the demons have taken it: it fights for them until the Herd of Swine dies, then returns to its owner.'],
 [/\b(mark|marked)\b/i,'Marked','a marked army member can\'t attack on its controller\'s next turn.'],
 [/\bsealed\b/i,'Sealed','a sealed army member can\'t attack.'],
 [/\bcursed\b/i,'Cursed','a cursed card in your hand costs 1 more for the rest of the fight.'],
 [/\bquarry\b/i,'Quarry','the army member the Wild Hunt is hunting: Hunt riders deal 2 extra damage to it.'],
 [/\bsunder(ed|s)?\b/i,'Sunder','split an army member into its Body and Spirit. If you Sunder it, you also take its Name.'],
 [/\bBod(y|ies)\b/,'Body','the half of a Sundered army member with half its health. It can\'t block, and it Reunites with its Spirit.'],
 [/\bSpirits?\b/,'Spirit','the half of a Sundered army member with half its power and Flying. It Reunites with its Body.'],
 [/(?<!Gourd of )\bNames?\b/,'Name','a spell you take by Sundering: write its keywords onto one of your army members, or speak it for 2 mana.'],
 [/\breunit(e|es|ed)\b/i,'Reunite','when an army member\'s Body and Spirit are both in your army, they join back into the original as an Akh.'],
 [/\bakh\b/i,'Akh','a reunited army member, the glorified soul: it comes back with +1/+1 and the glyphs of both halves.'],
 [/\binscrib(e|es|ed)\b/i,'Inscribe','write a glyph onto an army member: it gains that keyword or +1/+1. Each army member holds at most 3 glyphs.'],
 [/\bglyphs?\b/i,'Glyph','a keyword or +1/+1 written onto an army member by Inscribe (at most 3 on each).'],
 [/\berase[ds]?\b/i,'Erase','the army member loses its name, keywords and abilities for good. Opposing Erase can\'t touch a warded one.'],
 [/\bforese(e|es|en)\b/i,'Foresee','look at the top cards of their deck (or their hand). Foreseen cards are shown above their side of the battlefield.'],
 [/\bpreempt(ed|s)?\b/i,'Preempt','the most expensive foreseen card fails when they play it.'],
 [/\brecord(ed|s)?\b/i,'Record','when they play a recorded card, a fading copy of it joins your hand (or you draw a card).'],
 [/\bfading\b/i,'Fading copy','a copy with Disintegrate: it is gone after you play it.'],
 [/\bLies?\b/,'The Lie','a 0-cost card: when played, you lose 1 life and it is gone.'],
 [/\bHeralds?\b/,'Herald','Herald with Trumpets (1/2): each gives Paimon 1 extra mana a turn, and the third brings King Paimon.'],
 [/\bLocusts?\b/,'Locust','a 1/1 flyer from the pit: when it deals combat damage to you, your weakest army member gets -1/-0 permanently.'],
 [/\bKhrafstra\b/,'Khrafstra','a 1/1 token with Venomous.'],
 [/\bFl(y|ies)\b/,'Fly','a 1/1 token with Flying.'],
 [/\bSwine\b/,'Swine','a 1/1 the cup turns an army member into. When the Swine leaves play, the original returns to its owner\'s hand.'],
 [/\bShabti\b/,'Shabti','a 1/1 servant token that takes the place of the dead.'],
 [/\bEinherjar\b/,'Einherjar','a 3/3 warrior token of Valhalla.'],
 [/\bFallen Angels?\b/,'Fallen Angel','Lucifer\'s 2/2 flyer: he gains one for each Bargain accepted, and each gets +1/+1 per Bargain (at most +3/+3).'],
 [/\bsentinel\b/i,'Sentinel',KWL.k],
 [/\bcall(s|ed)?\b[^.]*\bby name\b|\bcalls one more name\b|\bthe called\b/i,'Called','the gourd has called it by name: if it attacks or blocks before their next turn, it answers and is swallowed (gone for good).'],
 [/\bClones? of the Great Sage\b/,'Clone of the Great Sage','a 1/1 copy of Wukong; when it dies, a Spare Hair goes into your hand.'],
 [/\bclaim(s|ed)?\b|\bsouls? they hold\b|\bthe Hall\b/i,'Claimed soul','your army members that die while Anubis is out go to their graveyard instead. The Packleader leads them into the Hall; every soul they hold feeds the Jackals.'],
 [/\bJackals?\b/,'Jackal','Anubis\'s pack: Desert Jackal, Jackal Guard, Wepwawet and the Jackal Packleader.'],
 [/\bfeather\b/i,'Feather','Ammit\'s scales weigh your strongest army member against the feather (power 4, lighter for each Guardian of the Scales). Heavier hearts are eaten.'],
 [/\bWeights? of the Mountain\b/,'Weight of the Mountain','a useless card: it cannot be cast.'],
 [/\bBargains?\b/,'Bargain','once a turn you may take +1 mana from Lucifer; each Bargain gives him a Fallen Angel.'],
 [/\bSons? of Darkness\b/,'Son of Darkness','one of Belial\'s soldiers (Line Soldier, Captain of the Lot, Slinger of Belial and their kin).'],
 [/\bGold\b/,'Gold','a treasure in Fáfnir\'s Hoard. Fáfnir gets +1/+1 for each Gold.'],
 [/\bBlood price\b/i,'Blood price','Odin\'s hero power: pay life for 1 mana (normally once a turn).'],
 [/\b(Strike|Trick|Leap)s?\b/,'Card types','Wukong\'s cards are Strikes, Tricks or Leaps. Playing a different type than the card before builds Momentum.']);
function stFxp(c,L){if(!c)return;const P=[];
 /* temporary flags (Blinded adds can't-block, Sealed adds can't-attack) are not the Berserker/Sentinel keywords */
 if(c.bln&&c.bln.includes('n')){const i=L.indexOf(KWL.n);if(i>=0)L.splice(i,1)}
 if(c.seal&&c.seal.includes('k')){const i=L.indexOf(KWL.k);if(i>=0)L.splice(i,1)}
 if(c.seal)P.push('<b>Sealed</b>: it can\'t attack while the Mountain Warden lives.');
 if(c.callT>=(G&&G.turn||0)&&c.callT)P.push('<b>Called</b>: if it attacks or blocks before their next turn, it is swallowed.');
 if(c.blind)P.push('<b>Blinded</b>: it can\'t block until the Yellow Wind Monster dies.');
 if(c.silk&&!c.coc)P.push('<b>Silk</b> ('+c.silk+'/3): -'+c.silk+' power. At 3 silk it is cocooned.');
 if(c.coc)P.push('<b>Cocooned</b>: 3 silk. It stays tapped while it has 3 silk.');
 if(c.burn)P.push('<b>Burning</b>: it takes 1 damage at the start of each of its controller\'s turns.');
 if(c.poss)P.push('<b>Possessed</b>: it fights for the demons until the Herd of Swine dies.');
 if(c.mk)P.push('<b>Marked</b>: it can\'t attack on its controller\'s next turn.');
 if(c.ub)P.push('<b>Can\'t be blocked</b> this turn.');
 if(c.cursed)P.push('<b>Cursed</b>: it costs 1 more for the rest of the fight.');
 if(c.white)P.push('<b>White bull</b>: +4/+4 and Bulldoze.');
 for(const x of P)if(!L.some(y=>y.indexOf(x.slice(0,x.indexOf('</b>')))>=0))L.push(x)}
/* the card face: a blinded/sealed card says so instead of 'Can only attack.'/'Can only defend.' */
if(typeof kwTx2=='function'){const _k=kwTx2;kwTx2=function(c,b){if(!c||!(c.bln||c.seal))return _k(c,b);const f=c.f;let g=f;for(const x of (c.bln||'')+(c.seal||''))g=g.replace(x,'');c.f=g;try{return _k(c,b)+(c.bln?' Blinded.':'')+(c.seal?' Sealed.':'')}finally{c.f=f}}}
(function(){try{const fit=()=>{const k=document.getElementById('kdock');if(!k)return;k.classList.remove('kd1','kd2');const H=innerHeight-16;if(H<200)return;
  if(k.scrollHeight>H*.6)k.classList.add('kd1');if(k.scrollHeight>H)k.classList.add('kd2')};
 addEventListener('resize',fit);const go=()=>{const k=document.getElementById('kdock');if(!k)return setTimeout(go,300);new MutationObserver(fit).observe(k,{childList:true,subtree:true,characterData:true})};go()}catch(e){}})();
try{const st=document.createElement('style');st.id='pgls';st.textContent=`
#kdock{max-height:calc(100vh - 16px);overflow:hidden}
#kdock.kd1,#kdock.cbt.kd1{font-size:12.5px;line-height:1.3}#kdock.kd1 p,#kdock.cbt.kd1 p{margin:0 0 3px}
#kdock.kd2,#kdock.cbt.kd2{font-size:11px;line-height:1.25;width:320px}
#insp .iinfo{overflow-y:auto!important;overscroll-behavior:contain}
`;document.body.appendChild(st)}catch(e){}
"""
_b3("showChars();\n</script>", _JSGL + "showChars();\n</script>")
