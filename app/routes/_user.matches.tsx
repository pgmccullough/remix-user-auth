import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import { getAllUsers } from '~/controllers/userController'
import { Main } from '~/components/Main/Main'
import { getProfileBy } from '~/controllers/profileController'
import { CustomMarker } from '~/components/CustomMarker/CustomMarker'
import { MapWrapper } from '~/components/MapWrapper/MapWrapper'
import { Profile } from '@prisma/client'

export const meta: MetaFunction = () => {
  return [
    { title: 'Init Remix with Auth' },
    { name: 'description', content: 'Basic starting point for user-based Remix' },
  ]
}

export default function Index() {
  const { profile, markerArray, GMAPS_API_KEY } = useLoaderData<{ profile: Profile, markerArray: Profile[], GMAPS_API_KEY: string }>() || {}

  return (
    <Main>
      <h1>{'Matches'}</h1>
      <MapWrapper
        apiKey={GMAPS_API_KEY || ''}
        initCenter={(profile?.lat_long && JSON.parse(profile.lat_long).lng) ? JSON.parse(profile?.lat_long) : {lat: 38.910405791235846, lng:  -77.04720670636921}}
        initZoom={4}
      >
        {markerArray.map((markerObj) => (
          <CustomMarker 
            key={markerObj.id}
            markerObj={markerObj} 
          />
        ))}
      </MapWrapper>
    </Main>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  const profile = await getProfileBy('username', user?.username || '')
  const allUsers = await getAllUsers()
  const markerArray = []
  for(const usr of allUsers) {
    const userProfile = await getProfileBy('username', usr.username)
    markerArray.push(userProfile)
  }
  const { GMAPS_API_KEY } = process.env
  return json({ user, profile, markerArray, GMAPS_API_KEY })
}
