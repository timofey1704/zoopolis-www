'use client'

import React from 'react'
import { LocationSelectProps, CityResponse, CityData, LocationOption } from '@/app/types'
import Selector, { Option as SelectorOption } from '../ui/Selector'

interface ExtendedCityResponse extends CityResponse {
  [key: string]: unknown
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
  isRequired,
}) => {
  const mapCityToOption = (city: ExtendedCityResponse): LocationOption => ({
    id: city.id,
    value: city.name,
    label: city.display_name,
  })

  const transformSelectedValue = (option: LocationOption | undefined): CityData | null => {
    if (!option) return null
    return {
      id: option.id,
      name: option.value,
      country: option.label.split(', ')[1],
      display_name: option.label,
    }
  }

  // Преобразуем CityData в Option для Selector
  const selectorValue = value
    ? {
        id: value.id,
        value: value.name,
        label: value.display_name,
      }
    : null

  const handleSelectorChange = (e: {
    target: {
      id: string
      value: SelectorOption | null
      selectedOption?: SelectorOption
    }
  }) => {
    const selectedOption = e.target.selectedOption
    if (selectedOption) {
      const locationOption: LocationOption = {
        id: selectedOption.id,
        value: selectedOption.value,
        label: selectedOption.label as string,
      }
      handleChange({
        target: {
          id: name,
          value: transformSelectedValue(locationOption),
          selectedOption: locationOption,
        },
      })
    } else {
      handleChange({
        target: {
          id: name,
          value: null,
          selectedOption: undefined,
        },
      })
    }
  }

  return (
    <Selector<ExtendedCityResponse>
      name={name}
      value={selectorValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      endpoint="/dictionaries/cities/"
      mapDataToOptions={mapCityToOption}
      isRequired={isRequired}
    />
  )
}

export default LocationSelect
