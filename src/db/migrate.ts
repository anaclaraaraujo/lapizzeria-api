import postgres from 'postgres'
import chalk from 'chalk'
import { env } from '../env.ts'

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

const connection = postgres(
  `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  { max: 1 },
)
const db = drizzle(connection)

await migrate(db, { migrationsFolder: 'drizzle' })

// eslint-disable-next-line no-console
console.log(chalk.greenBright('Migrations applied successfully!'))

await connection.end()
process.exit()
