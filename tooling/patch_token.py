# patch_token: a player token on the map (Ben, Nov 2026).
# - Each hero has a painted game piece (art/game/icons/token/<hero>.png): Odysseus in bronze and marble with helmet and
#   spear, Odin carved in oak and bone with hat, spear and raven, Sun Wukong in jade and lacquer with staff and circlet,
#   Thoth in black basalt and gold with an ibis head. It replaces the old "you are here" marker on the node you stand on
#   (the starting node at first), on every map: the hero's own, an Act II realm's and Act III's.
# - It stands on the node's upper-right rim with a soft shadow, so the node's medallion stays visible.
# - Picking the next node, the piece hops there along the line between the two nodes (0.75 s, lifting a little in the
#   middle and settling with a small squash) before the next screen opens. It moves inside the map's own coordinates,
#   so it follows the full-screen map's zoom and the phone layout. With reduced animations (settings panel, or the
#   system setting) it skips the hop.
# - The loader (patch_loader) preloads the piece, and if it ever failed to load it would leave a blank, never an emoji.
_b3("${here?'<em>⛵</em>':''}",
    "${here?`<span class=\"ptokw\"><i class=\"ptsh\"></i><img class=\"ptok\" src=\"art/game/icons/token/${PTOK()}.png\" alt=\"\" draggable=\"false\" onerror=\"ldErr(this)\"></span>`:''}")
_b3('function goNode(id){',
    "function PTOK(){const h=typeof CH!='undefined'?CH:'ody';return ({ody:1,odin:1,wukong:1,thoth:1})[h]?h:'ody'}"
    'function goNode(id){')
_JSTK = r"""
/* ===== patch_token: the player's piece hops between map nodes ===== */
try{if(typeof ldPre=='function')ldPre(['ody','odin','wukong','thoth'].map(h=>'art/game/icons/token/'+h+'.png'))}catch(e){}
{const g0=goNode;let busy=false;
 goNode=function(id){const self=this,args=arguments;
  try{if(busy)return;const W=G&&G.web,cu=W&&W.nodes[G.pos];
   const ok=G.phase=='map'&&cu&&id!==G.pos&&(cu.adj.includes(id)||(id==0&&G.pos==0&&G.fi>=FLOORS&&!G.spent));
   if(!ok||(typeof RMO=='function'&&RMO()))return g0.apply(self,args);
   const wr=document.querySelector('.wn.cur .ptokw'),to=document.querySelector('.wn[data-b="go'+id+'"]'),cn=wr&&wr.closest('.wn');
   if(!wr||!to||!cn)return g0.apply(self,args);
   const a=cn.getBoundingClientRect(),b=to.getBoundingClientRect(),k=a.width/(cn.offsetWidth||54)||1;
   const dx=(b.left+b.width/2-a.left-a.width/2)/k,dy=(b.top+b.height/2-a.top-a.height/2)/k;
   if(!isFinite(dx)||!isFinite(dy))return g0.apply(self,args);
   busy=true;cn.classList.add('ptmov');const im=wr.querySelector('.ptok'),sh=wr.querySelector('.ptsh'),D=760,E='cubic-bezier(.42,0,.32,1)';
   const lift=Math.min(46,22+Math.hypot(dx,dy)*.08);
   const A1=wr.animate([{transform:'translate(0,0)'},{transform:`translate(${dx}px,${dy}px)`}],{duration:D,easing:E,fill:'forwards'});
   im.animate([{transform:'translateY(0) scale(1)'},{transform:`translateY(${-lift}px) scale(1.08)`,offset:.5},{transform:'translateY(0) scaleX(1.08) scaleY(.9)',offset:.9},{transform:'translateY(0) scale(1)'}],{duration:D+120,easing:'ease-in-out',fill:'forwards'});
   sh&&sh.animate([{transform:'scale(1)',opacity:.85},{transform:'scale(.55)',opacity:.35,offset:.5},{transform:'scale(1.1)',opacity:.9,offset:.9},{transform:'scale(1)',opacity:.85}],{duration:D+120,easing:'ease-in-out',fill:'forwards'});
   let done=false;const fin=()=>{if(done)return;done=true;busy=false;try{cn.classList.remove('ptmov')}catch(e){}g0.apply(self,args)};
   setTimeout(fin,D+160);setTimeout(fin,2500)
  }catch(e){busy=false;return g0.apply(self,args)}}}
"""
_CSSTK = (
    '.wn .ptokw{position:absolute;left:24px;bottom:20px;width:58px;height:90px;pointer-events:none;z-index:7;display:block}'
    '.wn .ptok{position:absolute;left:0;bottom:0;width:100%;height:100%;object-fit:contain;object-position:50% 100%;transform-origin:50% 100%;'
    'filter:drop-shadow(0 2px 2px #000c) drop-shadow(0 0 6px #0007);-webkit-user-drag:none}'
    '.wn .ptsh{position:absolute;left:12%;right:12%;bottom:-4px;height:10px;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,#000c,#0000 70%);transform-origin:50% 50%}'
    '.wn.ptmov{z-index:40!important}'
    # the phone map is drawn very small, so the piece is half as large again there
    'html.ph .wn .ptokw{left:18px;bottom:14px;width:87px;height:135px}'
    '.wn.cur .mi{position:relative}'
    # the node you stand on is a disabled button, which the map dims; dim only its medallion, not the piece
    '.wn.cur:disabled{opacity:1!important}.wn.cur:disabled>.mi{opacity:.62}'
)
# the hop and the preload go at the very end of the script, after every other wrapper of goNode
_b3('\nshowChars();\n</script>', '\n' + _JSTK + '\nshowChars();\n</script>')
_b3('.dft{position:absolute;inset:0;display:flex;', _CSSTK + '.dft{position:absolute;inset:0;display:flex;')
