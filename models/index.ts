import fs from "fs";
import path from "path";
import process from "process";
import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import { fileURLToPath } from "url";

import configFile from "config/config.js";

interface AssociableModel extends ModelStatic<Model> {
  associate?: (db: DB) => void;
}

interface DB {
  [key: string]: ModelStatic<Model> | Sequelize;
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
}

interface EnvConfig {
  database: string;
  dialect: string;
  host: string;
  password: string;
  use_env_variable?: string;
  username: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = (process.env.NODE_ENV ?? "development") as keyof typeof configFile;
const envConfig = configFile[env] as EnvConfig;

const db: DB = {};

let sequelize: Sequelize;

if (envConfig.use_env_variable && process.env[envConfig.use_env_variable]) {
  sequelize = new Sequelize(process.env[envConfig.use_env_variable], envConfig);
} else {
  sequelize = new Sequelize(
    envConfig.database,
    envConfig.username,
    envConfig.password,
    envConfig
  );
}

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      !file.startsWith(".") &&
      file !== basename &&
      file.endsWith(".js") &&
      !file.includes(".test.js")
  );

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);
  const modelModule = (await import(modelPath)) as {
    default: (sequelize: Sequelize, dataTypes: typeof DataTypes) => AssociableModel;
  };

  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.values(db).forEach((model) => {
  const associableModel = model as AssociableModel;

  if (typeof associableModel.associate === "function") {
    associableModel.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
