from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, RegisterQRCode


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name = 'Профиль пользователя'
    verbose_name_plural = 'Профили пользователей'
    fields = ('phone_number', 'uuid', 'privacy_accepted', 'account_type', 'city', 'address')
    readonly_fields = ('uuid',)

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

@admin.register(RegisterQRCode)
class RegisterQRCodeAdmin(admin.ModelAdmin):
    list_display = ("code", "user", "is_active", "is_used", "created_at")
    list_filter = ("is_active", "is_used", "created_at")
    search_fields = ("code", "user__username")

    # чтобы в форме не отображались автоматически заполняемые поля
    readonly_fields = ("code", "image", "created_at")

admin.site.unregister(User)
admin.site.register(User, UserAdmin)