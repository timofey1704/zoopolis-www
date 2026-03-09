from asgiref.sync import sync_to_async

from api.utils.smsProvider import sendsms_async
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


async def send_verification_code(phone_number: str) -> tuple[str, str]:
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
        if not is_valid_phone(phone_number):
            return "", "Invalid phone number format"

        verification_code = generate_verification_code()

        set_redis = sync_to_async(redis_client.set_verification_code)
        if not await set_redis(phone_number, verification_code):
            return "", "Failed to save verification code"

        await sendsms_async(phone_number, verification_code)
        return verification_code, ""

    except Exception as e:
        return "", f"Error sending verification code: {str(e)}"