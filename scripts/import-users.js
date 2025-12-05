require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Database config
const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'siskeudes_db',
  DB_PORT = 3306
} = process.env;

async function importUsers() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: Number(DB_PORT)
    });

    console.log('Database connection established');

    // Read CSV file
    const csvPath = path.join(__dirname, '..', 'data', 'USERPASSWORD.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    console.log(`Found ${lines.length} lines in CSV`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const line of lines) {
      if (!line.trim()) continue;

      const [id, desa, username, password] = line.split(',');
      
      if (!desa || !username || !password) {
        console.log(`Skipping invalid line: ${line}`);
        skipped++;
        continue;
      }

      try {
        // Check if user already exists
        const [existing] = await connection.query('SELECT id FROM users WHERE username = ?', [username]);
        
        if (existing.length > 0) {
          console.log(`User ${username} already exists, skipping...`);
          skipped++;
          continue;
        }

        // Insert new user
        await connection.query(
          'INSERT INTO users (username, password, full_name, desa, role, status) VALUES (?, ?, ?, ?, ?, ?)',
          [username, password, desa, desa, 'admin', 'active']
        );

        console.log(`Imported: ${username} - ${desa}`);
        imported++;

      } catch (error) {
        console.error(`Error importing ${username}:`, error.message);
        errors++;
      }
    }

    console.log('\n=== Import Summary ===');
    console.log(`Total lines: ${lines.length}`);
    console.log(`Successfully imported: ${imported}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);

  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run import
importUsers().catch(console.error);