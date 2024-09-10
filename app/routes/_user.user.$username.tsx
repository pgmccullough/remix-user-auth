import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import type { User } from '@prisma/client'
import { getUserBy } from '~/controllers/userController'
import { Main } from '~/components/Main/Main'
import { applyFields, Field } from '~/data/en/data'
import { Input } from '~/components/Input/Input'
import { Table } from '~/components/Table/Table'

export const meta: MetaFunction = () => {
  return [
    { title: 'Init Remix with Auth' },
    { name: 'description', content: 'Basic starting point for user-based Remix' },
  ]
}

export default function Index() {
  const { user, targetUser } = useLoaderData<{ user?: User, targetUser: User }>() || {}

  return user?.username === targetUser.username ? (
    <Main>
      <h1>Profile</h1>
      <Table columns={2}>
        {
          applyFields.map(({label, type, options, width}: Field) => (
            <Input
              key={label}
              label={label}
              type={type}
              options={options}
              width={width}
            />
          ))
        }
      </Table>
    </Main>
  ) : (
    <></>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  const username = request.url.split('/').at(-1)
  const targetUser = await getUserBy('username', username || '')
  return json({ user, targetUser })
}
