from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from api.utils.exceptionsHandler import handle_exceptions

from api.main.serializers import FAQMainSerializer, MediaMainSerializer, MembershipPlansSerializer
from api.models import RegisterQRCode
from sitemanagement.models import FAQ, MainPageMedia, Pricing, PetCoordinates

from api.utils.smsProvider import sendsms
from api.utils.emails.email_templates.internal_pet_found_email import pet_found_email

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
        memberships = Pricing.objects.all()
        
        data = {
            'memberships': MembershipPlansSerializer(memberships, many=True).data
        }
        
        return Response(data, status=status.HTTP_200_OK)
    
class SmsSendView(APIView):
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
        return Response(
            {"is_lost": qr.pet.is_lost},
            status=status.HTTP_200_OK
        )
        
class SendCoordinatesView(APIView):
    @handle_exceptions
    def post(self, request):
        code = request.data.get("code")
        coordinates = request.data.get("coordinates")
        
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
            
        # сохраняем координаты в формате "latitude,longitude,accuracy"
        coordinates_str = f"{latitude},{longitude},{accuracy}"
        
        PetCoordinates.objects.create(
            pet=qr.pet,
            coordinates=coordinates_str
        )
        
        pet = qr.pet
        
        pet_found_email(pet)
        return Response(
            {"message": "Координаты успешно сохранены"},
            status=status.HTTP_200_OK
        )