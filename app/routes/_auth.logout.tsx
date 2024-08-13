import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth.server'

export const action: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: '/login' })
  return redirect('/login')
}

export default function Logout() {
  return null
}
