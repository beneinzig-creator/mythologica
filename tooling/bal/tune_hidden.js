/* ARCHIVE ONLY, not built: the earlier hidden-correction tuning (per-hero CFA/CFAE tables and a per-enemy LATE
   adjustment). Kept for reference; it needs the LATE hook that was removed from decks.js. */
/* later-fight per-enemy adjustments (Act I regular fights 2-4) */
Object.assign(LATE,{"The Lotus-Eaters":[-1,0,0],"The Sirens":[2,0,0],"Polyphemus":[-1,0,0],"The Shades of Hades":[1,0,0],"The Phaeacians":[-1,0,0],"The Cicones":[-2,0,0],
"The Jotnar":[-2,0,0],"The Dwarven Forge":[2,0,0],"Muspelheim":[-2,0,0],"Hel's Legion":[2,0,0],"Loki's Court":[-2,0,0],
"The Spider Cave":[1,0,0],"The Gold and Silver Horn Kings":[1,0,0],"The Heavenly Host":[-1,0,0],"Red Boy":[1,0,0]});
/* per-hero fight curve (regular fights) and elite scaling by fight */
CFA.ody[1]=[-5,-1,0];CFA.odin[1]=[-6,-1,0];CFA.odin[2]=[-7,-1,-2];CFA.odin[3]=[-7,-3,-2];CFA.wukong[1]=[-8,-1,0];CFA.wukong[3]=[-11,-3,-1];
CFAE.ody={1:[-3,-2,0],2:[-5,-2,-1],3:[-7,-4,-2]};CFAE.odin={1:[-5,-1,0],2:[-7,-1,-2],3:[-9,-3,-2]};CFAE.wukong={1:[-2,0,0],2:[-5,-1,-1],3:[-6,-2,-1]};
/* elite and boss life */
{const E=n=>ELITES.find(x=>x.n.startsWith(n)),B=n=>BOSS.find(x=>x.n.startsWith(n));
E('Circe').l=14;E('Cattle').l=14;E('The Norns').l=9;E('Fáfnir').l=18;E('Erlang').l=13;E('Princess Iron Fan').l=11;
B('Hector').l=15;B('Scylla').l=17;B('Charybdis').l=23;B('Jörmungandr').l=14;B('The Wild Hunt').l=14;B('The Wild Hunt').sc=[0,-1,0];B('Hrungnir').l=24;B('The Six-Eared').l=12;B('The Bull Demon').l=27;B("The Buddha").l=33;
B('The Wild Hunt').d=ids('hhnd:3,hrdr:3,hwld:2,hmst,hhrn:2,hhbt');}
