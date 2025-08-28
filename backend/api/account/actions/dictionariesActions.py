from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from dictionaries.models import Cities, PetsTypes, PetsBreeds, PetsColors

from api.account.serializers import CityListSerializer, PetTypeSerializer, PetBreedSerializer, PetColorSerializer   

from api.utils.decorators import handle_exceptions

class DictionariesView(ViewSet):
    """Эндпоинт для получения данных для выбора (изначальные словари заполняются админами)"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def cities(self, request):
        cities = Cities.objects.all()
        serializer = CityListSerializer(cities, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def pet_types(self, request):
        pet_types = PetsTypes.objects.all()
        serializer = PetTypeSerializer(pet_types, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def pet_breeds(self, request):
        pet_breeds = PetsBreeds.objects.all()
        serializer = PetBreedSerializer(pet_breeds, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def pet_colors(self, request):
        pet_colors = PetsColors.objects.all()
        serializer = PetColorSerializer(pet_colors, many=True)
        return Response(serializer.data)