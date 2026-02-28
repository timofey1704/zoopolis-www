"""
Аутентификация JWT из cookie (access_token).
Используется вместе с JWTAuthentication: сначала проверяется cookie, затем заголовок Authorization.
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.request import Request


class JWTCookieAuthentication(JWTAuthentication):
    """
    Читает JWT из cookie 'access_token', если передан — иначе пробует Authorization header.
    Нужен для запросов с credentials: 'include' (куки без заголовка).
    """
    def authenticate(self, request: Request):
        access_token = request.COOKIES.get("access_token")
        if access_token:
            try:
                validated_token = self.get_validated_token(access_token)
                user, token = self.get_user(validated_token), validated_token
                return user, token
            except InvalidToken as e:
                return None
      
        result = super().authenticate(request)
        return result
