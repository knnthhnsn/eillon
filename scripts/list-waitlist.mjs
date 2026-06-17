import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const env = readFileSync('.env.local', 'utf8');
const match = env.match(/^DATABASE_URL="([^"]+)"/m);
if (!match) throw new Error('DATABASE_URL missing in .env.local');

const sql = neon(match[1]);
const rows = await sql`
  SELECT email, source, size, created_at
  FROM waitlist_signups
  ORDER BY created_at DESC
`;
console.log(JSON.stringify(rows, null, 2));
