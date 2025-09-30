import random
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

from api.utils.exceptionsHandler import handle_exceptions
from sitemanagement.models import Tranasctions, Pricing
from api.account.serializers import MembershipSerializer
from datetime import timedelta

class VerificationView(APIView):
    @handle_exceptions
    def post(self, request):
        pass
    
class NotificationView(APIView):
    @handle_exceptions
    def post(self, request):
        pass

class MembershipView(ViewSet):
    permission_classes = [IsAuthenticated]

    def get_active_subscription(self, user):
        """Получить активную подписку пользователя"""
        now = timezone.now()
        return Tranasctions.objects.filter(
            user=user,
            status='completed',
            subscription_start__lte=now,
            subscription_end__gte=now
        ).first()

    @action(detail=False, methods=['patch'])
    @handle_exceptions
    def change_membership(self, request):
        user = request.user
        plan = request.data.get('plan')
        
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
            
        # проверяем текущую активную подписку
        active_subscription = self.get_active_subscription(user)
        if active_subscription:
            if active_subscription.membership.plan == plan:
                return Response({
                    'success': False,
                    'message': 'У вас уже активирован этот тарифный план',
                    'current_plan': {
                        'name': active_subscription.membership.plan,
                        'expires_at': active_subscription.subscription_end
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # апгрейды/даунгрейды?

        now = timezone.now()
        subscription_end = now + timedelta(days=30)  # 30 дней
        
        # генерируем уникальный transaction_id
        transaction_id = f"{int(now.timestamp())}{user.id}{random.randint(1000, 9999)}"
        
        # подготавливаем данные для сериализатора
        transaction_data = {
            'user': user.id,
            'membership': membership.id, 
            'amount': membership.price,
            'subscription_start': now,
            'subscription_end': subscription_end,
            'status': 'completed',
            'transaction_id': transaction_id,
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
            'imageURL': user.userprofile.imageURL,
        }

        return Response({
            'success': True,
            'message': 'План успешно изменен',
            'transaction': serializer.data,
            'user': user_data
        }, status=status.HTTP_200_OK)