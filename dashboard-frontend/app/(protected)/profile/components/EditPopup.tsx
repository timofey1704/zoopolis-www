import React from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import { useForm } from '@/app/hooks/useForm'
import TextInput from '@/components/ui/TextInput'
import TextAreaInput from '@/components/ui/TextAreaInput'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'
import Image from 'next/image'
import PetTypeSelector, { PetType } from '@/components/selectors/PetTypeSelector'
import GenderSelector from '@/components/selectors/GenderSelector'
import BreedSelector, { Breed } from '@/components/selectors/BreedSelector'
import ColorSelector, { PetColor } from '@/components/selectors/ColorSelector'

interface EditPopupProps {
  isOpen: boolean
  onClose: () => void
  id: number | null
  onSuccess?: () => void
}

interface EditPet {
  imageURL: string
  name: string
  type: PetType | null
  birthday: string
  gender: string
  breed: Breed | null
  color: PetColor | null
  comment: string
  allergies: string
}

const validationRules = {
  imageURL: { required: false },
  name: { required: true },
  type: { required: true },
  birthday: { required: true },
  gender: { required: true },
  breed: { required: true },
  color: { required: false },
  comment: { required: false },
  allergies: { required: false },
}

const EditPopup: React.FC<EditPopupProps> = ({ isOpen, onClose, id, onSuccess }) => {
  const { data, isLoading, error } = useClientFetch<EditPet>(`/pets/get-pet/`, {
    config: { params: { id } },
    queryOptions: { enabled: !!id },
  })

  // Не показываем попап, если нет id или он не открыт
  if (!id || !isOpen) return null

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Изменить данные питомца"
      description={
        <div>
          {isLoading ? (
            <div>Загрузка...</div>
          ) : error ? (
            <div>Ошибка: {error.message}</div>
          ) : (
            <div>
              <h2>EditPopup Content</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      }
      showSubmit={false}
    />
  )
}

export default EditPopup
