import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import type { User } from '@prisma/client'
import { getUserBy, getAllUsers } from '~/controllers/userController'
import { Main } from '~/components/Main/Main'
import { getProfileBy, updateProfile } from '~/controllers/profileController'

import { AdvancedMarker, APIProvider, InfoWindow, Map, MapCameraChangedEvent, Pin, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
import { useState } from 'react'
import { CustomMarker } from '~/components/CustomMarker/CustomMarker'

export const meta: MetaFunction = () => {
  return [
    { title: 'Init Remix with Auth' },
    { name: 'description', content: 'Basic starting point for user-based Remix' },
  ]
}

export default function Index() {
  const { user, profile, markerArray, GMAPS_API_KEY } = useLoaderData<{ user: User, profile: any, markerArray: any[], GMAPS_API_KEY: string }>() || {}



  return (
    <Main>
      <h1>{'Matches'}</h1>
      <APIProvider apiKey={GMAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <div style={{width: '100%', minHeight: '400px', height: '30vh'}}>
          <Map
            defaultZoom={13}
            defaultCenter={ { lat: JSON.parse(profile?.lat_long||'{lat: \'\'}').lat, lng: JSON.parse(profile?.lat_long||'{lng: \'\'}').lng } }
            mapId="CURRENT_USER_PIN"
            onCameraChanged={ (ev: MapCameraChangedEvent) =>
              console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            }
            zoom={4}
          >
            {markerArray.map((markerObj) => (
              <CustomMarker markerObj={markerObj} />
            ))}
          </Map>
        </div>
      </APIProvider>
    </Main>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  const profile = await getProfileBy('username', user.username)
  const { GMAPS_API_KEY } = process.env
  const allUsers = await getAllUsers()
  const markerArray = []
  for(const usr of allUsers) {
    const userProfile = await getProfileBy('username', usr.username)
    markerArray.push(userProfile)
  }
  //   const targetUser = await getUserBy('username', username || '');
  //   const profile = await getProfileBy('username', username || '');
  return json({ user, profile, markerArray, GMAPS_API_KEY })
}
