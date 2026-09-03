/* =========================================
   NAVBAR – scroll effect & mobile menu
   ========================================= */
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');

// Scroll: add .scrolled class
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile burger toggle
burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* =========================================
   SCROLL REVEAL – Intersection Observer
   ========================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Stagger sibling reveals inside the same parent
  const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${idx * 0.08}s`;
  revealObserver.observe(el);
});

/* =========================================
   ACTIVE NAV LINK – highlight current section
   ========================================= */
const sections = document.querySelectorAll('section[id]');
const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchorLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

/* =========================================
   CONTACT FORM – simple UX feedback
   ========================================= */
const form = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      formNote.textContent = '⚠️ Mohon isi semua field terlebih dahulu.';
      formNote.style.color = '#f87171';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formNote.textContent = '⚠️ Format email tidak valid.';
      formNote.style.color = '#f87171';
      return;
    }

    // Simulate send (swap with real API / EmailJS / Formspree when ready)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Mengirim…';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Kirim Pesan';
      formNote.style.color = 'var(--accent)';
      formNote.textContent = '✅ Pesan terkirim! Saya akan segera menghubungi kamu.';

      setTimeout(() => { formNote.textContent = ''; }, 5000);
    }, 1200);
  });
}

/* =========================================
   SMOOTH SCROLL – polyfill fallback
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =========================================
   TYPED-LIKE CURSOR ON HERO ROLE
   ========================================= */
const roleEl = document.querySelector('.hero-role');
if (roleEl) {
  const roles = [
    'Web Developer & UI Enthusiast',
    'Full-Stack Developer',
    'Laravel & PHP Developer',
    'Lifelong Learner 🚀',
  ];
  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;

  function typeRole() {
    const current = roles[roleIdx];

    if (!deleting) {
      charIdx++;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeRole, 2000);
        return;
      }
    } else {
      charIdx--;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
      }
    }

    setTimeout(typeRole, deleting ? 45 : 80);
  }

  // Start after a short pause so the page loads first
  setTimeout(typeRole, 1200);
}
