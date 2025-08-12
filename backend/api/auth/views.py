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
            
class RegisterViewSet(AuthBaseViewSet):
    """Регистрация клиента"""
    
    @action(detail=False, methods=['post'], url_path="send-verification")
    def send_verification_code(self, request):
        """Отправка кода верификации на email"""
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        
        if not phone_number:
            return Response(
                {"error": "Номер телефона обязателен"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # проверяем не существует ли уже пользователь с таким номером телефона
        if User.objects.filter(phone_number=phone_number).exists():
            return Response(
                {"error": "Пользователь с таким номером телефона уже существует"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # проверяем можно ли отправить новый код
        can_send, error_message = redis_client.can_send_new_code(phone_number)
        if not can_send:
            return Response(
                {"error": error_message},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # генерируем и отправляем код
        verification_code, error = send_verification_code(phone_number)
        
        if error:
            return Response(
                {"error": f"Ошибка отправки кода: {error}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        # сохраняем код в Redis
        if not redis_client.set_verification_code(phone_number, verification_code):
            return Response(
                {"error": "Ошибка сохранения кода верификации"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            {"message": "Код верификации отправлен"},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], url_path="verify-and-register")
    def verify_and_register_client(self, request):
        """Верификация кода и регистрация клиента"""
        print("\n=== Starting registration process ===")
        print(f"Request data: {request.data}")
        
        phone_number = request.data.get('phone_number')
        verification_code = request.data.get('verification_code')
        
        print(f"Номер телефона: {phone_number}, Code provided: {bool(verification_code)}")
        
        if not phone_number or not verification_code:
            print("Missing required fields")
            return Response(
                {"error": "Email и код верификации обязательны"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # проверяем код верификации
        print(f"Verifying code for номера телефона: {phone_number}")
        is_valid = redis_client.verify_code(phone_number, verification_code)
        print(f"Code verification result: {is_valid}")
        
        if not is_valid:
            print(f"Invalid verification code for phone number: {phone_number}")
            return Response(
                {"error": "Неверный или истекший код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # продолжаем регистрацию
        print("Starting serializer validation")
        serializer = ClientRegisterSerializer(data=request.data)
        if serializer.is_valid():
            print("Serializer validation passed")
            print(f"Validated data: {serializer.validated_data}")
            try:
                with transaction.atomic():
                    print("Creating new user")
                    user = serializer.save()
                    
                    refresh = RefreshToken.for_user(user)
                    user_data = UserResponseSerializer(user).data
                    
                    response = Response(
                        {
                            "access": str(refresh.access_token),
                            "refresh": str(refresh),
                            "user": user_data
                        }, 
                        status=status.HTTP_201_CREATED
                    )
                    
                    print("Registration completed successfully")
                    return self._set_auth_cookies(response, refresh)
                    
            except IntegrityError as e:
                print(f"IntegrityError during user creation: {str(e)}")
                print(f"Full error: {traceback.format_exc()}")
                return Response(
                    {"error": "Пользователь с таким email уже существует"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                print(f"Unexpected error during user creation: {str(e)}")
                print(f"Full traceback: {traceback.format_exc()}")
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            print("Serializer validation failed")
            print(f"Validation errors: {serializer.errors}")
        
        return Response(
            {
                "error": "Ошибка валидации",
                "details": serializer.errors
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )

class LogoutView(APIView):
    """Выход из системы"""
    
    def post(self, request):
        response = Response({'message': 'Logged out'}, status=status.HTTP_200_OK)
        
        # чистим куки и sessionID
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        response.delete_cookie('sessionid') 
        
        return response
    
class RefreshTokenView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                token = RefreshToken(refresh_token)

                # точное время истечения токена
                expires_at = datetime.now() + settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
                
                response_data = {
                    'access': str(token.access_token),
                    'refresh': str(token),
                    'expires_at': datetime.timestamp(expires_at)
                }
                
                return Response(response_data)
                
            except Exception as e:
                # логируем ошибки
               
                print(f"Token refresh error: {str(e)}")
                print(traceback.format_exc())
                
                return Response(
                    {'error': f'Invalid refresh token: {str(e)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            return Response(
                {'error': f'Token refresh failed: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
class PasswordRecoveryViewSet(AuthBaseViewSet):
    """Логика восстановления пароля"""
    
    @action(detail=False, methods=['post'], url_path="send-code")
    def send_recovery_code(self, request):
        """Отправляем код на введенный емаил"""
        try:
            phone_number = request.data.get('phone_number')
            
            if not phone_number:
                return Response(
                    {"error": "Номер телефона обязателен"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # проверяем существует ли юзер в базе
            try:
                user = User.objects.get(phone_number=phone_number)
            except User.DoesNotExist:
                return Response(
                    {"error": "Пользователь не найден"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # проверяем таймауты
            can_send, error_message = redis_client.can_send_new_code(phone_number)
            if not can_send:
                return Response(
                    {"error": error_message},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # отправляем код
            verification_code, error = send_verification_code(phone_number)
            if error:
                return Response(
                    {"error": error},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
            # сохраняем в редисе
            if not redis_client.set_verification_code(phone_number, verification_code):
                return Response(
                    {"error": "Ошибка сохранения кода подтверждения"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
            return Response(
                {"message": "Код подтверждения отправлен"},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": "Ошибка при отправке кода восстановления"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    @action(detail=False, methods=['post'], url_path="reset-password")
    def reset_password(self, request):
        """Сбрасываем пароль после верификации"""
        try:
            phone_number = request.data.get("phone_number")
            code = request.data.get("code")
            new_password = request.data.get("new_password")
            
            if not all([phone_number, code, new_password]):
                return Response(
                    {"error": "Email, код подтверждения и новый пароль обязательны"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # находим юзера в базе
            try:
                user = User.objects.get(phone_number=phone_number)
            except User.DoesNotExist:
                return Response(
                    {"error": "Пользователь не найден"},
                    status=status.HTTP_404_NOT_FOUND
                )
                
            # верифицируем
            is_valid = redis_client.verify_code(phone_number, code)
            if not is_valid:
                return Response(
                    {"error": "Неверный или истекший код подтверждения"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # обновляем пароль
            user.set_password(new_password)
            user.save()
            
            # удаляем старый код
            redis_client.delete_verification_code(phone_number)
            
            return Response(
                {"message": "Пароль успешно изменен"},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": "Ошибка при сбросе пароля"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )