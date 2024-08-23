import { json, redirect } from '@remix-run/node'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { createUser, getUserBy } from '~/controllers/userController'
import { handlePrismaError } from '~/utils/prismaErrors'
import { commitSession, getSession } from '~/services/session.server'
import { emailSender } from '~/utils/notifications/email'

type ActionData = {
  error?: string;
};

export default function Screen() {
  const actionData = useActionData<ActionData>()
  const { errorMessage } = useLoaderData<{ errorMessage?: string }>() || {}

  return (
    <div>
      <h1>Register</h1>
      <Form method="post">
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" />
        </div>
        {actionData?.error && <div style={{ color: 'red' }}>{actionData.error}</div>}
        <button type="submit">Register</button>
      </Form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = new URLSearchParams(await request.text())
  const username = formData.get('username') || ''
  const email = formData.get('email') || ''
  const password = formData.get('password') || ''

  const throwCreateError = async (errorMessage: string) => {
    const session = await getSession(request.headers.get('Cookie'))
    session.flash('errorMessage', errorMessage)
    const sessionCookie = await commitSession(session)
    return redirect('/register', {
      headers: {
        'Set-Cookie': sessionCookie,
      },
    })
  }

  if (!username || !email || !password) {
    return throwCreateError('All fields are required')
  }

  if(await getUserBy('username', username) || await getUserBy('email', email)) {
    return throwCreateError('An account with this username or email address already exists.')
  }

  try {
    await createUser(username, email, password)
    emailSender({
      from: 'patrick@descentrix.co',
      to: 'patrick.g.mccullough@gmail.com',
      subject: 'test for you',
      text: 'o hey lmao',
      html: '<b>o hey</b> lmao'
    })
    return redirect('/login')
  } catch (error) {
    return json<ActionData>({ error: `Error creating user: ${handlePrismaError(error)}` }, { status: 500 })
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
  return null
}
