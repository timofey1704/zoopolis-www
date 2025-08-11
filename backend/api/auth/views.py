from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
import traceback

from django.contrib.auth.models import User
from django.conf import settings
from django.db.utils import IntegrityError
from django.db import IntegrityError, transaction

from .serializers import ClientRegisterSerializer, UserResponseSerializer

from api.utils.cookiesSetter import AuthBaseViewSet
from datetime import datetime
from api.utils.smsVerification import send_verification_code
from api.utils.redisClient import redis_client
from api.models import User


class LoginViewSet(AuthBaseViewSet):
    """Логин для клиента"""
    
    @action(detail=False, methods=['post'], url_path="login")
    def login_client(self, request):
        try:
            email = request.data.get("email")
            password = request.data.get("password")
            
            if not email or not password:
                return Response(
                    {"error": "Email и пароль обязательны"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": "Пользователь не найден"},
                    status=status.HTTP_404_NOT_FOUND
                )
            if not user.check_password(password):
                return Response(
                    {"error": "Неверный пароль"},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            refresh = RefreshToken.for_user(user)
            
            user_data = UserResponseSerializer(user).data
            
            response = Response({
                "message": "Успешная авторизация",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data
            }, status=status.HTTP_200_OK)
            
            # сеттим куки
            return self._set_auth_cookies(response, refresh)
                
        except Exception as e:
            return Response(
                {"error": "Ошибка авторизации"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )