import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import type { User } from '@prisma/client'
import { getAllUsers } from '~/controllers/userController'
import { Main } from '~/components/Main/Main'

export const meta: MetaFunction = () => {
  return [
    { title: 'Init Remix with Auth' },
    { name: 'description', content: 'Basic starting point for user-based Remix' },
  ]
}

export default function Index() {
  const { user, userList } = useLoaderData<{ user?: User, userList?: Array<User> }>() || {}
  
  if(user?.role !== 'admin') console.log('you should not have access to this...')

  return (
    <Main>
      <h1>Users</h1>
      <p>List of users.</p>
      <div className="flex">
        <div style={{width: '4%'}}>Id</div>
        <div style={{width: '12%'}}>Username</div>
        <div style={{width: '26%'}}>Email</div>
        <div style={{width: '7%'}}>Role</div>
        <div style={{width: '7%'}}>Confirmed</div>
        <div style={{width: '21%'}}>Created</div>
        <div style={{width: '21%'}}>Updated</div>
      </div>
      {userList?.map(userLi => (
        <div key={userLi.id} className="flex">
          <div style={{width: '4%'}}>{userLi.id}</div>
          <div style={{width: '12%'}}><Link to={`/user/${userLi.username}`}>{userLi.username}</Link></div>
          <div style={{width: '26%'}}>{userLi.email}</div>
          <div style={{width: '7%'}}>{userLi.role}</div>
          <div style={{width: '7%'}}>{String(userLi.confirmed)}</div>
          <div style={{width: '21%'}}>{userLi.createdAt}</div>
          <div style={{width: '21%'}}>{userLi.updatedAt}</div>
        </div>
      ))}
    </Main>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  const userList = await getAllUsers()
  return json({ user, userList })
}
