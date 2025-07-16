import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const Header = () => {
  return (
    <div className="bg-gray flex items-center justify-between p-4">
      <div className="pl-[92px]">
        <Link href="/" className="transition-opacity duration-300 hover:opacity-80">
          <Image src="/logo.png" alt="logo" width={62} height={62} />
        </Link>
      </div>
      <div className="ml-10 flex items-center justify-center space-x-10 text-xl font-medium">
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
      <div className="pr-[92px]">
        <Button text="Личный кабинет" className="bg-white text-black" />
      </div>
    </div>
  )
}

export default Header
