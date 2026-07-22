// ── CHECKOUT ORDER SUMMARY (driven by URL params) ──
(function () {
  const params = new URLSearchParams(window.location.search);
  const item = params.get('item') || 'gummies';

  const catalog = {
    single:  { label: 'Subscribe &amp; Save — 1 Tub', unit: 23.99, was: 29.99, qty: 1, img: '1.jpg', name: 'MoonBites Sleep Gummies' },
    triple:  { label: 'Buy 2, Get 1 FREE — 3 Tubs', unit: 17.99, was: 29.99, qty: 3, img: '1.jpg', name: 'MoonBites Sleep Gummies' },
    hamper:  { label: 'Members Hamper Bundle', unit: 39.99, was: 39.99, qty: 1, img: 'hamper-bundle.jpg', name: 'MoonBites Members Hamper Bundle' },
  };

  const plan = catalog[item] || catalog.triple;
  const subtotal = plan.unit * plan.qty;
  const wasTotal = plan.was * plan.qty;
  const saving = wasTotal - subtotal;
  const fmt = n => `£${n.toFixed(2)}`;

  const setText = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  setText('checkoutPlanLabel', plan.label);
  setText('checkoutPlanRate', plan.unit < plan.was
    ? `${fmt(plan.unit)}/tub <s>${fmt(plan.was)}/tub</s>`
    : (plan.qty > 1 ? `${fmt(plan.unit)}/tub` : ''));
  setText('checkoutItemPrice', fmt(subtotal));
  setText('checkoutSubtotal', fmt(subtotal));
  setText('checkoutSaving', saving > 0 ? `−${fmt(saving)}` : '£0.00');
  setText('checkoutTotal', fmt(subtotal));
  setText('orderTotalBtn', fmt(subtotal));

  const imgEl = document.querySelector('.checkout__item img');
  if (imgEl) { imgEl.src = plan.img; imgEl.alt = plan.name; }
  const nameEl = document.querySelector('.checkout__item-info strong');
  if (nameEl) nameEl.textContent = plan.name;

  const savingRow = document.querySelector('.checkout__totals-row--saving');
  if (savingRow && saving <= 0) savingRow.style.display = 'none';

  // gifts only relevant to the gummies membership, not the hamper itself
  const giftsBlock = document.querySelector('.checkout__gifts');
  if (giftsBlock && item === 'hamper') giftsBlock.style.display = 'none';
})();

// ── PLACE ORDER (demo) ──
document.getElementById('placeOrderBtn').addEventListener('click', () => {
  const inputs = document.querySelectorAll('#checkoutStep input[required], #checkoutStep select[required]');
  let valid = true;
  inputs.forEach(el => { if (!el.value.trim()) { valid = false; el.style.borderColor = '#e05050'; } else { el.style.borderColor = ''; } });
  if (!valid) return;

  document.getElementById('checkoutStep').style.display = 'none';
  document.getElementById('checkoutConfirm').classList.add('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
