import React from 'react'
import { ButtonProps } from '@/app/types/index'

const Button = ({ onClick, className, text, type, leftIcon, midIcon, rightIcon }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`h-14 w-60 cursor-pointer rounded-[52px] text-base font-medium text-black transition-all duration-500 hover:shadow-2xl ${className}`}
      type={type}
    >
      {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
      {midIcon && <span className="flex items-center">{midIcon}</span>}
      <span className="text-center text-xl font-normal">{text}</span>
      {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
    </button>
  )
}

export default Button
