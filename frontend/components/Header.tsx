import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Burger from './Burger'
import { FaUser } from 'react-icons/fa'

const Header = () => {
  return (
    <div className="bg-gray flex items-center justify-between p-4">
      <div className="pl-4 sm:pl-8 lg:pl-[92px]">
        <Link
          href="/"
          className="transition-opacity duration-300 hover:cursor-pointer hover:opacity-80"
        >
          <Image src="/logo.png" alt="logo" width={62} height={62} />
        </Link>
      </div>
      {/* Navigation links - hidden on mobile and tablet */}
      <div className="ml-10 hidden items-center justify-center space-x-10 text-xl font-medium lg:flex">
        <Link
          href="/"
          className="hover:text-orange transition-colors duration-300 hover:cursor-pointer"
        >
          Как это работает?
        </Link>
        <Link
          href="/about"
          className="hover:text-orange transition-colors duration-300 hover:cursor-pointer"
        >
          Тарифы
        </Link>
        <Link
          href="/about"
          className="hover:text-orange transition-colors duration-300 hover:cursor-pointer"
        >
          Отзывы
        </Link>
        <Link
          href="/about"
          className="hover:text-orange transition-colors duration-300 hover:cursor-pointer"
        >
          FAQ
        </Link>
        <Link
          href="/about"
          className="hover:text-orange transition-colors duration-300 hover:cursor-pointer"
        >
          О компании
        </Link>
      </div>
      {/* Desktop button */}
      <div className="hidden pr-[92px] lg:block">
        <Button text="Личный кабинет" className="bg-white text-black hover:shadow-md" />
      </div>
      {/* Mobile/Tablet layout */}
      <div className="flex items-center space-x-4 pr-4 sm:pr-8 lg:hidden">
        <Link href="/login">
          <button className="rounded-full bg-white p-2 transition-shadow hover:shadow-md">
            <FaUser className="h-6 w-6" />
          </button>
        </Link>
        <Burger />
      </div>
    </div>
  )
}

export default Header
