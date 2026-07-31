const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Local SQLite database file ka path
const dbPath = path.resolve(__dirname, 'app.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database error:', err.message);
  } else {
    console.log('SQLite Database se connect ho gaye hain.');
    
    // Items table create kar rahe hain
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Table banane me error:', err.message);
      } else {
        console.log('Items table tayar hai.');
      }
    });
  }
});

module.exports = db;