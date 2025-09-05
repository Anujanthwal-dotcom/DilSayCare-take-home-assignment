import type { Knex } from "knex";
import dotenv from "dotenv";
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, "../.env")
}); 

// Common config
const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg", 
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "mydb",
    },
    migrations: {
      directory: "./migrations",
      extension: "ts", 
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL, 
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./seeds",
      extension: "ts",
    },
  },
};

export default config;
