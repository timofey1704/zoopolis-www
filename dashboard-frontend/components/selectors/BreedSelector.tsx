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
}

interface BreedSelectorProps {
  name: string
  value: string
  petTypeId?: number | null
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

const BreedSelector: React.FC<BreedSelectorProps> = ({
  name,
  value,
  petTypeId,
  handleChange,
  label,
  tooltip,
  placeholder,
}) => {
  const mapBreedToOption = (breed: BreedResponse): Option => ({
    id: breed.id,
    value: breed.name,
    label: breed.name,
  })

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

  // находим текущее значение для отображения
  const currentValue = value
    ? {
        id: 0, // будет заменено при получении данных
        name: value,
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
      config={{
        params: {
          pet_type: petTypeId,
        },
        queryOptions: {
          enabled: !!petTypeId, // включаем запрос только если выбран тип питомца
        },
      }}
    />
  )
}

export default BreedSelector
