from rest_framework import serializers
from sitemanagement.models import Pet
from django.utils import timezone

class BasePetSerializer(serializers.ModelSerializer):
    """Базовый сериализатор с общей валидацией"""
    class Meta:
        model = Pet
        exclude = ('owner', 'created_at')

    def validate_birthday(self, value):
        """Проверка, что дата рождения не в будущем"""
        if value > timezone.now().date():
            raise serializers.ValidationError("Дата рождения не может быть в будущем")
        return value

class PetSerializer(BasePetSerializer):
    """Сериализатор для чтения данных питомца"""
    class Meta(BasePetSerializer.Meta):
        fields = '__all__'
        read_only_fields = ('owner', 'created_at')