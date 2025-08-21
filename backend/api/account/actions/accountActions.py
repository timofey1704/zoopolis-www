from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from api.models import UserProfile
from api.auth.serializers import UserResponseSerializer
from api.account.serializers import CitySerializer
from api.utils.decorators import handle_exceptions
from api.utils.pagination import StandardResultsSetPagination

from dictionaries.models import Cities

class AccountActionsView(ViewSet):
    """Действия в аккаунте пользователя:
    - PATCH данных пользователя в /profile/contacts
    """
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['patch'])
    @handle_exceptions
    def change_profile_contacts_data(self, request):
        """Обновление данных на главной странице аккаунта"""
        
        user = request.user
        user_profile = get_object_or_404(UserProfile, user=user)
        
        # обновляем данные пользователя
        if 'firstName' in request.data:
            user.first_name = request.data['firstName']
        if 'lastName' in request.data:
            user.last_name = request.data['lastName']
        if 'city' in request.data:
            city_id = request.data['city']
            if city_id:
                try:
                    city = Cities.objects.get(id=city_id)
                    user_profile.city = city
                except (Cities.DoesNotExist, ValueError):
                    raise ValidationError("Город не найден")
        if 'address' in request.data:
            user_profile.address = request.data['address']
        if 'email' in request.data:
            email = request.data['email']
            validate_email(email)  # handle_exceptions обработает ValidationError
            user.email = email
            user.username = email
        
        # обновляем номер телефона
        if 'phone_number' in request.data:
            phone = request.data['phone_number']
            if phone:
                if len(phone) < 13:  # +375331234567
                    raise ValidationError("Номер телефона слишком короткий")
                
                # проверка на уникальность
                if UserProfile.objects.filter(phone_number=phone).exclude(user=user).exists():
                    raise ValidationError("Этот номер телефона уже используется")
                
                user_profile.phone_number = phone
                
        # обновляем фотографию профиля
        if 'image' in request.FILES:
            user_profile.imageURL = request.FILES['image']
            user_profile.save()

        # сохраняем изменения
        user.save()
        user_profile.save()
        
        response_data = {
            "message": "Данные успешно обновлены",
            "user": UserResponseSerializer(user).data
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
class CityView(ViewSet):
    """Получаем список городов из базы для автокомплита"""
    pagination_class = StandardResultsSetPagination
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_cities(self, request):
        # получаем параметр id города из query params
        city_id = request.query_params.get('id')
        
        # базовый QuerySet
        cities = Cities.objects.all()
        
        # фильтруем по id если указан
        if city_id:
            try:
                cities = cities.filter(id=city_id)
            except ValueError:
                cities = Cities.objects.none()
            
        # поиск по названию города
        search = request.query_params.get('search', '').strip()
        
        if search:
            try:
                # нормализуем поисковый запрос
                search = search.lower().replace('ё', 'е')
                
                # фильтруем города, где название начинается с поискового запроса
                cities = cities.filter(name__istartswith=search)
                
                # получаем все отфильтрованные города
                all_cities = list(cities)
                
                # сортируем результаты:
                # 1. Точные совпадения по имени
                # 2. Остальные по алфавиту
                exact_matches = [
                    city for city in all_cities
                    if city.name and city.name.lower().replace('ё', 'е') == search
                ]
                
                other_matches = [
                    city for city in all_cities
                    if city not in exact_matches
                ]
                
                # объединяем результаты, сохраняя порядок
                cities = exact_matches + sorted(other_matches, key=lambda x: x.name)
                
            except Exception as e:
                cities = Cities.objects.none()
        else:
            # если нет поиска, просто сортируем по названию
            cities = cities.order_by('name')
        
        # применяем пагинацию
        paginator = self.pagination_class()
        paginated_cities = paginator.paginate_queryset(cities, request)
        
        serialized_data = CitySerializer(paginated_cities, many=True).data
        
        return paginator.get_paginated_response(serialized_data)