import { neon } from '@neondatabase/serverless';

export async function handler(event, context) {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'DATABASE_URL environment variable missing on server' })
    };
  }

  try {
    const sql = neon(dbUrl);
    const rows = await sql`
      SELECT 
        id, 
        extracted_at, 
        base_price::float, 
        cabin_class, 
        upgrade_cost::float, 
        boarding_group, 
        available_seats_left 
      FROM flight_prices 
      ORDER BY extracted_at DESC
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(rows)
    };
  } catch (err) {
    console.error("Netlify Function Neon DB query error:", err);
    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Database query failed', details: err.message })
    };
  }
}
