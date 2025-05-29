import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Next.jsではdotenv不要。process.env.DATABASE_URLは自動で注入される
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

export const db = drizzle(pool);