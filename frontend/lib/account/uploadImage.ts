interface UploadImageResponse {
  user: {
    image: string
    [key: string]: string
  }
  message: string
}

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`/api/account/update-image`, {
    method: 'PATCH',
    body: formData,
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  return response.json()
}
