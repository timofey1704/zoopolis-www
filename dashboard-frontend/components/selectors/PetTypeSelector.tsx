import React from 'react'
import Selector, { Option as SelectorOption } from '../ui/Selector'

export interface PetType {
  id: number
  name: string
}

interface PetTypeResponse {
  id: number
  name: string
  [key: string]: unknown
}

interface PetTypeOption extends SelectorOption {
  label: string
}

interface PetTypeChangeEvent {
  target: {
    id: string
    value: PetType | null
    type: 'select'
  }
}

interface PetTypeSelectorProps {
  name: string
  value: string | PetType | null
  handleChange: (e: PetTypeChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
  isRequired?: boolean
}

const PetTypeSelector: React.FC<PetTypeSelectorProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
  isRequired,
}) => {
  const mapPetTypeToOption = (petType: PetTypeResponse): PetTypeOption => ({
    id: petType.id,
    value: petType.name,
    label: petType.name,
  })

  const transformSelectedValue = (option: PetTypeOption | undefined): PetType | null => {
    if (!option) return null
    return {
      id: option.id,
      name: option.value,
    }
  }

  const handleSelectorChange = (e: {
    target: {
      id: string
      value: SelectorOption | null
      selectedOption?: SelectorOption
    }
  }) => {
    const selectedOption = e.target.selectedOption as PetTypeOption | undefined
    handleChange({
      target: {
        id: name,
        value: transformSelectedValue(selectedOption),
        type: 'select',
      },
    })
  }

  // Преобразуем value в формат, понятный для Selector
  const selectorValue =
    typeof value === 'string'
      ? null
      : value
        ? {
            id: value.id,
            value: value.name,
            label: value.name,
          }
        : null

  return (
    <Selector<PetTypeResponse>
      name={name}
      value={selectorValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      endpoint="/dictionaries/pet-types/"
      mapDataToOptions={mapPetTypeToOption}
      isRequired={isRequired}
    />
  )
}

export default PetTypeSelector
