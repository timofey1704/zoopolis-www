from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.utils import timezone

from api.models import UserProfile
from api.auth.serializers import UserResponseSerializer
from api.account.serializers import MapPointsSerializer, ServicesSerializer, BonusesSerializer
from api.utils.decorators import handle_exceptions

from dictionaries.models import Cities
from sitemanagement.models import MapPoints, Services, Appointment, Bonuses, Devices
from api.account.serializers import MapPointsSerializer, DeviceSerializer

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
                
        if 'telegram_id' in request.data:
            telegram_id = request.data['telegram_id']
            
            #проверка на уникальность
            if UserProfile.objects.filter(telegram_id=telegram_id).exclude(user=user).exists():
                raise ValidationError("Этот Telegram ID уже указал кто-то другой")
                
            user_profile.telegram_id = telegram_id
        
        # обновляем фотографию профиля
        if 'image' in request.FILES:
            user_profile.image = request.FILES['image']
            user_profile.save()

        # сохраняем изменения
        user.save()
        user_profile.save()
        
        response_data = {
            "message": "Данные успешно обновлены",
            "user": UserResponseSerializer(user).data
        }
        return Response(response_data, status=status.HTTP_200_OK)


class MapPointsView(ViewSet):
    """Получаем список маркеров на карте"""
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_map_points(self, request):
        map_points = MapPoints.objects.all()
        return Response(MapPointsSerializer(map_points, many=True).data, status=status.HTTP_200_OK)
    
class ServicesView(ViewSet):
    """Взаимодействие с функционалом услуг"""
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_services(self, request):
        filter_type = request.query_params.get('filter', 'all')
        
        user_profile = get_object_or_404(UserProfile, user=request.user)
        user_plan = user_profile.account_type
        
        services = Services.objects.all()
        
        # фильтруем в зависимости от запроса
        if filter_type == 'available':
            # услуги доступные для тарифа пользователя
            services = services.filter(available_for__contains=[user_plan])
        elif filter_type == 'blocked':
            # услуги недоступные для тарифа пользователя
            services = services.exclude(available_for__contains=[user_plan])
        
        return Response(ServicesSerializer(services, many=True).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    @handle_exceptions
    def request_service(self, request, pk=None):
        """Запрос на получение услуги"""
        service = get_object_or_404(Services, id=pk)
        
        user_profile = get_object_or_404(UserProfile, user=request.user)
        user_plan = user_profile.account_type
        
        # проверяем доступность услуги для тарифа
        if not service.available_for or user_plan not in service.available_for:
            return Response({
                'success': False,
                'message': 'Услуга недоступна для вашего тарифного плана',
                'required_plans': service.available_for or []
            }, status=status.HTTP_403_FORBIDDEN)
            
        # проверяем актуальность услуги
        if service.actual_before < timezone.now().date():
            return Response({
                'success': False,
                'message': 'Услуга больше не актуальна'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # TODO: нужны ли дополнительные проверки?
        
        Appointment.objects.create(user=request.user, service=service)
        
        return Response({
            'success': True,
            'message': 'Заявка успешно создана'
        }, status=status.HTTP_200_OK)

class BonusesView(ViewSet):
    """Взаимодействие с функционалом бонусов"""
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    @handle_exceptions
    def get_bonuses(self, request):
        # получаем активные бонусы, которые не были использованы текущим пользователем
        bonuses = Bonuses.objects.filter(
            # is_active=True, fix : ZOO-50 - отображаем все бонусы, даже если is_active = false
            start_date__lte=timezone.now().date(),  # начало действия уже наступило
            end_date__gte=timezone.now().date(),    # срок действия еще не истек
        ).exclude(
            applied_by=request.user  # исключаем бонусы, которые пользователь уже использовал юзер
        )
        return Response(BonusesSerializer(bonuses, many=True).data, status=status.HTTP_200_OK)
    

    @handle_exceptions
    def apply_bonus(self, request, pk=None):
        """Применение бонуса"""
        bonus = get_object_or_404(Bonuses, id=pk)
        bonus.applied_by.add(request.user)
        bonus.save()
        return Response({
            'success': True,
            'message': 'Бонус успешно применен'
        }, status=status.HTTP_200_OK)
        
class DevicesView(APIView):
    permission_classes = [IsAuthenticated]
    @handle_exceptions
    
    def get(self, request):
        devices = Devices.objects.all()
        
        data = {
            'devices':DeviceSerializer(devices, many=True).data
        }
        
        return Response(data, status=status.HTTP_200_OK)