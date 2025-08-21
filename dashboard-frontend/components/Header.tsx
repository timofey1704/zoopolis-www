import React from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Burger from './ui/Burger'
import { FaUser } from 'react-icons/fa'

const Header = () => {
  return (
    <div className="bg-gray flex items-center justify-between p-4">
      <div className="pl-4 sm:pl-8 lg:pl-[92px]">Тайтл</div>

      <div className="hidden pr-[92px] lg:block">
        <Link href="/login">
          <Button text="Личный кабинет" className="bg-white text-black hover:shadow-md" />
        </Link>
      </div>
      {/* Mobile/Tablet layout */}
      <div className="flex items-center space-x-4 pr-4 sm:pr-8 lg:hidden">
        <Burger />
        <Link href="/login">
          <button className="ml-6 rounded-2xl bg-white p-2 transition-shadow hover:shadow-md">
            <FaUser className="h-6 w-6" />
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Header
