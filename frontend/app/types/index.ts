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

export interface TextAreaProps {
  value: string
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  label: string
  name: string
  placeholder: string
  height?: string | number
}
