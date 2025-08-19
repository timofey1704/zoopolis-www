from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from api.auth.serializers import UserResponseSerializer
from api.models import UserProfile
from api.account.serializers import PetSerializer
from sitemanagement.models import Pet
from api.utils.decorators import handle_exceptions


class UserDataView(ViewSet):
    """Эндпоинт для наполнения стора фронта данными"""
    permission_classes = [IsAuthenticated]
    
    def initial(self, request, *args, **kwargs):
        try:
            super().initial(request, *args, **kwargs)
        except Exception as e:
            print(f"Authentication error: {e}")
            raise
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def user_data(self, request):
        user = request.user
        
        try:
            user_data = UserResponseSerializer(user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": "User profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
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
        serializer = PetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
        serializer = PetSerializer(pet, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
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