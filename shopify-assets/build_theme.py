import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')

BASE = r'c:\Users\archi\Desktop\CLAUDE\MOONBITES WEBSITE'
OUT = os.path.join(BASE, 'shopify-assets')

CDN = {
    'logo-icon-sm.png': 'https://cdn.shopify.com/s/files/1/1021/6305/4979/files/moonbites-logo-icon.png?v=1781468044',
    '1.jpg': 'https://cdn.shopify.com/s/files/1/1021/6305/4979/files/moonbites-product-1.jpg?v=1781468045',
    '2.jpg': 'https://cdn.shopify.com/s/files/1/1021/6305/4979/files/moonbites-benefits.jpg?v=1781468045',
    '4.jpg': 'https://cdn.shopify.com/s/files/1/1021/6305/4979/files/moonbites-how-it-works.jpg?v=1781468045',
    '6.jpg': 'https://cdn.shopify.com/s/files/1/1021/6305/4979/files/moonbites-hero.jpg?v=1781468045',
}

# ───────────────────────── CSS ─────────────────────────
with open(os.path.join(BASE, 'styles.css'), encoding='utf-8') as f:
    css = f.read()

css += """

/* ── NAV CART COUNT BADGE ── */
.nav__cart { position: relative; text-decoration: none; }
.nav__cart-count {
  position: absolute; top: -6px; right: -10px;
  background: var(--violet); color: #08101a;
  font-size: 0.62rem; font-weight: 700; line-height: 1;
  border-radius: 50px; padding: 2px 5px; min-width: 14px; text-align: center;
}
"""

with open(os.path.join(OUT, 'moonbites.css'), 'w', encoding='utf-8') as f:
    f.write(css)
print(f'Wrote moonbites.css ({len(css)} chars)')

# ───────────────────────── JS ─────────────────────────
with open(os.path.join(BASE, 'script.js'), encoding='utf-8') as f:
    js = f.read()

old_block = """// ── ADD TO CART (demo) ──
document.querySelectorAll('.product-card .btn--primary').forEach(btn => {
  if (!btn.textContent.includes('Add to Cart')) return;
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
});"""

new_block = """// ── ADD TO CART (Shopify) ──
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
updateCartCount();"""

if old_block not in js:
    print('ERROR: old add-to-cart block not found!')
else:
    js = js.replace(old_block, new_block)

with open(os.path.join(OUT, 'moonbites.js'), 'w', encoding='utf-8') as f:
    f.write(js)
print(f'Wrote moonbites.js ({len(js)} chars)')

# ───────────────────────── LAYOUT ─────────────────────────
layout = """<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoonBites — Sleep Better Tonight</title>
  <meta name="description" content="MoonBites are delicious melatonin gummies crafted with adaptogens and botanicals to help you fall asleep faster, stay asleep longer, and wake up refreshed.">
  {%- if settings.favicon != blank -%}
    <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
  {%- endif -%}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  {{ 'moonbites.css' | asset_url | stylesheet_tag }}
  {{ content_for_header }}
</head>
<body>
  {{ content_for_layout }}
  <script src="{{ 'moonbites.js' | asset_url }}" defer></script>
</body>
</html>
"""

with open(os.path.join(OUT, 'moonbites-layout.liquid'), 'w', encoding='utf-8') as f:
    f.write(layout)
print(f'Wrote moonbites-layout.liquid ({len(layout)} chars)')

# ───────────────────────── TEMPLATE (index.liquid) ─────────────────────────
with open(os.path.join(BASE, 'index.html'), encoding='utf-8') as f:
    html = f.read()

body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
body = body_match.group(1).strip()

# remove the local script tag (replaced by layout's asset script)
body = re.sub(r'\s*<script src="script\.js"></script>\s*$', '', body)

# replace local image references with Shopify CDN URLs
for local, cdn in CDN.items():
    body = body.replace(f'src="{local}"', f'src="{cdn}"')

# ── Pricing toggle + Add to Cart block ──
old_pricing = """            <div class="pricing-toggle">
              <label class="pricing-opt pricing-opt--active" data-price="34.99">
                <input type="radio" name="price-main" checked />
                <span class="pricing-opt__label">One-time</span>
                <span class="pricing-opt__price">£34.99</span>
              </label>
              <label class="pricing-opt" data-price="22.74">
                <input type="radio" name="price-main" />
                <span class="pricing-opt__label">Subscribe &amp; Save 35%</span>
                <span class="pricing-opt__price">£22.74/mo</span>
                <span class="pricing-opt__save">BEST VALUE</span>
              </label>
            </div>
            <div class="product-card__footer">
              <span class="product-card__price" data-original="£34.99">£34.99</span>
              <a href="#" class="btn btn--primary">Add to Cart</a>
            </div>"""

new_pricing = """            <div class="pricing-toggle" data-variant-id="{{ variant.id }}">
              <label class="pricing-opt pricing-opt--active" data-price="{{ variant.price | money_without_currency }}" data-selling-plan="">
                <input type="radio" name="price-main" checked />
                <span class="pricing-opt__label">One-time</span>
                <span class="pricing-opt__price">{{ variant.price | money }}</span>
              </label>
              <label class="pricing-opt" data-price="{{ subscribe_price | money_without_currency }}" data-selling-plan="{{ subscribe_plan.id | default: '' }}">
                <input type="radio" name="price-main" />
                <span class="pricing-opt__label">Subscribe &amp; Save 35%</span>
                <span class="pricing-opt__price">{{ subscribe_price | money }}/mo</span>
                <span class="pricing-opt__save">BEST VALUE</span>
              </label>
            </div>
            <div class="product-card__footer">
              <span class="product-card__price" data-original="{{ variant.price | money }}">{{ variant.price | money }}</span>
              <button type="button" class="btn btn--primary">Add to Cart</button>
            </div>"""

if old_pricing not in body:
    print('ERROR: pricing block not found!')
else:
    body = body.replace(old_pricing, new_pricing)

# ── Nav cart icon -> link to /cart with count badge ──
old_cart_btn = '<button class="nav__cart" aria-label="Cart">🛒</button>'
new_cart_btn = '<a href="/cart" class="nav__cart" aria-label="Cart">🛒<span class="nav__cart-count" id="cartCount"></span></a>'
if old_cart_btn not in body:
    print('ERROR: nav cart button not found!')
else:
    body = body.replace(old_cart_btn, new_cart_btn)

# ── Sticky mobile CTA price ──
old_sticky = '<a href="#products" class="btn btn--primary">🌙 Shop MoonBites — From £24.99</a>'
new_sticky = '<a href="#products" class="btn btn--primary">🌙 Shop MoonBites — From {{ subscribe_price | money }}/mo</a>'
if old_sticky not in body:
    print('ERROR: sticky CTA not found!')
else:
    body = body.replace(old_sticky, new_sticky)

liquid_preamble = """{% layout 'moonbites' %}
{%- assign product = all_products['moonbites-sleep-gummies'] -%}
{%- assign variant = product.selected_or_first_available_variant -%}
{%- assign subscribe_plan = nil -%}
{%- for group in product.selling_plan_groups -%}
  {%- for plan in group.selling_plans -%}
    {%- assign subscribe_plan = plan -%}
  {%- endfor -%}
{%- endfor -%}
{%- assign subscribe_price = variant.price | times: 0.65 -%}

"""

index_liquid = liquid_preamble + body + '\n'

with open(os.path.join(OUT, 'index.liquid'), 'w', encoding='utf-8') as f:
    f.write(index_liquid)
print(f'Wrote index.liquid ({len(index_liquid)} chars)')

print('\nAll files written to', OUT)
