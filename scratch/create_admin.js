const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="(.+)"/);
const connectionString = dbUrlMatch ? dbUrlMatch[1] : null;

async function main() {
  if (!connectionString) return;

  const pool = new Pool({ connectionString });
  const password_hash = await bcrypt.hash('admin123', 10);
  
  try {
    const client = await pool.connect();
    await client.query('SET search_path TO growaiedu');
    
    console.log('CREATING ADMIN USER...');
    await client.query(`
      INSERT INTO "User" (id, name, email, phone, password_hash, role)
      VALUES (gen_random_uuid(), 'System Admin', 'admin@growaiedu.com', '9999999999', $1, 'ADMIN')
      ON CONFLICT (email) DO UPDATE SET role = 'ADMIN'
    `, [password_hash]);
    
    console.log('Admin account created: admin@growaiedu.com / admin123');
    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
