import { readdirSync } from 'fs';
import { basename, join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import Sequelize, { DataTypes } from 'sequelize';
import configRaw from '../config/config.json' with {type: 'json'};


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const base = basename(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configRaw[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Dynamically import models
const modelFiles = readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 &&
    file !== base &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js')
  ));

for (const file of modelFiles) {
  const modulePath = pathToFileURL(join(__dirname, file)).href;
  const modelModule = await import(modulePath);
  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
