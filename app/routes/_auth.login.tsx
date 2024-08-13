import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import { commitSession, getSession } from '~/services/session.server'

export default function Screen() {
  const { errorMessage } = useLoaderData<{ errorMessage?: string }>() || {}
  return (
    <div>
      <Form method="post">
        <input type="text" name="username" required />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        <button>Sign In</button>
      </Form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate('user-pass', request, {
      successRedirect: '/',
      throwOnError: true,
    })
  } catch (error) {
    if (error instanceof Response) return error
    const session = await getSession(request.headers.get('Cookie'))
    session.flash('errorMessage', error instanceof Error ? error.message : 'Authentication failed')
    const sessionCookie = await commitSession(session)

    return redirect('/login', {
      headers: {
        'Set-Cookie': sessionCookie,
      },
    })
  }
}
  
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const errorMessage = session.get('errorMessage')
  if(errorMessage) {
    const headers = new Headers({
      'Set-Cookie': await commitSession(session),
    })
    return json({ errorMessage }, { headers })
  }
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  })
}
