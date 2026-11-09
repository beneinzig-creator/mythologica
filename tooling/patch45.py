# v102: painted hero portraits and a painted background on the hero-select screen.
# Images load by relative path from art/game/home/ (made from art/home/ by the art pipeline),
# so they work from any static host. If an image is missing or fails to load, the emoji
# shows instead: the portrait <img> sits on top of the emoji and removes itself on error,
# and the background falls back to the normal stone background underneath.

_b3('<span class="hic">${c.ic}</span>',
    '<span class="hic"><span class="hem">${c.ic}</span><img class="hpic" src="art/game/home/${k}.jpg" alt="" draggable="false" onerror="this.remove()"></span>')

# Mark the hero-select screen so the background applies only there.
_b3('<div class="dft" style="gap:20px;overflow-y:auto',
    '<div class="dft hsel" style="gap:20px;overflow-y:auto')

# The portrait is a round medallion. The emoji keeps its old size, so a failed load still looks as before.
_b3('.hic{font-size:52px;line-height:1.1}',
    '.hic{font-size:52px;line-height:1.1;position:relative;display:grid;place-items:center;width:128px;height:128px}'
    '.hic .hpic{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%;'
    'border:2px solid #c9a24c;box-shadow:0 0 0 4px #0009,0 8px 22px #000c;-webkit-user-drag:none;user-select:none}'
    '.htile.on .hic .hpic{border-color:var(--gold);box-shadow:0 0 0 4px #0009,0 8px 22px #000c,0 0 22px var(--gl)}'
    # Painted background: night sea with a Greek temple, the Norse world tree and Chinese peaks.
    # The dark wash keeps the title and text readable; the stone background shows if the image fails.
    '.dft.hsel{background:linear-gradient(#0b1820cc,#0b182066 35%,#0b182088 65%,#0b1820ee),'
    'url(art/game/home/background.jpg) center 40%/cover no-repeat}')
_b3('.hic{font-size:34px}', '.hic{font-size:34px;width:84px;height:84px}')
_b3('html.ph .hic{font-size:24px}', 'html.ph .hic{font-size:24px;width:52px;height:52px}')
