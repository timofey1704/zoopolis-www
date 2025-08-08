from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from oauth2_provider.models import Application, AccessToken
from oauth2_provider.contrib.rest_framework import TokenHasScope
from .serializers import ApplicationSerializer, TokenIntrospectSerializer
from django.utils import timezone
from api.models import UserProfile

class ApplicationRegistrationView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ApplicationSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ApplicationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ApplicationSerializer
    
    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)

class TokenIntrospectView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TokenIntrospectSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        
        try:
            token_obj = AccessToken.objects.get(token=token)
            
            if token_obj.expires < timezone.now():
                return Response({
                    'active': False,
                    'error': 'Token has expired'
                })
                
            return Response({
                'active': True,
                'scope': token_obj.scope,
                'client_id': token_obj.application.client_id,
                'username': token_obj.user.username,
                'exp': token_obj.expires.timestamp()
            })
            
        except AccessToken.DoesNotExist:
            return Response({
                'active': False,
                'error': 'Token not found'
            }, status=status.HTTP_404_NOT_FOUND)

# Example protected resource endpoint
class ProtectedResourceView(APIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasScope]
    required_scopes = ['read']  # можно добавить read + write если нужно
    
    def get(self, request):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'uuid': str(profile.uuid),
            'phone_number': profile.phone_number,
        })
