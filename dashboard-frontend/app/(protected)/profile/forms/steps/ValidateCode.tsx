'use client'

import React, { useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

interface ValidateCodeProps {
  code: string
  onValidated: () => void
}

const ValidateCode: React.FC<ValidateCodeProps> = ({ code, onValidated }) => {
  const [verificationCode, setVerificationCode] = useState('')

  return (
    <div className="flex flex-col items-center space-y-8 p-6">
      <div className="space-y-2 text-center">
        <h2 className="font-semibold text-gray-900">Проверка кода</h2>
        <p className="text-base text-gray-500">
          Мы отправили код подтверждения на ваш номер телефона
        </p>
      </div>

      <div className="flex w-full flex-col items-center space-y-6">
        <div className="flex flex-col items-center">
          <InputOTP
            maxLength={6}
            value={verificationCode}
            onChange={setVerificationCode}
            className="gap-2"
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot
                index={0}
                className="aspect-square h-12 w-12 rounded-xl border-2 border-gray-200 text-xl"
              />
              <InputOTPSlot
                index={1}
                className="aspect-square h-12 w-12 rounded-xl border-2 border-gray-200 text-xl"
              />
              <InputOTPSlot
                index={2}
                className="aspect-square h-12 w-12 rounded-xl border-2 border-gray-200 text-xl"
              />
              <InputOTPSlot
                index={3}
                className="aspect-square h-12 w-12 rounded-xl border-2 border-gray-200 text-xl"
              />
              <InputOTPSlot
                index={4}
                className="aspect-square h-12 w-12 rounded-xl border-2 border-gray-200 text-xl"
              />
              <InputOTPSlot
                index={5}
                className="aspect-square h-12 w-12 rounded-xl border-2 border-gray-200 text-xl"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="w-[calc(6*3rem+5*0.5rem)]">
          <button
            onClick={() => {
              if (verificationCode.length === 6) {
                onValidated()
              }
            }}
            disabled={verificationCode.length !== 6}
            className={`w-full rounded-xl px-4 py-3 font-medium text-white transition-all duration-200 ${
              verificationCode.length === 6
                ? 'bg-orange cursor-pointer hover:bg-orange-600'
                : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            Подтвердить
          </button>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-500">
          Код для проверки: <span className="font-medium text-gray-900">{code}</span>
        </p>
      </div>
    </div>
  )
}

export default ValidateCode
