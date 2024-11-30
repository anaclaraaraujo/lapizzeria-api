import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env'
import * as schema from './schema'

const connectionString = `
postgresql://${env.DB_USER}
:${env.DB_PASSWORD}
@${env.DB_HOST}
:${env.DB_PORT}
/${env.DB_NAME}
`

const connection = postgres(connectionString)

export const db = drizzle(connection, { schema })
