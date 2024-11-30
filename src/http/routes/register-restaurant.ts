import { Elysia, t } from 'elysia'
import { db } from '../../db/connection'
import { restaurants, users } from '../../db/schema'

// defines the POST route for a restaurant record
export const registerRestaurant = new Elysia().post(
  '/restaurantes',
  async ({ body }) => {
    const { restaurantName, managerName, email, phone } = body

    // inserts a new manager into the database
    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: 'manager',
      })
      .returning({
        id: users.id,
      })

    // inserts the restaurant associated with the manager into the 'restaurants' table
    await db.insert(restaurants).values({
      name: restaurantName,
      managerId: manager.id,
    })

    // returns a response with status 201 (Created) and a success message
    return new Response(
      JSON.stringify({ message: 'Restaurante registrado com sucesso!' }),
      { status: 201 },
    )
  },
  {
    // defines validation for the request body using the 't' module
    body: t.Object({
      restaurantName: t.String(),
      managerName: t.String(),
      phone: t.String(),
      email: t.String({ format: 'email' }),
    }),
  },
)
