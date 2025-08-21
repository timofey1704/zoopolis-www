from django.contrib.auth.models import User
from sitemanagement.constants.account_types import account_types
from django.db import models
from dictionaries.models import Cities
import uuid

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, null=True)
    phone_number = models.CharField(max_length=18, unique=True, verbose_name="Номер телефона")
    city = models.ForeignKey(Cities, on_delete=models.CASCADE, verbose_name="Город", null=True, blank=True)
    address = models.CharField(max_length=255, verbose_name="Адрес", null=True, blank=True)
    account_type = models.CharField(max_length=20, verbose_name="Тип аккаунта", choices=account_types)
    privacy_accepted = models.BooleanField(default=False)
    imageURL = models.CharField(max_length=255, null=True, blank=True)
   
    def __str__(self):
        return str(self.phone_number)