// v123 (patch69): hover pop-up placement check. Runs IN THE BROWSER on whatever screen is showing:
//   await (await fetch('tooling/ut55_hover.js')).text().then(eval)   // then: await HOVER55()
// Hovers every visible card (and its offering coin / stance button, if any), waits for #kdock to be placed,
// and checks that the pop-up never overlaps the card it describes, stays on screen, and sits directly above
// the card whenever there is room above it. Returns {n, above, fails:[...]}.
window.HOVER55 = async function (opts) {
  opts = opts || {};
  const dk = document.getElementById('kdock');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const vis = r => r.width > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
  const cards = [...document.querySelectorAll('.cd')].filter(c => !c.closest('#insp') && vis(c.getBoundingClientRect()) && getComputedStyle(c).visibility != 'hidden');
  const out = { n: 0, above: 0, fails: [] };
  const fire = el => {
    const r = el.getBoundingClientRect();
    el.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }));
  };
  for (const cd of cards) {
    const targets = [cd, ...cd.querySelectorAll('.ob,.sb')].filter(e => vis(e.getBoundingClientRect()));
    for (const t of targets) {
      document.body.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));  // hide
      await sleep(20);
      fire(t);
      let ok = false;
      for (let i = 0; i < 60; i++) { await sleep(25); if (dk.classList.contains('vis')) { ok = true; break } }
      if (!ok) continue;  // card without pop-up text
      await sleep(opts.settle || 80);
      const R = cd.getBoundingClientRect(), K = dk.getBoundingClientRect();
      const name = (cd.querySelector('.nm b') || cd).textContent.trim().slice(0, 28) + (t === cd ? '' : ' [' + t.className + ']');
      const ox = Math.min(K.right, R.right) - Math.max(K.left, R.left), oy = Math.min(K.bottom, R.bottom) - Math.max(K.top, R.top);
      out.n++;
      if (ox > 0 && oy > 0) out.fails.push(name + ': pop-up overlaps its card by ' + Math.round(ox) + 'x' + Math.round(oy));
      if (K.left < 0 || K.top < 0 || K.right > innerWidth + 0.5 || K.bottom > innerHeight + 0.5) out.fails.push(name + ': pop-up off screen');
      const roomAbove = R.top - 10 - K.height >= 8;
      const isAbove = K.bottom <= R.top + 0.5 && Math.abs((K.left + K.right) / 2 - (R.left + R.right) / 2) < K.width / 2;
      if (isAbove) out.above++;
      else if (roomAbove && (R.left + R.right) / 2 - K.width / 2 >= -K.width / 2) out.fails.push(name + ': room above the card, but the pop-up is not above it');
    }
  }
  document.body.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
  return out;
};
