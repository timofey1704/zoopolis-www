import { IconType } from 'react-icons'

export interface User {
  id?: number | undefined | string
  uuid?: string
  name: string
  surname: string
  image?: string
  phone_number?: string
  email: string
  account_type?: string
}

export interface UserState {
  isAuthenticated: boolean
  user: User | null
}

export type ToastProps = {
  type: 'error' | 'success' | 'loading'
  message: string
  action?: {
    text: string
    onClick: () => void
  }
  duration?: number
}

export interface ButtonProps {
  onClick?: () => void
  className?: string
  text?: string
  leftIcon?: React.ReactNode
  midIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'text'
}

export interface TextInputProps {
  value: string
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  placeholder?: string
  name: string
  type?: 'text' | 'email' | 'password'
  className?: string
  maxLength?: number
  tooltip?: string | React.ReactNode
  style: string
  isPassword?: boolean
  isVisible?: boolean
  togglePasswordVisibility?: () => void
  error?: string
}

export interface ValidationRules {
  required?: boolean
  minLength?: number
  pattern?: RegExp
}

export interface ValidationErrors {
  [key: string]: string
}

export interface NavigationItem {
  name: string
  href: string
  icon: IconType
}

export interface PhoneInputProps {
  value: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  className?: string
  operatorsInfo?: boolean
}
