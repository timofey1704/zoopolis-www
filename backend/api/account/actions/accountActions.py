from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from api.auth.serializers import UserResponseSerializer
from api.models import UserProfile

from api.utils.decorators import handle_exceptions

class AccountActionsView(ViewSet):
    """Действия в аккаунте пользователя:
    - PATCH данных пользователя в /profile/contacts
    """
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['patch'])
    @handle_exceptions
    def change_profile_contacts_data(self, request):
        """Обновление данных на главной странице аккаунта"""
        
        user = request.user
        user_profile = get_object_or_404(UserProfile, user=user)
        
        # обновляем данные пользователя
        if 'firstName' in request.data:
            user.first_name = request.data['firstName']
        if 'lastName' in request.data:
            user.last_name = request.data['lastName']
        if 'city' in request.data:
            user_profile.city = request.data['city']
        if 'country' in request.data:
            user_profile.address = request.data['address']
        if 'email' in request.data:
            email = request.data['email']
            validate_email(email)  # handle_exceptions обработает ValidationError
            user.email = email
            user.username = email
        
        # обновляем номер телефона
        if 'phone_number' in request.data:
            phone = request.data['phone_number']
            if phone:
                if len(phone) < 13:  # +375331234567
                    raise ValidationError("Номер телефона слишком короткий")
                
                # проверка на уникальность
                if UserProfile.objects.filter(phone_number=phone).exclude(user=user).exists():
                    raise ValidationError("Этот номер телефона уже используется")
                
                user_profile.phone_number = phone
                
        # обновляем фотографию профиля
        if 'image' in request.FILES:
            user_profile.imageURL = request.FILES['image']
            user_profile.save()

        # сохраняем изменения
        user.save()
        user_profile.save()
        
        response_data = {
            "message": "Данные успешно обновлены",
            "user": UserResponseSerializer(user).data
        }
        return Response(response_data, status=status.HTTP_200_OK)