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
            'status': 'pending',  # статус pending до подтверждения от bePaid
            'request_id': request_id,
            'auto_renewal': request.data.get('auto_renewal', False)
        }
        
        # валидируем и сохраняем данные
        serializer = MembershipSerializer(data=transaction_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # возвращаем только данные транзакции, тип аккаунта обновится после подтверждения оплаты
        return Response({
            'success': True,
            'message': 'Транзакция создана, ожидаем подтверждение оплаты',
            'transaction': serializer.data
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
        
        try:
            notification_data = request.data
            logger.info('Bepaid notification data: %s', json.dumps(notification_data, indent=2))
            
            transaction_data = notification_data.get('transaction', {})
            tracking_id = transaction_data.get('tracking_id')
            payment_status = transaction_data.get('status')
            
            # логируем важные поля
            logger.info('Important fields: %s', {
                'transaction_type': transaction_data.get('type'),
                'status': payment_status,
                'tracking_id': tracking_id,
                'payment_method_type': transaction_data.get('payment_method_type'),
                'amount': transaction_data.get('amount'),
                'currency': transaction_data.get('currency'),
            })
            
            # проверяем наличие tracking_id
            if not tracking_id:
                logger.error('No tracking_id in notification')
                return Response({'status': 'error', 'message': 'No tracking_id'}, status=status.HTTP_400_BAD_REQUEST)
            
            # находим транзакцию
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
                
                # обновляем тип аккаунта пользователя
                user_profile = UserProfile.objects.get(user=transaction.user)
                user_profile.account_type = transaction.membership.plan
                user_profile.save()
                
                logger.info(f'Updated user {transaction.user.username} account type to {transaction.membership.plan}')
            else:
                transaction.status = 'failed'
                logger.info(f'Payment failed for transaction {tracking_id}')
            
            transaction.save()
            logger.info(f'Updated transaction {tracking_id} status to {transaction.status}')
            
        except Exception as e:
            logger.exception('Error processing notification')
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # всегда возвращаем 200 OK чтобы bepaid не пытался отправить повторно
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)