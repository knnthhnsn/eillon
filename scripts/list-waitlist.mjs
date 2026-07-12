import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const env = readFileSync('.env.local', 'utf8');
const match = env.match(/^DATABASE_URL="([^"]+)"/m);
if (!match) throw new Error('DATABASE_URL missing in .env.local');

const sql = neon(match[1]);
const rows = await sql`
  SELECT name, email, selection_label, signup_intent, product_slug, size,
         format_price, currency, source, page_path, created_at, updated_at
  FROM waitlist_signups
  ORDER BY created_at DESC
`;
console.log(JSON.stringify(rows, null, 2));
