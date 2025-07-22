// lib/db.js

import 'dotenv/config';
import { Sequelize, DataTypes } from "sequelize";
import configuration from '../config/config.js';

import 'pg';

// --- Explicitly import your models here ---
import userModel from './models/user.js';
import userPasswordModel from './models/userpassword.js';
// -----------------------------------------

const env = process.env.NODE_ENV || 'development';
const config = configuration[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  port: config.port,
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: config.dialectOptions || {},
});

// --- Initialize models and add them to the db object ---
db.User = userModel(sequelize, DataTypes);
db.UserPassword = userPasswordModel(sequelize, DataTypes);
// ----------------------------------------------------

// Set up associations between models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Test connection and sync database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    // In production, use migrations instead of sync
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or sync models:', error);
  }
})();

export default db; // Export the db object directly