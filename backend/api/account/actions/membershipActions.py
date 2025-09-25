from rest_framework.views import APIView
from api.utils.exceptionsHandler import handle_exceptions

class VerificationView(APIView):
    @handle_exceptions
    def post(self, request):
        pass
    
class NotificationView(APIView):
    @handle_exceptions
    def post(self, request):
        pass
