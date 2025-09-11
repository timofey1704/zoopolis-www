from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from api.utils.exceptionsHandler import handle_exceptions

from api.main.serializers import FAQMainSerializer, MediaMainSerializer, MembershipPlansSerializer
from api.models import RegisterQRCode
from sitemanagement.models import FAQ, MainPageMedia, Pricing

from api.utils.smsProvider import sendsms

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

        # если QR есть, но не привязан к питомцу == редирект 
        if not qr.pet:
            response = Response(status=status.HTTP_307_TEMPORARY_REDIRECT)
            response['Location'] = "http://localhost:3000/login"
            return response

        # если всё ок возвращаем статус is_lost
        return Response(
            {"is_lost": qr.pet.is_lost},
            status=status.HTTP_200_OK
        )
        