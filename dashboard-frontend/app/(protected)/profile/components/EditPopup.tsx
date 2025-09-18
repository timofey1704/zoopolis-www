import React, { useState, useEffect, useRef, FormEvent } from 'react'
import Image from 'next/image'
import { Dialog } from '@/components/ui/Dialog'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import { useForm } from '@/app/hooks/useForm'
import Loader from '@/components/ui/Loader'
import TextInput from '@/components/ui/TextInput'
import TextAreaInput from '@/components/ui/TextAreaInput'
import showToast from '@/components/ui/showToast'
import PetTypeSelector from '@/components/selectors/PetTypeSelector'
import GenderSelector from '@/components/selectors/GenderSelector'
import BreedSelector from '@/components/selectors/BreedSelector'
import ColorSelector from '@/components/selectors/ColorSelector'

interface EditPopupProps {
  isOpen: boolean
  onClose: () => void
  id: number | null
  onSuccess?: () => void
}

interface EditPetResponse {
  imageURL: string
  name: string
  type: number
  birthday: string
  gender: string
  breed: number
  color: number
  comment: string
  allergies: string
  clear_type: string
  clear_breed: string
  clear_color: string
  hex_code: string
}

const validationRules = {
  imageURL: { required: false },
  name: { required: true },
  type: { required: true },
  gender: { required: true },
  breed: { required: true },
  color: { required: false },
  comment: { required: false },
  allergies: { required: false },
}

const EditPopup: React.FC<EditPopupProps> = ({ isOpen, onClose, id, onSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { data, isLoading, error } = useClientFetch<EditPetResponse>(`/pets/get-pet/`, {
    config: { params: { id } },
    queryOptions: { enabled: !!id && isOpen },
  })

  const { values, handleChange, handleSubmit, setValues } = useForm(
    {
      imageURL: '',
      name: '',
      type: { id: 0, name: '' },
      gender: '',
      breed: { id: 0, name: '', pet_type: 0 },
      color: { id: 0, name: '', hex_code: '' },
      comment: '',
      allergies: '',
    },
    validationRules,
    async values => {
      try {
        // создаем FormData для отправки файла и данных формы
        const formData = new FormData()

        // добавляем id питомца
        if (!id) {
          throw new Error('ID питомца не указан')
        }
        formData.append('id', id.toString())

        // добавляем все текстовые поля
        Object.entries(values).forEach(([key, value]) => {
          if (!['imageURL', 'QRImage', 'QRCode'].includes(key)) {
            // для полей с id отправляем только id
            if (
              ['type', 'breed', 'color'].includes(key) &&
              value &&
              typeof value === 'object' &&
              'id' in value
            ) {
              formData.append(key, value.id.toString())
            } else {
              formData.append(key, value?.toString() || '')
            }
          }
        })

        // если есть файл для загрузки, добавляем его
        if (selectedFile) {
          formData.append('image', selectedFile)
        } else {
          console.log('No file found in selectedFile state')
        }

        const response = await fetch('/api/profile/update-pet', {
          method: 'PATCH',
          body: formData, // FormData автоматически установит правильный Content-Type
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Ошибка при обновлении данных')
        }

        showToast({ type: 'success', message: 'Питомец успешно обновлен!' })

        // обновляем список питомцев
        if (onSuccess) {
          onSuccess()
        }

        onClose()
      } catch (error) {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ой, что то пошло не так..',
        })
      }
    }
  )

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', message: 'Пожалуйста, выберите изображение' })
      return
    }

    // cохраняем файл в стейте
    setSelectedFile(file)

    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(localPreviewUrl)

    // сохраняем только локальное значение (файл уйдет вместе с формой)
    handleChange({
      target: { id: 'imageURL', value: file.name }, // можно просто имя файла или пустую строку
    })

    e.target.value = ''
  }

  useEffect(() => {
    if (data) {
      setValues({
        imageURL: data.imageURL || '',
        name: data.name || '',
        type: { id: data.type, name: data.clear_type },
        gender: data.gender || '',
        breed: { id: data.breed, name: data.clear_breed, pet_type: data.type },
        color: { id: data.color, name: data.clear_color, hex_code: data.hex_code },
        comment: data.comment || '',
        allergies: data.allergies || '',
      })
    }
  }, [data, setValues])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <Dialog
      isOpen={isOpen && !!id}
      onClose={onClose}
      title={`Изменить данные питомца - ${data?.name || ''}`}
      description={
        <div>
          {!id ? null : isLoading ? (
            <Loader />
          ) : error ? (
            <div>Ошибка: {error.message}</div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
                <div
                  className="group relative w-full cursor-pointer transition-opacity hover:opacity-80"
                  onClick={openFileDialog}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && openFileDialog()}
                >
                  <input
                    type="file"
                    id="image"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Image
                    src={values.imageURL || previewUrl || '/images/noPet.svg'}
                    alt="Pet"
                    height={160}
                    width={160}
                    priority
                    className="aspect-square w-full rounded-2xl object-cover md:w-[160px]"
                  />
                </div>
                <div className="flex w-full flex-col gap-4">
                  <TextInput
                    name="name"
                    value={values.name}
                    handleChange={handleChange}
                    label="Кличка"
                    placeholder="Имя вашего питомца"
                    style="register"
                  />
                  <PetTypeSelector
                    name="type"
                    value={values.type}
                    handleChange={handleChange}
                    label="Вид"
                    placeholder="Какой у вас питомец?"
                  />
                </div>
              </div>

              <GenderSelector
                name="gender"
                value={values.gender}
                handleChange={handleChange}
                label="Пол"
                placeholder="Выберите пол питомца"
              />
              <BreedSelector
                name="breed"
                value={values.breed}
                petTypeId={values.type?.id}
                handleChange={handleChange}
                label="Порода"
                placeholder="Выберите породу питомца"
              />
              <ColorSelector
                name="color"
                value={values.color}
                handleChange={handleChange}
                label="Цвет"
                placeholder="Выберите цвет питомца"
              />
              <TextAreaInput
                name="comment"
                value={values.comment}
                handleChange={handleChange}
                label="Комментарий"
                placeholder="Опишите вашего питомца"
              />
              <TextAreaInput
                name="allergies"
                value={values.allergies}
                handleChange={handleChange}
                label="Аллергии"
                placeholder="Какие у вашего питомца аллергии?"
              />
            </div>
          )}
        </div>
      }
      showSubmit={true}
      showCancel={false}
      submitText="Сохранить"
      onSubmit={() => {
        const e = { preventDefault: () => {} } as FormEvent
        handleSubmit(e)
      }}
    />
  )
}

export default EditPopup
