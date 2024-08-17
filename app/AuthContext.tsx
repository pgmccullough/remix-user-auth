import { json } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authenticator } from './services/auth.server'
import type { User } from '@prisma/client'

const AuthContext = createContext<{
    user: User | undefined;
    darkMode: boolean;
    handleDarkMode: (newDarkMode: boolean) => void;
    handleUserStatus: (newUser: User | undefined) => void;
      }>({
        user: undefined,
        darkMode: false,
        handleDarkMode: () => {},
        handleUserStatus: () => {},
      })

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: loggedInUser } = useLoaderData<{ user?: User }>() || {}
  const [user, setUser] = useState<User | undefined>(
    loggedInUser 
      ? {
        ...loggedInUser, 
        createdAt: new Date(loggedInUser.createdAt),
        updatedAt: new Date(loggedInUser.updatedAt),
      } 
      : undefined
  )
  const [darkMode, setDarkMode] = useState<boolean>(false)

  useEffect(() => {
    handleDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches as boolean)
  }, [])

  const handleDarkMode = (newDarkMode: boolean) => {
    setDarkMode(newDarkMode)
  }

  const handleUserStatus = (newUser: User | undefined) => {
    setUser(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, darkMode, handleDarkMode, handleUserStatus }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })
  return json({ user })
}
  
