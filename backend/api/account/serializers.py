import logging
from rest_framework import serializers
from django.utils import timezone
from django.conf import settings
from django.contrib.auth import get_user_model
from api.models import RegisterQRCode
from sitemanagement.models import Pet, MapPoints, Services, Bonuses, Pricing, Tranasctions, Devices
from dictionaries.models import Cities, PetsTypes, PetsBreeds, PetsColors

logger = logging.getLogger(__name__)
User = get_user_model()
class BasePetSerializer(serializers.ModelSerializer):
    """Базовый сериализатор с общей валидацией"""
    class Meta:
        model = Pet
        fields = '__all__'
        read_only_fields = ('owner', 'created_at')

    def validate_birthday(self, value):
        """Проверка, что дата рождения не в будущем"""
        if value > timezone.now().date():
            raise serializers.ValidationError("Дата рождения не может быть в будущем")
        return value

class PetCreateSerializer(BasePetSerializer):
    """Сериализатор для создания питомца с поддержкой загрузки изображений"""
    class Meta:
        model = Pet
        fields = ['name', 'type', 'birthday', 'gender', 'breed', 'color', 'comment', 'allergies', 'image']
        read_only_fields = ('owner', 'created_at')
class PetSerializer(BasePetSerializer):
    """Сериализатор для чтения данных питомца"""
    imageURL = serializers.SerializerMethodField()
    QRImage = serializers.SerializerMethodField()
    QRCode = serializers.SerializerMethodField()
    clear_type = serializers.SerializerMethodField()
    clear_breed = serializers.SerializerMethodField()
    clear_color = serializers.SerializerMethodField()
    clear_gender = serializers.SerializerMethodField()
    
    def get_imageURL(self, obj):
        """Фото питомца с BASE_URL"""
        return f"{settings.BASE_URL}{obj.image.url}" if obj.image else None
    
    def get_QRImage(self, obj):
        """Возвращает URL QR изображения питомца"""

        qr = RegisterQRCode.objects.filter(pet=obj, is_active=True).first()
        if not qr:
            return None
        return f"{settings.BASE_URL}{qr.image.url}" if qr.image else None
    
    def get_QRCode(self, obj):
        """Возвращает код QR питомца"""
        qr = RegisterQRCode.objects.filter(pet=obj, is_active=True).first()
        if not qr:
            return None
        return qr.code
        
    def get_clear_type(self, obj):
        """Возвращает название типа питомца"""
        return obj.type.name if obj.type else None
        
    def get_clear_breed(self, obj):
        """Возвращает название породы питомца"""
        return obj.breed.name if obj.breed else None
        
    def get_clear_color(self, obj):
        """Возвращает название цвета питомца"""
        return obj.color.name if obj.color else None
        
    def get_clear_gender(self, obj):
        """Возвращает пол питомца в читаемом виде"""
        gender_map = {
            'male': 'Мужской',
            'female': 'Женский'
        }
        return gender_map.get(obj.gender)
        
class CitySerializer(serializers.ModelSerializer):
    "Сериалиалайзер для выдачи городов"
    display_name = serializers.SerializerMethodField()
    
    def get_display_name(self, obj):
        """Возвращает отформатированное название города с страной"""
        return f"{obj.name}, {obj.country}"
    
    class Meta:
        model = Cities
        fields = ('id', 'name', 'country', 'display_name')
        
class CityListSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи списка городов"""
    class Meta:
        model = Cities
        fields = ('id', 'name', 'country')

class PetTypeSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи типов питомцев"""
    class Meta:
        model = PetsTypes
        fields = ('id', 'name')
        
class PetBreedSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи пород питомцев"""
    pet_type = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = PetsBreeds
        fields = ('id', 'name', 'pet_type')
        
class PetColorSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи цветов питомцев"""
    class Meta:
        model = PetsColors
        fields = ('id', 'name', 'hex_code')
        
class MapPointsSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи маркеров на карте"""
    class Meta:
        model = MapPoints
        fields = ('id', 'location', 'title', 'category')
        
class ServicesSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи услуг"""
    class Meta:
        model = Services
        fields = ('id', 'title', 'description', 'imageURL', 'actual_before', 'is_available')
        
class BonusesSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи бонусов"""
    class Meta:
        model = Bonuses
        fields = ('id', 'name', 'description', 'imageURL', 'category', 'start_date', 'end_date', 'code', 'is_available')
        
class MembershipSerializer(serializers.ModelSerializer):
    """Сериализатор для выдачи тарифных планов"""
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    membership = serializers.PrimaryKeyRelatedField(queryset=Pricing.objects.all())

    class Meta:
        model = Tranasctions
        fields = ('id', 'user', 'membership', 'amount', 'auto_renewal', 'status', 'transaction_id', 'created_at', 'subscription_start', 'subscription_end')
        
    def validate(self, data):
            """Валидация дат подписки"""
            subscription_start = data.get('subscription_start')
            subscription_end = data.get('subscription_end')
            
            if subscription_start and subscription_end:
                # проверяем что дата окончания позже даты начала
                if subscription_end <= subscription_start:
                    raise serializers.ValidationError({
                        "subscription_end": "Дата окончания подписки должна быть позже даты начала"
                    })
                
                # для новых подписок (status=pending/completed) проверяем будущее
                if data.get('status') in ['pending', 'completed']:
                    now = timezone.now()
                    
                    # дата начала не должна быть в прошлом более чем на 30 минут (небольшой запас для обработки запроса)
                    if subscription_start < now - timezone.timedelta(minutes=30):
                        raise serializers.ValidationError({
                            "subscription_start": "Дата начала подписки не может быть в прошлом"
                        })
                    
                    # дата окончания должна быть минимум на день позже начала
                    min_duration = timezone.timedelta(days=1)
                    if subscription_end - subscription_start < min_duration:
                        raise serializers.ValidationError({
                            "subscription_end": "Минимальный срок подписки - 1 день"
                        })
            
            return data
        
class DeviceSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Devices
        fields = ('id', 'title', 'description', 'price', 'category', 'wb_link', 'image')
        
    def get_image(self, obj):
        """Возвращает URL изображения продукта"""
        return f"{settings.BASE_URL}{obj.image.url}" if obj.image else None