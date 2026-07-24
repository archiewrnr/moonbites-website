// ── ANNOUNCEMENT BAR COUNTDOWN ──
(function () {
  const cdH = document.getElementById('cdH');
  const cdM = document.getElementById('cdM');
  const cdS = document.getElementById('cdS');
  if (!cdH || !cdM || !cdS) return;

  const end = new Date();
  end.setHours(end.getHours() + 23, end.getMinutes() + 59, end.getSeconds() + 47, 0);

  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    cdH.textContent = String(h).padStart(2, '0');
    cdM.textContent = String(m).padStart(2, '0');
    cdS.textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
})();

// ── STICKY NAV ──
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

// ── STAR FIELD (ENHANCED) ──
(function () {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars, constNodes, constEdges, sparkleNodes;
  const shootingStars = [];
  let nextShoot = 1800;

  function init() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

    // Background stars — sparse, tiny, mostly white. Kept deliberately subtle
    // so the star field reads as atmosphere, not motion competing with content.
    stars = Array.from({ length: 110 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.1 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.35 + 0.08,
      gold: Math.random() < 0.12,
    }));

    // Constellation anchor nodes — a handful of soft gold points, no connecting lines
    constNodes = Array.from({ length: 8 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.1 + 0.9,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.18 + 0.05,
    }));
    constEdges = [];

    // 4-point sparkle nodes (✦ diamond shapes) — very few, very soft
    sparkleNodes = Array.from({ length: 4 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 3.5 + 2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.25 + 0.1,
    }));
  }

  function spawnShootingStar() {
    const angle = (15 + Math.random() * 40) * (Math.PI / 180);
    const speed = 9 + Math.random() * 11;
    shootingStars.push({
      x: Math.random() * W * 0.85,
      y: Math.random() * H * 0.4 - 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 110 + Math.random() * 160,
      life: 1,
      decay: 0.007 + Math.random() * 0.006,
    });
  }

  function drawSparkle(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.08, -size * 0.08);
    ctx.lineTo(size, 0);
    ctx.lineTo(size * 0.08, size * 0.08);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.08, size * 0.08);
    ctx.lineTo(-size, 0);
    ctx.lineTo(-size * 0.08, -size * 0.08);
    ctx.closePath();
    ctx.fillStyle = 'rgba(220,190,80,1)';
    ctx.fill();
    ctx.restore();
  }

  let lastT = 0, elapsed = 0;

  function draw(t) {
    const dt = Math.min(t - lastT, 50);
    lastT = t;
    elapsed += dt;

    ctx.clearRect(0, 0, W, H);

    // Constellation lines
    constEdges.forEach(([i, j]) => {
      const pulse = 0.05 + 0.04 * Math.sin(elapsed * 0.0007);
      ctx.beginPath();
      ctx.moveTo(constNodes[i].x, constNodes[i].y);
      ctx.lineTo(constNodes[j].x, constNodes[j].y);
      ctx.strokeStyle = `rgba(201,168,67,${pulse})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });

    // Constellation nodes — gold glow + core
    constNodes.forEach(s => {
      const a = 0.4 + 0.6 * Math.abs(Math.sin(s.phase + elapsed * s.speed * 0.001));
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
      g.addColorStop(0, `rgba(201,168,67,${a * 0.22})`);
      g.addColorStop(1, 'rgba(201,168,67,0)');
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,185,75,${0.6 + a * 0.4})`; ctx.fill();
    });

    // Background stars
    stars.forEach(s => {
      const a = 0.1 + 0.85 * Math.abs(Math.sin(s.phase + elapsed * s.speed * 0.001));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold ? `rgba(220,185,80,${a})` : `rgba(255,255,255,${a})`;
      ctx.fill();
    });

    // 4-point sparkles
    sparkleNodes.forEach(s => {
      const a = 0.3 + 0.7 * Math.abs(Math.sin(s.phase + elapsed * s.speed * 0.001));
      drawSparkle(s.x, s.y, s.size * (0.7 + 0.3 * a), a * 0.85);
    });

    // Spawn shooting stars
    nextShoot -= dt;
    if (nextShoot <= 0) {
      spawnShootingStar();
      if (Math.random() < 0.32) setTimeout(spawnShootingStar, 350 + Math.random() * 550);
      nextShoot = 2000 + Math.random() * 5000;
    }

    // Draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.vx; ss.y += ss.vy;
      ss.life -= ss.decay;
      if (ss.life <= 0 || ss.x > W + 200 || ss.y > H + 200) {
        shootingStars.splice(i, 1); continue;
      }
      const sp = Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy);
      const nx = ss.vx / sp, ny = ss.vy / sp;
      const tailLen = ss.len * ss.life;
      const grad = ctx.createLinearGradient(
        ss.x - nx * tailLen, ss.y - ny * tailLen, ss.x, ss.y
      );
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, `rgba(201,168,67,${ss.life * 0.35})`);
      grad.addColorStop(1, `rgba(255,255,255,${ss.life})`);
      ctx.beginPath();
      ctx.moveTo(ss.x - nx * tailLen, ss.y - ny * tailLen);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2 * ss.life;
      ctx.lineCap = 'round';
      ctx.stroke();
      // Head glow
      const hg = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
      hg.addColorStop(0, `rgba(255,255,220,${ss.life})`);
      hg.addColorStop(1, 'rgba(255,255,220,0)');
      ctx.beginPath(); ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = hg; ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  init();
  window.addEventListener('resize', init, { passive: true });
  requestAnimationFrame(draw);
})();

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add('visible'), i * 70);
    revealObserver.unobserve(e.target);
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObserver.observe(el));

// ── TIMELINE SCROLL-SPY ──
const tlSteps = document.querySelectorAll('.tl-step');
if (tlSteps.length) {
  const tlObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('tl-step--active');
      else e.target.classList.remove('tl-step--active');
    });
  }, { threshold: 0.6, rootMargin: '-15% 0px -15% 0px' });
  tlSteps.forEach(el => tlObs.observe(el));
}

// ── INTERACTIVE DOSE PANEL ──
document.querySelectorAll('.dose-item').forEach(item => {
  item.addEventListener('click', () => {
    const wasOpen = item.classList.contains('is-open');
    document.querySelectorAll('.dose-item.is-open').forEach(i => i.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});
const doseObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const bar = e.target.querySelector('.dose-item__bar');
    const max = parseFloat(e.target.dataset.max);
    const mg = parseFloat(e.target.dataset.mg);
    requestAnimationFrame(() => { bar.style.width = Math.min(100, (mg / max) * 100) + '%'; });
    doseObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.dose-item').forEach(el => doseObs.observe(el));

// ── STAT COUNTER ──
const statNums = document.querySelectorAll('.stat__num');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const raw = el.textContent;
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.]/g, '');
    if (isNaN(num)) return;
    const start = performance.now();
    const dur = 1400;
    function upd(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = num * eased;
      el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(0)) + suffix;
      if (p < 1) requestAnimationFrame(upd);
    }
    requestAnimationFrame(upd);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
statNums.forEach(el => countObs.observe(el));

// ── PLAN SELECTOR (Get MoonBites purchase module) ──
// Real Shopify checkout links — moonbites-store.com
const SHOPIFY_CART_LINKS = {
  single: 'https://moonbites-store.com/cart/58243240329603:1?selling_plan=713363849603',
  triple: 'https://moonbites-store.com/cart/62041227526531:1?selling_plan=713363882371',
  'single-onetime': 'https://moonbites-store.com/cart/58243240329603:1',
  hamper: 'https://moonbites-store.com/cart/62048580927875:1',
};
(function () {
  const grid = document.getElementById('planGrid');
  const cta = document.getElementById('purchaseCta');
  if (!grid || !cta) return;
  const cards = grid.querySelectorAll('.plan-card');
  const ctaPriceByPlan = { single: 'TRY RISK FREE • £23.99', triple: 'TRY RISK FREE • £17.99', 'single-onetime': 'BUY NOW • £29.99' };
  let selectedPlan = 'triple';

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('plan-card--selected'));
      card.classList.add('plan-card--selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      selectedPlan = card.dataset.plan;
      cta.textContent = ctaPriceByPlan[selectedPlan] || ctaPriceByPlan.triple;
    });
  });
  // reflect the default checked plan on load
  const checked = grid.querySelector('input[type="radio"]:checked');
  if (checked) {
    checked.closest('.plan-card').classList.add('plan-card--selected');
    selectedPlan = checked.closest('.plan-card').dataset.plan;
  }

  cta.addEventListener('click', () => {
    window.location.href = SHOPIFY_CART_LINKS[selectedPlan] || SHOPIFY_CART_LINKS.triple;
  });
})();

// ── LIVE VIEWER COUNT + STOCK INDICATOR (illustrative demo values) ──
(function () {
  const viewerEl = document.getElementById('viewerCount');
  if (viewerEl) {
    setInterval(() => {
      viewerEl.textContent = 20 + Math.floor(Math.random() * 61); // 20–80
    }, 4000);
  }
})();

// ── RECENTLY PURCHASED TOAST (illustrative demo values) ──
// Skipped on the Journal/blog page — that page is intentionally kept free of sales pressure.
(function () {
  if (document.querySelector('.blog-hero')) return;
  const names = ['Sarah', 'James', 'Priya', 'Tom', 'Emily', 'Daniel', 'Keisha', 'Lucy', 'Ryan', 'Nina'];
  const towns = ['London', 'Manchester', 'Leeds', 'Bristol', 'Glasgow', 'Cardiff', 'Birmingham', 'Edinburgh'];
  const actions = ['just joined the MoonBites Membership', 'just subscribed & saved 30%', 'just claimed their free Silk Sleep Mask'];

  let toastEl;
  function showPurchaseToast() {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'purchase-toast';
      document.body.appendChild(toastEl);
    }
    const name = names[Math.floor(Math.random() * names.length)];
    const town = towns[Math.floor(Math.random() * towns.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    toastEl.innerHTML = `<span class="purchase-toast__icon">🌙</span><span><strong>${name}</strong> from ${town} ${action}</span>`;
    toastEl.classList.add('show');
    clearTimeout(toastEl._hideTimer);
    toastEl._hideTimer = setTimeout(() => toastEl.classList.remove('show'), 4200);
  }
  setTimeout(showPurchaseToast, 6000);
  setInterval(showPurchaseToast, 22000);
})();

// ── EXIT INTENT (desktop only, once per session) ──
(function () {
  let triggered = false;
  document.addEventListener('mouseout', e => {
    if (triggered || e.clientY > 0) return;
    if (localStorage.getItem('mb_popup_dismissed')) return;
    triggered = true;
    const overlay = document.getElementById('popupOverlay');
    if (overlay && !overlay.classList.contains('show')) overlay.classList.add('show');
  });
})();

// ── BENEFITS IMAGE CAROUSEL ──
(function () {
  const carousel = document.getElementById('benefitsCarousel');
  const dotsWrap = document.getElementById('benefitsDots');
  if (!carousel || !dotsWrap) return;
  const imgs = carousel.querySelectorAll('.benefits__img');
  let idx = 0;

  imgs.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Show image ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('button');

  function goTo(i) {
    idx = i;
    imgs.forEach((img, n) => img.classList.toggle('is-active', n === idx));
    dots.forEach((d, n) => d.classList.toggle('is-active', n === idx));
  }

  let timer = setInterval(() => goTo((idx + 1) % imgs.length), 4000);
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => { timer = setInterval(() => goTo((idx + 1) % imgs.length), 4000); });
})();

// ── RITUAL: SLEEP MASK COLOUR SWATCHES ──
document.querySelectorAll('.ritual-card__swatches').forEach(group => {
  const img = group.closest('.ritual-card').querySelector('.ritual-card__img img');
  const swatches = group.querySelectorAll('.ritual-swatch');
  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('is-active'));
      sw.classList.add('is-active');
      if (img) img.src = sw.dataset.img;
    });
  });
});

// ── REVIEWS CAROUSEL ──
const track = document.getElementById('reviewTrack');
const dotsContainer = document.getElementById('reviewDots');
const cards = track ? track.querySelectorAll('.review-card') : [];
let current = 0;
let autoTimer;

if (cards.length) {
  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.carousel__dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  document.getElementById('reviewNext').addEventListener('click', () => { next(); resetAuto(); });
  document.getElementById('reviewPrev').addEventListener('click', () => { prev(); resetAuto(); });

  function startAuto() { autoTimer = setInterval(next, 5000); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  // Pause on hover
  const carousel = track.closest('.carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', startAuto);

  startAuto();
}

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq__item.open').forEach(i => i.classList.remove('open'));
    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  });
});

// ── EMAIL POPUP (only on pages that include it) ──
const overlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupSkip = document.getElementById('popupSkip');
const popupForm = document.getElementById('popupForm');
const popupSuccess = document.getElementById('popupSuccess');
const popupFormWrap = document.getElementById('popupFormWrap');

function openPopup() { if (overlay) overlay.classList.add('show'); }
function closePopup() {
  if (overlay) overlay.classList.remove('show');
  localStorage.setItem('mb_popup_dismissed', '1');
}

if (overlay && !localStorage.getItem('mb_popup_dismissed')) {
  setTimeout(openPopup, 600);
}
if (popupClose) popupClose.addEventListener('click', closePopup);
if (popupSkip) popupSkip.addEventListener('click', closePopup);
if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });

if (popupForm) {
  popupForm.addEventListener('submit', e => {
    e.preventDefault();
    popupFormWrap.style.display = 'none';
    popupSuccess.classList.add('show');
    localStorage.setItem('mb_popup_dismissed', '1');
    setTimeout(closePopup, 3000);
  });
}

// ── NEWSLETTER FORM (only on pages that include it) ──
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const note = document.getElementById('newsletterNote');
    note.textContent = '🎉 You\'re subscribed! Check your inbox.';
    note.style.color = 'var(--green)';
    e.target.querySelector('input').value = '';
  });
}

// ── STICKY MOBILE CTA ──
const stickyMobile = document.getElementById('stickyMobile');
const heroSection = document.querySelector('.hero');
if (stickyMobile && heroSection) {
  const stickyObs = new IntersectionObserver(entries => {
    stickyMobile.classList.toggle('show', !entries[0].isIntersecting);
  }, { threshold: 0 });
  stickyObs.observe(heroSection);
}

// ── PURCHASE CTA (demo) ──
document.querySelectorAll('.product-card__footer .btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const orig = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
    }, 1800);
  });
});

// ── MOON COINS PROGRESS BAR ──
const coinsBar = document.querySelector('.coins-progress__bar');
if (coinsBar) {
  const coinsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      requestAnimationFrame(() => { coinsBar.style.width = coinsBar.dataset.pct + '%'; });
      coinsObs.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  coinsObs.observe(coinsBar);
}

// ── REFERRAL COPY LINK (demo) ──
const referralBtn = document.getElementById('referralCopyBtn');
if (referralBtn) {
  referralBtn.addEventListener('click', () => {
    const orig = referralBtn.textContent;
    referralBtn.textContent = '✓ Copied!';
    setTimeout(() => { referralBtn.textContent = orig; }, 1800);
  });
}

// ── BLOG: CATEGORY FILTERS ──
(function () {
  const filters = document.querySelectorAll('.blog-filter');
  const cards = document.querySelectorAll('.blog-card');
  if (!filters.length) return;
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      cards.forEach(c => {
        c.style.display = (f === 'all' || c.dataset.category === f) ? '' : 'none';
      });
    });
  });
})();

// ── BLOG: DAILY MICRO-CHALLENGE ──
(function () {
  const el = document.getElementById('challengeText');
  if (!el) return;
  const challenges = [
    "Set one consistent wake-up time tomorrow — even if you go to bed late tonight.",
    "Dim every light in your home to about half brightness for the hour before bed.",
    "Put your phone in another room 30 minutes before you plan to sleep.",
    "Try a 10-minute nap tomorrow between 1–3pm instead of reaching for more caffeine.",
    "Just notice what time you have your last caffeine today — no need to change anything yet.",
    "Drop your bedroom temperature by 1–2 degrees tonight.",
    "Write down tomorrow's to-do list before bed instead of running through it in your head.",
    "Get 10 minutes of natural daylight within an hour of waking up.",
    "Skip the nightcap tonight and notice how you feel waking up.",
    "Do one stretch or breathing exercise for 5 minutes before getting into bed.",
    "Read one physical page of a book instead of scrolling for your last 10 minutes awake.",
    "Notice how you feel 90 minutes after your usual bedtime — that's roughly one full sleep cycle.",
    "Move any evening workout at least 2 hours earlier than usual today.",
    "Leave your curtains slightly open tonight to get natural light first thing tomorrow."
  ];
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date() - start;
  const dayOfYear = Math.floor(diff / 86400000);
  el.textContent = '"' + challenges[dayOfYear % challenges.length] + '"';
})();

// ── BLOG: MYTH OR FACT CARDS ──
(function () {
  const cards = document.querySelectorAll('.myth-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
