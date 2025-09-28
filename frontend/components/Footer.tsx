import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Scroll from './ui/Scroll'
import { FaTelegramPlane, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className="flex flex-col space-y-4 rounded-t-[40px] bg-[#1C1C29] p-4 sm:space-y-6 sm:rounded-t-[60px] lg:space-y-7 lg:rounded-t-[100px]">
      <div className="mt-4 flex flex-col items-center gap-6 px-4 sm:mt-5 sm:px-6 lg:mt-5 lg:flex-row lg:justify-between lg:px-[92px]">
        <div>
          <Link href="/" className="transition-opacity duration-300 hover:opacity-80">
            <Image
              src="/logoFooter.png"
              alt="logo"
              width={50}
              height={50}
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[50px] lg:w-[50px]"
            />
          </Link>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-base font-medium text-white sm:gap-6 sm:text-lg lg:gap-10 lg:text-xl">
          <Scroll moveTo="main">
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              Как это работает?
            </div>
          </Scroll>

          <Scroll moveTo="pricing">
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              Тарифы
            </div>
          </Scroll>

          <Scroll moveTo="reviews">
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              Отзывы
            </div>
          </Scroll>
          <Scroll moveTo="faq">
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              FAQ
            </div>
          </Scroll>

          <Scroll moveTo="about-us">
            <div className="hover:text-orange transition-colors duration-300 hover:cursor-pointer">
              О компании
            </div>
          </Scroll>
          <Link
            href="/privacy-policy"
            className="hover:text-orange text-lg transition-colors duration-300"
          >
            Политика конфиденциальности
          </Link>
        </nav>

        <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
          <Link
            href="https://t.me/"
            target="_blank"
            className="hover:text-orange text-2xl text-white transition-colors duration-300 sm:text-3xl"
          >
            <FaTelegramPlane className="h-5 w-5 sm:h-6 sm:w-6 lg:h-[25px] lg:w-[25px]" />
          </Link>
          <Link
            href="https://www.instagram.com/"
            target="_blank"
            className="hover:text-orange text-2xl text-white transition-colors duration-300 sm:text-3xl"
          >
            <FaInstagram className="h-5 w-5 sm:h-6 sm:w-6 lg:h-[25px] lg:w-[25px]" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 p-4 text-base font-medium text-white sm:flex-row sm:justify-center sm:gap-6 sm:text-lg lg:justify-between lg:px-[100px] lg:text-xl">
        <a
          href="tel:+375173618080"
          className="hover:text-orange transition-colors duration-300"
          target="_blank"
        >
          +375 (17) 361-80-80
        </a>
        <a
          href="tel:88011008080"
          className="hover:text-orange transition-colors duration-300"
          target="_blank"
        >
          8(801) 100-80-80
        </a>
        <a
          href="https://zoopolis.org"
          target="_blank"
          className="hover:text-orange transition-colors duration-300"
        >
          zoopolis.org
        </a>
      </div>
    </div>
  )
}

export default Footer
