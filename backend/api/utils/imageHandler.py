from api.utils.CDNService import BunnyCDNService
from rest_framework.response import Response
from rest_framework import status
import magic  # для определения MIME-типа файла
from urllib.parse import urlparse

def handle_image_upload(
    image_file, 
    storage_path, 
    instance=None, 
    field_name='imageUrl',
    max_size_mb=5,
):
    """
    Универсальная функция для загрузки изображений в Bunny CDN
    
    Args:
        image_file: Загружаемый файл
        storage_path: Путь для сохранения в CDN
        instance: Опциональный экземпляр модели для обновления
        field_name: Имя поля для обновления в модели (по умолчанию 'imageUrl')
        max_size_mb: Максимальный размер файла в МБ (по умолчанию 5)
    
    Returns:
        tuple: (success: bool, result: str|Response)
        В случае успеха: (True, url_изображения)
        В случае ошибки: (False, Response с ошибкой)
    """
    try:
        # проверка размера файла
        if image_file.size > max_size_mb * 1024 * 1024:
            return False, Response(
                {'error': f'Размер файла превышает {max_size_mb}MB'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # проверка типа файла
        mime = magic.from_buffer(image_file.read(1024), mime=True)
        image_file.seek(0)  # сбрасываем указатель файла в начало
        
        allowed_types = ['image/jpeg', 'image/png', 'image/webp']
        if mime not in allowed_types:
            return False, Response(
                {'error': 'Разрешены только изображения в форматах JPEG, PNG или WebP'},
                status=status.HTTP_400_BAD_REQUEST
            )

        bunny_service = BunnyCDNService()
        image_url = bunny_service.upload_media(
            file=image_file,
            storage_path=storage_path
        )
        
        # если передан экземпляр модели, обновляем его
        if instance:
            setattr(instance, field_name, image_url)
            instance.save()
            
        return True, image_url
        
    except Exception as e:
        return False, Response(
            {'error': f'Ошибка при загрузке изображения: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
        
def handle_image_deletion(image_url):
    """Функция для удаления изображения"""
    if not image_url:
        return True  
    try:
        bunny_service = BunnyCDNService()
        parsed_url = urlparse(image_url)
        storage_path = parsed_url.path.lstrip('/')  # удаляем начальный слеш если есть
        bunny_service.delete_media(storage_path)
        return True
    except Exception as e:
        return False