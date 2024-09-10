import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import type { User } from '@prisma/client'
import { getUserBy } from '~/controllers/userController'
import { Main } from '~/components/Main/Main'
import { applyFields, Field } from '~/data/en/data'
import { Input } from '~/components/Input/Input'
import { Table } from '~/components/Table/Table'
import { getProfileBy, updateProfile } from '~/controllers/profileController'

import { AdvancedMarker, APIProvider, InfoWindow, Map, MapCameraChangedEvent, Pin, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
import { useState } from 'react'
import { ProgressBar } from '~/components/ProgressBar/ProgressBar'

export const meta: MetaFunction = () => {
  return [
    { title: 'Init Remix with Auth' },
    { name: 'description', content: 'Basic starting point for user-based Remix' },
  ]
}

export default function Index() {
  const { user, targetUser, profile, GMAPS_API_KEY } = useLoaderData<{ user?: User, targetUser: User, profile: { [ key: string ]: string, GMAPS_API_KEY: string } }>() || {}

  const [infowindowOpen, setInfowindowOpen] = useState<boolean>(false)
  const [markerRef, marker] = useAdvancedMarkerRef()

  const totalFields = Object.entries(profile).length
  const completeFields = Object.values(profile).filter(val => val).length

  return user?.username === targetUser?.username ? (
    <Main>
      <h1>{profile?.child_applicants_full_name || 'Profile'}</h1>
      <h2>Progress</h2>
      <ProgressBar
        progress={(completeFields/totalFields*100)/2}
      />

      <h2>Application</h2>
      <Form method="post">
        <Table columns={2}>
          {
            applyFields.map(({label, type, options, width}: Field) => {
              const inputId = label.replace(/[^\w\s]/gi, '').replaceAll(' ', '_').toLowerCase().split('_').slice(0,4).join('_')
              return (
                <Input
                  key={label}
                  inputId={inputId}
                  label={label}
                  storedValue={profile[inputId]||''}
                  type={type}
                  options={options}
                  width={width}
                />
              )
            })
          }
        </Table>
        <button type="submit">Submit</button>
      </Form>
      <APIProvider apiKey={GMAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <div style={{width: '100%', minHeight: '400px', height: '30vh'}}>
          <Map
            defaultZoom={13}
            defaultCenter={ { lat: JSON.parse(profile.lat_long||'{lat: \'\'}').lat, lng: JSON.parse(profile.lat_long||'{lng: \'\'}').lng } }
            mapId="CURRENT_USER_PIN"
            onCameraChanged={ (ev: MapCameraChangedEvent) =>
              console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            }
          >
            <AdvancedMarker
              ref={markerRef}
              onClick={() => setInfowindowOpen(true)}
              position={JSON.parse(profile.lat_long)}
              title={'AdvancedMarker that opens an Infowindow when clicked.'}
            />
            {/* <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} /> */}
            {infowindowOpen && (
              <InfoWindow
                anchor={marker}
                maxWidth={200}
                onCloseClick={() => setInfowindowOpen(false)}
              >
                  This is you. You live here.
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>
      <h2>Documents</h2>
      <input type="file" />
    </Main>
  ) : (
    <></>
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const username = request.url.split('/').at(-1)
  const formData = new URLSearchParams(await request.text())
  if(username) updateProfile(username, Object.fromEntries(formData))
  return 'double ds pretty please'
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  const { GMAPS_API_KEY } = process.env
  const username = request.url.split('/').at(-1)
  const targetUser = await getUserBy('username', username || '')
  const profile = await getProfileBy('username', username || '')
  return json({ user, targetUser, profile, GMAPS_API_KEY })
}
