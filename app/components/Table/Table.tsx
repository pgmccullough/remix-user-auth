import type { FC, ReactNode } from 'react'
import style from './Table.module.css'

export const Table: FC<{ children: ReactNode, columns: number }> = ({ children, columns }) => {
  return (
    <article className={`${style.table} ${style[`cols_${columns}`]}`}>
      {children}
    </article>
  )
}
