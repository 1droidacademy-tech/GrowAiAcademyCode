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
    
    // 1. Find the target user
    const userRes = await client.query("SELECT id, email, role FROM \"User\" WHERE email = $1", ['bharathiraj.poongan@gmail.com']);
    console.log('Target User Status:', userRes.rows);
    
    // 2. Find all admin users
    const adminRes = await client.query("SELECT email, role FROM \"User\" WHERE role = 'ADMIN'");
    console.log('All Current Admin Users:', adminRes.rows);
    
    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
