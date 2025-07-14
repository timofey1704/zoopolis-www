import React from 'react'
import Accordion from './ui/Accordion'
import { FAQProps } from '@/app/types'

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <div className="pl-4 py-7 sticky">
        <h2 className="text-4xl font-bold text-center py-4">
          ЧАСТЫЕ{' '} 
          <span className="relative inline-block px-3">
            <span className="absolute bg-orange -rotate-2 rounded-3xl -inset-1" />
            <span className="relative text-white">ВОПРОСЫ</span>
          </span>
        </h2>
        {faqs.map((faq) => (
          <Accordion key={faq.id} title={faq.title} content={faq.content} />
        ))}
      </div>
    </div>
  )
} 

export default FAQ