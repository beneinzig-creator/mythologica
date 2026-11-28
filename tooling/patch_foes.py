# v120: the opponent rework. foes.js is the shared ability layer (F(), DK(), hooks); foes_<realm>.js rewrite
# every enemy card's rules and every opponent's deck around one theme. Injected last so nothing overrides it.
_FOE_FILES=['foes','foes_greek','foes_norse','foes_chinese','foes_egypt','foes_heaven','foes_tune','foes_clarity','heroes_touch','wukong_quick','hero_flow']
import os as _os
_FOE_JS='\n'.join(open(S+f+'.js',encoding='utf-8').read() for f in _FOE_FILES if _os.path.exists(S+f+'.js'))
_b3("showChars();\n</script>", "/* ===== opponents (foes*.js) ===== */\n"+_FOE_JS+"\nshowChars();\n</script>")
# the Iron Fan's old blow-back (already narrowed to 3+ by patch_bal) is replaced by foes_chinese.js (blown away by weight)
_b3(" if(e.bf.some(x=>x.id=='ifan')){const L=cr(p).filter(x=>D[x.id][1]>=3).sort((a,b)=>D[b.id][1]-D[a.id][1]||pwr(b)-pwr(a));if(L.length){log('The Iron Fan gusts: '+D[L[0].id][0]+' is blown back to your hand.');bounce(L[0])}}", " /* ifan: foes_chinese.js */")
