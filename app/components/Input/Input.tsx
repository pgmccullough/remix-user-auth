import { FC, useState } from 'react'
import { Field } from '~/data/en/data'
import style from './Input.module.css'

type ValueType = string | { start: string, end: string };

export const Input: FC<Field> = ({ label, type, options, width }) => {
  const inputId = label.replace(/[^\w\s]/gi, '').replaceAll(' ', '_').toLowerCase()
  const [value, setValue] = useState<ValueType>(type === 'dateRange' ? { start: '', end: '' } : '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (type === 'dateRange') {
      const target = e.target as HTMLInputElement
      setValue(prevValue => ({
        ...(prevValue as { start: string, end: string }),
        [target.id.includes('_start') ? 'start' : 'end']: target.value
      }))
    } else {
      setValue(e.target.value)
    }
  }

  switch (type) {
  case 'date':
  case 'text':
    return (
      <fieldset className={`${style.fieldset} ${style[`fieldset_${width}`]}`}>
        <label
          className={style.label}
          dangerouslySetInnerHTML={{ __html: label }}
          htmlFor={inputId}
        />
        <input
          className={style.input}
          id={inputId}
          onChange={handleChange}
          type={type}
          value={value as string}
        />
      </fieldset>
    )

  case 'dateRange':
    return (
      <fieldset className={`${style.fieldset} ${style[`fieldset_${width}`]}`}>
        <legend
          className={style.legend}
          dangerouslySetInnerHTML={{ __html: label }}
        />
        <div className={style.inputHalfContainer}>
          <div className={style.inputHalf}>
            <label
              className={style.label}
              dangerouslySetInnerHTML={{ __html: 'start' }}
              htmlFor={`${inputId}_start`}
            />
            <input
              className={style.input}
              id={`${inputId}_start`}
              onChange={handleChange}
              type="date"
              value={(value as { start: string, end: string }).start}
            />
          </div>
          <div className={style.inputHalf}>
            <label
              className={style.label}
              dangerouslySetInnerHTML={{ __html: 'end' }}
              htmlFor={`${inputId}_end`}
            />
            <input
              className={style.input}
              id={`${inputId}_end`}
              onChange={handleChange}
              type="date"
              value={(value as { start: string, end: string }).end}
            />
          </div>
        </div>
      </fieldset>
    )

  case 'select':
    return (
      <fieldset className={`${style.fieldset} ${style[`fieldset_${width}`]}`}>
        <label
          className={style.label}
          dangerouslySetInnerHTML={{ __html: label }}
          htmlFor={inputId}
        />
        <select
          className={style.input}
          id={inputId}
          onChange={handleChange}
          value={value as string}
        >
          {options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </fieldset>
    )

  case 'radio':
    return (
      <fieldset className={`${style.fieldset} ${style[`fieldset_${width}`]}`}>
        <label
          className={style.label}
          dangerouslySetInnerHTML={{ __html: label }}
          htmlFor={inputId}
        />
        {options?.map((option, index) => (
          <div className={style.radioRow} key={index}>
            <input
              checked={value === option}
              name={inputId}
              onChange={(e) => setValue(e.target.value)}
              type="radio"
              value={option}
            />
            {option}
          </div>
        ))}
      </fieldset>
    )

  default:
    return <div className={style.grouping}>{label}</div>
  }
}
