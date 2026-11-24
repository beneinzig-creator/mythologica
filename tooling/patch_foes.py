# v120: the opponent rework. foes.js is the shared ability layer (F(), DK(), hooks); foes_<realm>.js rewrite
# every enemy card's rules and every opponent's deck around one theme. Injected last so nothing overrides it.
_FOE_FILES=['foes','foes_greek','foes_norse','foes_chinese','foes_egypt','foes_heaven']
import os as _os
_FOE_JS='\n'.join(open(S+f+'.js',encoding='utf-8').read() for f in _FOE_FILES if _os.path.exists(S+f+'.js'))
_b3("showChars();\n</script>", "/* ===== opponents (foes*.js) ===== */\n"+_FOE_JS+"\nshowChars();\n</script>")
