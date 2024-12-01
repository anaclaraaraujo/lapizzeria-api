import Elysia, { t } from 'elysia'
import { db } from '../../db/connection'
import { auth } from '../auth'
import dayjs from 'dayjs'
import { authLinks } from '../../db/schema'
import { eq } from 'drizzle-orm'

export const authenticateFromLink = new Elysia().use(auth).get(
  '/auth-links/authenticate',
  async ({ query, signUser }) => {
    const { code, redirect } = query

    // list of allowed redirects
    const allowedRedirects = [
      'http://localhost:5173',
      'http://lapizzeria.vercel.app',
    ]
    if (!allowedRedirects.includes(redirect)) {
      return new Response(JSON.stringify({ error: 'Invalid redirect URL' }), {
        status: 400,
      })
    }

    // search for the auth link in the bank
    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })

    // check if auth link exists
    if (!authLinkFromCode) {
      return new Response(JSON.stringify({ error: 'Auth link not found.' }), {
        status: 404,
      })
    }

    // check if the auth link has expired
    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      'days',
    )

    if (daysSinceAuthLinkWasCreated > 7) {
      return new Response(
        JSON.stringify({
          error: 'Auth link expired. Please generate a new one.',
        }),
        { status: 400 },
      )
    }

    // search for the user-managed restaurant
    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId)
      },
    })

    // checks if the user manages any restaurant
    if (!managedRestaurant) {
      return new Response(
        JSON.stringify({ error: 'User is not managing any restaurant.' }),
        { status: 403 },
      )
    }

    // sign the user token
    await signUser({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant.id,
    })

    // delete the auth link used
    await db.delete(authLinks).where(eq(authLinks.code, code))

    // returns safe redirection
    return new Response(null, {
      status: 302,
      headers: { Location: redirect },
    })
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
