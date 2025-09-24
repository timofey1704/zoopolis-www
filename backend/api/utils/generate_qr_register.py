import qrcode
from qrcode import constants
from django.conf import settings
import io
import base64
from typing import Tuple
from PIL import Image as PILImage
from api.utils.QRGenerator import generate_unique_qr_code

redirect_url = settings.IS_LOST_URL

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

    # преобразовываем в base64
    buffered = io.BytesIO()
    qr_image.save(buffered, "PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return qr_image, img_str, unique_code