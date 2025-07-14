'use client'

import React, { useState, useRef, useEffect } from 'react'
import { AccordionProps } from '@/app/types'
import closedFAQ from '../../public/closedFAQ.png'
import openFAQ from '../../public/openFAQ.png'
import Image from 'next/image'

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number>(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [content])

  const renderContent = () => {
    if (typeof content === 'string') {
      return (
        <div
          className="text-md font-medium [&>ol]:list-decimal [&>ol]:pl-4 [&_ul]:list-disc [&_ul]:py-2 [&_ul]:pl-4 [&_li]:mb-2 [&_p]:mt-1 [&_a]:text-orange [&_a]:hover:underline"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }
    return <div className="text-md font-medium">{content}</div>
  }

  return (
    <div className="relative bg-text rounded-[30px] my-4">
      <button
        className="flex justify-between items-center py-5 px-8 w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-2xl font-bold text-white text-left">{title}</h3>
        <div className="w-8 h-8 flex items-center justify-center relative">
          <Image
            src={openFAQ}
            alt="FAQ icon"
            width={32}
            height={32}
            className={`absolute transition-all duration-500 ${
              isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
            }`}
          />
          <Image
            src={closedFAQ}
            alt="FAQ icon"
            width={32}
            height={32}
            className={`absolute transition-all duration-500 ${
              isOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
            }`}
          />
        </div>
      </button>

      <div
        ref={contentRef}
        style={
          { '--accordion-height': `${contentHeight}px` } as React.CSSProperties
        }
        className={`
          grid
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }
        `}
      >
        <div className="overflow-hidden">
          <div className="px-8 pb-5">
            <div className="text-lg text-white">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accordion
