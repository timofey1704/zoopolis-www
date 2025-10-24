import logging
import json
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from api.utils.decorators import handle_exceptions
from sitemanagement.models import Pricing, Tranasctions
from api.account.serializers import MembershipSerializer
from api.models import UserProfile

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
            
        now = timezone.now()
        subscription_end = now + timedelta(days=30)  # 30 дней
        
        if Tranasctions.objects.filter(request_id=request_id).exists():
            return Response(
                {'error': 'Tracking ID already exists'}, 
                status=status.HTTP_409_CONFLICT
            )
        
        # определяем статус и сообщение в зависимости от плана
        is_free_plan = plan == 'zooID'
        transaction_status = 'completed' if is_free_plan else 'pending'
        response_message = 'Тарифный план успешно активирован' if is_free_plan else 'Транзакция создана, ожидаем подтверждение оплаты'
        
        transaction_data = {
            'user': user.id,
            'membership': membership.id, 
            'amount': 0 if is_free_plan else membership.price,
            'subscription_start': now,
            'subscription_end': subscription_end,
            'status': transaction_status,
            'request_id': request_id,
            'auto_renewal': request.data.get('auto_renewal', False)
        }
        
        serializer = MembershipSerializer(data=transaction_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # для бесплатного плана сразу обновляем тип аккаунта
        if is_free_plan:
            user_profile = user.userprofile
            user_profile.account_type = plan
            user_profile.save()
            
            # обновляем данные пользователя для ответа
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
                'message': response_message,
                'transaction': serializer.data,
                'user': user_data
            }, status=status.HTTP_200_OK)
        
        # для платных планов возвращаем только транзакцию
        return Response({
            'success': True,
            'message': response_message,
            'transaction': serializer.data
        }, status=status.HTTP_200_OK)
        
        
class VerificationView(APIView):
    @handle_exceptions
    def post(self, request):
        pass
    
class NotificationView(APIView):
    @handle_exceptions
    def post(self, request):
        try:
            notification_data = request.data
            
            transaction_data = notification_data.get('transaction', {})
            tracking_id = transaction_data.get('tracking_id')
            payment_status = transaction_data.get('status')
            bepaid_id = transaction_data.get('uid')
            
            if not tracking_id:
                logger.error('No tracking_id in notification')
                return Response({'status': 'error', 'message': 'No tracking_id'}, status=status.HTTP_400_BAD_REQUEST)
            
            transaction = Tranasctions.objects.filter(
                request_id=tracking_id,
                status='pending'
            ).first()
            
            if not transaction:
                logger.error(f'Transaction not found or not pending for tracking_id: {tracking_id}')
                return Response({'status': 'ok'}, status=status.HTTP_200_OK)
            
            # обновляем статус транзакции
            if payment_status == 'successful':
                transaction.status = 'completed'
                transaction.bepaid_id = bepaid_id
                # обновляем тип аккаунта пользователя
                user_profile = UserProfile.objects.get(user=transaction.user)
                user_profile.account_type = transaction.membership.plan
                user_profile.save()
                
            else:
                transaction.status = 'failed'
            
            transaction.save()
            
        except Exception as e:
            logger.exception('Error processing notification')
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # всегда возвращаем 200 OK чтобы bepaid не пытался отправить повторно
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)