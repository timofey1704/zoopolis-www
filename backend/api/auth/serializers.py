from rest_framework import serializers

from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from sitemanagement.models import PetCoordinates
from api.models import UserProfile

class ClientRegisterSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField()
    privacy_accepted = serializers.BooleanField()
    email = serializers.EmailField(required=True)
    name = serializers.CharField(required=True)
    surname = serializers.CharField(required=True)
    uuid = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'uuid', 'name', 'surname', 'email', 'password', 'phone_number', 'privacy_accepted']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'phone_number': {'required': True},
        }
    
    def validate_phone_number(self, value):
        if len(value) > 18:
            raise serializers.ValidationError("Номер телефона не может быть таким длинным")
        return value
    
    def validate_privacy_accepted(self, value):
        if not value:
            raise serializers.ValidationError("Необходимо принять условия политики конфиденциальности")
        return value
    
    def create(self, validated_data):
        privacy_accepted = validated_data.pop('privacy_accepted')
        phone_number = validated_data.pop('phone_number')
        name = validated_data.pop('name')
        surname = validated_data.pop('surname')
        
        try:
            user = User.objects.create_user(
                username=validated_data['email'],  # используем email как username
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=name,
                last_name=surname
            )
            
            UserProfile.objects.create(
                user=user,
                phone_number=phone_number,
                privacy_accepted=privacy_accepted
            )
            
            return user
        
        except IntegrityError:
            raise serializers.ValidationError({"email": "Пользователь с таким email уже существует"})
        
class UserResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    account_type = serializers.CharField(source='userprofile.account_type')
    name = serializers.CharField(source='first_name')
    surname = serializers.CharField(source='last_name')
    phone_number = serializers.CharField(source='userprofile.phone_number')
    image = serializers.SerializerMethodField()
    uuid = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    telegram_id = serializers.SerializerMethodField()
    is_coordinates_available = serializers.SerializerMethodField()
    
    def get_is_coordinates_available(self, obj):
        three_days_ago = timezone.now() - timedelta(days=3)
    
        return PetCoordinates.objects.filter(
            pet__owner=obj,
            created_at__gte=three_days_ago
        ).exists()
    
    def get_telegram_id(self, obj):
        return obj.userprofile.telegram_id if obj.userprofile.telegram_id else None
    
    def get_uuid(self, obj):
        try:
            return str(obj.userprofile.uuid)[:6]
        except Exception as e:
            return None

    def get_image(self, obj):
        try:
            if obj.userprofile.image:
                relative_url = obj.userprofile.image.url
                base_url = settings.BASE_URL
                base_url = base_url.rstrip('/')
                relative_url = relative_url.lstrip('/')
                full_url = f"{base_url}/{relative_url}"
                return full_url
            return None
        except Exception as e:
            return None
        
    def get_city(self, obj):
        city = obj.userprofile.city
        if city:
            return {
                'id': city.id,
                'name': city.name,
                'country': city.country,
                'display_name': f"{city.name}, {city.country}"
            }
        return None
    
    def get_address(self, obj):
        return obj.userprofile.address if obj.userprofile.address else None