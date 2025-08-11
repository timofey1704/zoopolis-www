import React from 'react'
import { PhoneInputProps } from '@/app/types'

const PhoneInput = ({
  value,
  handleChange,
  label = 'Номер телефона',
  className = '',
  operatorsInfo = true,
}: PhoneInputProps) => {
  return (
    <div className={className}>
      {label && (
        <div className="my-2 flex items-center gap-2">
          <label className="text-sm font-medium text-gray-500">{label}</label>
        </div>
      )}
      <input
        type="tel"
        id="phone_number"
        name="phone_number"
        placeholder={'+375 (__) ___ __ __'}
        value={value || ''}
        onChange={handleChange}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-black focus:bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none"
        autoComplete="tel"
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
