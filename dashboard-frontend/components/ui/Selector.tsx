'use client'

import React, { useState } from 'react'
import Select from 'react-select'
import Tooltip from './Tooltip'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import { useFormContext } from '@/app/hooks/useForm'

export interface Option {
  id: number
  value: string
  label: string | React.ReactNode
}

export interface DataItem {
  id: number
  [key: string]: unknown
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export interface SelectorProps<T extends DataItem> {
  name: string
  value?: Option | null
  handleChange: (e: {
    target: {
      id: string
      value: Option | null
      selectedOption?: Option
    }
  }) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
  endpoint?: string
  mapDataToOptions: (data: T) => Option
  searchParam?: string
  staticOptions?: T[]
  isRequired?: boolean
  config?: {
    params?: Record<string, string | number | boolean | undefined>
    queryOptions?: {
      enabled?: boolean
    }
  }
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
  staticOptions,
  isRequired,
  config = {},
}: SelectorProps<T>) => {
  const formContext = useFormContext()
  const required = isRequired ?? (formContext?.isFieldRequired(name) || false)
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useClientFetch<PaginatedResponse<T>>(
    endpoint || '/404-no-endpoint',
    {
      config: {
        params: {
          ...(search ? { [searchParam]: search } : {}),
          ...(config.params || {}),
        },
      },
      queryOptions: {
        staleTime: 60 * 60 * 1000, // кешируем на час
        refetchOnWindowFocus: false,
        enabled: !staticOptions && endpoint !== undefined && config.queryOptions?.enabled !== false, // отключаем запрос если используем статические опции, нет endpoint или явно выключен в конфиге
      },
    }
  )

  let options: Option[] = []

  if (staticOptions) {
    // если есть статические опции используем их
    options = staticOptions.map(mapDataToOptions)
  } else {
    // иначе используем данные с бекенда
    const dataArray = Array.isArray(data) ? data : data?.results || []
    options = dataArray.map(mapDataToOptions)
  }

  if (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
  }

  return (
    <div>
      {label && (
        <div className="my-2 flex items-center gap-2">
          <label
            className="flex items-center gap-1 text-sm font-medium text-gray-500"
            htmlFor={name}
          >
            {label}
            {required && (
              <span
                className="text-sm text-red-500"
                title="Обязательное поле"
                aria-label="обязательное поле"
              >
                *
              </span>
            )}
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
        required={required}
        aria-required={required}
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
