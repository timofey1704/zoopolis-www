import React from 'react'
import Accordion from './ui/Accordion'
import { FAQProps } from '@/app/types'

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="sticky py-7 pl-4">
        <h2 className="py-4 text-center text-4xl font-bold">
          ЧАСТЫЕ{' '}
          <span className="relative inline-block px-3">
            <span className="bg-orange absolute -inset-1 -rotate-3 rounded-3xl" />
            <span className="relative text-white">ВОПРОСЫ</span>
          </span>
        </h2>
        {faqs.map(faq => (
          <Accordion key={faq.id} title={faq.title} content={faq.content} />
        ))}
      </div>
    </div>
  )
}

export default FAQ
