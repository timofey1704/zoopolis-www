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
          className="lg:text-md [&_a]:text-orange text-sm font-medium sm:text-base [&_a]:hover:underline [&_li]:mb-1 sm:[&_li]:mb-2 [&_p]:mt-1 [&_ul]:list-disc [&_ul]:py-1.5 [&_ul]:pl-3 sm:[&_ul]:py-2 sm:[&_ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-3 sm:[&>ol]:pl-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    }
    return <div className="lg:text-md text-sm font-medium sm:text-base">{content}</div>
  }

  return (
    <div className="bg-text relative my-3 rounded-[20px] sm:my-4 sm:rounded-[30px]">
      <button
        className="flex w-full items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="pr-4 text-left text-sm text-white sm:text-base lg:text-lg">{title}</h4>
        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center sm:h-7 sm:w-7 lg:h-8 lg:w-8">
          <Image
            src={openFAQ}
            alt="FAQ icon"
            width={32}
            height={32}
            className={`absolute h-full w-full transition-all duration-500 ${
              isOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'
            }`}
          />
          <Image
            src={closedFAQ}
            alt="FAQ icon"
            width={32}
            height={32}
            className={`absolute h-full w-full transition-all duration-500 ${
              isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
            }`}
          />
        </div>
      </button>

      <div
        ref={contentRef}
        style={{ '--accordion-height': `${contentHeight}px` } as React.CSSProperties}
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        } `}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-3 sm:px-6 sm:pb-4 lg:px-8 lg:pb-5">
            <div className="text-white">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accordion
