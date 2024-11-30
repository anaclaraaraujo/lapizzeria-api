import Elysia, { t } from 'elysia'
import { db } from '../../db/connection'
import { createId } from '@paralleldrive/cuid2'
import { authLinks } from '../../db/schema'
import { env } from '../../env'

export const sendAuthLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email } = body

    // search for the user in the database with the provided email
    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    // if the user is not found, display an error
    if (!userFromEmail) {
      throw new Error('User not found')
    }

    // generates a unique code for the authentication link
    const authLinkCode = createId()

    // inserts the authentication link into the database
    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    })

    // creates the URL of the authentication link that will be sent by email
    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)

    authLink.searchParams.set('code', authLinkCode)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    console.log(authLink.toString())
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)
