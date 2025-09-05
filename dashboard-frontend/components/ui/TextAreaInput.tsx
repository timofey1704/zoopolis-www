import React from 'react'
import { TextAreaProps } from '@/app/types'

const TextAreaInput = ({
  value,
  handleChange,
  label,
  name,
  placeholder,
  height,
}: TextAreaProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-500" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        style={{ minHeight: height ? `${height}px` : '160px' }}
        className="focus:ring-mainblocks w-full rounded-xl border bg-white px-3 py-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
        autoComplete={name}
      />
    </div>
  )
}

export default TextAreaInput
