import React from 'react'
import { ButtonProps } from '@/app/types'

const Button = ({
  onClick,
  className,
  text,
  type,
  leftIcon,
  midIcon,
  rightIcon,
  size = 'lg',
  variant = 'default',
  loading = false,
  disabled = false,
}: ButtonProps) => {
  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-xl',
  }

  const variantClasses = {
    default: 'w-60 rounded-[52px] font-medium text-black hover:shadow-2xl',
    text: '',
  }

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer transition-all duration-500 ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${disabled || loading ? 'cursor-not-allowed opacity-50' : ''}`}
      type={type}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          <span className="ml-2 text-center font-normal">{text}</span>
        </div>
      ) : (
        <>
          {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
          {midIcon && <span className="flex items-center">{midIcon}</span>}
          <span className="text-center font-normal">{text}</span>
          {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
