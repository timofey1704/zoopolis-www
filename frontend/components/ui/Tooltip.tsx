'use client'

import { useState } from 'react'
import { CiCircleInfo } from 'react-icons/ci'

interface TooltipProps {
  content: string | React.ReactNode
}

const Tooltip = ({ content }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative flex items-center overflow-visible">
      <button
        type="button"
        className="text-orange hover:text-orange/80 focus:outline-none"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <CiCircleInfo className="h-4 w-4" />
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-10 mb-3 w-max max-w-xs -translate-x-1/2 rounded-xl bg-white px-4 py-2 text-center text-sm text-gray-700 shadow-lg">
          {content}
          <div className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-white"></div>
        </div>
      )}
    </div>
  )
}

export default Tooltip
