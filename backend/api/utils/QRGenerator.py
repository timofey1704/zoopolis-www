import qrcode
from qrcode import constants
import json
import io
import base64
import random
import string
from typing import List, Dict, Tuple
from PIL import Image as PILImage
from sitemanagement.models import Pet, QRCode

def generate_qr_from_objects(data: List[Dict], *, 
                           box_size: int = 10,
                           border: int = 4,
                           fill_color: str = "black",
                           back_color: str = "white") -> Tuple[PILImage.Image, str]:
    """
    Генерация QR кода из списка объектов.
    
    Args:
        data: Список словарей для кодирования в QR
        box_size: Размер каждого квадрата в QR коде (по умолчанию: 10)
        border: Размер границы в квадратах (по умолчанию: 4)
        fill_color: Цвет QR кода (по умолчанию: "black")
        back_color: Цвет фона (по умолчанию: "white")
    
    Returns:
        Кортеж содержащий:
        - PIL Image объект QR кода
        - Base64 закодированную строку изображения QR кода
    """
    # преобразуем данные в JSON строку
    json_data = json.dumps(data)
    
    # создаем экземпляр QR кода
    qr = qrcode.QRCode(
        version=None,  # !автосайз. какой нам нужен, Вадим говорил что нужен специфичный размер??
        error_correction=constants.ERROR_CORRECT_L,
        box_size=box_size,
        border=border
    )
    
    # добавляем данные
    qr.add_data(json_data)
    qr.make(fit=True)
    
    # создаем QR код
    qr_image = qr.make_image(fill_color=fill_color, back_color=back_color)
    
    # преобразовываем в base64
    buffered = io.BytesIO()
    qr_image.save(buffered, "PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return qr_image, img_str

def generate_pet_qr(pet: Pet, *,
                  box_size: int = 10,
                  border: int = 4,
                  fill_color: str = "black",
                  back_color: str = "white") -> Tuple[PILImage.Image, str]: 
    """
    Генерация QR кода для питомца с информацией о владельце.
    
    Args:
        pet: Экземпляр модели Pet
        box_size: Размер каждого квадрата в QR коде (по умолчанию: 10)
        border: Размер границы в квадратах (по умолчанию: 4)
        fill_color: Цвет QR кода (по умолчанию: "black")
        back_color: Цвет фона (по умолчанию: "white")
    
    Returns:
        Кортеж содержащий:
        - PIL Image объект QR кода
        - Base64 закодированную строку изображения QR кода
    """
    
    pet_data = {
        "pet": {
            "id": pet.pk,
            "name": pet.name,
        },
    }
    
    # генерируем QR код
    qr_image, qr_base64 = generate_qr_from_objects(
        [pet_data],
        box_size=box_size,
        border=border,
        fill_color=fill_color,
        back_color=back_color
    )
    
    return qr_image, qr_base64

def generate_unique_qr_code() -> str:
    """
    Генерирует уникальный 8-символьный код для QR.
    Использует только заглавные буквы и цифры (кроме нуля - требование в задаче).
    Проверяет уникальность кода в базе данных.
    
    Returns:
        Уникальная строка длиной 8 символов, содержащая только заглавные буквы и цифры (1-9)
    """
    # определяем допустимые символы: A-Z и 1-9
    letters = string.ascii_uppercase
    digits = '123456789'
    all_chars = letters + digits
    
    while True:
        # генерируем 8-символьный код
        code = ''.join(random.choice(all_chars) for _ in range(8))
        
        # проверяем код на уникальность
        if not QRCode.objects.filter(code=code).exists():
            return code

def save_pet_qr(pet: Pet) -> QRCode:
    """
    Генерация и сохранение QR кода для питомца.
    
    Args:
        pet: Экземпляр модели Pet
    
    Returns:
        Созданный экземпляр модели QRCode
    """
    qr_image, qr_base64 = generate_pet_qr(pet)
    
    # сохраняем QRкод в базу
    qr_code = QRCode.objects.create(
        pet=pet,
        code=generate_unique_qr_code(),
        imageURL=f"data:image/png;base64,{qr_base64}"
    )
    
    return qr_code