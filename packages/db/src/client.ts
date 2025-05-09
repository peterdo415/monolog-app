// packages/db/src/client.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';

// .env から DATABASE_URL をロード
dotenv.config({ path: process.cwd() + '/.env' });

const pool = new Pool({
  connectionString: String(process.env.DATABASE_URL),
  max: 10,
});

export const db = drizzle(pool);
