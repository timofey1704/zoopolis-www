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
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`${stepIdx !== steps.length - 1 ? 'pr-24 sm:pr-48' : ''} relative`}
          >
            {step.status === 'complete' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="bg-orange h-0.5 w-full" />
                </div>
                <div className="bg-orange relative flex h-8 w-8 items-center justify-center rounded-full">
                  <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div
                  className="border-orange relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white"
                  aria-current="step"
                >
                  <span className="bg-orange h-2.5 w-2.5 rounded-full" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}

            <span
              className="absolute start-0 top-10 text-center text-sm font-medium whitespace-nowrap"
              style={{ width: '100px' }}
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
