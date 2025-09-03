import React from 'react'
import Selector, { Option } from '../ui/Selector'
import { ChangeEvent } from 'react'

export interface PetColor {
  id: number
  name: string
  hex_code: string
}

interface ColorResponse {
  id: number
  name: string
  hex_code: string
}

type CustomChangeEvent = {
  target: {
    id: string
    value: string | number | boolean | string[] | number[] | PetColor | null
    type?: string
    checked?: boolean
  }
}

interface ColorSelectorProps {
  name: string
  value: string | PetColor | null
  handleChange: (e: ChangeEvent<HTMLSelectElement> | CustomChangeEvent) => void
  label?: string
  tooltip?: string | React.ReactNode
  placeholder?: string
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
  name,
  value,
  handleChange,
  label,
  tooltip,
  placeholder,
}) => {
  const mapColorToOption = (color: ColorResponse): Option => ({
    id: color.id,
    value: color.name,
    label: (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color.hex_code }} />
        <span>{color.name}</span>
      </div>
    ),
  })

  const transformSelectedValue = (option: Option | undefined): PetColor | null => {
    if (!option) return null
    return {
      id: option.id,
      name: option.value,
      hex_code: '',
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

  const selectorValue = typeof value === 'string' ? null : value

  return (
    <Selector<ColorResponse>
      name={name}
      value={selectorValue}
      handleChange={handleSelectorChange}
      label={label}
      tooltip={tooltip}
      placeholder={placeholder}
      endpoint="/dictionaries/pet-colors/"
      mapDataToOptions={mapColorToOption}
    />
  )
}

export default ColorSelector
