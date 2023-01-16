'use strict';
import dodo from 'dotenv';
dodo.config()
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
const basename = path.basename(__filename);
/**
 * @type {any}
 */
const env = process.env.NODE_ENV || 'development';
const configs  = require('./../config/config');

// @ts-ignore
const config = configs[env]
/**
 * @type {any}
 */
const db = {};

/**
 * @type {any}
 */
const dialect = config.dialect

/**
 * @type {Sequelize.Sequelize}
 */
let sequelize = new Sequelize.Sequelize(
  config.database,
  config.username,
   config.password,
   {
    host: config.host,
    dialect: dialect,
    pool: true ?{
      max: 5,
      min: 5,
      acquire: 30000,
      idle: 10000
    } : undefined
   }
  );

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
