// ============ NAV SCROLL ============
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ============ MOBILE MENU ============
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ============ LANGUAGE TOGGLE ============
const langBtn = document.getElementById('langToggle');
let currentLang = localStorage.getItem('drbest_lang') || 'en';

function setLanguage(lang){
  currentLang = lang;
  localStorage.setItem('drbest_lang', lang);
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  langBtn.textContent = lang === 'en' ? 'AR' : 'EN';

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text && !el.querySelector('[data-en]')) el.textContent = text;
  });

  const titleEl = document.querySelector('title');
  const t = titleEl.getAttribute(`data-${lang}`);
  if (t) document.title = t;
}
langBtn.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'ar' : 'en'));
setLanguage(currentLang);

// ============ YEAR ============
document.getElementById('year').textContent = new Date().getFullYear();

// ============ SCROLL REVEAL ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = 1;
      e.target.style.transform = 'translateY(0)';
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.product-card, .brand, .pill, .about-content, .about-visual, .stat, .c-card, .m-item, .section-label, .section-title, .map-wrapper').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .8s cubic-bezier(.22,.61,.36,1), transform .8s cubic-bezier(.22,.61,.36,1)';
  observer.observe(el);
});

// ============ LIGHTBOX (Gallery + Products) ============
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbCounter = document.getElementById('lbCounter');

// Combine gallery + product images
const allImages = [
  ...Array.from(document.querySelectorAll('.m-item img')),
  ...Array.from(document.querySelectorAll('.pc-img img'))
];

let currentIndex = 0;

function openLightbox(index){
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('no-scroll');
}
function updateLightbox(){
  const img = allImages[currentIndex];
  lbImage.style.opacity = 0;
  lbImage.style.transform = 'scale(.95)';
  setTimeout(() => {
    lbImage.src = img.src;
    lbImage.alt = img.alt;
    lbImage.style.opacity = 1;
    lbImage.style.transform = 'scale(1)';
  }, 180);
  lbCounter.textContent = `${String(currentIndex+1).padStart(2,'0')} / ${String(allImages.length).padStart(2,'0')}`;
}
function nextImage(){
  currentIndex = (currentIndex + 1) % allImages.length;
  updateLightbox();
}
function prevImage(){
  currentIndex = (currentIndex - 1 + allImages.length) % allImages.length;
  updateLightbox();
}

// Wire up gallery images
document.querySelectorAll('.m-item').forEach((item) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const idx = allImages.indexOf(img);
    if (idx !== -1) openLightbox(idx);
  });
});

// Wire up product card images
document.querySelectorAll('.pc-img').forEach((wrap) => {
  wrap.addEventListener('click', (e) => {
    e.stopPropagation();
    const img = wrap.querySelector('img');
    const idx = allImages.indexOf(img);
    if (idx !== -1) openLightbox(idx);
  });
});

lbClose.addEventListener('click', closeLightbox);
lbNext.addEventListener('click', nextImage);
lbPrev.addEventListener('click', prevImage);

// Click outside image to close
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.classList.contains('lb-content')) {
    closeLightbox();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});