import React from 'react'
import Selector, { Option } from '../ui/Selector'

export interface Breed {
  id: number
  name: string
  pet_type: number
}

interface BreedResponse {
  id: number
  name: string
  pet_type: number
  [key: string]: unknown
}

interface BreedChangeEvent {
  target: {
    id: string
    value: Breed | string | null
    selectedOption?: Option
  }
}

interface BreedSelectorProps {
  name: string
  value: Breed | string | null
  petTypeId?: number | null
  handleChange: (e: BreedChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
  isRequired?: boolean
}

const BreedSelector: React.FC<BreedSelectorProps> = ({
  name,
  value,
  petTypeId,
  handleChange,
  label,
  tooltip,
  placeholder,
  isRequired,
}) => {
  const mapBreedToOption = (breed: BreedResponse): Option => ({
    id: breed.id,
    value: breed.name,
    label: breed.name,
  })

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
        value: selectedOption
          ? {
              id: selectedOption.id,
              name: selectedOption.value,
              pet_type: petTypeId || 0,
            }
          : '',
        selectedOption,
      },
    })
  }

  // находим текущее значение для отображения
  const currentValue = value
    ? {
        id: typeof value === 'object' ? value.id : 0,
        value: typeof value === 'object' ? value.name : value,
        label: typeof value === 'object' ? value.name : value,
      }
    : null

  return (
    <Selector<BreedResponse>
      name={name}
      value={currentValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      endpoint={petTypeId ? `/dictionaries/pet-breeds/` : undefined}
      mapDataToOptions={mapBreedToOption}
      searchParam="search"
      isRequired={isRequired}
      config={{
        params: {
          pet_type: petTypeId || undefined,
        },
        queryOptions: {
          enabled: !!petTypeId, // включаем запрос только если выбран тип питомца
        },
      }}
    />
  )
}

export default BreedSelector
