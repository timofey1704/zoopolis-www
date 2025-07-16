import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaTelegramPlane, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className="flex flex-col space-y-7 rounded-t-[100px] bg-[#1C1C29] p-4">
      <div className="mt-5 flex items-center justify-between px-[92px]">
        <div>
          <Link href="/" className="transition-opacity duration-300 hover:opacity-80">
            <Image src="/logoFooter.png" alt="logo" width={50} height={50} />
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-10 text-xl font-medium text-white">
          <Link href="/" className="hover:text-orange transition-colors duration-300">
            Как это работает?
          </Link>
          <Link href="/about" className="hover:text-orange transition-colors duration-300">
            Тарифы
          </Link>
          <Link href="/about" className="hover:text-orange transition-colors duration-300">
            Отзывы
          </Link>
          <Link href="/about" className="hover:text-orange transition-colors duration-300">
            FAQ
          </Link>
          <Link href="/about" className="hover:text-orange transition-colors duration-300">
            О компании
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="https://t.me/"
            target="_blank"
            className="hover:text-orange text-3xl text-white transition-colors duration-300"
          >
            <FaTelegramPlane size={25} />
          </Link>
          <Link
            href="https://www.instagram.com/"
            target="_blank"
            className="hover:text-orange text-3xl text-white transition-colors duration-300"
          >
            <FaInstagram size={25} />
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 px-[100px] text-xl font-medium text-white">
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
