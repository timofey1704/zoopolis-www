import logging
from typing import cast
from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.throttling import UserRateThrottle

from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404

from asgiref.sync import sync_to_async

from api.account.serializers import PetSerializer, PetCreateSerializer
from api.utils.decorators import handle_exceptions
from api.models import RegisterQRCode
from api.utils.emails.email_templates.internal_qr_activated import qr_activated_email
from api.utils.smsVerification import send_verification_code
from api.utils.redisClient import redis_client

from sitemanagement.models import Pet

logger = logging.getLogger(__name__)

class CheckCodeView(ViewSet):
    """Проверяем код с QR пользователя"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], throttle_classes=[UserRateThrottle])
    @handle_exceptions
    async def validate_code(self, request):
        """Проверка кода из запроса пользователя и отправка SMS кода подтверждения."""
        code = request.data.get("code")
        profile = await sync_to_async(lambda: request.user.userprofile)()
        phone_number = profile.phone_number

        if not code:
            return Response(
                {"error": "Не указан код"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qr_code = await sync_to_async(
            lambda: RegisterQRCode.objects.filter(code=code, is_active=True, is_used=False).first()
        )()

        if not qr_code:
            return Response(
                {
                    "action": "unavailable",
                    "message": "Такого кода не существует",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if qr_code.user and qr_code.user != request.user:
            return Response(
                {
                    "action": "unavailable",
                    "message": "Этот кулон уже принадлежит другому пользователю",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if qr_code.user == request.user and qr_code.is_verificated and not qr_code.pet:
            imageURL = f"{settings.BASE_URL}{qr_code.image.url}" if qr_code.image else None
            return Response(
                {
                    "action": "pass",
                    "message": "QR код уже верифицирован",
                    "code": qr_code.code,
                    "imageURL": imageURL,
                    "isAlreadyVerificated": True
                },
                status=status.HTTP_200_OK,
            )

        can_send, error_message = await sync_to_async(redis_client.can_send_new_code)(phone_number)
        if not can_send:
            return Response(
                {"error": error_message},
                status=status.HTTP_400_BAD_REQUEST
            )

        verification_code, error = await send_verification_code(phone_number)
        if error:
            return Response(
                {"error": f"Ошибка отправки кода: {error}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        set_ok = await sync_to_async(redis_client.set_verification_code)(phone_number, verification_code)
        if not set_ok:
            return Response(
                {"error": "Ошибка сохранения кода верификации"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        imageURL = f"{settings.BASE_URL}{qr_code.image.url}" if qr_code.image else None
        return Response(
            {
                "action": "pass",
                "message": "Код подтверждения отправлен на ваш номер телефона",
                "code": qr_code.code,
                "imageURL": imageURL,
                "isAlreadyVerificated": False
            },
            status=status.HTTP_200_OK,
        )
        
    @action(detail=False, methods=['post'], throttle_classes=[UserRateThrottle])
    @handle_exceptions
    def verify_sms_code(self, request):
        """Проверка SMS кода и активация QR кода"""
        sms_code = request.data.get("sms_code")
        qr_code = request.data.get("qr_code")

        if not sms_code or not qr_code:
            return Response(
                {"error": "Необходимо указать SMS код и QR код"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # проверяем QR код
        qr_code_obj = RegisterQRCode.objects.filter(
            code=qr_code, 
            is_active=True, 
            is_used=False,
            is_verificated=False
        ).first()

        if not qr_code_obj:
            return Response(
                {"error": "QR код не найден или уже использован"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # проверяем смску с фронта
        phone_number = request.user.userprofile.phone_number
        is_valid = redis_client.verify_code(phone_number, sms_code)
        
        if not is_valid:
            return Response(
                {"error": "Неверный или истекший код подтверждения"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ! активируем QR код ( нужно ли делать? )
        try:
            qr_code_obj.is_verificated = True
            qr_code_obj.user = request.user
            qr_code_obj.activation_date = timezone.now()
            qr_code_obj.save()

            return Response(
                {
                    "message": "QR код успешно активирован",
                    "code": qr_code_obj.code,
                    "imageURL": f"{settings.BASE_URL}{qr_code_obj.image.url}" if qr_code_obj.image else None
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Error activating QR code: {e}")
            return Response(
                {"error": "Ошибка при активации QR кода"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class PetView(ViewSet):
    """Эндпоинт для работы с питомцами"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pet_id):
        """
        Получение питомца с проверкой владельца
        """
        pet = get_object_or_404(Pet, id=pet_id)
        if pet.owner != self.request.user:
            raise PermissionDenied("У вас нет прав на доступ к этому питомцу")
        return pet
    
    @action(detail=False, methods=['get'], throttle_classes=[UserRateThrottle])
    @handle_exceptions
    def get_pets(self, request):
        """Получение списка питомцев пользователя"""
        pets = Pet.objects.filter(owner=request.user)
        serializer = PetSerializer(pets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], throttle_classes=[UserRateThrottle])
    @handle_exceptions
    def get_pet(self, request):
        """Получение конкретного питомца"""
        pet_id = request.query_params.get('id')
        if not pet_id:
            return Response(
                {"error": "Не указан ID питомца"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        pet = self.get_object(pet_id)
        serializer = PetSerializer(pet)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], throttle_classes=[UserRateThrottle])
    @handle_exceptions
    def create_pet(self, request):
        """Создание нового питомца"""
        serializer = PetCreateSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
        
        if serializer.is_valid():
            # получаем код QR из запроса
            qr_code_value = request.data.get('qr_code')

            if not qr_code_value:
                return Response(
                    {"error": "QR код не указан"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # ищем существующий QR код
            qr_code = RegisterQRCode.objects.filter(code=qr_code_value, is_used=False).first()
            if not qr_code:
                return Response(
                    {"error": "QR код не найден или уже использован"},
                    status=status.HTTP_404_NOT_FOUND
                )

            try:
                # сохраняем питомца
                pet = cast(Pet, serializer.save(owner=request.user))
                
                # связываем QR код с питомцем и помечаем как использованный
                qr_code.pet = pet
                qr_code.is_used = True
                qr_code.user = request.user
                qr_code.activation_date = timezone.now()
                qr_code.save()
                qr_activated_email(qr_code)
                
                response_serializer = PetSerializer(pet)
                response_data = dict(response_serializer.data)
                response_data.update({
                    'qr_code': {
                        'code': qr_code.code,
                        'imageURL': qr_code.image.url if qr_code.image else None
                    }
                })
                
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                # если что-то пошло не так, удаляем питомца
                logger.error(f"Ошибка при создании питомца: {str(e)}")
                if 'pet' in locals():
                    pet.delete()
                return Response(
                    {"error": "Ошибка при создании питомца"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        logger.error(f"Ошибки валидации: {serializer.errors}")
        return Response(
            {"errors": serializer.errors}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['patch'], throttle_classes=[UserRateThrottle])
    @handle_exceptions
    def update_pet(self, request):
        """Обновление данных питомца"""
        pet_id = request.data.get('id')
        if not pet_id:
            return Response(
                {"error": "Не указан ID питомца"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pet = self.get_object(pet_id)
        serializer = PetCreateSerializer(pet, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            response_serializer = PetSerializer(pet)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"errors": serializer.errors}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['delete'], throttle_classes=[UserRateThrottle])
    @handle_exceptions
    def delete_pet(self, request):
        """Удаление питомца"""
        pet_id = request.data.get('id')
        if not pet_id:
            return Response(
                {"error": "Не указан ID питомца"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pet = self.get_object(pet_id)
        pet.delete()
        return Response(
            {"message": "Питомец успешно удален"},
            status=status.HTTP_200_OK
        )
        
    @action(detail=False, methods=['patch'])
    @handle_exceptions
    def is_lost_pet(self, request):
        """Пометить питомца как потерянный"""
        pet_id = request.data.get('id')
        if not pet_id:
            return Response(
                {"error": "Не указан ID питомца"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        pet = self.get_object(pet_id)
        pet.is_lost = not pet.is_lost
        pet.save()
        return Response(
            {"message": "Питомец успешно помечен как потерянный" if pet.is_lost else "Питомец успешно помечен как найденный"},
            status=status.HTTP_200_OK
        )