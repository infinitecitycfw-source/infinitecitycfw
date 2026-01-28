exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Missing DISCORD_WEBHOOK_URL' }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const name = String(data.name || '').trim();
  const discord = String(data.discord || '').trim();
  const age = String(data.age || '').trim();
  const fivem = String(data.fivem || '').trim();
  const reason = String(data.reason || '').trim();
  const additional = String(data.additional || '').trim();

  if (!name || !discord || !age || !fivem || !reason) {
    return {
      statusCode: 400,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const content = [
    '**طلب تفعيل جديد**',
    `**الاسم:** ${name}`,
    `**Discord:** ${discord}`,
    `**العمر:** ${age}`,
    `**FiveM/Steam:** ${fivem}`,
    `**سبب التفعيل:** ${reason}`,
    additional ? `**معلومات إضافية:** ${additional}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: 502,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Discord webhook failed', details: text }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Request failed' }),
    };
  }
};
