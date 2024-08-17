import { Link } from '@remix-run/react'
import { useAuth } from '~/AuthContext'
import type { FC } from 'react'

export const Nav: FC = () => {
  const { user } = useAuth()

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
