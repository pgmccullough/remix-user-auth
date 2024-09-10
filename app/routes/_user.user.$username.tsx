import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth.server'
import type { Profile, User } from '@prisma/client'
import { getUserBy } from '~/controllers/userController'
import { Main } from '~/components/Main/Main'
import { applyFields, Field } from '~/data/en/data'
import { Input } from '~/components/Input/Input'
import { Table } from '~/components/Table/Table'
import { getProfileBy, updateProfile } from '~/controllers/profileController'
import { ProgressBar } from '~/components/ProgressBar/ProgressBar'
import { CustomMarker } from '~/components/CustomMarker/CustomMarker'
import { MapWrapper } from '~/components/MapWrapper/MapWrapper'

export const meta: MetaFunction = () => {
  return [
    { title: 'Init Remix with Auth' },
    { name: 'description', content: 'Basic starting point for user-based Remix' },
  ]
}

export default function Index() {
  const { user, targetUser, profile, GMAPS_API_KEY } = useLoaderData<{ user?: User, targetUser: User, profile: Profile, GMAPS_API_KEY: string }>() || {}
  const totalFields = profile ? Object.entries(profile).length : 0
  const completeFields = profile ? Object.values(profile).filter(val => val).length : 100

  /* MOVE THIS INTO A CONTROLLER, REUSABLE, WILL NEED TO ACCESS PRISMA
     TO CHECK FOR RELATIONSHIPS/MATCHES */
  const profileAccess = (userId: number | undefined, targetId: number) => {
    return (
      userId === targetId 
        ? 'Edit'
        // : 1===1 // check if target follows user
        //   ? 'Read'
          : ''
    )
  }

  return profileAccess(user?.id, targetUser.id) ? (
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
                  storedValue={profile && profile[inputId as keyof Profile] || ''}
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
      <MapWrapper
        apiKey={GMAPS_API_KEY}
        initCenter={(profile?.lat_long && JSON.parse(profile.lat_long).lng) ? JSON.parse(profile?.lat_long) : {lat: 38.910405791235846, lng:  -77.04720670636921}}
        initZoom={4}
      >
        {
          profile ? (
            <CustomMarker markerObj={profile} />
          ) : (
            <></>
          )
        }
      </MapWrapper>
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
  return ''
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  const { GMAPS_API_KEY } = process.env
  const username = request.url.split('/').at(-1)
  const targetUser = await getUserBy('username', username || '')
  const profile = await getProfileBy('username', username || '')
  return json({ user, targetUser, profile, GMAPS_API_KEY })
}
