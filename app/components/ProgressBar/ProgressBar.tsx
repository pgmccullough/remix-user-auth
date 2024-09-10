import { FC, useEffect, useState } from 'react'
import style from './ProgressBar.module.css'

export const ProgressBar:FC<{ progress: number }> = ({ progress }) => {
  const [toProgress, setToProgress ] = useState<number>(0)

  useEffect(() => {
    setToProgress(progress)
  }, [])

  return (
    <div className={style.pb_outer}>
      <div 
        className={style.pb_inner}
        style={{width: `${toProgress}%`}}
      />
    </div>
  )
}
