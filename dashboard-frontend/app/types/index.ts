export interface CityData {
  id: number
  name: string
  country: string
  display_name: string
}

export interface User {
  id?: number | undefined | string
  uuid?: string
  name: string
  surname: string
  image?: string
  phone_number?: string
  email: string
  account_type?: string
  city?: CityData | null
  address?: string
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
  type?: 'text' | 'email' | 'password' | 'datetime-local' | 'date'
  className?: string
  maxLength?: number
  tooltip?: string | React.ReactNode
  style: string
  isPassword?: boolean
  isVisible?: boolean
  togglePasswordVisibility?: () => void
  error?: string
  min?: string
  max?: string
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
  icon: string
}

export interface PhoneInputProps {
  value: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  className?: string
  operatorsInfo?: boolean
}

export interface AccountSidebarProps {
  user: User
  navigation: NavigationItem[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface CityResponse {
  id: number
  name: string
  country: string
  display_name: string
}

export interface LocationOption {
  value: string
  label: string
  id: number
}

export interface LocationSelectProps {
  name: string
  value: CityData | null
  handleChange: (e: {
    target: { id: string; value: CityData | null; selectedOption?: LocationOption }
  }) => void
  label: string
  placeholder: string
  tooltip?: string | React.ReactNode
}

export interface TextAreaProps {
  value: string
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  label: string
  name: string
  placeholder: string
  height?: string | number
}

interface MembershipFeature {
  id: number
  name: string
}

export interface Membership {
  id: number
  plan: string
  bg_color: string
  price: number
  description: string
  is_popular: boolean
  is_available: boolean
  is_active: boolean
  features: MembershipFeature[]
}

export interface PricingCardProps {
  memberships: Membership[]
}
