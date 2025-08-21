import { useState, useCallback, useRef } from 'react'
import showToast from '@/components/ui/showToast'

interface UsePhotoUploadOptions {
  uploadUrl?: string // URL для загрузки файла на бэкенд
  onUploadSuccess?: (url: string) => void
  onUploadError?: (error: Error) => void
  defaultImage?: string
}

async function uploadImageToServer(file: File, uploadUrl: string) {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Ошибка при загрузке файла')
  }

  const data = await response.json()
  return data
}

export const usePhotoUpload = (options: UsePhotoUploadOptions = {}) => {
  const { uploadUrl, onUploadSuccess, onUploadError, defaultImage = '/images/noPet.svg' } = options

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // Создаем локальное превью
        const previewUrl = URL.createObjectURL(file)
        setPreviewUrl(previewUrl)

        // Если указан URL для загрузки, отправляем файл на сервер
        if (uploadUrl) {
          setIsUploading(true)
          try {
            const response = await uploadImageToServer(file, uploadUrl)
            // Если сервер вернул URL загруженного файла, обновляем превью
            if (response.imageUrl) {
              setPreviewUrl(response.imageUrl)
            }
            onUploadSuccess?.(response.imageUrl || previewUrl)
          } catch (error) {
            throw error
          } finally {
            setIsUploading(false)
          }
        } else {
          // Если URL не указан, просто вызываем onUploadSuccess с локальным превью
          onUploadSuccess?.(previewUrl)
        }

        showToast({
          type: 'success',
          message: 'Фотография успешно обновлена',
        })

        // Очищаем input
        e.target.value = ''
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Ошибка при загрузке фотографии')
        showToast({
          type: 'error',
          message: err.message,
        })
        console.error('Error handling file:', error)
        onUploadError?.(err)
      }
    },
    [uploadUrl, onUploadSuccess, onUploadError]
  )

  return {
    fileInputRef,
    previewUrl,
    openFileDialog,
    handleFileChange,
    displayUrl: previewUrl || defaultImage,
    isUploading,
  }
}

// Пример использования:
/*
const MyComponent = () => {
  const { 
    fileInputRef,
    displayUrl,
    openFileDialog,
    handleFileChange,
    isUploading
  } = usePhotoUpload({
    uploadUrl: '/api/upload-photo',  // URL для загрузки на бэкенд
    defaultImage: '/images/noPhoto.svg',
    onUploadSuccess: (url) => {
      // обработка успешной загрузки, например обновление данных пользователя
      updateUser({ photoUrl: url })
    }
  })

  return (
    <div className="group relative w-full cursor-pointer" onClick={openFileDialog}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <Image
        src={displayUrl}
        alt="Photo"
        width={160}
        height={160}
        className="aspect-square w-full rounded-2xl object-cover"
      />
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white">Загрузка...</span>
        </div>
      )}
    </div>
  )
}
*/
