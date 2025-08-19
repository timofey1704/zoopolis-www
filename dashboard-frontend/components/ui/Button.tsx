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
      className={`cursor-pointer transition-all duration-500 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      type={type}
    >
      {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
      {midIcon && <span className="flex items-center">{midIcon}</span>}
      <span className="text-center font-normal">{text}</span>
      {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
    </button>
  )
}

export default Button
