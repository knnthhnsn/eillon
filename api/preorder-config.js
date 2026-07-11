const {
  getPublicPreorderProducts,
  getPreorderRuntimeStatus,
} = require('../lib/preorder-config');

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  const runtime = getPreorderRuntimeStatus();
  const enabled = runtime.enabled;
  json(res, 200, {
    enabled,
    status: enabled ? 'open' : 'opening_soon',
    products: getPublicPreorderProducts(),
  });
};
