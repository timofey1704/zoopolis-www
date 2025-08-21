import React, { useState, useCallback, useRef } from 'react'
import { useForm } from '@/app/hooks/useForm'
import TextInput from '@/components/ui/TextInput'
import Button from '@/components/ui/Button'
import showToast from '@/components/ui/showToast'
import Image from 'next/image'

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

const PetForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const handlePhotoChange = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // создаем превью
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)

      // загружаем на сервер
      //   const response = await uploadImage(file)
      //   if (response.user?.image) {
      //     setPreviewUrl(response.user.image)
      //   }

      showToast({
        type: 'success',
        message: 'Фотография успешно обновлена',
      })

      // очищаем инпут
      e.target.value = ''
    } catch (error) {
      showToast({
        type: 'error',
        message: 'Ошибка при загрузке фотографии',
      })
      console.error('Error handling file:', error)
    }
  }, [])

  const { values, handleChange, handleSubmit } = useForm(
    {
      imageURL: '',
      name: '',
      type: '',
      birthday: '',
      gender: '',
      breed: '',
      color: '',
      comment: '',
      allergies: '',
      QR_code: '',
    },
    validationRules,
    async values => {
      try {
        const response = await fetch('/api/profile/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values }),
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
                <div className="group relative w-full cursor-pointer" onClick={handlePhotoChange}>
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
                src={values.QR_code || '/images/noQR.svg'}
                alt="qrcode"
                width={160}
                height={160}
                className="rounded-full object-cover hover:cursor-pointer"
              />
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
              <TextInput
                name="type"
                value={values.type}
                handleChange={handleChange}
                label="Вид"
                placeholder="Какой у вас питомец?"
                style="register"
              />
              <TextInput
                name="birthday"
                value={values.birthday}
                handleChange={handleChange}
                label="Дата рождения"
                placeholder="Дата рождения"
                style="register"
              />
              <TextInput
                name="gender"
                value={values.gender}
                handleChange={handleChange}
                label="Пол"
                placeholder="Пол"
                style="register"
              />
              <TextInput
                name="breed"
                value={values.breed}
                handleChange={handleChange}
                label="Порода"
                placeholder="Порода"
                style="register"
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

            <div className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-2">
              <TextInput
                name="comment"
                value={values.comment}
                handleChange={handleChange}
                label="Комментарий"
                placeholder="Комментарий"
                style="register"
              />
              <TextInput
                name="allergies"
                value={values.allergies}
                handleChange={handleChange}
                label="Аллергии"
                placeholder="Аллергии"
                style="register"
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
