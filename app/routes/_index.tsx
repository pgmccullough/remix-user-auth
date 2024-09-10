import { json } from '@remix-run/node'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import { User } from '@prisma/client'
import { Nav } from '~/components/Nav/Nav'
import { Main } from '~/components/Main/Main'

export const meta: MetaFunction = () => {
  return [
    { title: 'Family Exchanges - The Society of the Cincinnati<' },
    { name: 'description', content: 'The Family Exchange Program facilitates exchanges between the children or grandchildren of French Society members with the children or grandchildren of members of the American constituent societies. Both boys and girls between the ages of fourteen and nineteen are eligible to participate. Exchange visits typically take place over the summer vacation period. Generally, a visit [&hellip;]' },
  ]
}

export default function Index() {
  const { user } = useLoaderData<{ user?: User }>() || {}
  return (
    <>
      <Nav />
      <Main>
        <h1>Home</h1>
        <p>The Family Exchange Program facilitates exchanges between the children or grandchildren of French Society members with the children or grandchildren of members of the American constituent societies. Both boys and girls between the ages of fourteen and nineteen are eligible to participate.</p>
        <p>Exchange visits typically take place over the summer vacation period. Generally, a visit of two to three weeks is arranged for one child with the family of his or her counterpart in the host country, before his or her counterpart embarks on his or her own trip across the Atlantic. The reciprocal visit may occur in the following year's summer vacation period. The specific timing and travel arrangements for the exchange visits are left to the participating families to work out together. The Society’s role is to put the families interested in these exchanges in touch with each other.</p>
        <p>All financial obligations of the program are the responsibility of the participating families. Familiarity with the French language is beneficial, but there is no requirement that an American child has studied French or is able to speak the language.</p>
        { 
          user ? (
            <>
              <h2>Status</h2>
            </>
          ): (
            <>
              <h2>To Register</h2>
              <p>In order to apply for the exchange, or to register or host a child, you must first <Link to="/register">register an account</Link>.</p>
              <p>Already have an account? <Link to="/login">Login here</Link>.</p>
            </>
          )
        }
      </Main>
    </>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  return json({ user })
}
