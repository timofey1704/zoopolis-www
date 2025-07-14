import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaTelegramPlane, FaInstagram } from "react-icons/fa"

const Footer = () => {
  return (
    <div className='flex flex-col space-y-7 p-4 bg-[#1C1C29] rounded-t-[100px]'>
    <div className='flex justify-between items-center mt-5 px-[92px]'>
      <div>
        <Link href="/" className='hover:opacity-80 transition-opacity duration-300'>
          <Image src="/logoFooter.png" alt="logo" width={50} height={50} />
        </Link>
      </div>
      <div className='flex items-center justify-center space-x-10 text-xl font-medium text-white'>
        <Link href="/" className='hover:text-orange transition-colors duration-300'>Как это работает?</Link>
        <Link href="/about" className='hover:text-orange transition-colors duration-300'>Тарифы</Link>
        <Link href="/about" className='hover:text-orange transition-colors duration-300'>Отзывы</Link>
        <Link href="/about" className='hover:text-orange transition-colors duration-300'>FAQ</Link>
        <Link href="/about" className='hover:text-orange transition-colors duration-300'>О компании</Link>
      </div>
      <div className='flex items-center space-x-6'>
        <Link href="https://t.me/" target="_blank" className='text-white text-3xl hover:text-orange transition-colors duration-300'>
          <FaTelegramPlane size={25} />
        </Link>
        <Link href="https://www.instagram.com/" target="_blank" className='text-white text-3xl hover:text-orange transition-colors duration-300'>
          <FaInstagram size={25} />
        </Link>
      </div>
    </div>
    <div className='flex justify-between items-center p-4 text-xl font-medium text-white px-[100px]'>
      <a href="tel:+375173618080" className='hover:text-orange transition-colors duration-300' target="_blank">+375 (17) 361-80-80</a>
      <a href="tel:88011008080" className='hover:text-orange transition-colors duration-300' target="_blank">8(801) 100-80-80</a>
      <a href="https://zoopolis.org" target="_blank" className='hover:text-orange transition-colors duration-300'>zoopolis.org</a>
    </div>
    </div>
  )
}

export default Footer