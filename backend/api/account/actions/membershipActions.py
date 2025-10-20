import logging
import base64
import json
import requests
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from api.utils.decorators import handle_exceptions
from sitemanagement.models import Pricing, Tranasctions
from api.account.serializers import MembershipSerializer

logger = logging.getLogger(__name__)

class MembershipView(ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    @handle_exceptions
    def change_membership(self, request):
        user = request.user
        plan = request.data.get('plan')
        request_id = request.data.get('tracking_id')
        
        if not plan:
            return Response({
                'success': False,
                'message': 'Не указан тарифный план'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            membership = Pricing.objects.get(plan=plan)
        except Pricing.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Тарифный план не найден'
            }, status=status.HTTP_404_NOT_FOUND)
            
        # проверяем текущий тип аккаунта
        if user.userprofile.account_type == plan:
            return Response({
                'success': False,
                'message': 'У вас уже активирован этот тарифный план'
            }, status=status.HTTP_400_BAD_REQUEST)
            
            # апгрейды/даунгрейды?
            
        #!сюда логика по бипейду когда будет готова

        now = timezone.now()
        subscription_end = now + timedelta(days=30)  # 30 дней
        
        if Tranasctions.objects.filter(request_id=request_id).exists():
            return Response(
                {'error': 'Tracking ID already exists'}, 
                status=status.HTTP_409_CONFLICT
            )
        
        # подготавливаем данные для сериалайзера
        transaction_data = {
            'user': user.id,
            'membership': membership.id, 
            'amount': membership.price,
            'subscription_start': now,
            'subscription_end': subscription_end,
            'status': 'completed',
            'request_id': request_id,
            'auto_renewal': request.data.get('auto_renewal', False)
        }
        
        # валидируем и сохраняем данные
        serializer = MembershipSerializer(data=transaction_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # обновляем тип аккаунта в профиле пользователя
        user_profile = user.userprofile
        user_profile.account_type = plan  # plan уже содержит правильное значение (zooID/concierge/zoopolis)
        user_profile.save()
        
        # возвращаем обновленные данные пользователя для стора
        user_data = {
            'id': user.id,
            'name': user.first_name,
            'uuid': str(user.userprofile.uuid)[:6] if user.userprofile.uuid else None,
            'email': user.email,
            'account_type': user.userprofile.account_type,
            'phone_number': user.userprofile.phone_number,
            'city': user.userprofile.city.id if user.userprofile.city else None,
            'address': user.userprofile.address,
            'imageURL': user.userprofile.image.url if user.userprofile.image else None,
        }

        return Response({
            'success': True,
            'message': 'План успешно изменен',
            'transaction': serializer.data,
            'user': user_data
        }, status=status.HTTP_200_OK)
        
        
class VerificationView(APIView):
    @handle_exceptions
    def post(self, request):
        pass
    
class NotificationView(APIView):
    @handle_exceptions
    def post(self, request):
        logger = logging.getLogger(__name__)
        
        logger.info('Bepaid notification headers: %s', dict(request.headers))
        
        # логируем тело запроса
        try:
            notification_data = request.data
            logger.info('Bepaid notification data: %s', json.dumps(notification_data, indent=2))
            
            # доп поля
            logger.info('Important fields: %s', {
                'transaction_type': notification_data.get('transaction', {}).get('type'),
                'status': notification_data.get('transaction', {}).get('status'),
                'tracking_id': notification_data.get('transaction', {}).get('tracking_id'),
                'payment_method_type': notification_data.get('transaction', {}).get('payment_method_type'),
                'amount': notification_data.get('transaction', {}).get('amount'),
                'currency': notification_data.get('transaction', {}).get('currency'),
            })
            
        except Exception as e:
            logger.exception('Error parsing notification data')
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # всегда возвращаем 200 OK чтобы bepaid не пытался отправить повторно
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)