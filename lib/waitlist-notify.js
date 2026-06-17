const PRODUCT_LABELS = {
  beles: "Beles · Fico d'India",
  asmara: 'Asmara · Rain on Stone',
  massawa: 'Massawa · Red Sea Citrus',
  ritual: 'Ritual · Frankincense & Myrrh',
  all: 'EILLON Letter (all releases)',
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getNotifyRecipients() {
  const raw = process.env.WAITLIST_NOTIFY_EMAIL || process.env.ADMIN_NOTIFY_EMAIL || '';
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function buildEmail({ email, productSlug, source, size, isNew }) {
  const product = PRODUCT_LABELS[productSlug] || productSlug;
  const action = isNew ? 'New waitlist signup' : 'Waitlist signup updated';
  const subject = `${action} — ${product}`;
  const lines = [
    ['Email', email],
    ['Chapter', product],
    ['Source', source],
    ['Size', size || '—'],
    ['Status', isNew ? 'New signup' : 'Updated existing signup'],
  ];

  const text = [
    action,
    '',
    ...lines.map(([label, value]) => `${label}: ${value}`),
    '',
    'View all signups: https://eillon.maison/waitlist-admin',
  ].join('\n');

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #1c1c1a; line-height: 1.5;">
      <p style="font-family: Inter, Arial, sans-serif; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #6f6f6b;">
        ${escapeHtml(action)}
      </p>
      <h1 style="font-size: 24px; font-weight: 400; margin: 0 0 20px;">${escapeHtml(product)}</h1>
      <table style="border-collapse: collapse; font-family: Inter, Arial, sans-serif; font-size: 14px;">
        ${lines.map(([label, value]) => `
          <tr>
            <td style="padding: 6px 16px 6px 0; color: #6f6f6b; white-space: nowrap;">${escapeHtml(label)}</td>
            <td style="padding: 6px 0;">${escapeHtml(value)}</td>
          </tr>
        `).join('')}
      </table>
      <p style="margin-top: 24px; font-family: Inter, Arial, sans-serif; font-size: 13px;">
        <a href="https://eillon.maison/waitlist-admin">Open waitlist admin</a>
      </p>
    </div>
  `.trim();

  return { subject, text, html };
}

async function notifyWaitlistSignup(signup) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = getNotifyRecipients();
  const from = process.env.RESEND_FROM || 'EILLON <notifications@eillon.maison>';

  if (!apiKey || recipients.length === 0) {
    return { sent: false, reason: 'notifications_not_configured' };
  }

  const notifyOnUpdate = process.env.WAITLIST_NOTIFY_ON_UPDATE === 'true';
  if (!signup.isNew && !notifyOnUpdate) {
    return { sent: false, reason: 'existing_signup' };
  }

  const { subject, text, html } = buildEmail(signup);
  const idempotencyKey = `waitlist-notify/${signup.email}/${signup.productSlug}/${signup.isNew ? 'new' : 'update'}/${signup.updatedAt || 'now'}`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey.slice(0, 256),
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject,
      text,
      html,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Resend request failed (${response.status})`);
  }

  return { sent: true, id: payload.id };
}

module.exports = { notifyWaitlistSignup };
