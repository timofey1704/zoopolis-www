import React from 'react'
import { ButtonProps } from '@/app/types/index'

const Button = ({
  onClick,
  className,
  text,
  type,
  leftIcon,
  rightIcon,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-base font-medium rounded-[52px] cursor-pointer text-black w-60 h-14 hover:shadow-2xl transition-all duration-500 ${className}`}
      type={type}
    >
      {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
      <span className='text-xl font-normal text-center'>{text}</span>
      {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
    </button>
  )
}

export default Button
