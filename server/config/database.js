const { Pool } = require('pg');
require('dotenv').config();

// Parse Railway's DATABASE_URL if available
let dbConfig = {};

if (process.env.DATABASE_URL) {
  // Railway provides DATABASE_URL in format: postgresql://user:password@host:port/database
  const url = new URL(process.env.DATABASE_URL);
  dbConfig = {
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: url.port,
    database: url.pathname.slice(1), // Remove leading slash
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
} else {
  // Fallback to individual environment variables
  dbConfig = {
    user: process.env.DB_USER || process.env.PGUSER || 'postgres',
    host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
    database: process.env.DB_NAME || process.env.PGDATABASE || 'smart_student_hub',
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'password',
    port: process.env.DB_PORT || process.env.PGPORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});

module.exports = pool;