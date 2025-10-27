import React from 'react'

interface ValidateCodeProps {
  code: string
  onValidated: () => void
}

const ValidateCode: React.FC<ValidateCodeProps> = ({ code, onValidated }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Проверка кода</h3>
      <p>Код для проверки: {code}</p>
      <button
        onClick={onValidated}
        className="bg-orange rounded px-4 py-2 text-white hover:bg-orange-600"
      >
        Подтвердить
      </button>
    </div>
  )
}

export default ValidateCode
