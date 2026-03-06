from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

# общие атрибуты кук (должны совпадать при установке и удалении)
COOKIE_OPTS = {
    'path': '/',
    'httponly': True,
    'secure': True,
    'samesite': 'None',
}


def set_auth_cookies(response, refresh):
    """Устанавливает куки для токенов аутентификации.
    SameSite=None + Secure нужны, чтобы браузер отправлял куки при cross-origin.
    """
    response.set_cookie(
        'access_token',
        str(refresh.access_token),
        **COOKIE_OPTS,
        max_age=900,  # 15 min, как ACCESS_TOKEN_LIFETIME
    )
    response.set_cookie(
        'refresh_token',
        str(refresh),
        **COOKIE_OPTS,
        max_age=86400 * 14,  # 14 дней как REFRESH_TOKEN_LIFETIME
    )
    return response


def clear_auth_cookies(response):
    """Удаляет куки токенов. Те же атрибуты, что при установке (set_auth_cookies)."""
    response.set_cookie('access_token', '', max_age=0, **COOKIE_OPTS)
    response.set_cookie('refresh_token', '', max_age=0, **COOKIE_OPTS)
    return response


class AuthBaseViewSet(ViewSet):
    """Базовый класс для аутентификации с общими методами"""

    def _set_auth_cookies(self, response, refresh):
        return set_auth_cookies(response, refresh)

    @action(detail=False, methods=['post'], url_path="refresh")
    def refresh_token(self, request):
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                token = RefreshToken(refresh_token)
                response_data = {
                    'access': str(token.access_token),
                    'refresh': str(token),
                    'expires_at': datetime.timestamp(
                        datetime.now() + settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
                    )
                }
                
                return Response(response_data)
                
            except Exception as e:      
                return Response(
                    {'error': f'Invalid refresh token: {str(e)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            return Response(
                {'error': f'Token refresh failed: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
