import {drizzle} from 'drizzle-orm/neon-http';
import {neon} from '@neondatabase/serverless';
import * as schema from './schema';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Neon serverless connection
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle ORM instance with schema
const db = drizzle(sql, { schema });

console.log('✅ Database connection initialized');

export default db;
