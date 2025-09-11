import io
import uuid
from django.contrib.auth.models import User
from django.db import models
from django.core.files.base import ContentFile

from sitemanagement.constants.account_types import account_types
from sitemanagement.constants.qr_code_path import register_qr_upload_path
from dictionaries.models import Cities

from api.utils.generate_qr_register import generate_registration_qr

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
    
class RegisterQRCode(models.Model):
    user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    verbose_name="Пользователь",
    null=True,
    blank=True
    )
    code = models.CharField(max_length=255, verbose_name="Код")
    image = models.ImageField(upload_to=register_qr_upload_path, verbose_name="Фото QR кода")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    is_active = models.BooleanField(default=True, verbose_name="Активность")
    is_used = models.BooleanField(default=False, verbose_name="Использован")
    is_printed = models.BooleanField(default=False, verbose_name='Статус распечатки кода')
    
    class Meta:
        verbose_name = "QR код регистрации"
        verbose_name_plural = "QR коды регистрации"

    def __str__(self):
        return self.code


    def save(self, *args, **kwargs):
        if not self.pk:  # только при создании
            qr_image, _, unique_code = generate_registration_qr("http://192.168.0.7:3000/register") #! поменяй в проде
            self.code = unique_code

            # сохраняем изображение во временный буфер
            image_io = io.BytesIO()
            qr_image.save(image_io, format="PNG")
            self.image.save(f"{unique_code}.png", ContentFile(image_io.getvalue()), save=False)
            
        super().save(*args, **kwargs)