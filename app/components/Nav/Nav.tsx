import { useOutletContext , Link } from '@remix-run/react'
import type { FC } from 'react'
import { User } from '@prisma/client'
import style from './Nav.module.css'

export const Nav: FC = () => {
  const { user } = useOutletContext() as {user: User}
  return (
    <nav className={style.nav}>
      <Link to="/">Home</Link>
      { 
        user ? (
          <>
            <Link to="/admin/users">User Management</Link>
            <Link to="/matches">Matches</Link>
            <Link to={`/user/${user.username.toLowerCase()}`}>My Account</Link>
            <form method="post" action="/logout">
              <button type="submit">Logout</button>
            </form>
          </>
        ) : (
          <></>
        )
      }
    </nav>
  )
}
