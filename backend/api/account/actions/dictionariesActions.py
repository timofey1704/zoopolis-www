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
        pet_type = request.query_params.get('pet_type')
        if not pet_type:
            return Response({"error": "pet_type parameter is required"}, status=400)
            
        pet_breeds = PetsBreeds.objects.filter(pet_type_id=pet_type)
        serializer = PetBreedSerializer(pet_breeds, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def pet_colors(self, request):
        pet_colors = PetsColors.objects.all()
        serializer = PetColorSerializer(pet_colors, many=True)
        return Response(serializer.data)