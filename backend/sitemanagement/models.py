from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from sitemanagement.constants.account_types import account_types
from sitemanagement.constants.colors import colors
from sitemanagement.constants.image_save_path import (devices_upload_path, 
pet_image_upload_path, 
pet_qr_upload_path, 
bonuses_upload_path, 
services_upload_path)
from dictionaries.models import PetsTypes, PetsBreeds, PetsColors

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
    id = models.AutoField(primary_key=True)
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
        ordering = ['id']
        
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
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Владелец')
    image = models.ImageField(
        upload_to=pet_image_upload_path,
        verbose_name="Фото питомца",
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255, verbose_name='Кличка')
    type = models.ForeignKey(PetsTypes, on_delete=models.CASCADE, verbose_name='Тип питомца')
    birthday = models.DateField(verbose_name='Дата рождения')
    gender = models.CharField(max_length=10, choices=[('male', 'Мужской'), ('female', 'Женский')], verbose_name='Пол')
    breed = models.ForeignKey(PetsBreeds, on_delete=models.CASCADE, verbose_name='Порода')
    color = models.ForeignKey(PetsColors, on_delete=models.CASCADE, verbose_name='Цвет')
    comment = models.TextField(max_length=255, verbose_name='Комментарий', null=True, blank=True)
    allergies = models.TextField(max_length=255, verbose_name='Аллергии', null=True, blank=True)
    is_lost = models.BooleanField(default=False, verbose_name='Питомец потерян?')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Питомец'
        verbose_name_plural = 'Питомцы'
        ordering = ['-id']
        
    def __str__(self):
        return f'{self.type} {self.name} - Владелец: {self.owner.username}'
    
class PetCoordinates(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, verbose_name='Питомец')
    latitude = models.FloatField(verbose_name='Широта')
    longitude = models.FloatField(verbose_name='Долгота')
    accuracy = models.FloatField(verbose_name='Точность')
    address = models.CharField(max_length=255, verbose_name='Адрес', null=True, blank=True)
    founder_name = models.CharField(max_length=30, verbose_name='Имя владельца', null=True, blank=True)
    founder_phone = models.CharField(max_length=14, verbose_name='Телефон владельца', null=True, blank=True) #+375123456789
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Координаты питомца'
        verbose_name_plural = 'Координаты питомцев'
        
    def __str__(self):
        return f'{self.pet.name} - {self.created_at}'
class QRCode(models.Model):
    pet = models.ForeignKey(
        'Pet',
        on_delete=models.CASCADE,
        verbose_name='Питомец',
        related_name='qr_code'
    )
    code = models.CharField(max_length=255, verbose_name='Код')
    image = models.ImageField(
        upload_to=pet_qr_upload_path,
        verbose_name="Фото QR кода",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    is_active = models.BooleanField(default=True, verbose_name='Активность')
    
    class Meta:
        verbose_name = 'QR код'
        verbose_name_plural = 'QR коды'
        
    def __str__(self):
        return self.code
    
class MapPoints(models.Model):
    location = models.CharField(max_length=255, verbose_name='Координаты локации')
    title = models.CharField(max_length=255, verbose_name='Название локации')
    category = models.CharField(max_length=20, verbose_name='Категория', choices=[('clinic', 'Ветклиника'), ('pharmacy', 'Ветаптека'), ('salon', 'Зоосалон')])
    
    class Meta:
        verbose_name = 'Маркер на карте'
        verbose_name_plural = 'Маркеры на карте'
    
    def __str__(self):
        return self.title
    
class Services (models.Model):
    title = models.CharField(max_length=50, verbose_name='Название услуги')
    description = models.CharField(max_length=100, verbose_name='Описание услуги')
    image = models.ImageField(
        upload_to=services_upload_path,
        verbose_name="Изображение продукта",
        null=True,
        blank=True
    )
    actual_before = models.DateField(verbose_name='Действует до')
    available_for = ArrayField(
        models.CharField(max_length=20, choices=account_types),
        verbose_name='Доступно для тарифов',
        blank=True,
        null=True,
        default=list,
        help_text='Выберите тарифные планы, для которых доступна услуга'
    )
    is_available = models.BooleanField(default=True, verbose_name='Доступность услуги')

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        ordering = ['id']

    def __str__(self):
        return self.title

class Appointment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Пользователь')
    service = models.ForeignKey(Services, on_delete=models.CASCADE, verbose_name='Услуга')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Запись'
        verbose_name_plural = 'Записи'
        ordering = ['id']
    
    def __str__(self):
        return self.user.username + ' - ' + self.service.title

class BonusApplication(models.Model):
    """Модель для отслеживания использования бонусов пользователями"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Пользователь')
    bonus = models.ForeignKey('Bonuses', on_delete=models.CASCADE, verbose_name='Бонус')
    applied_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата применения')

    class Meta:
        verbose_name = 'Применение бонуса'
        verbose_name_plural = 'Применения бонусов'
        unique_together = ('user', 'bonus')  # пользователь может использовать бонус только один раз

    def __str__(self):
        return f"{self.user.username} - {self.bonus.name}"


class Bonuses(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название бонуса')
    description = models.TextField(max_length=255, verbose_name='Описание бонуса')
    image = models.ImageField(
        upload_to=bonuses_upload_path,
        verbose_name="Картинка для бонуса",
        null=True,
        blank=True
    )
    category = models.CharField(max_length=255, verbose_name='Категория', choices=[('discount', 'Скидки'), ('promo', 'Промокоды'), ('promotion', 'Акции')])
    start_date = models.DateField(verbose_name='Дата начала')
    end_date = models.DateField(verbose_name='Дата окончания')
    code = models.CharField(max_length=10, verbose_name='Промокод', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    is_available = models.BooleanField(default=True, verbose_name='Активность')
    applied_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='BonusApplication',
        related_name='applied_bonuses',
        verbose_name='Использован пользователями'
    )
    class Meta:
        verbose_name = 'Бонус'
        verbose_name_plural = 'Бонусы'
        ordering = ['id']
        
    def __str__(self):
        return self.name
    
class Tranasctions(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Пользователь')
    membership = models.ForeignKey(Pricing, on_delete=models.CASCADE, verbose_name='Тарифный план')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Сумма')
    auto_renewal = models.BooleanField(default=False, verbose_name='Автоматическое продление')
    status = models.CharField(max_length=10, verbose_name='Статус', choices=[('pending', 'Ожидание'), ('completed', 'Выполнено'), ('failed', 'Не выполнено')])
    request_id = models.CharField(max_length=255, verbose_name='ID транзакции в bePaid')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    subscription_start = models.DateTimeField(verbose_name='Начало подписки', null=True, blank=True)
    subscription_end = models.DateTimeField(verbose_name='Окончание подписки', null=True, blank=True)
    
    class Meta:
        verbose_name = 'Транзакция'
        verbose_name_plural = 'Транзакции'
        ordering = ['-id']
        
    def __str__(self):
        return f'{self.user.username} - {self.membership.plan}'
    
class Devices(models.Model):
    title = models.CharField(max_length=100, verbose_name='Название продукта')
    description = models.CharField(max_length=255, verbose_name='Описание продукта')
    price = models.IntegerField(verbose_name='Цена продукта')
    image = models.ImageField(
        upload_to=devices_upload_path,
        verbose_name="Изображение продукта",
    )
    wb_link = models.CharField(max_length=255, verbose_name="Ссылка на WB")
    category = models.CharField(max_length=15, verbose_name='Категория', choices=[('collars', 'Ошейники'), ('keychains', 'Брелоки')], default='collars')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Устройство'
        verbose_name_plural = 'Устройства'
        ordering = ['id']
    
    def __str__(self) -> str:
        return f'{self.title} - {self.price}'