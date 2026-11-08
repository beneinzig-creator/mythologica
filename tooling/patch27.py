# ===== v60: abilities for vanilla Offering creatures =====
_b3("D.sphinx=['Sphinx of Thebes',3,'C',2,4,'o','',","D.sphinx=['Sphinx of Thebes',3,'C',2,4,'o','When it dies or is offered, return a random other army member from your graveyard to your hand.',")
_b3("D.mino=['Minotaur of Crete',4,'C',4,3,'o','',","D.mino=['Minotaur of Crete',4,'C',4,3,'o','When it dies or is offered, deal 3 damage to the opponent.',")
_b3("D.tbull=['Bull of Poseidon',3,'C',3,3,'o','',","D.tbull=['Bull of Poseidon',3,'C',3,3,'o','When it dies or is offered, draw a card.',")
_b3("D.eagle=['Eagle of Zeus',4,'C',3,2,'fo','',","D.eagle=['Eagle of Zeus',4,'C',3,2,'fo','When it enters, draw a card. When offered, gain 2 extra mana.',")
_b3("const DEATH={","const sphFx=(s,c)=>{const g=s.gy.filter(x=>x!==c&&isC(x)&&x.id!='sold');if(g.length){const x=g[Math.random()*g.length|0];s.gy.splice(s.gy.indexOf(x),1);x.sick=1;s.hand.push(x);log('The Sphinx returns '+D[x.id][0]+' to its owner\\'s hand.')}};\nconst DEATH={tbull:{p:2,fn:s=>draw(s,1)},mino:{p:3,fn:(s,o)=>{o.life-=3;log('The Minotaur gores '+(o==G.p?'you':o.nm)+' for 3.')}},sphinx:{p:3,fn:(s,o,c)=>sphFx(s,c)},")
_b3("if(c.id=='thanat')cassFx(s,o,5);","if(c.id=='thanat')cassFx(s,o,5);if(c.id=='tbull')draw(s,1);if(c.id=='mino'){o.life-=3;log('The Minotaur gores '+(o==G.p?'you':o.nm)+' for 3.')}if(c.id=='sphinx')sphFx(s,c);if(c.id=='eagle'){s.mana+=2;log('The Eagle grants 2 extra mana.')}")
_b3("const ETB={","const ETB={eagle:s=>draw(s,1),")
_b3("const ETBV={","const ETBV={eagle:1.5,")
