const { ensureTable, listSignups } = require('../lib/db');

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function getKey(req) {
  return String(req.headers['x-admin-key'] || '');
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const adminKey = process.env.WAITLIST_ADMIN_KEY;
  if (!adminKey) {
    json(res, 503, { error: 'Admin access is not configured' });
    return;
  }

  if (getKey(req) !== adminKey) {
    json(res, 401, { error: 'Unauthorized' });
    return;
  }

  try {
    await ensureTable();
    const signups = await listSignups();
    json(res, 200, { count: signups.length, signups });
  } catch (err) {
    console.error('waitlist admin failed', err);
    json(res, 500, { error: 'Could not load signups' });
  }
};
