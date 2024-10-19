import { z } from 'zod'

const envSchema = z.object({
  API_BASE_URL: z.string().default('http://localhost:3333'),
  AUTH_REDIRECT_URL: z.string().default('http://localhost:5173'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.number().default(5432),
  DB_USER: z.string().default('docker'),
  DB_PASSWORD: z.string().default('docker'),
  DB_NAME: z.string().default('pizzashop'),
  DB_SSL: z.boolean().default(false),
  JWT_SECRET_KEY: z.string().default('yu64dUaHCMFsXh2'),
})

export const env = envSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3333',
  AUTH_REDIRECT_URL: process.env.API_BASE_URL ||'http://localhost:5173',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  DB_USER: process.env.DB_USER || 'docker',
  DB_PASSWORD: process.env.DB_PASSWORD || 'docker',
  DB_NAME: process.env.DB_NAME || 'pizzashop',
  DB_SSL: process.env.DB_SSL === 'true',
})
