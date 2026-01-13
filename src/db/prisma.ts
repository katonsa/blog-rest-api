import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../lib/generated/prisma/client';

const isDev = process.env.NODE_ENV !== 'production';

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
  }),
  log: isDev ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
});

export { prisma };
