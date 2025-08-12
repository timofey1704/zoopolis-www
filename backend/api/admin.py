from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from api.models import UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name = 'Профиль пользователя'
    verbose_name_plural = 'Профили пользователей'
    fields = ('phone_number', 'uuid', 'privacy_accepted', 'account_type')
    readonly_fields = ('uuid',)

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)