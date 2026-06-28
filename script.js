/**
 * ============================================================
 * SALMAN IRFAN — PORTFOLIO JAVASCRIPT
 * Author      : Salman Irfan
 * Description : All interactive behaviour for the portfolio.
 *
 * Sections:
 *   01. Skills Data & Grid Population
 *   02. Skill Bar Animations (Intersection Observer)
 *   03. Scroll Reveal Animations (Intersection Observer)
 *   04. Navigation — Scroll Shadow & Hamburger Toggle
 *   05. Photo Gallery — Thumbnail Switcher
 *   06. Lightbox — Certificate Full-Size Viewer
 *   07. Achievements Data & Grid Population
 *   08. Interests Data & Pills Population
 *   09. Initialisation — Run Everything on DOMContentLoaded
 * ============================================================
 */

'use strict';


/* ============================================================
   01. SKILLS DATA & GRID POPULATION
   Each object maps to one card in the #skillsGrid container.
   Fields: icon (emoji), name (display label), pct (0-100).
   ============================================================ */

const SKILLS = [
  { icon: '🌐', name: 'HTML5',            pct: 90 },
  { icon: '🎨', name: 'CSS3',             pct: 85 },
  { icon: '⚡', name: 'JavaScript',       pct: 75 },
  { icon: '🔧', name: 'Git & GitHub',     pct: 80 },
  { icon: '📱', name: 'Responsive Design',pct: 85 },
  { icon: '🔍', name: 'SEO Tools',        pct: 70 },
  { icon: '📊', name: 'Digital Marketing',pct: 72 },
  { icon: '🎬', name: 'Video Production', pct: 78 },
  { icon: '✍️', name: 'Content Writing',  pct: 80 },
  { icon: '📸', name: 'Social Media Mgmt',pct: 82 },
  { icon: '💡', name: 'Problem Solving',  pct: 85 },
  { icon: '🤝', name: 'Teamwork',         pct: 90 },
  { icon: '🗣️', name: 'Communication',    pct: 88 },
];

/**
 * buildSkillsGrid
 * Injects a .skill-card element for every entry in SKILLS
 * into the #skillsGrid container. Bars start at 0% width
 * and are animated later by the Intersection Observer.
 */
function buildSkillsGrid() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  SKILLS.forEach(function (skill) {
    // Outer card
    const card = document.createElement('div');
    card.className = 'skill-card';

    // Icon
    const icon = document.createElement('div');
    icon.className = 'skill-icon';
    icon.textContent = skill.icon;

    // Skill name
    const name = document.createElement('div');
    name.className = 'skill-name';
    name.textContent = skill.name;

    // Progress bar track
    const barBg = document.createElement('div');
    barBg.className = 'skill-bar-bg';

    // Progress bar fill — data-pct carries the target width
    const bar = document.createElement('div');
    bar.className = 'skill-bar';
    bar.setAttribute('data-pct', skill.pct);
    barBg.appendChild(bar);

    // Percentage label
    const pct = document.createElement('div');
    pct.className = 'skill-pct';
    pct.textContent = skill.pct + '%';

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(barBg);
    card.appendChild(pct);
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}


/* ============================================================
   02. SKILL BAR ANIMATIONS (Intersection Observer)
   Bars animate from 0% → their target width when the
   #skillsGrid section scrolls into view.
   ============================================================ */

/**
 * initSkillBars
 * Observes the skills section; fires bar transitions once
 * when the section first enters the viewport.
 */
function initSkillBars() {
  const section = document.getElementById('skills');
  if (!section) return;

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // Animate every bar in the grid
        const bars = section.querySelectorAll('.skill-bar');
        bars.forEach(function (bar) {
          const target = bar.getAttribute('data-pct') || '0';
          bar.style.width = target + '%';
        });

        obs.unobserve(entry.target); // Run once only
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(section);
}


/* ============================================================
   03. SCROLL REVEAL ANIMATIONS (Intersection Observer)
   Elements with .reveal fade + slide up when they enter
   the viewport. Stagger delays are handled via CSS classes
   (.rd1, .rd2, .rd3) set directly in the HTML.
   ============================================================ */

/**
 * initScrollReveal
 * Adds the .visible class to .reveal elements as they enter
 * the viewport, triggering the CSS transition.
 */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}


/* ============================================================
   04. NAVIGATION — SCROLL SHADOW & HAMBURGER TOGGLE
   ============================================================ */

/**
 * initNav
 * – Adds the .scrolled class to <nav> once the page scrolls
 *   past 60 px, revealing the bottom border (defined in CSS).
 * – toggleNav() is called by the hamburger button's onclick
 *   attribute in the HTML.
 */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * toggleNav
 * Opens / closes the mobile navigation drawer.
 * Called directly via onclick on the hamburger <div>.
 */
function toggleNav() {
  const links = document.getElementById('navLinks');
  if (links) {
    links.classList.toggle('open');
  }
}

/**
 * closeNavOnLinkClick
 * Automatically collapses the mobile menu when any nav
 * link is tapped — improves UX on small screens.
 */
function closeNavOnLinkClick() {
  const links = document.getElementById('navLinks');
  if (!links) return;

  links.querySelectorAll('a').forEach(function (anchor) {
    anchor.addEventListener('click', function () {
      links.classList.remove('open');
    });
  });
}


/* ============================================================
   05. PHOTO GALLERY — THUMBNAIL SWITCHER
   Clicking a thumbnail updates the main profile image
   and moves the .active class to the clicked thumbnail.
   ============================================================ */

/**
 * initGallery
 * Delegates click events on the .gallery-strip container
 * for efficient event handling.
 */
function initGallery() {
  const strip = document.querySelector('.gallery-strip');
  const mainPhoto = document.getElementById('mainPhoto');
  if (!strip || !mainPhoto) return;

  strip.addEventListener('click', function (e) {
    const thumb = e.target.closest('.gallery-thumb');
    if (!thumb) return;

    // Swap main photo source
    mainPhoto.src = thumb.src;

    // Update active state
    strip.querySelectorAll('.gallery-thumb').forEach(function (t) {
      t.classList.remove('active');
    });
    thumb.classList.add('active');
  });
}


/* ============================================================
   06. LIGHTBOX — CERTIFICATE FULL-SIZE VIEWER
   openLightbox(src) is called via onclick in the HTML.
   closeLightbox() is called by the close button and the
   dark backdrop click handler.
   ============================================================ */

/**
 * openLightbox
 * Displays the lightbox overlay with the given image source.
 *
 * @param {string} src - The image src (URL or base64 data URI).
 */
function openLightbox(src) {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox || !lightboxImg) return;

  lightboxImg.src = src;
  lightbox.classList.add('open');

  // Prevent background scroll while lightbox is open
  document.body.style.overflow = 'hidden';
}

/**
 * closeLightbox
 * Hides the lightbox overlay and restores page scrolling.
 */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * initLightboxKeyboard
 * Allows the Escape key to close the lightbox for
 * improved accessibility.
 */
function initLightboxKeyboard() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}


/* ============================================================
   07. ACHIEVEMENTS DATA & GRID POPULATION
   Each object maps to one .ach-card inside #achGrid.
   Fields: icon (emoji), title (heading), desc (body text).
   ============================================================ */

const ACHIEVEMENTS = [
  {
    icon:  '🏆',
    title: 'Best Intern of the Month',
    desc:  'Awarded by GAO Tek Inc. in October 2025 for outstanding performance and dedication throughout the internship program.'
  },
  {
    icon:  '🌍',
    title: 'International Collaboration',
    desc:  'Worked remotely alongside professionals from multiple countries, building cross-cultural communication and teamwork skills.'
  },
  {
    icon:  '📜',
    title: 'Dual Certification — GAO Tek',
    desc:  'Earned two professional certificates (Web Development & Digital Marketing) upon successful completion of a 4-month program.'
  },
  {
    icon:  '🔍',
    title: 'Google — Git & GitHub Certificate',
    desc:  'Completed the Google-backed Git & GitHub course via Coursera, strengthening version control skills used in real projects.'
  },
  {
    icon:  '📈',
    title: 'SEO Tools Certification — Coursera',
    desc:  'Certified in Boost SEO Tools, applying learnings to digital marketing strategies and content optimisation.'
  },
  {
    icon:  '🎬',
    title: 'Content Creator since 2020',
    desc:  'Built an online presence from scratch — gaming videos, football reels, and tech articles on Medium spanning 5+ years.'
  },
];

/**
 * buildAchievementsGrid
 * Injects a .ach-card element for every entry in ACHIEVEMENTS
 * into the #achGrid container. Cards gain the .reveal class
 * so the scroll observer animates them on entry.
 */
function buildAchievementsGrid() {
  const grid = document.getElementById('achGrid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  ACHIEVEMENTS.forEach(function (item, index) {
    const card = document.createElement('div');
    // Stagger delay helpers (rd1 / rd2 / rd3) cycle through cards
    const delay = 'rd' + ((index % 3) + 1);
    card.className = 'ach-card reveal ' + delay;

    const icon = document.createElement('div');
    icon.className   = 'ach-icon';
    icon.textContent = item.icon;

    const title = document.createElement('div');
    title.className   = 'ach-title';
    title.textContent = item.title;

    const desc = document.createElement('div');
    desc.className   = 'ach-desc';
    desc.textContent = item.desc;

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(desc);
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}


/* ============================================================
   08. INTERESTS DATA & PILLS POPULATION
   Each string in INTERESTS maps to one .interest-pill inside
   #interestsWrap. Format: 'emoji Label'.
   ============================================================ */

const INTERESTS = [
  '💻 Web Development',
  '🎮 Gaming',
  '⚽ Football',
  '🎵 Music & Singing',
  '✍️ Writing & Blogging',
  '📱 Social Media',
  '🎬 Video Production',
  '📖 Technology News',
  '🌐 Open Source',
  '📸 Photography',
  '🤖 Artificial Intelligence',
  '🎨 UI / UX Design',
  '🏋️ Fitness',
  '🌍 Travelling',
];

/**
 * buildInterestsPills
 * Injects a .interest-pill span for every entry in INTERESTS
 * into the #interestsWrap container.
 */
function buildInterestsPills() {
  const wrap = document.getElementById('interestsWrap');
  if (!wrap) return;

  const fragment = document.createDocumentFragment();

  INTERESTS.forEach(function (label) {
    const pill = document.createElement('span');
    pill.className   = 'interest-pill';
    pill.textContent = label;
    fragment.appendChild(pill);
  });

  wrap.appendChild(fragment);
}


/* ============================================================
   09. INITIALISATION — RUN EVERYTHING ON DOMContentLoaded
   All setup functions are called here in a logical order.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // 1. Populate the skills grid before observing it
  buildSkillsGrid();

  // 2. Animate skill bars when section scrolls into view
  initSkillBars();

  // 3. Fade-up reveal for all .reveal elements
  //    (must run AFTER dynamic content is injected so the
  //    observer picks up cards added by buildAchievementsGrid)
  buildAchievementsGrid();
  buildInterestsPills();
  initScrollReveal();

  // 4. Navigation scroll shadow + mobile menu
  initNav();
  closeNavOnLinkClick();

  // 5. Photo gallery thumbnail switcher
  initGallery();

  // 6. Keyboard shortcut for lightbox
  initLightboxKeyboard();

});

/*
 * NOTE: toggleNav(), openLightbox(), and closeLightbox() are
 * intentionally kept on the global scope because they are
 * referenced via inline onclick attributes in the HTML.
 * In a module-based build (e.g. Vite / Webpack) these would
 * be re-attached as event listeners and removed from global.
 */
