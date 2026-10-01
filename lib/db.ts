import "server-only";

import mysql, { type Pool } from "mysql2/promise";

const globalForDb = globalThis as unknown as { finqDbPool?: Pool };

function createPool() {
  const required = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;
  const missing = required.filter((name) => process.env[name] === undefined);
  if (missing.length > 0) {
    throw new Error(`DB 환경변수가 없습니다: ${missing.join(", ")}`);
  }

  return mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 5,
    waitForConnections: true,
    timezone: "+09:00",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
    decimalNumbers: true,
  });
}

export function getDb() {
  if (!globalForDb.finqDbPool) globalForDb.finqDbPool = createPool();
  return globalForDb.finqDbPool;
}
