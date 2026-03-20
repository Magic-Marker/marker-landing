// Cloudflare Worker: Userlist Push API proxy
// Deploy via Cloudflare dashboard, then add USERLIST_PUSH_KEY as an encrypted secret.

const ALLOWED_ORIGINS = [
  'https://marker.page',
  'https://www.marker.page',
  'http://localhost:8765',
  'http://localhost:3000',
  'http://127.0.0.1:8765',
  'null',
];

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);
    const headers = isAllowed ? corsHeaders(origin) : {};

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers });
    }

    if (!isAllowed) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      const body = await request.json();

      const res = await fetch('https://push.userlist.com/users', {
        method: 'POST',
        headers: {
          'Authorization': 'Push ' + env.USERLIST_PUSH_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: body.email,
          properties: body.properties || {},
        }),
      });

      return new Response(JSON.stringify({ ok: res.ok }), {
        status: res.ok ? 200 : 502,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Bad request' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
