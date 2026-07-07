/* =========================================================
   CASE STUDIES CAROUSEL
========================================================= */

/* ─────────────────────────────────────────────────────────
   APPS DATA — single source of truth for the carousel.
   To add a new app, append one object to this array. That's it:
   the card, its index number, and a dot are generated automatically.

   badges: array of { label, type } — type is "platform" or "social".
   desc:   one short sentence (keep it tight — tiles stay compact).
   ───────────────────────────────────────────────────────── */
const apps = [
  {
    name: 'Scentique',
    tagline: 'Which perfume do I wear tonight?',
    nowrapTagline: true,
    badges: [{ label: 'Android', type: 'platform' }, { label: 'Consumer App', type: 'platform' }],
    desc: 'Scan any perfume to instantly know which occasions it suits best — no expertise needed.',
    playUrl: 'https://play.google.com/store/apps/details?id=com.scentique.scentique'
  },
  {
    name: 'PlantLife AI',
    tagline: 'Is my plant dying — can I fix it?',
    badges: [{ label: 'Android', type: 'platform' }, { label: 'Free · Society First', type: 'social' }],
    desc: 'Point your phone at any plant to identify it, spot disease, and get home remedies. Free, always.',
    playUrl: 'https://play.google.com/store/apps/details?id=com.nani.plantlife_ai'
  },
  {
    name: 'AutoScroll',
    tagline: 'Still scrolling with your thumb?',
    badges: [{ label: 'Android', type: 'platform' }, { label: 'Productivity', type: 'platform' }],
    desc: 'Hands-free automatic scrolling at your own pace — set it, sit back, and read.',
    playUrl: 'https://play.google.com/store/apps/details?id=com.autoscroll.scrollmind'
  },
  {
    name: 'SharePark',
    tagline: 'Where do I park?',
    badges: [{ label: 'Android', type: 'platform' }, { label: 'Community', type: 'social' }],
    desc: 'Find open parking nearby and share your own empty spot with others.',
    playUrl: 'https://play.google.com/store/apps/details?id=com.sharepark.mobile'
  },
  {
    name: 'WakeMust',
    tagline: 'Alarms that let you fall back asleep?',
    nowrapTagline: true,
    badges: [{ label: 'Android', type: 'platform' }, { label: 'Consumer App', type: 'platform' }],
    desc: "A smart alarm that won't quit until you're genuinely awake — challenges that force you up.",
    playUrl: 'https://play.google.com/store/apps/details?id=com.wakemust'
  }
];

(function casesCarousel() {
  const track = document.getElementById('casesTrack');
  const dotsWrap = document.getElementById('casesDots');
  if (!track || !dotsWrap) return;

  /* Escape user-facing copy before injecting as HTML */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Render a card per app from the data array */
  track.innerHTML = apps.map((app, i) => {
    const num = String(i + 1).padStart(2, '0');
    const badges = app.badges.map((b) =>
      `<span class="case-badge ${b.type}">${esc(b.label)}</span>`).join('');
    return `
      <div class="case-card">
        <span class="case-index" aria-hidden="true">${num}</span>
        <div class="case-badges">${badges}</div>
        <div class="case-name">${esc(app.name)}</div>
        <div class="case-tagline">"${esc(app.tagline)}"</div>
        <p class="case-desc">${esc(app.desc)}</p>
        <div class="store-buttons">
          <a href="${esc(app.playUrl)}" target="_blank" rel="noopener" aria-label="Get ${esc(app.name)} on Google Play">
            <img src="assets/PlayStore.png" alt="Get it on Google Play">
          </a>
        </div>
      </div>`;
  }).join('');

  const cards = Array.from(track.querySelectorAll('.case-card'));
  if (!cards.length) return;

  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  /* Build one dot per card */
  const dots = cards.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to app ${i + 1}`);
    dot.addEventListener('click', () => scrollToCard(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function cardStep() {
    return cards[0].offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
  }

  function scrollToCard(i) {
    track.scrollTo({ left: cardStep() * i, behavior: 'smooth' });
  }

  function activeIndex() {
    return Math.round(track.scrollLeft / cardStep());
  }

  function sync() {
    const maxLeft = track.scrollWidth - track.clientWidth - 2;
    const atEnd = track.scrollLeft >= maxLeft;
    const idx = atEnd ? cards.length - 1 : activeIndex();
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = atEnd;
  }

  /* dot clicks restart the autoplay timer so it doesn't jump immediately */
  dots.forEach((dot, i) => dot.addEventListener('click', () => { scrollToCard(i); play(); }));
  if (prevBtn) prevBtn.addEventListener('click', () => { scrollToCard(Math.max(0, activeIndex() - 1)); play(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { scrollToCard(Math.min(cards.length - 1, activeIndex() + 1)); play(); });

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { sync(); ticking = false; });
  }, { passive: true });

  window.addEventListener('resize', sync, { passive: true });

  /* ─── Autoplay: advance every 5s, loop back at the end ─── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;

  function advance() {
    const maxLeft = track.scrollWidth - track.clientWidth - 2;
    if (track.scrollLeft >= maxLeft) scrollToCard(0);
    else scrollToCard(activeIndex() + 1);
  }
  function play() {
    stop();
    if (reduceMotion || cards.length <= 1) return;
    timer = setInterval(advance, 5000);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  /* Pause on hover / focus / touch; resume after */
  const carousel = track.closest('.cases-carousel') || track;
  ['mouseenter', 'focusin', 'touchstart'].forEach((ev) =>
    carousel.addEventListener(ev, stop, { passive: true }));
  ['mouseleave', 'focusout'].forEach((ev) =>
    carousel.addEventListener(ev, play, { passive: true }));
  /* Pause when the tab is hidden to save resources */
  document.addEventListener('visibilitychange', () =>
    document.hidden ? stop() : play());

  sync();
  play();
})();
