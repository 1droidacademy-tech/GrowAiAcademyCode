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
    
    const res = await client.query('SELECT * FROM "PromoCode"');
    console.log('Existing Promo Codes:', res.rows);
    
    // Also check the target user's role
    const userRes = await client.query("SELECT email, role FROM \"User\" WHERE email = 'bharathiraj.poongan@gmail.com'");
    console.log('Target User Role:', userRes.rows);

    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
