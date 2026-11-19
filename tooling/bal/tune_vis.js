/* visible enemy ramp: one shared table for every hero (Act I fights 1-4), no hidden per-hero or per-enemy corrections */
SCL[0]=[-4,0,0];SCL[1]=[-2,0,0];SCL[2]=[1,0,0];SCL[3]=[3,0,0];
CFA.ody={};CFA.odin={};CFA.wukong={};CFAE.ody={};CFAE.odin={};CFAE.wukong={};
/* elite and boss life */
{const E=n=>ELITES.find(x=>x.n.startsWith(n)),B=n=>BOSS.find(x=>x.n.startsWith(n));
E('Circe').l=13;E('Cattle').l=16;E('The Norns').l=10;E('Fáfnir').l=22;E('Erlang').l=17;E('Princess Iron Fan').l=18;
B('Hector').l=15;B('Scylla').l=16;B('Charybdis').l=25;B('Jörmungandr').l=14;B('The Wild Hunt').l=14;B('The Wild Hunt').sc=[0,-1,0];B('Hrungnir').l=22;B('The Six-Eared').l=12;B('The Bull Demon').l=27;B("The Buddha").l=33;
B('The Wild Hunt').d=ids('hhnd:3,hrdr:3,hwld:2,hmst,hhrn:2,hhbt');}
/* base life per enemy, fitted to the visible ramp (fight 1 ~33%, fights 2-4 ~28%) */
CHARS.odin.en[0].l=8;CHARS.odin.en[1].l=11;CHARS.odin.en[2].l=16;CHARS.odin.en[3].l=14;CHARS.odin.en[4].l=13;CHARS.odin.en[5].l=14;CHARS.ody.en[0].l=16;CHARS.ody.en[1].l=19;CHARS.ody.en[2].l=15;CHARS.ody.en[3].l=10;CHARS.ody.en[4].l=16;CHARS.ody.en[5].l=13;CHARS.wukong.en[0].l=14;CHARS.wukong.en[1].l=16;CHARS.wukong.en[3].l=12;CHARS.wukong.en[4].l=18;CHARS.wukong.en[5].l=15;
/* Heavenly Host: steadier deck (the Decree now only taxes army members that cost 2 or less) */
CHARS.wukong.en[2].d=ids('hsd:3,hhd:2,hgn,hnz,hpg:3,hbot:2');CHARS.wukong.en[2].l=11;
CHARS.wukong.en[2].l=12;CHARS.wukong.en[3].l=13;CHARS.wukong.en[4].l=19;
/* Act II: per hero:realm life adjustment (each realm's enemies were tuned for their own hero; target ~30% in the first Act II fight) */
Object.assign(XADJ,{'odin:ody':[4,1,0],'odin:thoth':[7,0,0],'odin:wukong':[8,0,0],'ody:odin':[13,-1,0],'ody:thoth':[0,0,0],'ody:wukong':[2,0,0],
 'thoth:odin':[6,0,0],'thoth:ody':[7,0,0],'thoth:wukong':[7,0,0],'wukong:odin':[8,0,0],'wukong:ody':[11,0,0],'wukong:thoth':[14,0,0]});
