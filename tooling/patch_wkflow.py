# patch_wkflow: Sun Wukong "flow" pass (Nov 2026). wukong_flow.js is injected after the opponents block (foes*.js and
# wukong_quick.js), so its rules sit on top of every earlier Wukong change. See the file header for the sim notes.
_b3("\nshowChars();\n</script>", "\n/* ===== Wukong flow (wukong_flow.js) ===== */\n"+open(S+'wukong_flow.js',encoding='utf-8').read()+"\nshowChars();\n</script>")
