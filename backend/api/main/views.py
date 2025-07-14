from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.utils.exceptionsHandler import handle_exceptions

from api.main.serializers import FAQMainSerializer
from sitemanagement.models import FAQ

class FAQView(APIView):
    @handle_exceptions
    def get(self, request):
              
        faqs = FAQ.objects.all()

        data = {
            'faqs': FAQMainSerializer(faqs, many=True).data
        }

        return Response(data, status=status.HTTP_200_OK)