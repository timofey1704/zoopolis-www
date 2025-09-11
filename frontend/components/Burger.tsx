'use client'

import React, { useState } from 'react'
import Scroll from './ui/Scroll'

const Burger = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex h-8 w-8 flex-col items-center justify-center"
      >
        <div className="relative h-8 w-8">
          <span
            className={`absolute h-0.5 bg-black transition-all duration-300 ease-in-out ${
              isOpen ? 'top-4 w-8 rotate-45' : 'top-2 w-8'
            }`}
          />
          <span
            className={`absolute h-0.5 bg-black transition-all duration-300 ease-in-out ${
              isOpen ? 'top-4 w-0 opacity-0' : 'top-4 w-8'
            }`}
          />
          <span
            className={`absolute h-0.5 bg-black transition-all duration-300 ease-in-out ${
              isOpen ? 'top-4 w-8 -rotate-45' : 'top-6 w-8'
            }`}
          />
        </div>
      </button>

      {/* меню */}
      <div
        className={`bg-gray fixed left-0 z-50 w-full origin-top shadow-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? 'top-[80px] h-[calc(100vh-80px)] scale-y-100 opacity-100'
            : 'top-[80px] h-0 scale-y-0 opacity-0'
        } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div
          className={`flex flex-col items-center space-y-8 pt-12 transition-all duration-300 ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <Scroll moveTo="main" onClick={handleClose}>
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              Как это работает?
            </div>
          </Scroll>

          <Scroll moveTo="pricing" onClick={handleClose}>
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              Тарифы
            </div>
          </Scroll>

          <Scroll moveTo="reviews" onClick={handleClose}>
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              Отзывы
            </div>
          </Scroll>

          <Scroll moveTo="faq" onClick={handleClose}>
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              FAQ
            </div>
          </Scroll>

          <Scroll moveTo="about-us" onClick={handleClose}>
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              О компании
            </div>
          </Scroll>
        </div>
      </div>
    </>
  )
}

export default Burger
