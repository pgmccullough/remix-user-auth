import type { MetaFunction } from '@remix-run/node'
import { Nav } from '~/components/Nav/Nav'

export const meta: MetaFunction = () => {
  return [
    { title: 'Init Remix with Auth' },
    { name: 'description', content: 'Basic starting point for user-based Remix' },
  ]
}

export default function Index() {
  return (
    <>
      <Nav />
      <div>
        <h1>Home</h1>
        <p>Welcome to a basic Remix Setup with user auth</p>
      </div>
    </>
  )
}
