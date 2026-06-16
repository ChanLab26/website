/* neural.js — Intracranial electrode network canvas animation */

(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes, raf;
  const MAX_DIST  = 180;
  const NODE_COUNT_DENSITY = 14000; // lower = more nodes

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    initNodes();
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function initNodes() {
    const count = Math.max(18, Math.floor((W * H) / NODE_COUNT_DENSITY));
    nodes = Array.from({ length: count }, () => ({
      x:    rand(0, W),
      y:    rand(0, H),
      vx:   rand(-0.25, 0.25),
      vy:   rand(-0.18, 0.18),
      r:    rand(1.5, 3.5),
      phase: rand(0, Math.PI * 2),  /* for oscillation pulse */
      freq:  rand(0.006, 0.014),
      amp:   rand(0.3, 0.7),
    }));
  }

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t++;

    /* Update positions */
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -30)  n.x = W + 30;
      if (n.x > W+30) n.x = -30;
      if (n.y < -30)  n.y = H + 30;
      if (n.y > H+30) n.y = -30;
    });

    /* Draw connections */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d > MAX_DIST) continue;

        /* Oscillating alpha — like coherence fluctuation */
        const pulse = Math.sin(t * a.freq + a.phase) * a.amp;
        const base  = (1 - d / MAX_DIST);
        const alpha = Math.max(0, base * (0.18 + pulse * 0.18));

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(100,180,255,${alpha.toFixed(3)})`;
        ctx.lineWidth   = base * 1.2;
        ctx.stroke();
      }
    }

    /* Draw nodes (electrodes) */
    nodes.forEach(n => {
      const pulse  = Math.sin(t * n.freq * 1.5 + n.phase);
      const glow   = (n.r + 1) + pulse * 1.4;
      const bright = 0.5 + pulse * 0.35;

      /* Outer glow ring */
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow * 3);
      grad.addColorStop(0, `rgba(100,180,255,${(bright * 0.3).toFixed(3)})`);
      grad.addColorStop(1, 'rgba(100,180,255,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, glow * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      /* Core */
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,220,255,${(0.55 + pulse * 0.35).toFixed(3)})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  /* Boot */
  resize();
  draw();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  });

  /* Pause when tab hidden (battery/perf) */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      draw();
    }
  });
})();
