// ── ANNOUNCEMENT BAR COUNTDOWN ──
(function () {
  const end = new Date();
  end.setHours(end.getHours() + 23, end.getMinutes() + 59, end.getSeconds() + 47, 0);

  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdH').textContent = String(h).padStart(2, '0');
    document.getElementById('cdM').textContent = String(m).padStart(2, '0');
    document.getElementById('cdS').textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
})();

// ── STICKY NAV ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ── STAR FIELD (ENHANCED) ──
(function () {
  const canvas = document.getElementById('starsCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars, constNodes, constEdges, sparkleNodes;
  const shootingStars = [];
  let nextShoot = 1800;

  function init() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

    // Background stars — white + occasional gold
    stars = Array.from({ length: 360 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.7 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.9 + 0.2,
      gold: Math.random() < 0.12,
    }));

    // Constellation anchor nodes — larger gold stars
    constNodes = Array.from({ length: 32 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 1.0,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.1,
    }));

    // Connect nearby nodes with lines
    constEdges = [];
    for (let i = 0; i < constNodes.length; i++) {
      let cnt = 0;
      for (let j = i + 1; j < constNodes.length; j++) {
        if (cnt >= 2) break;
        const dx = constNodes[i].x - constNodes[j].x;
        const dy = constNodes[i].y - constNodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < Math.min(W, H) * 0.2) {
          constEdges.push([i, j]);
          cnt++;
        }
      }
    }

    // 4-point sparkle nodes (✦ diamond shapes)
    sparkleNodes = Array.from({ length: 14 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 6 + 3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.2,
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

// ── PRICING TOGGLE ──
document.querySelectorAll('.pricing-toggle').forEach(toggle => {
  const opts = toggle.querySelectorAll('.pricing-opt');
  const priceEl = toggle.closest('.product-card__body').querySelector('.product-card__price');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('pricing-opt--active'));
      opt.classList.add('pricing-opt--active');
      const price = opt.dataset.price;
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      const isSubscribe = opt.querySelector('.pricing-opt__save');
      priceEl.textContent = isSubscribe ? `£${price}/mo` : `£${price}`;
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

// ── EMAIL POPUP ──
const overlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupSkip = document.getElementById('popupSkip');
const popupForm = document.getElementById('popupForm');
const popupSuccess = document.getElementById('popupSuccess');
const popupFormWrap = document.getElementById('popupFormWrap');

function openPopup() { overlay.classList.add('show'); }
function closePopup() {
  overlay.classList.remove('show');
  localStorage.setItem('mb_popup_dismissed', '1');
}

if (!localStorage.getItem('mb_popup_dismissed')) {
  setTimeout(openPopup, 600);
}
popupClose.addEventListener('click', closePopup);
popupSkip.addEventListener('click', closePopup);
overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });

popupForm.addEventListener('submit', e => {
  e.preventDefault();
  popupFormWrap.style.display = 'none';
  popupSuccess.classList.add('show');
  localStorage.setItem('mb_popup_dismissed', '1');
  setTimeout(closePopup, 3000);
});

// ── NEWSLETTER FORM ──
document.getElementById('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const note = document.getElementById('newsletterNote');
  note.textContent = '🎉 You\'re subscribed! Check your inbox.';
  note.style.color = 'var(--green)';
  e.target.querySelector('input').value = '';
});

// ── STICKY MOBILE CTA ──
const stickyMobile = document.getElementById('stickyMobile');
const heroSection = document.querySelector('.hero');
const stickyObs = new IntersectionObserver(entries => {
  stickyMobile.classList.toggle('show', !entries[0].isIntersecting);
}, { threshold: 0 });
if (heroSection) stickyObs.observe(heroSection);

// ── ADD TO CART (Shopify) ──
document.querySelectorAll('.product-card').forEach(card => {
  const btn = card.querySelector('.btn--primary');
  const toggle = card.querySelector('.pricing-toggle');
  if (!btn || !toggle || !btn.textContent.includes('Add to Cart')) return;

  const variantId = toggle.dataset.variantId;

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!variantId) return;

    const activeOpt = toggle.querySelector('.pricing-opt--active');
    const sellingPlan = activeOpt ? activeOpt.dataset.sellingPlan : '';

    const payload = { id: variantId, quantity: 1 };
    if (sellingPlan) payload.selling_plan = sellingPlan;

    const orig = btn.textContent;
    btn.textContent = 'Adding...';

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.description || 'Could not add to cart');
      }
      btn.textContent = '✓ Added!';
      btn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
      updateCartCount();
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
      }, 1800);
    } catch (err) {
      btn.textContent = 'Error — try again';
      setTimeout(() => { btn.textContent = orig; }, 2200);
    }
  });
});

// ── CART COUNT BADGE ──
function updateCartCount() {
  fetch('/cart.js')
    .then(r => r.json())
    .then(cart => {
      const el = document.getElementById('cartCount');
      if (el) el.textContent = cart.item_count > 0 ? cart.item_count : '';
    })
    .catch(() => {});
}
updateCartCount();
