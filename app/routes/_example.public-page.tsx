import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import type { User } from '@prisma/client'

export const meta: MetaFunction = () => {
  return [
    { title: 'Init Remix with Auth' },
    { name: 'description', content: 'Basic starting point for user-based Remix' },
  ]
}

export default function Index() {
  const { user } = useLoaderData<{ user?: User }>() || {}
  return (
    <div>
      <h1>Public</h1>
      <p>Hey, {user?.id?`you're logged in as ${user.username}, but `:''}anyone can see this page, it is fine.</p>
    </div>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  return json({ user })
}
