// nails-business/config/config.js
import 'dotenv/config'; // Ensure dotenv is loaded for process.env

const config = {
  development: {
    username: process.env.DB_USERNAME || 'your_dev_db_user',
    password: process.env.DB_PASSWORD || 'your_dev_db_password',
    database: process.env.DB_DATABASE || 'your_dev_db_name',
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres', // e.g., 'mysql', 'sqlite', 'postgres', 'mssql'
    port: process.env.DB_PORT || 5432, // Default port for PostgreSQL
    logging: false, // Set to true to see SQL queries in console
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // For self-signed certs or development, set to true for production with valid certs
      }
    }
  }
};

export default config;