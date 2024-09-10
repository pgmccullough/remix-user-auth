import type { FC, ReactNode } from 'react'
import style from './Main.module.css'

export const Main: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main className={style.main}>
      {children}
    </main>
  )
}
