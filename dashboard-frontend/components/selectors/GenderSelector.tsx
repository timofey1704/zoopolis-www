import React from 'react'
import Selector, { Option } from '@/components/ui/Selector'

export interface Gender {
  id: number
  value: string
  label: string
  [key: string]: unknown
}

interface GenderChangeEvent {
  target: {
    id: string
    value: string
    selectedOption?: Option
  }
}

interface GenderSelectorProps {
  name: string
  value: string
  handleChange: (e: GenderChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
}

const GENDERS: Gender[] = [
  { id: 1, value: 'male', label: 'Мальчик' },
  { id: 2, value: 'female', label: 'Девочка' },
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
      value: Option | null
      selectedOption?: Option
    }
  }) => {
    const selectedOption = e.target.selectedOption
    handleChange({
      target: {
        id: name,
        value: selectedOption?.value || '',
        selectedOption,
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
