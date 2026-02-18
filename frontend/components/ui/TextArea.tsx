import { TextAreaProps } from '@/app/types'

const TextArea = ({ value, handleChange, label, name, placeholder, height }: TextAreaProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-500" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        style={{ minHeight: height ? `${height}px` : '160px' }}
        className="focus:ring-mainblocks w-full rounded-xl border bg-gray-100 px-3 py-2 text-black focus:bg-white focus:ring-2 focus:outline-none"
        autoComplete={name}
      />
    </div>
  )
}

export default TextArea
