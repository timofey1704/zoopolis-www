import React from 'react'
import Selector, { Option } from '@/components/ui/Selector'

export interface Gender {
  id: number
  value: string
  label: string
}

interface GenderSelectorProps {
  name: string
  value: string
  handleChange: (e: {
    target: {
      id: string
      value: any
      selectedOption?: Option
    }
  }) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
}

const GENDERS = [
  { id: 1, value: 'male', label: 'Мужской' },
  { id: 2, value: 'female', label: 'Женский' },
]

const GenderSelector: React.FC<GenderSelectorProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
}) => {
  const handleSelectorChange = (e: {
    target: {
      id: string
      value: any
      selectedOption?: Option
    }
  }) => {
    const selectedOption = e.target.selectedOption
    handleChange({
      target: {
        id: name,
        value: selectedOption?.value || '',
        selectedOption: selectedOption || undefined,
      },
    })
  }

  // Находим текущее значение в списке для отображения
  const currentValue = GENDERS.find(gender => gender.value === value)

  return (
    <Selector<Gender>
      name={name}
      value={currentValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      mapDataToOptions={gender => ({
        id: gender.id,
        value: gender.value,
        label: gender.label,
      })}
      staticOptions={GENDERS}
    />
  )
}

export default GenderSelector
