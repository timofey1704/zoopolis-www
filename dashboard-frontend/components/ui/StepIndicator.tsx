import React from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'

interface StepIndicatorProps {
  steps: {
    id: number
    name: string
    status: 'complete' | 'current' | 'upcoming'
  }[]
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <nav aria-label="Progress">
      {/* Мобильная версия */}
      <ol role="list" className="flex flex-col sm:hidden">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`flex items-center ${step.id !== steps.length ? 'mb-8' : ''} relative`}
          >
            {step.id !== steps.length && (
              <div className="absolute top-10 left-4 h-full w-0.5 bg-gray-200">
                {step.status === 'complete' && <div className="bg-orange h-full w-0.5" />}
              </div>
            )}

            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                step.status === 'complete'
                  ? 'bg-orange'
                  : step.status === 'current'
                    ? 'border-orange border-2 bg-white'
                    : 'border-2 border-gray-300 bg-white'
              }`}
            >
              {step.status === 'complete' ? (
                <CheckIcon className="h-5 w-5 text-white" />
              ) : step.status === 'current' ? (
                <span className="bg-orange h-2.5 w-2.5 rounded-full" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
              )}
            </div>
            <span className="ml-4 text-sm font-medium">{step.name}</span>
          </li>
        ))}
      </ol>

      {/* Десктопная версия */}
      <ol role="list" className="hidden items-center sm:flex">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`${step.id !== steps.length ? 'pr-24 md:pr-48' : ''} relative`}
          >
            {step.status === 'complete' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="bg-orange h-0.5 w-full" />
                </div>
                <div className="bg-orange relative flex h-8 w-8 items-center justify-center rounded-full">
                  <CheckIcon className="h-5 w-5 text-white" />
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="border-orange relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white">
                  <span className="bg-orange h-2.5 w-2.5 rounded-full" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                </div>
              </>
            )}
            <span
              className="absolute top-10 text-center text-sm font-medium"
              style={{
                width: '100px',
                ...(step.id === 1 && { left: 0 }),
                ...(step.id === 2 && { left: '50%', transform: 'translateX(-140%)' }),
                ...(step.id === 3 && { left: '50%', transform: 'translateX(-47%)' }),
              }}
            >
              {step.name}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default StepIndicator
