import logging
from django.conf import settings
from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from api.account.serializers import PetSerializer, PetCreateSerializer
from sitemanagement.models import Pet
from api.utils.decorators import handle_exceptions
from typing import cast
from api.utils.QRGenerator import save_pet_qr
from api.models import RegisterQRCode

logger = logging.getLogger(__name__)

class CheckCodeView(ViewSet):
    """Проверяем код с QR пользователя"""
    # permission_classes = [IsAuthenticated]

    def validate_code(self, request):
        """Проверка кода из запроса пользователя"""
        code = request.data.get("code")

        if not code:
            return Response(
                {"error": "Не указан код"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qr_code = RegisterQRCode.objects.filter(code=code).first()

        if qr_code:
            # код существует = пропускаем
            
            imageURL = f"{settings.BASE_URL}{qr_code.image.url}" if qr_code.image else None
            return Response(
                {
                    "action": "pass",
                    "message": "Код найден",
                    "code": qr_code.code,
                    "imageURL": imageURL
                },
                status=status.HTTP_200_OK,
            )
        else:
            # кода нет = разворачиваем
            return Response(
                {
                    "action": "unavailable",
                    "message": "Такого кода не существует",
                },
                status=status.HTTP_404_NOT_FOUND,
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
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_pets(self, request):
        """Получение списка питомцев пользователя"""
        pets = Pet.objects.filter(owner=request.user)
        serializer = PetSerializer(pets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
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
    
    @action(detail=False, methods=['post'])
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
                qr_code.save()
                
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
    
    @action(detail=False, methods=['patch'])
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
    
    @action(detail=False, methods=['delete'])
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