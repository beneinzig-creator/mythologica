# Draft offers get a real cost spread: every pick shows at least one card costing 2 or less,
# and never more than one card costing 4+. Swaps keep the "at least one army member" rule.
out=rep(out,"off.filter(x=>D[x][2]=='C').forEach(x=>{G.cs=",
"""{const dw=(ok,j)=>{const keepC=G.ch!='wukong'&&D[off[j]][2]=='C'&&off.filter(x=>D[x][2]=='C').length==1,cs=POOL.filter(x=>!off.includes(x)&&ok(D[x][1])&&(!keepC||D[x][2]=='C')),tot=cs.reduce((n,x)=>n+wt(x),0);if(!cs.length)return;let r=Math.random()*tot,id=cs[cs.length-1];for(const x of cs){r-=wt(x);if(r<0){id=x;break}}off[j]=id},hi=()=>off.reduce((b,x,k)=>D[x][1]>D[off[b]][1]?k:b,0);
if(!off.some(x=>D[x][1]<=2))dw(c=>c<=2,hi());
while(off.filter(x=>D[x][1]>=4).length>1){const j=hi(),b=off.slice();dw(c=>c<=3,j);if(off[j]==b[j])break}}
off.filter(x=>D[x][2]=='C').forEach(x=>{G.cs=""")
