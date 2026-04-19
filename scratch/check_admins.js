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
    
    const res = await client.query("SELECT name, email, role FROM \"User\" WHERE role = 'ADMIN'");
    console.log('Admin Users:', res.rows);
    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
