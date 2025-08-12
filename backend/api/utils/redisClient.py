import redis
from django.conf import settings
from typing import Tuple, cast

class RedisClient:
    def __init__(self):
        self.redis = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=0,  # используем базу данных 0 для верификации
            decode_responses=True  # автоматически декодировать ответы в строки
        )
        
    def set_verification_code(self, phone_number: str, code: str, expires_in: int = 600) -> bool:
        """
        Сохраняет код верификации в Redis
        
        Args:
            phone_number: Номер телефона пользователя
            code: Код верификации
            expires_in: Время жизни кода в секундах (по умолчанию 10 минут)
            
        Returns:
            bool: True если успешно сохранено, False если произошла ошибка
        """
        try:
            # создаем ключ для кода верификации
            verification_key = f"phone_number_verification:{phone_number}"
            
            # создаем ключ для счетчика попыток
            attempts_key = f"verification_attempts:{phone_number}"
            
            # сохраняем код с временем жизни
            self.redis.set(verification_key, code, ex=expires_in)
            
            # инициализируем счетчик попыток, если его еще нет
            if not self.redis.exists(attempts_key):
                self.redis.set(attempts_key, "0", ex=expires_in)
                
            return True
        except Exception as e:
            print(f"Redis error in set_verification_code: {str(e)}")
            return False
            
    def verify_code(self, phone_number: str, code: str) -> Tuple[bool, str]:
        """
        Проверяет код верификации
        
        Args:
            phone_number: Номер телефона пользователя
            code: Код для проверки
            
        Returns:
            Tuple[bool, str]: (успех, сообщение об ошибке)
        """
        try:
            verification_key = f"phone_number_verification:{phone_number}"
            attempts_key = f"verification_attempts:{phone_number}"
            
            # проверяем количество попыток
            attempts_str = self.redis.get(attempts_key)
            attempts = 0 if attempts_str is None else int(cast(str, attempts_str))
            
            if attempts >= 3:
                return False, "Превышено количество попыток. Запросите новый код"
            
            # получаем сохраненный код
            stored_code = self.redis.get(verification_key)
            if stored_code is None:
                return False, "Код верификации истек или недействителен"
                
            # увеличиваем счетчик попыток
            self.redis.incr(attempts_key)
            
            # проверяем код
            if cast(str, stored_code) != code:
                return False, "Неверный код верификации"
                
            # если код верный, удаляем все ключи
            self.redis.delete(verification_key, attempts_key)
            return True, ""
            
        except Exception as e:
            print(f"Redis error in verify_code: {str(e)}")
            return False, "Ошибка проверки кода"
        
    def delete_verification_code(self, phone_number: str) -> bool:
        """
        Удаляет код верификации
        
        Args:
            phone_number: Номер телефона пользователя
            
        Returns:
            bool: True если успешно удалено, False если произошла ошибка
        """
        try:
            verification_key = f"email_verification:{phone_number}"
            attempts_key = f"verification_attempts:{phone_number}"
            
            self.redis.delete(verification_key)
            self.redis.delete(attempts_key)
            
            return True
            
        except Exception as e:
            print(f"Redis error in delete_verification_code: {str(e)}")
            return False
            
    def can_send_new_code(self, phone_number: str) -> Tuple[bool, str]:
        """
        Проверяет, можно ли отправить новый код
        
        Args:
            phone_number: Номер телефона пользователя
            
        Returns:
            Tuple[bool, str]: (можно отправить, сообщение об ошибке)
        """
        try:
            cooldown_key = f"verification_cooldown:{phone_number}"
            
            # проверяем, не отправляли ли мы код недавно
            if self.redis.exists(cooldown_key):
                ttl = cast(int, self.redis.ttl(cooldown_key))
                return False, f"Подождите {ttl} секунд перед повторной отправкой"
                
            # устанавливаем задержку в 60 секунд между отправками
            self.redis.set(cooldown_key, "1", ex=60)
            return True, ""
            
        except Exception as e:
            print(f"Redis error in can_send_new_code: {str(e)}")
            return True, ""  # в случае ошибки Redis позволяем отправить код
            
redis_client = RedisClient() 