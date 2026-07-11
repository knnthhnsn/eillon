(() => {
  'use strict';

  const PREORDER_PATH = '/beles/preorder';
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'];

  function track(name, properties = {}) {
    let attempt = 0;
    const send = () => {
      if (typeof window.EILLON_ANALYTICS?.track === 'function') {
        window.EILLON_ANALYTICS.track(name, properties);
        return;
      }
      attempt += 1;
      if (attempt < 7) {
        window.setTimeout(send, 180 * attempt);
        return;
      }
      if (typeof window.va === 'function') {
        window.va('event', { name, page: window.location.pathname, ...properties });
      }
    };
    send();
  }

  function getUtm() {
    const fromAnalytics = window.EILLON_ANALYTICS?.getUtm?.();
    if (fromAnalytics && typeof fromAnalytics === 'object') return fromAnalytics;
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(
      UTM_KEYS.map((key) => [key, (params.get(key) || '').slice(0, 120)]),
    );
  }

  function getSource() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('source') || '';
    const incoming = /@/.test(raw) || (raw.match(/\d/g) || []).length >= 7
      ? ''
      : raw.replace(/[^a-z0-9_-]/gi, '').slice(0, 80);
    try {
      if (incoming) sessionStorage.setItem('eillon_preorder_source', incoming);
      return incoming || sessionStorage.getItem('eillon_preorder_source') || 'preorder_page';
    } catch {
      return incoming || 'preorder_page';
    }
  }

  function setProductCopy(product) {
    document.querySelectorAll(`[data-preorder-product="${product.id}"]`).forEach((card) => {
      card.querySelectorAll('[data-product-field]').forEach((node) => {
        const field = node.dataset.productField;
        if (field === 'price') {
          node.textContent = new Intl.NumberFormat('en-DK', {
            style: 'currency',
            currency: product.currency,
            maximumFractionDigits: 0,
          }).format(product.price);
        } else if (product[field]) {
          node.textContent = product[field];
        }
      });
    });
  }

  function injectProductSchema(product) {
    if (!product || document.getElementById('eillon-preorder-product-schema')) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'eillon-preorder-product-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `https://eillon.maison${PREORDER_PATH}#founder-sample`,
      name: 'Beles Founder Sample Preorder',
      description: product.description,
      image: 'https://eillon.maison/images/flacon-beles-1100.webp',
      sku: product.id,
      brand: { '@type': 'Brand', name: 'EILLON' },
      offers: {
        '@type': 'Offer',
        url: `https://eillon.maison${PREORDER_PATH}#founder-sample`,
        price: String(product.price),
        priceCurrency: product.currency,
        availability: 'https://schema.org/PreOrder',
        seller: { '@type': 'Organization', name: 'EILLON' },
      },
    });
    document.head.appendChild(script);
  }

  async function readConfig() {
    const response = await fetch('/api/preorder-config', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Preorder status unavailable');
    return response.json();
  }

  function initPreorderPage() {
    const localProducts = Array.isArray(window.EILLON_PREORDER_PRODUCTS)
      ? window.EILLON_PREORDER_PRODUCTS
      : [];
    localProducts.forEach(setProductCopy);

    const statusNodes = document.querySelectorAll('[data-preorder-status]');
    const buttons = [...document.querySelectorAll('[data-preorder-checkout]')];
    const cancelledNotice = document.getElementById('preorderCancelled');
    const params = new URLSearchParams(window.location.search);
    const source = getSource();

    let checkoutEnabled = false;
    let liveProducts = new Map();

    const setStatus = (state) => {
      const text = state === 'open'
        ? 'Founder preorder checkout is open'
        : state === 'closed'
          ? 'Founder preorder opening soon'
          : state === 'unavailable'
            ? 'Checkout status is temporarily unavailable'
            : 'Checking secure checkout';
      statusNodes.forEach((node) => {
        node.textContent = text;
      });
    };

    if (params.get('cancelled') === '1') {
      if (cancelledNotice) cancelledNotice.hidden = false;
      track('preorder_checkout_cancelled', { source });
    }

    document.querySelectorAll('[data-preorder-proof]').forEach((link) => {
      link.addEventListener('click', () => {
        track('preorder_proof_link_clicked', {
          label: link.dataset.analyticsLabel || link.textContent.trim().slice(0, 80),
          source,
        });
      });
    });

    buttons.forEach((button) => {
      button.addEventListener('click', async () => {
        if (!checkoutEnabled || button.disabled) return;
        const productId = button.dataset.preorderCheckout;
        const product = liveProducts.get(productId);
        if (!product?.enabled) return;

        const card = button.closest('[data-preorder-product]');
        const status = card?.querySelector('[data-offer-status]');
        const sizeInterest = product.type === 'bottle_deposit'
          ? card?.querySelector('input[name="bottle_size_interest"]:checked')?.value
          : 'sample';
        const utm = getUtm();

        track('preorder_offer_selected', {
          preorder_type: product.type,
          size_interest: sizeInterest || null,
          source,
        });

        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        const label = button.querySelector('[data-button-label]');
        if (label) label.textContent = 'Opening secure checkout';
        if (status) status.textContent = '';

        try {
          const response = await fetch('/api/create-preorder-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              product_id: productId,
              size_interest: sizeInterest,
              source,
              utm_source: utm.utm_source || null,
              utm_medium: utm.utm_medium || null,
              utm_campaign: utm.utm_campaign || null,
            }),
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok || !data.url) throw new Error(data.error || 'Checkout could not open');

          track('preorder_checkout_started', {
            preorder_type: product.type,
            size_interest: sizeInterest || null,
            source,
          });
          window.setTimeout(() => window.location.assign(data.url), 80);
        } catch (err) {
          if (status) status.textContent = err.message || 'Secure checkout could not open. Please try again.';
          button.disabled = false;
          button.removeAttribute('aria-busy');
          if (label) label.textContent = 'Continue to secure checkout';
        }
      });
    });

    setStatus('checking');
    track('preorder_page_viewed', { source });

    readConfig()
      .then((config) => {
        const products = Array.isArray(config.products) ? config.products : [];
        products.forEach(setProductCopy);
        liveProducts = new Map(products.map((product) => [product.id, product]));
        checkoutEnabled = config.enabled === true;
        setStatus(checkoutEnabled ? 'open' : 'closed');

        buttons.forEach((button) => {
          const product = liveProducts.get(button.dataset.preorderCheckout);
          const enabled = checkoutEnabled && product?.enabled === true;
          button.disabled = !enabled;
          button.setAttribute('aria-disabled', String(!enabled));
          const label = button.querySelector('[data-button-label]');
          if (label) label.textContent = enabled ? 'Continue to secure checkout' : 'Opening soon';
        });

        if (checkoutEnabled) {
          const sample = products.find((product) => product.type === 'sample_preorder' && product.enabled);
          injectProductSchema(sample);
        }
      })
      .catch(() => {
        checkoutEnabled = false;
        setStatus('unavailable');
        buttons.forEach((button) => {
          button.disabled = true;
          button.setAttribute('aria-disabled', 'true');
          const label = button.querySelector('[data-button-label]');
          if (label) label.textContent = 'Checkout unavailable';
        });
      });
  }

  async function initSuccessPage() {
    const title = document.getElementById('successTitle');
    const status = document.getElementById('successStatus');
    const detail = document.getElementById('successDetail');
    const sessionId = new URLSearchParams(window.location.search).get('session_id') || '';

    if (!/^cs_(?:test|live)_[A-Za-z0-9_]+$/.test(sessionId)) {
      if (status) status.textContent = 'We could not read the checkout reference.';
      if (detail) detail.textContent = 'Keep the payment confirmation from Stripe and contact care@eillon.maison if you need help.';
      return;
    }

    track('preorder_checkout_returned_success', { source: getSource() });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const response = await fetch(`/api/preorder-session?session_id=${encodeURIComponent(sessionId)}`, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        if (response.ok) {
          const preorder = await response.json();
          if (preorder.status === 'paid') {
            if (title) title.textContent = 'Payment received';
            if (status) status.textContent = 'Your founder preorder is recorded in the EILLON studio file.';
            if (detail) {
              detail.textContent = preorder.preorder_type === 'sample_preorder'
                ? 'Keep the payment confirmation from Stripe. We will write again when the first sample batch has passed final inspection and is ready to dispatch.'
                : 'Keep the payment confirmation from Stripe. We will write with your private bottle purchase window; no remaining bottle balance has been charged today.';
            }
            return;
          }
        }
      } catch {
        // The webhook can arrive just after the browser redirect; retry quietly.
      }
      await new Promise((resolve) => window.setTimeout(resolve, 900));
    }

    if (status) status.textContent = 'Your payment confirmation is still being filed.';
    if (detail) detail.textContent = 'Keep the payment confirmation from Stripe. If the studio confirmation does not arrive, contact care@eillon.maison with the Checkout reference.';
  }

  if (document.body.classList.contains('preorder-page')) initPreorderPage();
  if (document.body.classList.contains('preorder-success-page')) initSuccessPage();
})();
