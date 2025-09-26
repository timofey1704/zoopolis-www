import qrcode
from qrcode import constants
from django.conf import settings
import io
import base64
import random
import string
from typing import Tuple
from pathlib import Path
from PIL import Image as PILImage
from django.apps import apps

redirect_url = settings.IS_LOST_URL
LOGO_PATH = Path(__file__).parent / 'img' / 'logo_zoo_wt_edit.png'

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


def add_logo_to_qr(qr_image: PILImage.Image, logo_path: str, logo_size: int = 60) -> PILImage.Image:
    """
    Добавляет логотип в центр QR кода.
    
    Args:
        qr_image: PIL Image объект QR кода
        logo_path: Путь к файлу логотипа
        logo_size: Размер логотипа в пикселях (по умолчанию 60)
    
    Returns:
        PIL Image объект с QR кодом и логотипом
    """
    # открываем и ресайзим логотип
    logo = PILImage.open(logo_path)
    
    # конвертируем в RGBA если нужно
    if logo.mode != 'RGBA':
        logo = logo.convert('RGBA')
    
    # изменяем размер логотипа
    logo = logo.resize((logo_size, logo_size))
    
    # вычисляем позицию для размещения логотипа в центре
    qr_width, qr_height = qr_image.size
    logo_pos_x = (qr_width - logo_size) // 2
    logo_pos_y = (qr_height - logo_size) // 2
    
    # создаем новое изображение с белым фоном
    result = PILImage.new('RGB', qr_image.size, 'white')
    
    # копируем QR код
    result.paste(qr_image, (0, 0))
    
    # накладываем логотип
    result.paste(logo, (logo_pos_x, logo_pos_y), logo)
    
    return result

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

    # добавляем логотип
    qr_image = add_logo_to_qr(qr_image, str(LOGO_PATH))

    # преобразовываем в base64
    buffered = io.BytesIO()
    qr_image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return qr_image, img_str, unique_code