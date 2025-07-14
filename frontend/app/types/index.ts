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
