(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];

  /* confetti */
  const colors = ['#0a9ab0', '#5b5bf0', '#ffb703', '#ff5d8f', '#3fd0e4', '#8ac926'];
  function confetti(x, y, n = 28) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 140;
      c.style.cssText = `left:${x}px;top:${y}px;background:${colors[i % colors.length]};` +
        `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 80}px;--r:${Math.random() * 720 - 360}deg;` +
        `border-radius:${Math.random() > .5 ? '50%' : '2px'}`;
      document.body.appendChild(c);
      c.addEventListener('animationend', () => c.remove());
    }
  }

  /* hero: click the period or the wordmark */
  $('.word').addEventListener('click', e => confetti(e.clientX, e.clientY, 36));

  /* rotating taglines */
  const lines = [
    'Innovating the homebrew scene.',
    'Teaching old consoles new tricks.',
    'Fixing the Wii, one patch at a time.',
    'Your GameCube controller says hi.',
    'Solving mysteries nobody asked about.',
    'Now with 100% more Gecko codes.',
    'Plug in. Patch up. Play on.'
  ];
  let li = 0;
  const lede = $('#lede');
  lede.addEventListener('click', e => {
    li = (li + 1) % lines.length;
    lede.classList.remove('swap'); void lede.offsetWidth;
    lede.textContent = lines[li];
    lede.classList.add('swap');
    confetti(e.clientX, e.clientY, 10);
  });

  /* surprise me: jump to a random card and wiggle it */
  $('#surprise').addEventListener('click', () => {
    const cards = $$('.card');
    const c = cards[Math.floor(Math.random() * cards.length)];
    c.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    c.classList.remove('wiggle'); void c.offsetWidth;
    setTimeout(() => {
      c.classList.add('wiggle');
      const r = c.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + 20, 22);
    }, reduce ? 0 : 500);
  });

  /* scroll reveal with stagger */
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 });
    $$('.grid').forEach(g => $$('.card', g).forEach((c, i) => {
      c.style.setProperty('--d', (i % 4) * 70 + 'ms');
      c.classList.add('reveal');
      io.observe(c);
    }));
  }

  /* sparkle trail (mouse only) */
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    let last = 0;
    addEventListener('pointermove', e => {
      const t = performance.now();
      if (t - last < 55) return;
      last = t;
      const s = document.createElement('i');
      s.className = 'spark';
      s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;color:${colors[Math.floor(Math.random() * colors.length)]};` +
        `--x:${Math.random() * 30 - 15}px;font-size:${8 + Math.random() * 8}px`;
      s.textContent = '✦';
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }, { passive: true });
  }

  /* footer quips */
  const quips = [
    'Made with questionable amounts of caffeine.',
    'No Wiis were harmed. Some were bricked. Briefly.',
    'Ask me about the Wii. Please. Anyone.',
    'Try the Konami code. You know the one.',
    'This footer is clickable. Probably a mistake.',
    'Powered by spite and Gecko codes.'
  ];
  let qi = 0;
  $('#quip').addEventListener('click', () => { qi = (qi + 1) % quips.length; $('#quip').textContent = quips[qi]; });

  /* konami: rainbow party */
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  addEventListener('keydown', e => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === code[pos] ? pos + 1 : (k === code[0] ? 1 : 0);
    if (pos === code.length) {
      pos = 0;
      document.documentElement.classList.toggle('party');
      confetti(innerWidth / 2, innerHeight / 3, 80);
    }
  });
})();
