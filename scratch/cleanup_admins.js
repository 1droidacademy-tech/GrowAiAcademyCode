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
    
    console.log('REMOVING UNAUTHORIZED ADMINS...');
    const res = await client.query(`
      UPDATE "User" 
      SET role = 'STUDENT' 
      WHERE email != 'bharathiraj.poongan@gmail.com' AND role = 'ADMIN'
    `);
    
    console.log(`Demoted ${res.rowCount} users to STUDENT.`);
    
    // Also explicitly delete the temporary test account if it exists
    await client.query(`DELETE FROM "User" WHERE email = 'admin@growaiedu.com'`);
    console.log('Deleted temporary admin@growaiedu.com account.');

    client.release();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
