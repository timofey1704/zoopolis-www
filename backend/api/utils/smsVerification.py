from api.utils.smsProvider import sendsms
from api.utils.redisClient import redis_client
import random
import string
import re

VERIFICATION_CODE_LENGTH = 6
PHONE_REGEX = re.compile(r'^\+?[1-9]\d{10,14}$')

def is_valid_phone(phone_number: str) -> bool:
    """Проверяем валидность номера телефона"""
    return bool(PHONE_REGEX.match(phone_number))

def generate_verification_code() -> str:
    """Создаем код подтверждения заданной длины"""
    return ''.join(random.choices(string.digits, k=VERIFICATION_CODE_LENGTH))

def send_verification_code(phone_number: str) -> tuple[str, str]:
    """
    Отправляем SMS с кодом подтверждения на номер телефона пользователя
    
    Аргументы:
        phone_number: Номер телефона пользователя, на который отправляем код подтверждения
        
    Возвращает:
        tuple: (verification_code, error_message)
        - verification_code будет {VERIFICATION_CODE_LENGTH}-значным числом, если успешно, пустой строкой, если нет
        - error_message будет содержать детали ошибки, если есть, пустой строкой, если нет
    """
    try:
        # проверяем валидность номера
        if not is_valid_phone(phone_number):
            error_msg = "Invalid phone number format"
            return "", error_msg

        # генерируем код
        verification_code = generate_verification_code()
        
        # сохраняем код в Redis
        if not redis_client.set_verification_code(phone_number, verification_code):
            error_msg = "Failed to save verification code"
            return "", error_msg

        # отправляем SMS
        sendsms(phone_number, verification_code)
        return verification_code, ""
            
    except Exception as e:
        error_msg = f"Error sending verification code: {str(e)}"
        return "", error_msg