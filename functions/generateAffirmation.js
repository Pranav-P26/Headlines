import fetch from 'node-fetch';

export async function handler(event, context) {
  const { emotion = 'this moment' } = JSON.parse(event.body || '{}');
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return { statusCode: 500, body: 'Missing API key' };
  }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: [
          { role: 'system', content: 'You provide uplifting, personalized affirmations. Never reveal that you are an AI. Only print the affirmation.' },
          { role: 'user', content: `I am feeling ${emotion} after reading the news. Give me one unique affirmation to help.` },
        ],
        max_tokens: 60,
        temperature: 0.8,
      }),
    });

    const json = await res.json();
    const affirmation = json.choices?.[0]?.message?.content.trim() || '';
    return {
      statusCode: 200,
      body: JSON.stringify({ affirmation }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Error generating affirmation' };
  }
}
