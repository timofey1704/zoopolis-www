'use client'

import React, { useState } from 'react'
import Select from 'react-select'
import Tooltip from './Tooltip'
import { useClientFetch } from '@/app/hooks/useClientFetch'

export interface Option {
  id: number
  value: string
  label: string
}

export interface DataItem {
  id: number
  [key: string]: any
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export interface SelectorProps<T extends DataItem> {
  name: string
  value?: {
    id: number | string
    [key: string]: any
  } | null
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
  endpoint: string
  mapDataToOptions: (data: T) => Option
  searchParam?: string
}

const Selector = <T extends DataItem>({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
  endpoint,
  mapDataToOptions,
  searchParam = 'search',
}: SelectorProps<T>) => {
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useClientFetch<PaginatedResponse<T>>(endpoint, {
    config: {
      params: search ? { [searchParam]: search } : undefined,
    },
    queryOptions: {
      staleTime: 60 * 60 * 1000, // кешируем на час
      refetchOnWindowFocus: false,
    },
  })

  const options = data?.results.map(mapDataToOptions) || []

  if (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
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
      <Select<Option>
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
                    ...selectedOption,
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

export default Selector
