import fs from "fs";
import path from "path";
import process from "process";
import { DataTypes, Dialect, Model, ModelStatic, Options, Sequelize } from "sequelize";
import { fileURLToPath } from "url";

import configFile from "../config/config.js";

interface AssociableModel extends ModelStatic<Model> {
  associate?: (db: Database) => void;
}

interface Database {
  [key: string]: ModelStatic<Model> | Sequelize | typeof Sequelize;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

interface EnvConfig {
  database: string;
  dialect: Dialect;
  host: string;
  logging?: ((sql: string, timing?: number) => void) | boolean;
  password: string;
  port?: number | string;
  use_env_variable?: string;
  username: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = (process.env.NODE_ENV ?? "development") as keyof typeof configFile;
const envConfig = configFile[env] as EnvConfig;

const db: Database = {} as Database;

let sequelize: Sequelize;

if (envConfig.use_env_variable && process.env[envConfig.use_env_variable]) {
  const databaseUrl = process.env[envConfig.use_env_variable];
  if (!databaseUrl) {
    throw new Error(`Environment variable ${envConfig.use_env_variable} is not set`);
  }

  // Create options object with only the properties Sequelize expects
  const options: Options = {
    dialect: envConfig.dialect,
    // Add other options that Sequelize expects
    dialectOptions:
      envConfig.dialect === "postgres"
        ? {
            ssl:
              process.env.NODE_ENV === "production"
                ? {
                    rejectUnauthorized: false,
                    require: true,
                  }
                : false,
          }
        : undefined,
    host: envConfig.host,
    logging: envConfig.logging,
    port: envConfig.port ? parseInt(envConfig.port as string) : undefined,
  };

  sequelize = new Sequelize(databaseUrl, options);
} else {
  // Validate required fields for non-URL connection
  if (!envConfig.database || !envConfig.username) {
    throw new Error("Database configuration is incomplete");
  }

  sequelize = new Sequelize(envConfig.database, envConfig.username, envConfig.password, {
    dialect: envConfig.dialect,
    host: envConfig.host,
    logging: envConfig.logging,
    port: envConfig.port ? parseInt(envConfig.port as string) : undefined,
    // Add production-specific options
    ...(process.env.NODE_ENV === "production" && {
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
          require: true,
        },
      },
      pool: {
        acquire: 30000,
        idle: 10000,
        max: 5,
        min: 0,
      },
      ssl: true,
    }),
  });
}

const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => !file.startsWith(".") && file !== basename && file.endsWith(".js") && !file.includes(".test.js"));

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);
  const modelModule = (await import(modelPath)) as {
    default: (sequelize: Sequelize, dataTypes: typeof DataTypes) => AssociableModel;
  };

  const model = modelModule.default(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  const model = db[modelName] as AssociableModel;
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
