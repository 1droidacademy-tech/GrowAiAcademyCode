const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="(.+)"/);
const connectionString = dbUrlMatch ? dbUrlMatch[1] : null;

async function main() {
  if (!connectionString) return;

  const pool = new Pool({ connectionString });
  
  try {
    const client = await pool.connect();
    await client.query('SET search_path TO growaiedu');
    
    console.log('ATTEMPTING TO CREATE PROMO CODE VIA SQL...');
    const res = await client.query(`
      INSERT INTO "PromoCode" (id, code, discount, is_active)
      VALUES (gen_random_uuid(), 'WELCOME500', 500, true)
      RETURNING *
    `);
    
    console.log('Success:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Database Error:', err);
  } finally {
    await pool.end();
  }
}

main();
