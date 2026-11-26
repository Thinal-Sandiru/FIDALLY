/* ─────────────────────────────────────────────────────────────
   FIDALLY Splash: Simple, creative full-viewport wake-up
   - Edge-to-edge live voice waveform horizon
   - Expanding acoustic ripples + animated FIDALLY model
   - Clean upward curtain reveal
   ───────────────────────────────────────────────────────────── */
(() => {
  const splash = document.getElementById("splash");
  if (!splash) return;

  const waveCanvas = document.getElementById("splashWave");
  const ctx =
    waveCanvas && waveCanvas.getContext ? waveCanvas.getContext("2d") : null;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MIN_SHOW = reduce ? 450 : 2800;
  const start = performance.now();

  let W = 0,
    H = 0,
    dpr = 1;
  const resize = () => {
    if (!ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    waveCanvas.width = Math.round(W * dpr);
    waveCanvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  requestAnimationFrame(() => {
    splash.classList.add("is-awake");
  });

  // Smooth full-width voice wave ribbons across the viewport
  const waves = [
    { amp: 32, freq: 0.0052, speed: 2.1, color: "rgba(47, 107, 255, 0.3)", width: 2 },
    { amp: 22, freq: 0.0082, speed: -1.6, color: "rgba(90, 162, 255, 0.22)", width: 1.5 },
    { amp: 13, freq: 0.0115, speed: 2.7, color: "rgba(232, 238, 255, 0.1)", width: 1 },
  ];

  let left = false;
  function tick(now) {
    if (left && splash.classList.contains("is-gone")) return;

    const elapsed = Math.max(0, now - start);
    const progress = Math.min(1, elapsed / MIN_SHOW);

    if (ctx && !reduce) {
      ctx.clearRect(0, 0, W, H);
      const t = elapsed / 1000;
      const midY = H * 0.48;
      const energy = 0.25 + 0.75 * Math.sin(progress * Math.PI * 0.85);

      for (const wv of waves) {
        ctx.beginPath();
        ctx.strokeStyle = wv.color;
        ctx.lineWidth = wv.width;
        for (let x = 0; x <= W; x += 12) {
          const env = Math.sin((x / W) * Math.PI);
          const y =
            midY +
            Math.sin(x * wv.freq + t * wv.speed) * wv.amp * env * energy +
            Math.cos(x * wv.freq * 1.6 - t * wv.speed * 0.8) *
              (wv.amp * 0.35) *
              env *
              energy;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    if (!reduce && !splash.classList.contains("is-gone")) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);

  const leave = () => {
    if (left) return;
    left = true;
    splash.classList.add("is-done");
    setTimeout(() => {
      splash.classList.add("is-gone");
      window.removeEventListener("resize", resize);
    }, 700);
  };

  const ready = () =>
    setTimeout(leave, Math.max(0, MIN_SHOW - (performance.now() - start)));
  if (document.readyState === "complete") ready();
  else window.addEventListener("load", ready, { once: true });

  setTimeout(leave, 5000);
})();
