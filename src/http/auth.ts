import { Elysia, t, type Static } from 'elysia'
import jwt from '@elysiajs/jwt'

import { env } from '../env'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayload,
    }),
  )
  .derive({ as: 'scoped' }, ({ jwt, cookie: { auth } }) => {
    return {
      // function to sign a new token and store it in the 'auth' cookie
      signUser: async (payload: Static<typeof jwtPayload>) => {
        // generate JWT token using provided payload
        const token = await jwt.sign(payload)

        // stores the generated token in the 'auth' cookie, setting it to be secure
        auth.value = token //
        auth.httpOnly = true
        auth.maxAge = 60 * 60 * 24 * 7
        auth.path = '/'
      },

      // function to remove the authentication cookie (sign-out)
      signOut: async () => {
        auth.remove()
      },
    }
  })
