import React from 'react'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import Image from 'next/image'
import Loader from '@/components/ui/Loader'

interface Pet {
  id: number
  name: string
  clear_type: string
  birthday: string
  clear_gender: string
  clear_breed: string
  clear_color: string
  comment: string
  allergies: string
  imageURL: string
  QRImage: string
  QRCode: string
}

const ExistedPets = () => {
  const { data: pets = [], isLoading, error } = useClientFetch<Pet[]>('/pets/get-pets/')

  if (isLoading) return <Loader />
  if (error) return <div>Error: {error.message}</div>

  console.log(pets)
  return (
    <div className="space-y-8">
      {pets.length === 0 ? (
        <div className="text-center text-gray-500">У вас пока нет питомцев</div>
      ) : (
        pets.map(pet => (
          <div key={pet.id} className="my-3 overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {pet.clear_type} {pet.name}
              </h2>
            </div>

            <div className="flex items-center justify-around gap-4 py-4">
              <div className="flex items-center justify-center md:w-[160px]">
                <Image
                  src={pet.imageURL || '/images/noPet.svg'}
                  alt={pet.name}
                  height={160}
                  width={160}
                  priority
                  className="aspect-square w-full rounded-2xl object-cover md:w-[160px]"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={pet.QRImage || '/images/noQR.svg'}
                  alt="qrcode"
                  width={160}
                  height={160}
                  className="rounded-2xl object-contain"
                />
                {pet.QRCode && (
                  <div className="flex items-center justify-center rounded-lg bg-gray-100 px-4 py-2">
                    <span className="font-mono text-lg font-semibold text-gray-700">
                      {pet.QRCode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Порода</p>
                <p className="font-medium">{pet.clear_breed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Цвет</p>
                <p className="font-medium">{pet.clear_color}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Дата рождения</p>
                <p className="font-medium">{new Date(pet.birthday).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Пол</p>
                <p className="font-medium">{pet.clear_gender}</p>
              </div>
              {pet.comment && (
                <div>
                  <p className="text-sm text-gray-500">Комментарий</p>
                  <p className="font-medium">{pet.comment}</p>
                </div>
              )}
              {pet.allergies && (
                <div>
                  <p className="text-sm text-gray-500">Аллергии</p>
                  <p className="font-medium">{pet.allergies}</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ExistedPets
