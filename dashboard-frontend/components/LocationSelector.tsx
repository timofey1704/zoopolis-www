'use client'

import React, { useState } from 'react'
import Select from 'react-select'
import Tooltip from './ui/Tooltip'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import { PaginatedResponse, CityResponse, LocationOption, LocationSelectProps } from '@/app/types'

const LocationSelect: React.FC<LocationSelectProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
}) => {
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useClientFetch<PaginatedResponse<CityResponse>>(
    '/account/cities/',
    {
      config: {
        // если search не пустой, то добавляем его в query params
        params: search ? { search } : undefined,
      },
      queryOptions: {
        staleTime: 60 * 60 * 1000, // кэшируем на 1 час
        refetchOnWindowFocus: false, // не перезапрашиваем при фокусе инпута
      },
    }
  )

  const options =
    data?.results.map(city => ({
      id: city.id,
      value: city.name,
      label: city.display_name,
    })) || []

  // если есть ошибка, логируем её
  if (error) {
    console.error('Error fetching cities:', error)
  }

  return (
    <div>
      {label && (
        <div className="my-2 flex items-center gap-2">
          <label className="text-sm font-medium text-gray-500" htmlFor={name}>
            {label}
          </label>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
      )}
      <Select<LocationOption>
        inputId={name}
        name={name}
        options={options}
        value={options.find(opt => opt.id === value?.id)}
        onChange={selectedOption => {
          handleChange({
            target: {
              id: name,
              value: selectedOption
                ? {
                    id: selectedOption.id,
                    name: selectedOption.value,
                    country: selectedOption.label.split(', ')[1],
                    display_name: selectedOption.label,
                  }
                : null,
              selectedOption: selectedOption || undefined,
            },
          })
        }}
        isLoading={isLoading}
        onInputChange={newValue => setSearch(newValue)}
        isSearchable
        isClearable
        placeholder={placeholder}
        noOptionsMessage={() => (isLoading ? 'Загрузка...' : 'Нет доступных вариантов')}
        classNamePrefix="select"
        className="rounded-lg"
        styles={{
          control: base => ({
            ...base,
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            padding: '2px',
            '&:hover': {
              borderColor: '#E5E7EB',
            },
            '&:focus-within': {
              backgroundColor: '#FFFFFF',
              borderColor: '#E5E7EB',
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
            },
          }),
          menu: base => ({
            ...base,
            position: 'absolute',
            width: '100%',
            zIndex: 9999,
            marginTop: '4px',
            borderRadius: '0.75rem',
            overflow: 'hidden',
          }),
          option: (base, state) => ({
            ...base,
            fontSize: '0.875rem',
            padding: '8px 12px',
            backgroundColor: state.isSelected ? '#EFF6FF' : state.isFocused ? '#F3F4F6' : 'white',
            color: state.isSelected ? '#2563EB' : '#1F2937',
            cursor: 'pointer',
            '&:active': {
              backgroundColor: '#DBEAFE',
            },
            '&:hover': {
              backgroundColor: state.isSelected ? '#EFF6FF' : '#F3F4F6',
            },
          }),
        }}
      />
    </div>
  )
}

export default LocationSelect
