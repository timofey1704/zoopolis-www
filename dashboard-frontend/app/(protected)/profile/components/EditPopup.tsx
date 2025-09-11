import React, { useMemo } from 'react'
import { Pet } from '../forms/ExistedPets'
import { Dialog } from '@/components/ui/Dialog'
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
  petData: Pet | null
  onSuccess?: () => void
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

const EditPopup: React.FC<EditPopupProps> = ({ isOpen, onClose, petData, onSuccess }) => {
  // вычисляем начальные значения формы в зависимости от наличия данных о питомце
  const initialValues = useMemo(() => {
    if (!petData) {
      // безопасные значения-заглушки, если данные ещё не получены
      return {
        id: '',
        imageURL: '',
        name: '',
        type: '',
        birthday: '',
        gender: '',
        breed: '',
        color: '',
        comment: '',
        allergies: '',
      }
    }

    return {
      id: petData.id,
      imageURL: petData.imageURL,
      name: petData.name,
      type: petData.type,
      birthday: petData.birthday,
      gender: petData.gender,
      breed: petData.breed,
      color: petData.color,
      comment: petData.comment,
      allergies: petData.allergies,
    }
  }, [petData])

  const { values, handleChange, handleSubmit, setValues } = useForm(
    initialValues,
    validationRules,
    async values => {
      try {
        const requestData = {
          id: Number(values.id),
          imageURL: values.imageURL,
          name: values.name,
          type: values.type,
          birthday: values.birthday,
          gender: values.gender,
          breed: values.breed,
          color: values.color,
          comment: values.comment,
          allergies: values.allergies,
        }

        await fetch('/api/profile/pets/update-pet', {
          method: 'PATCH',
          body: JSON.stringify(requestData),
        })

        showToast({
          type: 'success',
          message: 'Маршрут успешно обновлен!',
        })
        onSuccess?.()
        onClose()
      } catch (error) {
        console.error('Error updating route:', error)
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ой, что то пошло не так..',
        })
      }
    }
  )

  return <div>EditPopup</div>
}

export default EditPopup
