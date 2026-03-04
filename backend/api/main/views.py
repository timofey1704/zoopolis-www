import requests
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from django.conf import settings

from api.utils.exceptionsHandler import handle_exceptions
from api.main.serializers import FAQMainSerializer, MediaMainSerializer, MembershipPlansSerializer
from api.models import RegisterQRCode, UserProfile
from api.utils.smsProvider import sendsms
from api.utils.emails.email_templates.internal_pet_found_email import pet_found_email

from sitemanagement.models import FAQ, MainPageMedia, Pricing, PetCoordinates

class FAQView(APIView):
    @handle_exceptions
    def get(self, request):
              
        faqs = FAQ.objects.all()

        data = {
            'faqs': FAQMainSerializer(faqs, many=True).data
        }

        return Response(data, status=status.HTTP_200_OK)
    
class MediaMainView(APIView):
    @handle_exceptions
    def get(self, request):
        
        media = MainPageMedia.objects.all()
        
        data = {
            'media': MediaMainSerializer(media, many=True).data
        }
        
        return Response(data, status=status.HTTP_200_OK)
    
class MembershipPlansView(APIView):
    @handle_exceptions
    def get(self, request):
        memberships = Pricing.objects.filter(is_available=True)
        
        data = {
            'memberships': MembershipPlansSerializer(memberships, many=True).data
        }
        
        return Response(data, status=status.HTTP_200_OK)
    
class SmsSendView(APIView):
    throttle_classes = [AnonRateThrottle]
    @handle_exceptions
    def post(self, request):
        phone = request.data.get('phone')
        text = request.data.get('text')
        
        if not phone or not text:
            return Response(
                {'status': False, 'error': {'code': 1, 'description': 'Phone and text are required'}}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = sendsms(phone, text)
        
        if result.get('status'):
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        
class IsLostPetView(APIView):
    throttle_classes = [AnonRateThrottle]
    @handle_exceptions
    def post(self, request):
        code = request.data.get("code")

        if not code:
            return Response(
                {"error": "Код не предоставлен"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            qr = RegisterQRCode.objects.select_related("pet").get(code=code)
        except RegisterQRCode.DoesNotExist:
            return Response(
                {"error": "Такого кода не существует"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
           
            return Response(
                {"error": f"Ошибка при получении QR кода: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
        redirect_url = settings.REDIRECT_LOGIN_URL
        
        # если QR есть, но не привязан к питомцу == возвращаем URL для редиректа
        if not qr.pet:
            return Response(
                {"redirect_url": redirect_url},
                status=status.HTTP_307_TEMPORARY_REDIRECT
            )
        # если всё ок возвращаем статус is_lost
        #!ZOO-173 -- дополнительно возвращаем тарифный план пользователя, имя и телефон владельца
        plan = UserProfile.objects.select_related('user').get(user=qr.user).account_type
        owner_name = qr.pet.owner.first_name
        owner_phone = qr.pet.owner.userprofile.phone_number
        return Response(
            {"is_lost": qr.pet.is_lost,
             "plan": plan,
             "owner_info": {
                 "name": owner_name,
                 "phone": owner_phone
             }},
            status=status.HTTP_200_OK
        )
        
class SendCoordinatesView(APIView):
    throttle_classes = [AnonRateThrottle]
    @handle_exceptions
    def post(self, request):
        code = request.data.get("code")
        coordinates = request.data.get("coordinates")
        founder_name = request.data.get("founder_name")
        founder_phone = request.data.get("founder_phone")
        
        if not code:
            return Response(
                {"error": "Код не предоставлен"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not coordinates:
            return Response(
                {"error": "Координаты не предоставлены"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # валидация формата координат
        try:
            if not all(key in coordinates for key in ['latitude', 'longitude', 'accuracy']):
                return Response(
                    {"error": "Неверный формат координат"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            latitude = float(coordinates['latitude'])
            longitude = float(coordinates['longitude'])
            accuracy = float(coordinates['accuracy'])
            
            # базовая валидация координат
            if not (-90 <= latitude <= 90) or not (-180 <= longitude <= 180):
                return Response(
                    {"error": "Некорректные координаты"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except (ValueError, TypeError):
            return Response(
                {"error": "Некорректный формат данных координат"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            qr = RegisterQRCode.objects.select_related("pet").get(code=code)
        except RegisterQRCode.DoesNotExist:
            return Response(
                {"error": "Такого кода не существует"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if not qr.pet:
            return Response(
                {"error": "Питомец не найден"},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            headers = {
                'User-Agent': 'Zoopolis/1.0 (info@zoopolis.org)'
            }
    
            params = {
                'lat': latitude,
                'lon': longitude,
                'format': 'json',
                'zoom': 18,  # максимальный уровень детализации
                'addressdetails': 1,
                'namedetails': 1,
                'accept-language': 'ru',  # русский язык
            }
            response = requests.get(
                "https://nominatim.openstreetmap.org/reverse",
                params=params,
                headers=headers,
                timeout=5
            )
            response.raise_for_status()  # проверяем статус ответа
            address_data = response.json()
            
            address = {}
            if 'address' in address_data:
                addr = address_data['address']
                components = []
                
                if addr.get('house_number'):
                    components.append(addr['house_number'])
                if addr.get('road'):
                    components.append(addr['road'])
                if addr.get('suburb'):
                    components.append(addr['suburb'])
                if addr.get('city_district'):
                    components.append(addr['city_district'])
                if addr.get('city'):
                    components.append(addr['city'])
                
                address['formatted'] = ', '.join(filter(None, components))
                address['raw'] = addr  # исходные данные
            else:
                address = None
                
        except requests.RequestException as e:
            # если произошла ошибка при запросе адреса, логируем её, но продолжаем выполнение
            print(f"Warning: Failed to get address from Nominatim: {str(e)}")
            address = None
                 
        # создаем объект с координатами, адрес добавляем если он есть
        coordinates_data = {
            'pet': qr.pet,
            'latitude': latitude,
            'longitude': longitude,
            'accuracy': accuracy,
        }
        
        # добавляем необязательные поля
        if address and 'formatted' in address:
            coordinates_data['address'] = address['formatted']
        if founder_name:
            coordinates_data['founder_name'] = founder_name
        if founder_phone:
            coordinates_data['founder_phone'] = founder_phone
        
        PetCoordinates.objects.create(**coordinates_data)
        
        pet = qr.pet
        pet_found_email(pet)
        
        return Response(
            {"message": "Координаты успешно сохранены"},
            status=status.HTTP_200_OK
        )