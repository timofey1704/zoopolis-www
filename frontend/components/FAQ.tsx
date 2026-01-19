import React from 'react'
import Accordion from './ui/Accordion'
import { FAQProps } from '@/app/types'

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <div className="mx-auto w-full max-w-250 px-4 sm:px-6 lg:px-8">
      <div className="py-4 sm:py-6 lg:py-8">
        <h2 className="mb-6 text-center text-2xl font-bold sm:mb-8 sm:text-3xl lg:mb-10 lg:text-4xl">
          ЧАСТЫЕ{' '}
          <span className="relative inline-block px-2 sm:px-3">
            <span className="bg-orange absolute -inset-1 -rotate-3 rounded-2xl sm:rounded-3xl" />
            <span className="relative text-white">ВОПРОСЫ</span>
          </span>
        </h2>
        <div className="space-y-4 sm:space-y-6">
          {faqs.map(faq => (
            <Accordion key={faq.id} title={faq.title} content={faq.content} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ
