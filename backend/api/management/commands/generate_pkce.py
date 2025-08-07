from django.core.management.base import BaseCommand
from api.utils.oauthCodeVerifier import generate_pkce_pair

class Command(BaseCommand):
    help = 'Генерирует code_verifier и code_challenge для PKCE авторизации'

    def handle(self, *args, **options):
        code_verifier, code_challenge = generate_pkce_pair()
        self.stdout.write(self.style.SUCCESS('✅ Code Verifier:'))
        self.stdout.write(code_verifier)
        self.stdout.write(self.style.SUCCESS('✅ Code Challenge:'))
        self.stdout.write(code_challenge)