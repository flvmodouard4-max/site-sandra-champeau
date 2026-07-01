/* ── NAV SCROLL STATE ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── BURGER MENU ── */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── REVEAL ON SCROLL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

function observeReveal() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}
observeReveal();

/* ── ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

/* ── COUNTER ANIMATION ── */
function animateCounter(el, target) {
  let start = 0;
  const duration = 1400;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const badgeNum = document.querySelector('.about__badge-num');
if (badgeNum) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounter(badgeNum, 8); entries[0].target._obs.disconnect(); }
  }, { threshold: 0.5 }).observe(Object.assign(badgeNum, { _obs: null }));
  badgeNum._obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounter(badgeNum, 8); badgeNum._obs.disconnect(); }
  }, { threshold: 0.5 });
  badgeNum._obs.observe(badgeNum);
}

/* ── STARS HELPER ── */
function starsHtml(n) {
  return '★'.repeat(Math.min(5, Math.max(1, n))) + '☆'.repeat(5 - Math.min(5, n));
}

/* ── LOAD CMS CONTENT ── */
fetch('/content/data.json')
  .then(r => r.json())
  .then(data => {

    /* Hero */
    const heroTitle = document.querySelector('[data-cms="hero.title"]');
    if (heroTitle) heroTitle.innerHTML = data.hero.title.replace(/\n/g, '<br>');
    const heroSub = document.querySelector('[data-cms="hero.subtitle"]');
    if (heroSub) heroSub.textContent = data.hero.subtitle;

    /* About */
    const aboutTitle = document.querySelector('[data-cms="about.title"]');
    if (aboutTitle) aboutTitle.innerHTML = data.about.title.replace(/\n/g, '<br>');
    const aboutT1 = document.querySelector('[data-cms="about.text1"]');
    if (aboutT1) aboutT1.textContent = data.about.text1;
    const aboutT2 = document.querySelector('[data-cms="about.text2"]');
    if (aboutT2) aboutT2.textContent = data.about.text2;
    const aboutPhoto = document.getElementById('about-photo');
    if (aboutPhoto && data.about.photo) aboutPhoto.src = data.about.photo;

    /* Tarif */
    const tarifNum = document.getElementById('tarif-num');
    if (tarifNum) tarifNum.textContent = data.tarif + ' €';

    /* Services */
    const grid = document.getElementById('services-grid');
    if (grid && data.services) {
      grid.innerHTML = data.services.map((s, i) => `
        <div class="service-card reveal" style="--i:${i}">
          <div class="service-card__icon">${s.icon}</div>
          <h3>${s.title}</h3>
          <p>${s.description}</p>
        </div>`).join('');
      observeReveal();
    }

    /* Témoignages */
    const reviewsGrid = document.getElementById('reviews-grid');
    if (reviewsGrid && data.testimonials) {
      reviewsGrid.innerHTML = data.testimonials.map(t => `
        <div class="review-card reveal">
          <div class="review-card__stars">${starsHtml(t.stars)}</div>
          <p>« ${t.text} »</p>
          <span class="review-card__author">— ${t.author}</span>
        </div>`).join('');
      observeReveal();
    }
  })
  .catch(() => {
    /* Fallback silencieux si le JSON n'est pas accessible (dev local sans serveur) */
  });

/* ── NETLIFY IDENTITY REDIRECT ── */
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/';
      });
    }
  });
}
