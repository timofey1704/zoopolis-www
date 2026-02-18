import { useEffect } from 'react'
import Button from './Button'
import { DialogProps } from '@/app/types'

export const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  submitText = 'OK',
  onSubmit,
  showCancel = true,
  showSubmit = true,
  cancelText = 'Отмена',
}: DialogProps) => {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto px-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-50 mx-auto my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        <div className="mb-6">{description}</div>

        <div className="flex w-full gap-3">
          {showCancel && (
            <Button
              text={cancelText}
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 py-3 text-gray-700 hover:bg-gray-200"
            />
          )}
          {showSubmit && (
            <Button
              text={submitText}
              onClick={onSubmit || onClose}
              className="from-orange flex-1 rounded-xl bg-linear-to-r to-orange-600 py-3 text-white hover:opacity-90"
            />
          )}
        </div>
      </div>
    </div>
  )
}
