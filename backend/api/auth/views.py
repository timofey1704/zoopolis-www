import traceback
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import AnonRateThrottle
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.db import IntegrityError, transaction

from .serializers import ClientRegisterSerializer, UserResponseSerializer

from api.utils.cookiesSetter import AuthBaseViewSet, set_auth_cookies, clear_auth_cookies
from api.utils.smsVerification import send_verification_code
from api.utils.redisClient import redis_client
from api.models import User, UserProfile, RegisterQRCode

class LoginViewSet(AuthBaseViewSet):
    """Логин для клиента"""
    
    @action(detail=False, methods=['post'], url_path="login", throttle_classes=[AnonRateThrottle])
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
                    {"error": "Неверный email или пароль"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not user.check_password(password):
                return Response(
                    {"error": "Неверный email или пароль"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            refresh = RefreshToken.for_user(user)

            user_data = UserResponseSerializer(user).data

            response = Response({
                "message": "Успешная авторизация",
                "user": user_data
            }, status=status.HTTP_200_OK)

            return self._set_auth_cookies(response, refresh)

        except Exception:
            return Response(
                {"error": "Ошибка авторизации"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
class RegisterViewSet(AuthBaseViewSet):
    """Регистрация клиента"""
    
    @action(detail=False, methods=['post'], url_path="send-verification", throttle_classes=[AnonRateThrottle])
    def send_verification_code(self, request):
        """Отправка кода верификации на номер телефона"""
        phone_number = request.data.get('phone_number')
        promocode = request.data.get('promocode')
        email = request.data.get('email')
        
        if not phone_number:
            return Response(
                {"error": "Номер телефона обязателен"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # проверяем не существует ли уже пользователь с таким номером телефона
        if UserProfile.objects.filter(phone_number=phone_number).exists():
            return Response(
                {"error": "Пользователь с таким номером телефона уже существует"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Пользователь с таким email уже существует"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # проверяем промокод (если предоставлен)
        if promocode:
            try:
                qr_code = RegisterQRCode.objects.get(code=promocode)
                if qr_code.is_used:
                    return Response({"error": "Промокод уже использован"}, status=status.HTTP_400_BAD_REQUEST)
                if not qr_code.is_active:
                    return Response({"error": "Промокод неактивен"}, status=status.HTTP_400_BAD_REQUEST)
            except RegisterQRCode.DoesNotExist:
                return Response({"error": "Неверный промокод"}, status=status.HTTP_400_BAD_REQUEST)
            
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

    @action(detail=False, methods=['post'], url_path="verify")
    def verify_and_register_client(self, request):
        """Верификация кода и регистрация клиента"""
        
        phone_number = request.data.get('phone_number')
        verification_code = request.data.get('verification_code')
        promocode = request.data.get('promocode')

        if not phone_number or not verification_code:
            return Response(
                {"error": "Номер телефона и код верификации обязательны"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # проверяем код верификации
        is_valid = redis_client.verify_code(phone_number, verification_code)
        
        if not is_valid:
            print(f"Invalid verification code for phone number: {phone_number}")
            return Response(
                {"error": "Неверный или истекший код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # проверяем промокод если он предоставлен
        if promocode:
            try:
                qr_code = RegisterQRCode.objects.get(code=promocode, is_active=True, is_used=False)
            except RegisterQRCode.DoesNotExist:
                return Response(
                    {"error": "Неверный или уже использованный промокод"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # продолжаем регистрацию
        serializer = ClientRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()
                    
                    # активируем промокод если он был предоставлен
                    if promocode:
                        try:
                            qr_code = RegisterQRCode.objects.get(code=promocode, is_active=True, is_used=False)
                            qr_code.is_used = True
                            qr_code.is_active = False
                            qr_code.user = user  # type: ignore
                            qr_code.save()
                        except RegisterQRCode.DoesNotExist:
                            return Response(
                                {"error": "Промокод не найден"},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    
                    refresh = RefreshToken.for_user(user) # type: ignore
                    user_data = UserResponseSerializer(user).data
                    
                    response = Response(
                        {
                             "message": "Успешная регистрация",
                            "user": user_data
                        }, 
                        status=status.HTTP_201_CREATED
                    )
                    
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
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Выход успешен"}, status=status.HTTP_200_OK)
        clear_auth_cookies(response)
        response.delete_cookie('sessionid', path='/')
        return response
class RefreshTokenCookieView(APIView):
    """Refresh по cookie refresh_token. Возвращает ответ с новыми access/refresh в Set-Cookie (для продления сессии)."""
    def post(self, request):
        refresh_token_str = request.COOKIES.get('refresh_token')
        if not refresh_token_str:
            return Response(
                {'error': 'Refresh token cookie required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            old_refresh = RefreshToken(refresh_token_str)
            user_id = old_refresh.get('user_id')
            user = User.objects.get(pk=user_id)
        except (Exception, User.DoesNotExist):
            return Response(
                {'error': 'Invalid or expired refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        new_refresh = RefreshToken.for_user(user)
        response = Response({'message': 'Token refreshed'}, status=status.HTTP_200_OK)
        set_auth_cookies(response, new_refresh)
        return response
            
class PasswordRecoveryViewSet(AuthBaseViewSet):
    """Логика восстановления пароля"""
    
    @action(detail=False, methods=['post'], url_path="send-code", throttle_classes=[AnonRateThrottle])
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