import random
import string

def generate_verification_code() -> str:
    """Создание 6-значного код для верификации"""
    return ''.join(random.choices(string.digits, k=6))