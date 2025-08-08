import { IconType } from 'react-icons'

export interface User {
  id?: number | undefined | string
  uuid?: string
  name: string
  surname: string
  image?: string
  phone_number?: string
  email: string
  country?: string
  city?: string
  account_type: string
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
}

export interface AccordionProps {
  title: string
  content: string | React.ReactNode
}

export interface FAQ {
  id: number
  title: string
  content: string | React.ReactNode
}

export interface FAQProps {
  faqs: FAQ[]
}

export interface MediaItem {
  id: number
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string // для превью видео
}

export interface ImagesSliderProps {
  items: MediaItem[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sliderRef: React.RefObject<any>
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
  features: MembershipFeature[]
}

export interface PricingCardProps {
  memberships: Membership[]
}

export interface NavigationItem {
  name: string
  href: string
  icon: IconType
}

export interface AccountSidebarProps {
  user: User
  navigation: NavigationItem[]
}
