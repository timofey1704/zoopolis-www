import requests
import uuid
import os
from django.conf import settings

class BunnyCDNService:
    def __init__(self):
        self.storage_zone_name = settings.BUNNY_STORAGE_ZONE_NAME
        self.api_key = settings.BUNNY_STORAGE_API_KEY
        self.base_url = "https://storage.bunnycdn.com"
        self.cdn_base_url = settings.BUNNY_CDN_BASE_URL

    def upload_media(self, file, storage_path):
        temp_path = None
        try:
            # генерируем безопасное имя файла
            file_extension = os.path.splitext(file.name)[1]
            safe_filename = f"{uuid.uuid4()}{file_extension}"
            
            # формируем путь для API
            storage_path = storage_path.strip('/')
            api_path = f"/{self.storage_zone_name}/{storage_path}/{safe_filename}"
            
            
            # читаем содержимое файла
            file_content = file.read()
            
            # выполняем PUT запрос к API
            headers = {
                "AccessKey": self.api_key,
                "Content-Type": "application/octet-stream"
            }
            
            response = requests.put(
                f"{self.base_url}{api_path}",
                data=file_content,
                headers=headers
            )
            
            if response.status_code not in [200, 201]:
                raise Exception(f"BunnyCDN error: {response.text}")
            
            # формируем URL для CDN
            cdn_path = f"{storage_path}/{safe_filename}"
            cdn_url = f"{self.cdn_base_url}/{cdn_path}"
            
            return cdn_url
            
        except Exception as e:
            raise

    def delete_media(self, storage_path):
        """
        Удаляем файл из BunnyCDN
        
        Args:
            storage_path: путь к файлу в storage zone (например: 'users/pets/image.jpg')
        """
        try:
            # формируем полный путь для API
            api_path = f"/{self.storage_zone_name}/{storage_path}"

            # выполняем DELETE запрос
            headers = {
                "AccessKey": self.api_key
            }
            response = requests.delete(
                f"{self.base_url}{api_path}",
                headers=headers
            )

            if response.status_code not in [200, 204]:
                raise Exception(f"BunnyCDN вернул ошибку: {response.text}")
            
        except Exception as e:
            raise Exception(f"Ошибка при удалении файла из BunnyCDN: {str(e)}")
