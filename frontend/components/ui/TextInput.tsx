import React from 'react'
import { TextInputProps } from '@/app/types'
import Tooltip from './Tooltip'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'

const TextInput = ({
  value,
  handleChange,
  label,
  placeholder,
  name,
  type = 'text',
  className = '',
  maxLength,
  tooltip,
  style,
  isPassword,
  togglePasswordVisibility,
  isVisible,
  error,
}: TextInputProps) => {
  const getStylesProps = () => {
    const baseStyles = 'px-3 py-2 '
    switch (style) {
      case 'main':
        return `p-4`
      case 'register':
        return `${baseStyles}`
      default:
        return baseStyles
    }
  }

  return (
    <div className={className}>
      {label && (
        <div className="my-2 flex items-center gap-2">
          <label className="text-sm font-medium text-gray-500" htmlFor={name}>
            {label}
          </label>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
      )}
      <div className="relative">
        <input
          type={isPassword ? (isVisible ? 'text' : 'password') : type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value || ''}
          onChange={handleChange}
          className={`${getStylesProps()} w-full border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-xl text-black focus:ring-1 focus:outline-none ${
            error ? 'focus:ring-red-400' : 'focus:ring-blue-400'
          } focus:bg-white`}
          autoComplete={name}
          maxLength={maxLength}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {isVisible ? <HiOutlineEye /> : <HiOutlineEyeOff />}
          </button>
        )}
      </div>
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  )
}

export default TextInput
