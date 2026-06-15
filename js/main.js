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
  if (!mobileOverlay.classList.contains('open')) {
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
