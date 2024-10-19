/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from '@faker-js/faker'
import { restaurants, users } from './schema'
import { db } from './connection'
import chalk from 'chalk'

// reset db
await db.delete(users)
await db.delete(restaurants)

console.log(chalk.yellowBright('✔️ Database reset!'))

// create customers
await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
])

console.log(chalk.yellow('✔️ Created customers!'))

// create manager
const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log(chalk.yellow('✔️ Created manager!'))

// create restaurant
await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  },
])

console.log(chalk.yellow('✔️ Created restaurant!'))
console.log(chalk.yellow('Database seeded successfully!'))

process.exit()
