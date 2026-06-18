# care@eillon.maison setup

`care@eillon.maison` is the public studio address on the site (mailto links, imprint, shipping). It only works after **DNS** and **forwarding** are configured at Porkbun.

## Current status

`eillon.maison` uses Porkbun nameservers. As of setup, there were **no MX records**, so mail to `care@eillon.maison` was rejected by the internet — not a website bug.

## Receiving mail (Porkbun forwarding — recommended)

Free, ~5 minutes. Replies still send from your personal inbox unless you add hosted email.

### 1. Log in to Porkbun

Open [https://porkbun.com/account/login](https://porkbun.com/account/login) in your browser.

### 2. Create the forward

1. **Domain Management** → find `eillon.maison`
2. Click the **envelope** icon under Email
3. Under **Porkbun Email Forwarding**, create:
   - **Username:** `care`
   - **Forward to:** your personal inbox (e.g. your Gmail)
4. Click **Create Email Forward**

### 3. Fix DNS (MX + SPF)

On the same Email Hosting page, scroll down and click **Fix DNS** → OK.

This adds:

| Type | Host | Value | Priority |
|------|------|-------|----------|
| MX | @ | fwd1.porkbun.com | 10 |
| MX | @ | fwd2.porkbun.com | 20 |
| TXT | @ | v=spf1 include:_spf.porkbun.com ~all | — |

Or run locally with Porkbun API keys:

```bash
export PORKBUN_API_KEY=pk1_...
export PORKBUN_SECRET_API_KEY=sk1_...
node scripts/setup-porkbun-email-dns.mjs
```

Keys: [porkbun.com/account/api](https://porkbun.com/account/api)

### 4. Verify

```bash
node scripts/check-email-dns.mjs
```

Send a test email **from an address that is not your forward destination** (avoids Porkbun feedback loops).

## Sending mail (Resend — waitlist notifications)

Outbound API mail uses Resend. Set in Vercel:

| Variable | Example |
|----------|---------|
| `RESEND_API_KEY` | From [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_FROM` | `EILLON <care@eillon.maison>` |
| `WAITLIST_NOTIFY_EMAIL` | Your inbox for signup alerts |

Verify `eillon.maison` (or subdomain `send.eillon.maison`) in Resend → Domains → add DNS records Porkbun shows in Resend dashboard.

Until the domain is verified, Resend cannot send from `@eillon.maison`.

## Optional: send/receive from care@ in Gmail

Porkbun **hosted email** (~$2/month) or Google Workspace gives a real mailbox and Gmail “Send mail as” for replies from `care@eillon.maison`.
