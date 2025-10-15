// import dotenv from "dotenv/config";
import { Dialect } from "sequelize";

console.log("🔍 Environment Variables Debug:");
console.log("DB_USER:", process.env.DB_USER, "Type:", typeof process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***" : "UNDEFINED", "Type:", typeof process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME, "Type:", typeof process.env.DB_NAME);
console.log("DB_HOST:", process.env.DB_HOST, "Type:", typeof process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT, "Type:", typeof process.env.DB_PORT);
console.log("NODE_ENV:", process.env.NODE_ENV, "Type:", typeof process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "***" : "UNDEFINED");

// Validate required environment variables
const requiredEnvVars = ["DB_USER", "DB_PASSWORD", "DB_NAME", "DB_HOST"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:", missingVars);
  process.exit(1);
}

// Helper function to get dialect with fallback
const getDialect = (): Dialect => {
  const dialect = process.env.DB_DIALECT;
  if (dialect && ["mariadb", "mssql", "mysql", "postgres", "sqlite"].includes(dialect)) {
    return dialect as Dialect;
  }
  return "postgres"; // default to postgres
};

export default {
  development: {
    database: process.env.DB_NAME,
    dialect: getDialect(),
    host: process.env.DB_HOST,
    logging: console.log,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
  },
  production: {
    database: process.env.DB_NAME,
    dialect: getDialect(),
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
        require: true,
      },
    },
    host: process.env.DB_HOST,
    logging: false,
    password: process.env.DB_PASSWORD,
    pool: {
      acquire: 30000,
      idle: 10000,
      max: 5,
      min: 0,
    },
    port: process.env.DB_PORT,
    ssl: true,
    username: process.env.DB_USER,
  },
  test: {
    database: process.env.DB_NAME,
    dialect: getDialect(),
    host: process.env.DB_HOST,
    logging: false,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
  },
};
