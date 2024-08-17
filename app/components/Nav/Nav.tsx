import { useOutletContext , Link } from '@remix-run/react'
import type { FC } from 'react'
import { User } from '@prisma/client'

export const Nav: FC = () => {
  const { user } = useOutletContext() as {user: User}
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/public-page">Public Page</Link>
      <Link to="/private-page">Private Page</Link>
      <Link to="/admin/users">User Management</Link>
      { 
        user
          ? <form method="post" action="/logout">
            <button type="submit">Logout</button>
          </form>
          : ''
      }
    </nav>
  )
}
