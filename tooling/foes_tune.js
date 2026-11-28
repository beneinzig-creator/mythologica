/* ===== difficulty tuning (life totals), from the bal/foes matrix ===== */
[['The Lotus-Eaters',14],['The Shades of Hades',13],["Fenrir's Brood",7],['The Norns',12],['Jörmungandr, the World Serpent',17],
 ['The Spider Cave',12],['The Gold and Silver Horn Kings',22],['The Heavenly Host',10],['The Six-Eared Macaque',10],
 ['The Crocodiles of Sobek',25],['The Scorpions of Serket',24],['The Watchers',13],['The Jotnar',9],["Loki's Court",18],['The White Bone Spirit',25],['The Jackals of Anubis',19],['The Priests of Heka',14],['Cattle of the Sun',18],
 ['Polyphemus',12],['The Cicones',10],['Princess Iron Fan',11],['Ammit, the Devourer',15],['The Prophets of Baal',28],['Lilith',8],['Asmodeus',17],['Beelzebub, Lord of the Flies',24],['Circe, Witch of Aeaea',15],['The Pairikas',17],['Azazel, the Scapegoat',16],["Mastema's Spirits",15]

 ,['The Buddha\'s Palm',28]].forEach(([n,l])=>DK(n,{l}));
DK('The Wild Hunt',{l:11});
/* difficulty dial-back (playtest): every opponent has 10% less life */
{const L=[];for(const h of Object.keys(CHARS))L.push(...(CHARS[h].en||[]));if(typeof ELITES!='undefined')L.push(...ELITES);if(typeof BOSS!='undefined')L.push(...BOSS);if(typeof A3!='undefined'&&A3.en)L.push(...A3.en);
 for(const x of new Set(L))if(x&&x.l)x.l=Math.max(6,Math.round(x.l*0.9))}
/* every enemy deck has an answer to flying (Ben's rule): the four decks that had no flyer, Range member or removal get Range on one card (2026-11-27) */
['embp','jguard','bgrd','xlegs'].forEach(id=>{if(D[id]&&!D[id][5].includes('a'))D[id][5]+='a'});
