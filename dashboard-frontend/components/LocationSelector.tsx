'use client'

import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import axios from 'axios'
import Tooltip from './ui/Tooltip'

interface CityResponse {
  id: number
  name: string
  country: string
  display_name: string
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

interface LocationOption {
  value: string
  label: string
  id: number
}

interface LocationSelectProps {
  name: string
  value: string
  handleChange: (e: {
    target: { id: string; value: string; selectedOption?: LocationOption }
  }) => void
  label: string
  placeholder: string
  tooltip?: string | React.ReactNode
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
}) => {
  const [options, setOptions] = useState<LocationOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true)
      try {
        // Если поиск пустой, не добавляем параметр search в URL
        const url = `${API_URL}/account/cities/${search ? `?search=${search}` : ''}`

        // для городов - пагинированный ответ
        const response = await axios.get<PaginatedResponse<CityResponse>>(url)
        setOptions(
          response.data.results.map(city => ({
            id: city.id,
            value: city.name,
            label: city.display_name,
          }))
        )
      } catch (error) {
        console.error('Error fetching options:', error)
        setOptions([])
      } finally {
        setIsLoading(false)
      }
    }

    // debounce search
    const timeoutId = setTimeout(() => {
      fetchOptions()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, API_URL])

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
        value={options.find(opt => opt.label === value || opt.value === value)}
        onChange={selectedOption => {
          handleChange({
            target: {
              id: name,
              value: selectedOption?.value || '',
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
