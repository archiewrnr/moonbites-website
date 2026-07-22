// ── ANNOUNCEMENT BAR COUNTDOWN ──
(function () {
  const end = new Date();
  end.setHours(end.getHours() + 23, end.getMinutes() + 59, end.getSeconds() + 47, 0);
  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const elH = document.getElementById('cdH');
    if (!elH) return;
    elH.textContent = String(h).padStart(2, '0');
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

// ── PREMIUM STAR FIELD ──
(function () {
  const canvas = document.getElementById('starsCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars, sparkleNodes, nebulaBlobs;
  const shootingStars = [];
  let nextShoot = 2200;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

    stars = Array.from({ length: 260 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.8 + 0.15,
      gold: Math.random() < 0.16,
    }));

    sparkleNodes = Array.from({ length: 9 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.7,
      size: Math.random() * 7 + 4,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.15,
    }));

    nebulaBlobs = [
      { x: W * 0.15, y: H * 0.1, r: Math.min(W, H) * 0.4, hue: 'rgba(106,91,196,0.10)' },
      { x: W * 0.85, y: H * 0.25, r: Math.min(W, H) * 0.35, hue: 'rgba(201,168,106,0.07)' },
    ];
  }

  function spawnShootingStar() {
    const angle = (18 + Math.random() * 35) * (Math.PI / 180);
    const speed = 7 + Math.random() * 8;
    shootingStars.push({
      x: Math.random() * W * 0.8,
      y: Math.random() * H * 0.35 - 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 130 + Math.random() * 170,
      life: 1,
      decay: 0.005 + Math.random() * 0.004,
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
    ctx.fillStyle = 'rgba(212,175,90,0.95)';
    ctx.fill();
    ctx.restore();
  }

  let lastT = 0, elapsed = 0;

  function draw(t) {
    const dt = Math.min(t - lastT, 50);
    lastT = t;
    elapsed += dt;
    ctx.clearRect(0, 0, W, H);

    nebulaBlobs.forEach(n => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, n.hue);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    });

    stars.forEach(s => {
      const a = 0.12 + 0.82 * Math.abs(Math.sin(s.phase + elapsed * s.speed * 0.001));
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold ? `rgba(212,175,90,${a})` : `rgba(255,255,255,${a})`;
      ctx.fill();
    });

    sparkleNodes.forEach(s => {
      const a = 0.25 + 0.65 * Math.abs(Math.sin(s.phase + elapsed * s.speed * 0.001));
      drawSparkle(s.x, s.y, s.size * (0.7 + 0.3 * a), a * 0.8);
    });

    if (!reduceMotion) {
      nextShoot -= dt;
      if (nextShoot <= 0) {
        spawnShootingStar();
        nextShoot = 4500 + Math.random() * 6500;
      }
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x += ss.vx; ss.y += ss.vy;
      ss.life -= ss.decay;
      if (ss.life <= 0 || ss.x > W + 200 || ss.y > H + 200) { shootingStars.splice(i, 1); continue; }
      const sp = Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy);
      const nx = ss.vx / sp, ny = ss.vy / sp;
      const tailLen = ss.len * ss.life;
      const grad = ctx.createLinearGradient(ss.x - nx * tailLen, ss.y - ny * tailLen, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, `rgba(212,175,90,${ss.life * 0.4})`);
      grad.addColorStop(1, `rgba(255,255,255,${ss.life})`);
      ctx.beginPath();
      ctx.moveTo(ss.x - nx * tailLen, ss.y - ny * tailLen);
      ctx.lineTo(ss.x, ss.y);
      ctx.strokeStyle = grad; ctx.lineWidth = 2 * ss.life; ctx.lineCap = 'round';
      ctx.stroke();
      const hg = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
      hg.addColorStop(0, `rgba(255,250,225,${ss.life})`);
      hg.addColorStop(1, 'rgba(255,250,225,0)');
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
    setTimeout(() => e.target.classList.add('visible'), i * 60);
    revealObserver.unobserve(e.target);
  });
}, { threshold: 0.08 });
revealEls.forEach(el => revealObserver.observe(el));

// ── PRICING TOGGLE ──
document.querySelectorAll('.pricing-toggle').forEach(toggle => {
  const opts = toggle.querySelectorAll('.pricing-opt');
  const priceEl = toggle.closest('.product-card__body').querySelector('.product-card__price');
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('pricing-opt--active'));
      opt.classList.add('pricing-opt--active');
      const price = opt.dataset.price;
      const isSubscribe = opt.querySelector('.pricing-opt__save');
      priceEl.textContent = isSubscribe ? `£${price}/mo` : `£${price}`;
    });
  });
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── NEWSLETTER FORM ──
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const note = document.getElementById('newsletterNote');
    note.textContent = "You're subscribed — check your inbox.";
    note.style.color = '#4ade80';
    e.target.querySelector('input').value = '';
  });
}

// ── ADD TO CART (demo) ──
document.querySelectorAll('.product-card .btn--primary').forEach(btn => {
  if (!btn.textContent.includes('Add to Cart')) return;
  btn.addEventListener('click', e => {
    e.preventDefault();
    const orig = btn.textContent;
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.textContent = orig; }, 1800);
  });
});
