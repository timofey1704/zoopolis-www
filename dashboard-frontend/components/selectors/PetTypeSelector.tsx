import React from 'react'
import Selector, { Option } from '../ui/Selector'
import { ChangeEvent } from 'react'

export interface PetType {
  id: number
  name: string
}

interface PetTypeResponse {
  id: number
  name: string
}

type CustomChangeEvent = {
  target: {
    id: string
    value: string | number | boolean | string[] | number[] | PetType | null
    type?: string
    checked?: boolean
  }
}

interface PetTypeSelectorProps {
  name: string
  value: string | PetType | null
  handleChange: (e: ChangeEvent<HTMLSelectElement> | CustomChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
}

const PetTypeSelector: React.FC<PetTypeSelectorProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
}) => {
  const mapPetTypeToOption = (petType: PetTypeResponse): Option => ({
    id: petType.id,
    value: petType.name,
    label: petType.name,
  })

  const transformSelectedValue = (option: Option | undefined): PetType | null => {
    if (!option) return null
    return {
      id: option.id,
      name: option.value,
    }
  }

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
        value: transformSelectedValue(selectedOption),
        type: 'select',
      },
    })
  }

  // Преобразуем value в формат, понятный для Selector
  const selectorValue = typeof value === 'string' ? null : value

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
    />
  )
}

export default PetTypeSelector
