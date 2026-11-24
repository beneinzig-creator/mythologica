# v126 (patch_owntext): three requests from Ben.
# 1. Enemy cards read from their owner's side. Ordinary enemy cards were already written that way ("your army
#    members" = the enemy's), but the realm trumps, boss items and a few creatures were written from the player's
#    side ("The first army member ... you play each turn costs 1 more" on the enemy's Heavenly Decree). Those texts
#    are rewritten from the owner's side ("... your opponent plays ..."). Only enemy-only cards are touched; the
#    mechanics are unchanged. The log already narrates to the player ("Scorched Earth: you lose 1 life.") and stays.
# 2. Prestige: hovering an upgrade button shows the parchment hover box with what it does (keyword upgrades use
#    the same KWL descriptions as the card details).
# 3. Mana cost colour: red when an effect makes a card cost more than its printed cost, green when less (already
#    there). On the painted parchment cost badge both are drawn in a darker shade so the digits stay readable.

OWNTX = {
 'nshade': 'Deal 4 damage to target army member. Grows stronger the further your opponent travels.',
 'trident': 'Deal 4 damage to target army member. Grows stronger the further your opponent travels.',
 'heal2': 'Gain 4 life. Restore 2 health to each of your army members.',
 'xcook': 'When it enters, restore 2 health to each of your army members.',
 'embp': 'When it enters, restore 3 health to each of your army members.',
 'xdaeva': "When it enters, a Lie goes into your opponent's hand.",
 'xcoin': 'When it enters, you gain 1 mana.',
 'xpaimon': 'When it enters, two of your army members learn a keyword.',
 'xproph': "Each turn, marks your opponent's strongest army member: it can't attack. Heals the Beast's wound.",
 'lhz': 'Ward. The first army member your opponent plays each turn enters tapped.',
 'hdead': 'Ward. Whenever an army member dies, you gain 1 extra mana on your next turn (up to 2).',
 'hitr': 'Ward. Your Marauders that deal combat damage to your opponent return to your hand and can be played again for free.',
 'pgrow': 'Ward. At the start of your turn, your weakest army member gets +1/+1 permanently.',
 'rwall': 'Ward. Combat damage dealt to your Giants is reduced by 1.',
 'ffire': 'Ward. Whenever you play an item or modifier, your strongest army member gets +1/+1 permanently.',
 'bland': "Ward. At the start of each of your opponent's turns, they lose 1 life.",
 'corp': "Ward. At the start of each of your opponent's turns, each of their army members that has damage on it takes 1 more damage.",
 'ltax': 'Ward. The first spell your opponent casts each turn costs 1 more.',
 'cup': ("Ward. At the start of your turn, if your opponent has no Swine, their strongest untapped army member that costs 3 or more "
         "(not a token) is turned into a Swine (1/1). When the Swine dies, is offered or leaves play, the original returns to "
         "its owner's hand and costs 1 less to play."),
 'gourd': 'Ward. The first spell your opponent casts each turn that targets one of your army members is swallowed: it does nothing.',
 'decree': 'Ward. The first army member that costs 2 or less your opponent plays each turn costs 1 more.',
 'sfire': 'Ward. Army members that block your army members take 1 damage first.',
 'bone': 'Ward. The first of your army members to die each turn returns to your hand instead.',
 'ywind': 'Ward. All of your army members have Charge.',
 'eye': 'Ward. Spells and instants that cost 0 cost 1 more for your opponent.',
 'mtrump': 'Ward. The first army member your opponent plays each turn is mimicked: a copy joins your army if there is room, and vanishes for good when it dies.',
 'bfury': 'Ward. At the start of your turn, each of your army members gets +1/+0 until end of turn.',
 'palm': 'Ward. Each card your opponent plays after the third in a turn costs 2 more.',
 'ifan': "Ward. At the start of your turn, the most expensive army member your opponent controls that costs 3 or more is blown back to their hand.",
 'trob': ("Ward. At the start of your turn, if you control more army members than your opponent, you steal a random item or modifier "
          "they control (or, if they have none, a random card from their hand) for the rest of the fight."),
 'serk': 'Ward. Your army members with 1 power have Venomous while in attack form.',
 'shab': 'Ward. The first time each of your non-token army members dies, a 1/1 Shabti takes its place.',
 'sobk': 'Ward. Your army members have Ruthless (they get +1 power when they attack).',
 'anub': 'Ward. Whenever any army member dies, the jackals feed: your opponent loses 1 life.',
 'heka': "Ward. At the start of your turn, a random card in your opponent's hand is cursed: it costs 1 more for the rest of the fight.",
 'xlegion': 'Ward. Whenever you play an army member that costs 2 or more, a 1/1 Possessed joins it (if there is room).',
 'xwatch': 'Ward. Whenever your opponent casts a spell, you draw a card (at most 2 a turn).',
 'xneph': 'Ward. Your army members that cost 3 or more cost 1 less.',
 'xmol': 'Ward. Whenever one of your army members dies or is offered, your other army members get +1/+0 permanently.',
 'xbab': "Ward. At the start of your turn, the costs of the cards in your opponent's hand are shuffled among them.",
 'xpair': "Ward. At the start of your turn, a random untapped army member of your opponent's is tapped.",
 'xbel': 'Ward. Every third turn, your army members get +2/+0 until end of turn.',
 'xmam': 'Ward. Each mana your opponent leaves unspent at the end of their turn gives your army members +1/+0 during your next turn (up to +3).',
 'xmast': "Ward. At the start of your turn, each of your opponent's army members that attacked last turn takes 1 damage.",
 'xpaim': ('Ward. While you control a Herald, your army members get +1/+0. At the start of your turn, one of your army members '
           'learns a keyword (Flying, Ward, Charge or Ruthless).'),
 'walls': 'Ward. Attacking costs your opponent 1 mana per army member they attack with.',
 'heads': 'Ward. Each time your army members deal damage to your opponent, they must offer their weakest army member.',
 'whirl': ("Ward. At the start of every third turn of your opponent's, they lose 2 life and all army members on both sides "
           "return to their owners' hands."),
 'ouro': ('Ward. Whenever your opponent attacks, the attacking army member with the highest cost (3 or more) that survives '
          'returns to their hand after combat.'),
 'hunt': ("Ward. At the start of your turn, the Hunt marks your opponent's strongest army member as the Quarry. Hunt riders deal "
          "2 extra damage to the Quarry. A rider that kills the Quarry gets +1/+1 for the rest of the fight, and you draw a card."),
 'ammt': "Ward. Whenever one of your opponent's army members dies, your strongest army member gets +1/+1 permanently.",
 'sphx': ("Ward. At the start of your turn, the Sphinx names a card type. At the end of your opponent's turn, if they did not "
          "play a card of that type, they lose 2 life."),
 'apep': "Ward. At the start of your turn, your opponent's strongest army member is Erased: it loses its name, keywords and abilities.",
 'setx': ("Ward. At the start of your turn, your opponent's strongest army member that costs 3 or more is Sundered: its Body "
          "and Spirit stay with them, but its Name is lost."),
 'sekh': ('Ward. At the start of your turn, each of your army members gets +1/+0 permanently, and your rage burns you for 1 '
          'per army member you control.'),
 'xbeel': "Ward. Whenever one of your army members that isn't a Fly dies, a 1/1 Fly with Flying takes its place.",
 'xaza': "Ward. Whenever one of your army members dies, your opponent's strongest army member takes 2 damage.",
 'xasm': 'Ward. The first army member your opponent plays each turn takes 2 damage.',
 'xlil': "Ward. Your army members get +1 power during your turn. Whenever one of your opponent's army members dies, you gain 2 life.",
 'xbarg': 'Ward. Once each turn your opponent may accept the Bargain: +1 mana. Each time they do, you gain a Fallen Angel.',
 'xdrag': 'Ward. The Red Dragon: three Heads of the Dragon wait in your deck, and every Fallen Angel you gained grew stronger.',
 'xdruj': "Ward. At the start of your turn, a Lie is shuffled into your opponent's deck.",
 'xassa': "Ward. Whenever one of your opponent's army members dies, you get a 1/1 Khrafstra with Venomous.",
 'xsmoke': ("Ward. Your opponent's army members with 3 or more power get -1/+0. At the start of every other turn of yours, "
            "a Locust rises from the pit."),
 'xtorm': ("Ward. Your Locusts get +1/+1 and Venomous. At the start of your opponent's turn, each of their damaged army "
           "members takes 1 more damage."),
}

import json as _json
# ---- 3. cost colour ----
_b3("cc<d[1]?' style=\"color:#7be08a\"':''", "cc<d[1]?' style=\"color:#7be08a\"':cc>d[1]?' style=\"color:#ff6b5a\"':''")

_JSOWN = r"""
/* ===== v126 (patch_owntext): owner-side enemy texts, prestige hover box, cost colours ===== */
{const T=__OWNTX__;for(const k in T)if(D[k]){D[k][6]=T[k];if(TXT[k])TXT[k]=T[k]}}
function koTip(o,c){const lab=KO[o]?KO[o][0]:'';const nm=D[c.id][0];
 if(o==6){const s=UPS[c.id]?UPS[c.id](((c.rec&&c.rec.m)||0)+1):'';return'<p><b>Stronger effect</b></p><p>'+nm+"'s effect gets stronger"+(s?': '+s:'')+'. Permanent for this run.</p>'}
 const m=/^Gains (.+)$/.exec(lab);if(m){const nmk=m[1],a=nmk=='flying'?['f']:ABU.find(x=>x[1]==nmk);const k=a&&a[0];
  const def=k=='f'?'Flying: only flying army members can block it.':(KWL[k]||'');return'<p><b>Gains '+nmk[0].toUpperCase()+nmk.slice(1)+'</b></p>'+(def?'<p>'+def+'</p>':'')+'<p>Permanent for this run.</p>'}
 const D0={0:'This army member gets +1 power for the rest of the run.',1:'This army member gets +2 health for the rest of the run.',
  2:'It costs 1 less mana to play for the rest of the run.',3:'Offering it (💀) gives 1 more mana for the rest of the run.',
  5:'When you cast it, you also draw a card. Permanent for this run.'};
 return'<p><b>'+lab+'</b></p>'+(D0[o]?'<p>'+D0[o]+'</p>':'')}
(function(){try{const tp=document.createElement('div');tp.id='kotip';document.body.appendChild(tp);let cur=null;
 const hide=()=>{cur=null;tp.classList.remove('on')};
 addEventListener('pointerover',e=>{const b=e.target.closest&&e.target.closest('.ko [data-k]');if(!b){if(cur)hide();return}if(b===cur)return;
  const[i,j]=b.dataset.k.split(':'),x=G&&G.kl&&G.kl[+i];if(!x||x.o[+j]==null){hide();return}
  cur=b;tp.innerHTML=koTip(x.o[+j],x.c);tp.classList.add('on');const R=b.getBoundingClientRect(),w=tp.offsetWidth,h=tp.offsetHeight,m=8;
  let y=R.top-h-10;if(y<m)y=Math.min(innerHeight-h-m,R.bottom+10);const xx=Math.min(Math.max(m,R.left+R.width/2-w/2),innerWidth-w-m);
  tp.style.left=Math.round(xx)+'px';tp.style.top=Math.round(y)+'px'},true);
 addEventListener('pointerdown',hide,true);addEventListener('scroll',hide,true);addEventListener('pointerleave',hide);
 new MutationObserver(()=>{if(cur&&!document.body.contains(cur))hide()}).observe(document.getElementById('app')||document.body,{childList:true,subtree:true})}catch(e){}})();
try{const st=document.createElement('style');st.id='pown';st.textContent=`
#kotip{position:fixed;left:0;top:0;z-index:510;width:250px;pointer-events:none;display:none;
 background:radial-gradient(ellipse at 30% 20%,#d6c39a33,#0000 45%),radial-gradient(ellipse at 78% 82%,#5a3d1a2e,#0000 50%),radial-gradient(ellipse at 50% 45%,#c2ab7d 0%,#ad9466 62%,#8c7349 100%);
 color:#1d150b;border:10px solid #5e4520;border-image:url(art/game/frames/c.jpg) 58 round;border-radius:6px;box-shadow:0 10px 26px #000d;font-family:var(--fb);text-shadow:none;
 padding:8px 12px;font-size:15px;line-height:1.4;text-align:left}
#kotip.on{display:block}#kotip p{margin:0 0 6px}#kotip p:last-child{margin:0}#kotip b{color:#5a1f0c}
html.ph #kotip{width:210px;font-size:12.5px}
.cd .nm i[style*="ff6b5a"]{color:#ff6b5a}
.cd.af .nm i[style*="ff6b5a"]{color:#a3170e!important}
`;document.body.appendChild(st)}catch(e){}
""".replace('__OWNTX__', _json.dumps(OWNTX, ensure_ascii=False))
_b3("showChars();\n</script>", _JSOWN + "showChars();\n</script>")
