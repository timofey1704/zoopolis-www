'use client'
import React from 'react'
import Button from './ui/Button'

const SmsSend = () => {
  const handleSMSSend = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-sms/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: '375333832840', text: 'Зоополис зовет:)' }),
    })
    const data = await response.json()
    console.log('SMS sent:', data)
    if (response.ok) {
      alert('SMS отправлено успешно!')
    } else {
      alert('Ошибка при отправке SMS: ' + data.detail)
      console.error('SMS send error:', data)
    }
  }

  return <Button text="Отправить смску" className="bg-orange text-white" onClick={handleSMSSend} />
}

export default SmsSend
