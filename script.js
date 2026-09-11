/* ── HERO VIDEO (chargée uniquement sur desktop pour préserver la vitesse mobile) ── */
const heroVideo = document.getElementById('heroVideo');
if (heroVideo && window.matchMedia('(min-width: 768px)').matches) {
  const source = document.createElement('source');
  source.src = 'hero-lavande.mp4';
  source.type = 'video/mp4';
  heroVideo.appendChild(source);
  heroVideo.load();
  const tryPlayHeroVideo = () => heroVideo.play().catch(() => {});
  tryPlayHeroVideo();
  document.addEventListener('pointerdown', tryPlayHeroVideo, { once: true });
  document.addEventListener('scroll', tryPlayHeroVideo, { once: true, passive: true });
  heroVideo.addEventListener('ended', () => {
    heroVideo.pause();
    heroVideo.currentTime = heroVideo.duration;
  });
}

/* ── NAV SCROLL STATE ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── BURGER MENU ── */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  nav.classList.toggle('menu-open', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
    nav.classList.remove('menu-open');
  });
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

/* ── CARROUSEL AVIS ── */
const reviewsGrid = document.getElementById('reviews-grid');
if (reviewsGrid) {
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  const scrollByCard = (dir) => {
    const card = reviewsGrid.querySelector('.review-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(reviewsGrid).columnGap || getComputedStyle(reviewsGrid).gap) || 24;
    reviewsGrid.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };
  prevBtn?.addEventListener('click', () => scrollByCard(-1));
  nextBtn?.addEventListener('click', () => scrollByCard(1));
}
