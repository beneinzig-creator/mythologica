# patch_juice: combat feel (scaled screen shake, hit-stop and slow motion on big hits and killing blows, bigger damage
# numbers, impact sparks) and the animated opponent portrait at the top left of the fight screen, which gets angry when
# hurt, laughs when it hurts you, and weeps and crumbles when it loses. Code lives in juice.js (visual only).
_b3("\nshowChars();\n</script>", "\n/* ===== combat feel + opponent portrait (juice.js) ===== */\n"+open(S+'juice.js',encoding='utf-8').read()+"\nshowChars();\n</script>")
