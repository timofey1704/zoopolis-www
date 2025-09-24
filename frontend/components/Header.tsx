import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Burger from './Burger'
import { FaUser } from 'react-icons/fa'
import Scroll from './ui/Scroll'

const Header = () => {
  return (
    <div className="bg-gray flex items-center justify-between p-4">
      <div className="pl-4 sm:pl-8 lg:pl-[92px]">
        <Link
          href="/"
          className="transition-opacity duration-300 hover:cursor-pointer hover:opacity-80"
        >
          <Image src="/logo.png" alt="logo" width={62} height={62} priority />
        </Link>
      </div>
      <div className="ml-10 hidden items-center justify-center space-x-10 text-xl font-medium lg:flex">
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
      </div>

      <div className="hidden pr-[92px] lg:block">
        <a href="https://account.zoopolis.org/login" target="_blank" rel="noopener noreferrer">
          <Button text="Личный кабинет" className="bg-white text-black hover:shadow-md" />
        </a>
      </div>

      <div className="flex items-center space-x-4 pr-4 sm:pr-8 lg:hidden">
        <Burger />
        <a href="https://account.zoopolis.org/login" target="_blank" rel="noopener noreferrer">
          <button className="ml-6 rounded-2xl bg-white p-2 transition-shadow hover:shadow-md">
            <FaUser className="h-6 w-6" />
          </button>
        </a>
      </div>
    </div>
  )
}

export default Header
