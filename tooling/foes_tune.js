/* ===== difficulty tuning (life totals), from the bal/foes matrix ===== */
[['The Lotus-Eaters',14],['The Shades of Hades',13],["Fenrir's Brood",7],['The Norns',12],['Jörmungandr, the World Serpent',12],
 ['The Spider Cave',12],['The Gold and Silver Horn Kings',22],['The Heavenly Host',10],['The Six-Eared Macaque',10],
 ['The Crocodiles of Sobek',16],['The Jackals of Anubis',19],['The Priests of Heka',14],['Cattle of the Sun',18],
 ['Polyphemus',12],['The Cicones',10],['Princess Iron Fan',11],['Ammit, the Devourer',15],['The Prophets of Baal',25],['Lilith',10],['Asmodeus',17],['Beelzebub, Lord of the Flies',21]

 ,['The Buddha\'s Palm',28]].forEach(([n,l])=>DK(n,{l}));
DK('The Wild Hunt',{l:13});
/* difficulty dial-back (playtest): every opponent has 10% less life */
{const L=[];for(const h of Object.keys(CHARS))L.push(...(CHARS[h].en||[]));if(typeof ELITES!='undefined')L.push(...ELITES);if(typeof BOSS!='undefined')L.push(...BOSS);if(typeof A3!='undefined'&&A3.en)L.push(...A3.en);
 for(const x of new Set(L))if(x&&x.l)x.l=Math.max(6,Math.round(x.l*0.9))}
