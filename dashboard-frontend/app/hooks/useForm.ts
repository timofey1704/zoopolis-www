'use client'

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  createContext,
  useContext,
  ReactNode,
} from 'react'
import toast from 'react-hot-toast'
import { ValidationRules, ValidationErrors, CityData } from '../types'
import { PetType } from '@/components/selectors/PetTypeSelector'
import { Breed } from '@/components/selectors/BreedSelector'
import { PetColor } from '@/components/selectors/ColorSelector'

type FormContextType = {
  isFieldRequired: (fieldName: string) => boolean
}

const FormContext = createContext<FormContextType | null>(null)

export const useFormContext = () => {
  const context = useContext(FormContext)
  return context
}

type FormValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | CityData
  | PetType
  | Breed
  | PetColor
  | null

type CustomChangeEvent = {
  target: {
    id: string
    value: FormValue
    type?: string
    checked?: boolean
  }
}

export function useForm<T extends Record<string, FormValue>>(
  initialValues: T,
  validationRules?: { [K in keyof T]?: ValidationRules },
  onSubmit?: (values: T) => void
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isVisible, setIsVisible] = useState(false)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | CustomChangeEvent
  ) => {
    const { id, value, type } = e.target
    const isCheckbox = type === 'checkbox' && 'checked' in e.target

    setValues(prev => ({
      ...prev,
      [id]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }))

    // скидываем ошибки
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const resetField = (fieldName: keyof T, value: FormValue = '') => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value,
    }))

    // очищаем ошибки для этого поля, если они есть
    if (errors[fieldName as string]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName as string]
        return newErrors
      })
    }
  }

  const fieldNames: { [key: string]: string } = {
    name: 'Имя',
    surmame: 'Фамилия',
    email: 'Email',
    phone_number: 'Номер телефона',
    password: 'Пароль',
    privacy_accepted: 'Политика конфиденциальности',
  }

  const validate = () => {
    if (!validationRules) return true

    const newErrors: ValidationErrors = {}

    Object.keys(validationRules).forEach(key => {
      const value = values[key]
      const rules = validationRules[key as keyof T]

      if (rules?.required && !value) {
        newErrors[key] = 'Это поле обязательно'
        toast.error(`Поле "${fieldNames[key] || key}" обязательно для заполнения`, {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '8px',
          },
        })
      }

      if (rules?.minLength && typeof value === 'string' && value.length < rules.minLength) {
        newErrors[key] = `Минимальная длина ${rules.minLength} символов`
        toast.error(
          `Минимальная длина поля "${fieldNames[key] || key}" - ${rules.minLength} символов`,
          {
            duration: 2000,
            position: 'top-right',
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '16px',
              borderRadius: '8px',
            },
          }
        )
      }

      if (rules?.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        newErrors[key] = 'Неверный формат'
        toast.error(`Поле "${fieldNames[key] || key}" заполнено некорректно`, {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '8px',
          },
        })
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate() && onSubmit) {
      onSubmit(values)
    }
  }

  const togglePasswordVisibility = () => {
    setIsVisible(!isVisible)
  }

  const isFieldRequired = (fieldName: keyof T): boolean => {
    if (!validationRules) return false
    return validationRules[fieldName]?.required ?? false
  }

  const FormProvider = ({ children }: { children: ReactNode }) => {
    return React.createElement(
      FormContext.Provider,
      { value: { isFieldRequired: isFieldRequired as (fieldName: string) => boolean } },
      children
    )
  }

  return {
    values,
    errors,
    isVisible,
    setValues,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    resetField,
    isFieldRequired,
    FormProvider,
  }
}
