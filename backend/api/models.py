from django.contrib.auth.models import User
from django.db import models
import uuid

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, null=True)
    phone_number = models.CharField(max_length=18, verbose_name="Номер телефона")
   
    def __str__(self):
        return str(self.phone_number)