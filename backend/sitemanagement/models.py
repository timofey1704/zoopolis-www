from django.db import models
from django.conf import settings
from sitemanagement.constants.account_types import account_types
from sitemanagement.constants.colors import colors

class FAQ (models.Model):
    title = models.CharField(max_length=250)
    content = models.CharField(max_length=800)
    
    class Meta:
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
        ordering = ['id']

    def __str__(self):
        return self.title
    
class Pricing(models.Model):
    plan = models.CharField(max_length=10, choices=account_types, verbose_name='Название тарифного плана')
    description = models.TextField(max_length=255, verbose_name='Описание тарифного плана')
    price = models.IntegerField(verbose_name='Стоимость тарифного плана / месяц')
    is_popular = models.BooleanField(default=False, verbose_name='Популярность')
    is_available = models.BooleanField(default=False, verbose_name='Доступность')
    features = models.ManyToManyField('Feature', related_name='pricing_plans', verbose_name='Свойства')
    bg_color = models.CharField(max_length=10,choices=colors, verbose_name='Цвет карточки')
    class Meta:
        verbose_name = 'Тарифный план'
        verbose_name_plural = 'Тарифные планы'
        
    def __str__(self):
        return self.plan
    
class Feature(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название свойства')
    
    class Meta:
        verbose_name = 'Свойство'
        verbose_name_plural = 'Свойства'
        
    def __str__(self):
        return self.name

class MainPageMedia(models.Model):
    type = models.CharField(max_length=10, 
        choices=[
            ("image", "Фото"),
            ("video", "Видео"),     
        ],verbose_name="Тип контента")
    url = models.CharField(max_length=255, verbose_name="Ссылка на медиаконтент")
    thumbnail_url = models.CharField(max_length=255, verbose_name="Ссылка на превью видео", null=True, blank=True)
    
    class Meta:
        verbose_name = 'Медиа контент для главной'
        verbose_name_plural = 'Медиа контент для главной'
        
    def __str__(self):
        return self.url
    
class Pet(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Владелец')
    imageURL = models.CharField(max_length=255, verbose_name='Фото питомца', null=True, blank=True)
    name = models.CharField(max_length=255, verbose_name='Кличка')
    type = models.CharField(max_length=10, choices=[('dog', 'Собака'), ('cat', 'Кошка')], verbose_name='Тип питомца')
    birthday = models.DateField(verbose_name='Дата рождения')
    gender = models.CharField(max_length=10, choices=[('male', 'Мужской'), ('female', 'Женский')], verbose_name='Пол')
    breed = models.CharField(max_length=255, verbose_name='Порода')
    color = models.CharField(max_length=255, verbose_name='Цвет')
    comment = models.TextField(max_length=255, verbose_name='Комментарий', null=True, blank=True)
    allergies = models.TextField(max_length=255, verbose_name='Аллергии', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Питомец'
        verbose_name_plural = 'Питомцы'
        
class QRCode(models.Model):
    pet = models.ForeignKey('Pet', on_delete=models.CASCADE, verbose_name='Питомец')
    code = models.CharField(max_length=255, verbose_name='Код')
    imageURL = models.CharField(max_length=255, verbose_name='Фото QR кода')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    is_active = models.BooleanField(default=True, verbose_name='Активность')
    
    class Meta:
        verbose_name = 'QR код'
        verbose_name_plural = 'QR коды'
        
    def __str__(self):
        return self.code