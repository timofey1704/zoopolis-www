'use client'

import React from 'react'
import { LocationSelectProps, CityResponse, CityData } from '@/app/types'
import Selector, { Option } from '../ui/Selector'

const LocationSelect: React.FC<LocationSelectProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
}) => {
  const mapCityToOption = (city: CityResponse): Option => ({
    id: city.id,
    value: city.name,
    label: city.display_name,
  })

  const transformSelectedValue = (option: Option | undefined): CityData | null => {
    if (!option) return null
    return {
      id: option.id,
      name: option.value,
      country: option.label.split(', ')[1],
      display_name: option.label,
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
        selectedOption: selectedOption || undefined,
      },
    })
  }

  return (
    <Selector<CityResponse>
      name={name}
      value={value}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      endpoint="/account/cities/"
      mapDataToOptions={mapCityToOption}
    />
  )
}

export default LocationSelect
