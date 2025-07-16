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
          className="text-md [&_a]:text-orange font-medium [&_a]:hover:underline [&_li]:mb-2 [&_p]:mt-1 [&_ul]:list-disc [&_ul]:py-2 [&_ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }
    return <div className="text-md font-medium">{content}</div>
  }

  return (
    <div className="bg-text relative my-4 rounded-[30px]">
      <button
        className="flex w-full items-center justify-between px-8 py-5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-left text-white">{title}</h3>
        <div className="relative flex h-8 w-8 items-center justify-center">
          <Image
            src={openFAQ}
            alt="FAQ icon"
            width={32}
            height={32}
            className={`absolute transition-all duration-500 ${
              isOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'
            }`}
          />
          <Image
            src={closedFAQ}
            alt="FAQ icon"
            width={32}
            height={32}
            className={`absolute transition-all duration-500 ${
              isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
            }`}
          />
        </div>
      </button>

      <div
        ref={contentRef}
        style={{ '--accordion-height': `${contentHeight}px` } as React.CSSProperties}
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        } `}
      >
        <div className="overflow-hidden">
          <div className="px-8 pb-5">
            <div className="text-white">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accordion
