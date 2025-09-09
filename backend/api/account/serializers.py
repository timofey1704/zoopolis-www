from rest_framework import serializers
from django.utils import timezone
from django.conf import settings

from sitemanagement.models import Pet, MapPoints, Services, Bonuses
from dictionaries.models import Cities, PetsTypes, PetsBreeds, PetsColors

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

class PetSerializer(BasePetSerializer):
    """Сериализатор для чтения данных питомца"""
    QRImage = serializers.SerializerMethodField()
    QRCode = serializers.SerializerMethodField()
    clear_type = serializers.SerializerMethodField()
    clear_breed = serializers.SerializerMethodField()
    clear_color = serializers.SerializerMethodField()
    clear_gender = serializers.SerializerMethodField()
    
    def get_QRImage(self, obj):
        """Возвращает URL QR изображения питомца"""
        qr = obj.qr_code.filter(is_active=True).last()
        if not qr:
            return None
        # Добавляем базовый URL к пути изображения
        return f"{settings.BASE_URL}{qr.imageURL}"
    
    def get_QRCode(self, obj):
        """Возвращает код QR питомца"""
        qr = obj.qr_code.filter(is_active=True).last()
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