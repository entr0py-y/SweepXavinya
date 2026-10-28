/* Hindsight-powered SweepX agent.
   The API key is intentionally kept on the server and is never sent to the browser. */

const HINDSIGHT_BASE_URL = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';
const HINDSIGHT_BANK_ID = process.env.HINDSIGHT_BANK_ID || 'sweepx';

function hindsightUrl(path) {
  return `${HINDSIGHT_BASE_URL.replace(/\/$/, '')}/v1/default/banks/${encodeURIComponent(HINDSIGHT_BANK_ID)}${path}`;
}

async function hindsightRequest(path, body) {
  const apiKey = process.env.HINDSIGHT_API_KEY;
  if (!apiKey) throw new Error('Hindsight is not configured. Add HINDSIGHT_API_KEY to .env.local.');

  const response = await fetch(hindsightUrl(path), {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail || data.message || data.error;
    throw new Error(detail ? `Hindsight request failed: ${detail}` : `Hindsight request failed (${response.status}).`);
  }
  return data;
}

function cleanUserId(value) {
  return String(value || 'anonymous').replace(/[^a-zA-Z0-9:_-]/g, '_').slice(0, 80);
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, userId, username, history } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'A message is required.' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long. Please keep it under 2,000 characters.' });
  }

  const tag = `user:${cleanUserId(userId || username)}`;
  const safeHistory = Array.isArray(history)
    ? history.slice(-8).filter(item => item && (item.role === 'user' || item.role === 'assistant'))
      .map(item => `${item.role === 'user' ? 'User' : 'SweepX Agent'}: ${String(item.content || '').slice(0, 1000)}`)
    : [];
  const query = [
    'You are SweepX Agent, a helpful, concise assistant for a community cleanup app.',
    'Help users understand reports, missions, cleanup best practices, safety, and how to use SweepX.',
    'Do not claim to have performed actions or know live data unless it is in memory.',
    safeHistory.length ? `Recent conversation:\n${safeHistory.join('\n')}` : '',
    `User: ${message.trim()}`
  ].filter(Boolean).join('\n\n');

  try {
    const answer = await hindsightRequest('/reflect', {
      query,
      budget: 'low',
      max_tokens: 500,
      tags: [tag],
      tags_match: 'any_strict'
    });

    const text = typeof answer.text === 'string' && answer.text.trim()
      ? answer.text.trim()
      : 'I could not produce a response right now. Please try again.';

    // Memory retention is best-effort: a temporary memory write failure should not hide a valid reply.
    hindsightRequest('/memories/retain', {
      content: `User (${username || 'anonymous'}): ${message.trim()}\nSweepX Agent: ${text}`,
      tags: [tag]
    }).catch(error => console.warn('Hindsight memory retention failed:', error.message));

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Hindsight chat error:', error);
    return res.status(502).json({ error: error.message || 'The SweepX Agent is unavailable.' });
  }
};
