import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const Header = () => {
  return (
    <div className='flex justify-between items-center p-4 bg-gray'>
      <div className='pl-[92px]'>
        <Link href="/" className='hover:opacity-80 transition-opacity duration-300'>
          <Image src="/logo.png" alt="logo" width={62} height={62} />
        </Link>
      </div>
      <div className='flex items-center justify-center space-x-10 ml-10 text-xl font-medium'>
        <Link href="/" className='hover:text-orange'>Как это работает</Link>
        <Link href="/about" className='hover:text-orange'>Тарифы</Link>
        <Link href="/about" className='hover:text-orange'>Отзывы</Link>
        <Link href="/about" className='hover:text-orange'>FAQ</Link>
        <Link href="/about" className='hover:text-orange'>О компании</Link>
      </div>
      <div className='pr-[92px]'>
        <Button text="Личный кабинет" />
      </div>
    </div>
  )
}

export default Header