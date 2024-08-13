import { Outlet } from '@remix-run/react'
import { Nav } from '~/components/Nav/Nav'

export default function Layout() {
  return (
    <>
      <Nav />
      <div><Outlet /></div>
    </>
  )
}
