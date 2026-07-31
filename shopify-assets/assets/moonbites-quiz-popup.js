/* MoonBites Quiz Popup — vanilla JS, no dependencies. */
(function () {
  'use strict';

  var root = document.getElementById('mbq-root');
  if (!root) return;

  var SUPPRESSED_PATHS = ['/cart', '/checkout', '/pages/account'];
  var path = window.location.pathname;
  for (var i = 0; i < SUPPRESSED_PATHS.length; i++) {
    if (path.indexOf(SUPPRESSED_PATHS[i]) !== -1) return;
  }

  var DISMISS_KEY = 'mbq_dismissed';
  var CONVERTED_KEY = 'mbq_converted';
  var DISMISS_DAYS = 30;
  var CONVERTED_DAYS = 365;

  function isSuppressed() {
    var converted = safeGet(CONVERTED_KEY);
    if (converted && !isExpired(converted, CONVERTED_DAYS)) return true;
    var dismissed = safeGet(DISMISS_KEY);
    if (dismissed && !isExpired(dismissed, DISMISS_DAYS)) return true;
    return false;
  }

  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { window.localStorage.setItem(key, val); } catch (e) { /* storage unavailable, fail silently */ }
  }
  function isExpired(timestamp, days) {
    var then = parseInt(timestamp, 10);
    if (isNaN(then)) return true;
    return (Date.now() - then) > days * 24 * 60 * 60 * 1000;
  }

  if (isSuppressed()) return;

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var overlay = document.getElementById('mbqOverlay');
  var card = document.getElementById('mbqCard');
  var closeBtn = document.getElementById('mbqClose');
  var skipBtn = document.getElementById('mbqSkip1');
  var backBtn = document.getElementById('mbqBack');
  var options = root.querySelectorAll('.mbq-option');
  var responseEl = document.getElementById('mbqResponse');
  var form = document.getElementById('mbqForm');
  var emailInput = document.getElementById('mbqEmail');
  var errorEl = document.getElementById('mbqError');
  var submitBtn = document.getElementById('mbqSubmit');
  var copyBtn = document.getElementById('mbqCopy');
  var codeEl = document.getElementById('mbqCode');
  var shopCta = document.getElementById('mbqShopCta');
  var consentInput = document.getElementById('mbqConsent');
  var steps = root.querySelectorAll('.mbq-step');

  var currentSegment = null;
  var lastFocusedEl = null;
  var isOpen = false;
  var triggersActive = false;

  // ── Analytics helpers ──
  function pushEvent(name, data) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, data || {}));
    } catch (e) { /* no-op */ }
    try {
      if (typeof window.fbq === 'function') {
        if (name === 'Lead') window.fbq('track', 'Lead', data || {});
        else window.fbq('trackCustom', name, data || {});
      }
    } catch (e) { /* no-op */ }
  }

  // ── Step navigation ──
  function showStep(name) {
    steps.forEach(function (step) {
      var active = step.getAttribute('data-step') === name;
      step.classList.toggle('is-active', active);
    });
    if (name === 'email' && emailInput) {
      setTimeout(function () { emailInput.focus(); }, prefersReducedMotion ? 0 : 200);
    }
  }

  // ── Focus trap ──
  function getFocusable() {
    return card.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
  }
  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var focusable = getFocusable();
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
  function onKeydown(e) {
    if (e.key === 'Escape') { closePopup(false); return; }
    trapFocus(e);
  }

  // ── Open / close ──
  function openPopup() {
    if (isOpen) return;
    isOpen = true;
    lastFocusedEl = document.activeElement;
    overlay.hidden = false;
    // Force reflow so the opacity/transform transition actually runs.
    void overlay.offsetHeight;
    overlay.setAttribute('data-open', 'true');
    document.addEventListener('keydown', onKeydown);
    document.body.style.overflow = 'hidden';
    setTimeout(function () { closeBtn.focus(); }, prefersReducedMotion ? 0 : 350);
    pushEvent('QuizStarted', {});
  }

  function closePopup(converted) {
    if (!isOpen) return;
    isOpen = false;
    overlay.setAttribute('data-open', 'false');
    document.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';
    if (!converted) safeSet(DISMISS_KEY, String(Date.now()));
    setTimeout(function () {
      overlay.hidden = true;
      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
    }, prefersReducedMotion ? 0 : 350);
  }

  closeBtn.addEventListener('click', function () { closePopup(false); });
  skipBtn.addEventListener('click', function () { closePopup(false); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) closePopup(false); });
  backBtn.addEventListener('click', function () { showStep('quiz'); });

  // ── Step 1: segment selection ──
  options.forEach(function (btn) {
    btn.addEventListener('click', function () {
      currentSegment = btn.getAttribute('data-segment');
      var response = btn.getAttribute('data-response') || '';
      responseEl.textContent = response;
      pushEvent('QuizAnswered', { segment: currentSegment });
      showStep('email');
    });
  });

  // ── Step 2: email validation + submit ──
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(msg) {
    if (msg) {
      errorEl.textContent = msg;
      errorEl.hidden = false;
      emailInput.classList.add('is-invalid');
    } else {
      errorEl.hidden = true;
      emailInput.classList.remove('is-invalid');
    }
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.setAttribute('data-loading', loading ? 'true' : 'false');
  }

  /**
   * submitLead — abstracts the lead-capture destination.
   *
   * Default path: Shopify's native customer/newsletter form endpoint.
   *
   * TODO(klaviyo): to switch to Klaviyo, replace the body of this function
   * with a call to Klaviyo's public `client/subscriptions` API, e.g.:
   *
   *   var KLAVIYO_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   *   var KLAVIYO_LIST_ID = root.dataset.klaviyoListId; // already wired via schema
   *   return fetch('https://a.klaviyo.com/client/subscriptions?company_id=' + KLAVIYO_PUBLIC_KEY, {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json', revision: '2024-10-15' },
   *     body: JSON.stringify({
   *       data: {
   *         type: 'subscription',
   *         attributes: {
   *           profile: { data: { type: 'profile', attributes: {
   *             email: email,
   *             properties: { sleep_segment: segment }
   *           } } },
   *           custom_source: 'MoonBites Quiz Popup'
   *         },
   *         relationships: { list: { data: { type: 'list', id: KLAVIYO_LIST_ID } } }
   *       }
   *     })
   *   });
   *
   * No refactor needed elsewhere — the caller only cares that this returns
   * a Promise that resolves on success and rejects on failure.
   */
  function submitLead(payload) {
    var email = payload.email;
    var segment = payload.segment;
    var body = new URLSearchParams({
      form_type: 'customer',
      utf8: '✓',
      'contact[email]': email,
      'contact[tags]': segment || '',
      'contact[accepts_marketing]': 'true'
    });
    return fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    }).then(function (res) {
      if (!res.ok) throw new Error('Lead submission failed with status ' + res.status);
      return res;
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = emailInput.value.trim();

    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address.');
      emailInput.focus();
      return;
    }
    if (consentInput && !consentInput.checked && consentInput.hasAttribute('required')) {
      setError('Please confirm you’d like to receive emails.');
      return;
    }
    setError(null);
    setLoading(true);

    submitLead({ email: email, segment: currentSegment })
      .then(function () {
        safeSet(CONVERTED_KEY, String(Date.now()));
        try { window.localStorage.removeItem(DISMISS_KEY); } catch (e) { /* no-op */ }
        pushEvent('Lead', { segment: currentSegment });
        setLoading(false);
        showStep('reveal');
      })
      .catch(function () {
        setLoading(false);
        setError('Something went wrong — please try again.');
      });
  });

  // ── Step 3: copy code ──
  copyBtn.addEventListener('click', function () {
    var code = codeEl.textContent.trim();
    function markCopied() {
      copyBtn.setAttribute('data-copied', 'true');
      setTimeout(function () { copyBtn.removeAttribute('data-copied'); }, 2200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(markCopied).catch(function () { fallbackCopy(code, markCopied); });
    } else {
      fallbackCopy(code, markCopied);
    }
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
    done();
  }

  // ── Trigger setup: delay / scroll / exit-intent, first past the post wins ──
  function setupTriggers() {
    if (triggersActive) return;
    triggersActive = true;

    var delaySeconds = parseInt(root.getAttribute('data-delay'), 10);
    var scrollPct = parseInt(root.getAttribute('data-scroll'), 10);
    var exitEnabled = root.getAttribute('data-exit-intent') === 'true';
    var isDesktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var fired = false;
    function fire() {
      if (fired) return;
      fired = true;
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onExitIntent);
      openPopup();
    }

    var delayTimer = null;
    if (!isNaN(delaySeconds) && delaySeconds >= 0) {
      delayTimer = setTimeout(fire, delaySeconds * 1000);
    }

    function onScroll() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) return;
      var pct = (window.scrollY / scrollable) * 100;
      if (pct >= scrollPct) fire();
    }
    if (!isNaN(scrollPct)) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    function onExitIntent(e) {
      if (e.clientY > 0) return;
      fire();
    }
    if (exitEnabled && isDesktop) {
      document.addEventListener('mouseout', onExitIntent);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTriggers);
  } else {
    setupTriggers();
  }
})();
