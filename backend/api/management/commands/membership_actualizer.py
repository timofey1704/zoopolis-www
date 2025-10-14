from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Q
from sitemanagement.models import Tranasctions

class Command(BaseCommand):
    help = 'Проверка и обновление статуса подписки пользователей'

    def handle(self, *args, **options):
        now = timezone.now()
        
        # получаем активные транзакции с истекшим сроком подписки
        expired_transactions = Tranasctions.objects.filter(
            Q(status='completed') &
            Q(subscription_end__lt=now) &  # подписка истекла
            Q(user__userprofile__account_type__in=['concierge', 'zoopolis'])  # только платные! тарифы
        ).select_related('user', 'user__userprofile')

        updated_count = 0
        for transaction in expired_transactions:
            profile = transaction.user.userprofile
            
            # проверяем нет ли более новых активных транзакций
            has_active_subscription = Tranasctions.objects.filter(
                user=transaction.user,
                status='completed',
                subscription_end__gt=now
            ).exists()
            
            if not has_active_subscription:
                # если нет активных подписок - переводим на zooID
                old_type = profile.account_type
                profile.account_type = 'zooID'
                profile.save()
                updated_count += 1
                
                self.stdout.write(
                    self.style.WARNING(
                        f'Пользователь {profile.user.username} переведен с тарифа {old_type} на zooID'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Обработка завершена. Обновлено пользователей: {updated_count}'
            )
        )