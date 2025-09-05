import React, { ReactNode } from 'react'
import Button from './Button'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: ReactNode
  submitText?: string
  onSubmit?: () => void
  showCancel?: boolean
  cancelText?: string
}

export const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  submitText = 'OK',
  onSubmit,
  showCancel = true,
  cancelText = 'Отмена',
}: DialogProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="bg-opacity-50 fixed inset-0 bg-black transition-opacity" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        <div className="mb-6">{description}</div>

        <div className="flex justify-end space-x-4">
          {showCancel && (
            <Button
              text={cancelText}
              onClick={onClose}
              className="rounded-xl bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            />
          )}
          <Button
            text={submitText}
            onClick={onSubmit || onClose}
            className="from-orange rounded-xl bg-gradient-to-r to-orange-600 px-4 py-2 text-white hover:opacity-90"
          />
        </div>
      </div>
    </div>
  )
}
