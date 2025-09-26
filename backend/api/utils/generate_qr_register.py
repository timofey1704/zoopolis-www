import qrcode
from qrcode import constants
from django.conf import settings
import io
import base64
import random
import string
from typing import Tuple
from PIL import Image as PILImage
from django.apps import apps

redirect_url = settings.IS_LOST_URL

def get_register_qr_model():
    """
    Получает модель RegisterQRCode используя apps.get_model() для избежания циклического импорта
    """
    return apps.get_model('api', 'RegisterQRCode')

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
        if not get_register_qr_model().objects.filter(code=code).exists():
            return code


def generate_registration_qr(base_url: str = redirect_url) -> Tuple[PILImage.Image, str, str]:
    """
    Генерация QR кода для страницы регистрации с уникальным параметром.

    Args:
        base_url: Базовый URL для регистрации (по умолчанию IS_LOST_URL)

    Returns:
        - PIL Image объект QR кода
        - Base64 строка изображения QR
        - Уникальный код, который нужно связать с пользователем
    """
    # генерируем уникальный код
    unique_code = generate_unique_qr_code()

    # формируем URL с параметром
    url = f"{base_url}?ref={unique_code}"

    # создаем QR
    qr = qrcode.QRCode(
        version=None,
        error_correction=constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    qr_image = qr.make_image(fill_color="black", back_color="white").get_image()
    
    # конвертируем в RGB для сохранения
    if qr_image.mode != 'RGB':
        qr_image = qr_image.convert('RGB')

    # преобразовываем в base64
    buffered = io.BytesIO()
    qr_image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return qr_image, img_str, unique_code