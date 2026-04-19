const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually load .env since it's not in the environment
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL="(.+)"/);
const connectionString = dbUrlMatch ? dbUrlMatch[1] : null;

async function main() {
  if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    return;
  }

  const pool = new Pool({ connectionString });
  
  try {
    const client = await pool.connect();
    await client.query('SET search_path TO growaiedu');
    
    console.log('UPDATING SPECIFIC COURSE...');
    const res = await client.query(`
      UPDATE "Course" 
      SET 
        title = 'AI Essentials for School Students',
        price = 3000, 
        early_discount = 500 
      WHERE 
        id = 'ai-bootcamp'
      RETURNING id, title, price, early_discount
    `);
    
    console.log('Update result:', res.rows);
    client.release();
  } catch (err) {
    console.error('Error executing query', err);
  } finally {
    await pool.end();
  }
}

main();
