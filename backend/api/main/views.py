from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.utils.exceptionsHandler import handle_exceptions

from api.main.serializers import FAQMainSerializer, MediaMainSerializer, MembershipPlansSerializer
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