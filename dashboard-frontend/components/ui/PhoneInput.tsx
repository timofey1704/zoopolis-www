import React from 'react'
import { PhoneInputProps } from '@/app/types'

const PhoneInput = ({
  value,
  handleChange,
  label = 'Номер телефона',
  className = '',
  operatorsInfo = true,
  isRequired,
}: PhoneInputProps) => {
  return (
    <div className={className}>
      {label && (
        <div className="my-2 flex items-center gap-1">
          <label className="text-sm font-medium text-gray-500">{label}</label>
          {isRequired && (
            <span
              className="text-sm text-red-500"
              title="Обязательное поле"
              aria-label="обязательное поле"
            >
              *
            </span>
          )}
        </div>
      )}

      <input
        type="tel"
        id="phone_number"
        name="phone_number"
        placeholder={'+375 (__) ___ __ __'}
        value={value || ''}
        onChange={handleChange}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-black focus:ring-1 focus:ring-blue-400 focus:outline-none"
        autoComplete="tel"
        required={isRequired}
        aria-required={isRequired} // для accessibility и оценки серч консоли
      />

      {operatorsInfo && (
        <p className="mt-1 text-xs text-gray-500">
          Доступные операторы: A1 (29), А1 (44), МТС (33), life:) (25)
        </p>
      )}
    </div>
  )
}

export default PhoneInput
