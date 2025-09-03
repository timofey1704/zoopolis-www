import React, { useRef, useState } from 'react'
import { useForm } from '@/app/hooks/useForm'
import { uploadImage } from '@/lib/imageUpload'
import TextInput from '@/components/ui/TextInput'
import TextAreaInput from '@/components/ui/TextAreaInput'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'
import Image from 'next/image'
import PetTypeSelector, { PetType } from '@/components/selectors/PetTypeSelector'
import GenderSelector from '@/components/selectors/GenderSelector'
import BreedSelector from '@/components/selectors/BreedSelector'
import ColorSelector from '@/components/selectors/ColorSelector'

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

type PetImageResponse = {
  imageUrl: string
  message: string
}

const PetForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const file = files[0]

      if (!file.type.startsWith('image/')) {
        showToast({
          type: 'error',
          message: 'Пожалуйста, выберите изображение',
        })
        return
      }

      // создаем локальное превью
      const localPreviewUrl = URL.createObjectURL(file)
      setPreviewUrl(localPreviewUrl)

      // загружаем на сервер
      const response = await uploadImage<PetImageResponse>(file, '/api/pets/update-image')

      if (response.imageUrl) {
        setPreviewUrl(response.imageUrl)
        handleChange({
          target: {
            id: 'imageURL',
            value: response.imageUrl,
          },
        })
      }

      showToast({
        type: 'success',
        message: 'Фотография успешно загружена',
      })

      // очищаем инпут
      e.target.value = ''
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Ошибка при загрузке фотографии',
      })
      console.error('Error handling file:', error)
    }
  }

  const { values, handleChange, handleSubmit } = useForm(
    {
      imageURL: '',
      name: '',
      type: null as PetType | null,
      birthday: '',
      gender: '',
      breed: '',
      color: '',
      comment: '',
      allergies: '',
      QRImage: '',
      QRCode: '',
    },
    validationRules,
    async values => {
      try {
        // создаем FormData для отправки файла и данных формы
        const formData = new FormData()

        // добавляем все текстовые поля
        Object.entries(values).forEach(([key, value]) => {
          if (key !== 'imageURL') {
            // Для PetType отправляем только id
            if (key === 'type' && value) {
              formData.append(key, (value as PetType).id.toString())
            } else {
              formData.append(key, value?.toString() || '')
            }
          }
        })

        // если есть файл для загрузки, добавляем его
        if (fileInputRef.current?.files?.[0]) {
          formData.append('image', fileInputRef.current.files[0])
        }

        const response = await fetch('/api/pets', {
          method: 'POST',
          body: formData, // FormData автоматически установит правильный Content-Type
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Ошибка при обновлении данных')
        }

        showToast({ type: 'success', message: 'Данные успешно обновлены!' })
      } catch (error) {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ой, что то пошло не так..',
        })
      }
    }
  )

  return (
    <div className="space-y-3 py-3">
      <div className="overflow-hidden rounded-2xl pl-1">
        <div className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center justify-around gap-4 py-4">
              <div className="flex items-center justify-center md:w-[160px]">
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
                    src={previewUrl || '/images/noPet.svg'}
                    alt="Pet"
                    height={160}
                    width={160}
                    priority
                    className="aspect-square w-full rounded-2xl object-cover md:w-[160px]"
                  />
                </div>
              </div>
              <Image
                src={values.QRImage || '/images/noQR.svg'}
                alt="qrcode"
                width={160}
                height={160}
                className="rounded-full object-cover"
              />
              {values.QRCode && (
                <div className="flex items-center justify-center">
                  <span className="text-sm text-gray-500">{values.QRCode}</span>
                </div>
              )}
            </div>
            <div className="h-[2px] w-full bg-white" />
            <div className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-3">
              <TextInput
                name="name"
                value={values.name}
                handleChange={handleChange}
                label="Кличка"
                placeholder="Как зовут вашего питомца?"
                style="register"
              />
              <PetTypeSelector
                name="type"
                value={values.type}
                handleChange={handleChange}
                label="Вид"
                placeholder="Какой у вас питомец?"
              />
              <TextInput
                name="birthday"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={values.birthday}
                handleChange={handleChange}
                label="Дата рождения"
                style="register"
              />
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
              <TextInput
                name="color"
                value={values.color}
                handleChange={handleChange}
                label="Цвет"
                placeholder="Цвет"
                style="register"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 px-1 pb-4 md:grid-cols-2">
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

            <div className="flex items-center justify-center">
              <Button
                text="Сохранить"
                className="bg-orange mt-4 flex w-full items-center justify-center text-white"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PetForm
