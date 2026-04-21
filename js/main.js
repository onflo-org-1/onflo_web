/* ── Nav scroll shadow + active link ── */
const nav      = document.getElementById('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

/* ── Mobile menu ── */
function toggleMenu() {
  const hbg     = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileOverlay');
  hbg.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Scroll fade-in ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fi').forEach(el => observer.observe(el));

/* ── Contact form → Web3Forms ── */
async function handleSubmit(e) {
  e.preventDefault();
  const btn  = document.getElementById('submitBtn');
  const form = e.target;

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res  = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form)
    });
    const data = await res.json();

    if (data.success) {
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#0d9488';
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        btn.disabled = false;
      }, 3200);
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch {
    btn.textContent = 'Failed — please try again';
    btn.style.background = '#ef4444';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
    }, 3000);
  }
}
