import qrcode
from qrcode import constants
import io
import base64
from typing import Tuple
from PIL import Image as PILImage, ImageDraw, ImageFont
from api.utils.QRGenerator import generate_unique_qr_code


def generate_registration_qr(base_url: str = "http://192.168.0.7:3000/is_lost/") -> Tuple[PILImage.Image, str, str]:
    """
    Генерация QR кода для страницы регистрации с уникальным параметром.

    Args:
        base_url: Базовый URL для регистрации (по умолчанию http://192.168.0.7:3000/is_lost/)

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

    # создаем новое изображение с дополнительным пространством для текста
    padding = 30  # отступ между элементами
    text_height = 32  # высота текста
    
    # общая высота: QR + отступ + текст + отступ
    total_height = qr_image.height + (padding * 2) + text_height
    
    final_image = PILImage.new('RGB', 
        (qr_image.width, total_height), 
        'white'
    )

    # вставляем QR код сверху
    final_image.paste(qr_image, (0, 0))

    # добавляем текст
    from PIL import ImageDraw, ImageFont
    draw = ImageDraw.Draw(final_image)
    
    # список шрифтов в порядке предпочтения
    font_size = 32
    font_options = [
        "DejaVuSans.ttf",
        "Arial.ttf",
        "Helvetica.ttf",
    ]

    # пробуем загрузить один из шрифтов
    font = None
    for font_name in font_options:
        try:
            font = ImageFont.truetype(font_name, font_size)
            print(f"Using font: {font_name}")
            break
        except:
            continue

    # если ни один шрифт не загрузился, создаем bitmap шрифт нужного размера и вставляем его в изображение
    if font is None:
        print("Using default font with scaling")
        # создаем временное изображение с текстом
        temp_img = PILImage.new('RGB', (font_size * len(unique_code), font_size), 'white')
        temp_draw = ImageDraw.Draw(temp_img)
        default_font = ImageFont.load_default()
        
        # рисуем текст маленьким шрифтом
        temp_draw.text((0, 0), unique_code, font=default_font, fill='black')
        
        # масштабируем изображение с текстом до нужного размера
        bbox = default_font.getbbox(unique_code)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        scale_factor = font_size / text_height
        target_size = (
            int(text_width * scale_factor),
            font_size
        )
        text_img = temp_img.resize(target_size, PILImage.Resampling.LANCZOS)
        
        # вставляем масштабированный текст в основное изображение
        text_position = ((final_image.width - target_size[0]) // 2, qr_image.height + padding)
        final_image.paste(text_img, text_position)
        
        # преобразовываем в base64
        buffered = io.BytesIO()
        final_image.save(buffered, "PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return final_image, img_str, unique_code

    # вычисляем позицию для центрирования текста
    text_width = draw.textlength(unique_code, font=font)
    text_position = ((final_image.width - text_width) // 2, qr_image.height + padding)
    
    # рисуем текст
    draw.text(
        text_position,
        unique_code,
        font=font,
        fill='black'
    )

    # преобразовываем в base64
    buffered = io.BytesIO()
    final_image.save(buffered, "PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return final_image, img_str, unique_code