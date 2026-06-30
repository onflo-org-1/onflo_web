/* =========================================================
   NAVBAR + ACTIVE SECTION HIGHLIGHT
========================================================= */

const nav = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

/* =========================================================
   MOBILE MENU
========================================================= */

const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileLinks = document.querySelectorAll(
  '#mobileOverlay a[href^="#"]'
);

/* Open menu */
function openMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');

  mobileOverlay.classList.add('open');

  /* Keep navbar above overlay */
  nav.classList.add('menu-open');

  document.body.style.overflow = 'hidden';
}

/* Close menu */
function closeMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');

  mobileOverlay.classList.remove('open');

  nav.classList.remove('menu-open');

  document.body.style.overflow = '';
}

/* Toggle menu */
function toggleMenu() {
  if (mobileOverlay.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
}

/* Hamburger click */
hamburger?.addEventListener('click', toggleMenu);

/* Close menu after clicking a mobile link */
mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* Close menu on ESC */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeMenu();
  }
});

/* =========================================================
   SCROLL EFFECTS
========================================================= */

window.addEventListener(
  'scroll',
  () => {
    /* Navbar shadow on scroll */
    nav.classList.toggle('scrolled', window.scrollY > 10);

    /* Active navigation link */
    let current = '';

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 130) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  },
  { passive: true }
);

/* =========================================================
   FADE-IN ANIMATIONS
========================================================= */

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  }
);

document
  .querySelectorAll('.fi')
  .forEach(element => observer.observe(element));

/* =========================================================
   CONTACT FORM (WEB3FORMS)
========================================================= */

async function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn = document.getElementById('submitBtn');

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const response = await fetch(
      'https://api.web3forms.com/submit',
      {
        method: 'POST',
        body: new FormData(form)
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        data.message || 'Submission failed'
      );
    }

    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#0d9488';

    form.reset();

    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
      btn.disabled = false;
    }, 3200);

  } catch (error) {

    btn.textContent = 'Failed — please try again';
    btn.style.background = '#ef4444';

    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);

    console.error(error);
  }
}

/* =========================================================
   HERO PARTICLE NETWORK
========================================================= */

(function heroNetwork() {
  const canvas = document.getElementById('heroNet');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const TEAL = '102, 187, 197';        // ~oklch(0.66 0.145 205) in rgb
  let w = 0, h = 0, dpr = 1;
  let nodes = [];
  let raf = null;
  const mouse = { x: null, y: null };

  function size() {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0) return false;            // hidden (mobile) — don't run
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  function build() {
    const count = Math.round((w * h) / 13000);  // density scales with area
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1.2
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const LINK = 118;

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      // gentle pull toward mouse
      if (mouse.x !== null) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 160 && d > 0) { n.x += (dx / d) * 0.5; n.y += (dy / d) * 0.5; }
      }
    }

    // links
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${TEAL}, ${(1 - d / LINK) * 0.32})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    // nodes
    for (const n of nodes) {
      ctx.fillStyle = `rgba(${TEAL}, 0.85)`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf) cancelAnimationFrame(raf);
    if (size()) { build(); frame(); }
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(start, 200);
  });

  start();
})();

/* =========================================================
   CUSTOM POINTER (dot + trailing glow)
========================================================= */

(function customPointer() {
  const dot = document.getElementById('cursorDot');
  const glow = document.getElementById('cursorGlow');
  if (!dot || !glow) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let tx = 0, ty = 0, gx = 0, gy = 0;

  window.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top = ty + 'px';
  }, { passive: true });

  (function loop() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(loop);
  })();

  const hotSel = 'a, button, input, textarea, .svc-card, .case-card, .team-card, .stack-cat, .testi-card';
  document.querySelectorAll(hotSel).forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hot'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hot'));
  });
})();
