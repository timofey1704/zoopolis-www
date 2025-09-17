from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
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
    list_display = ("code", "user", "is_active", "is_used", "is_printed", "created_at", "print_image_button")
    list_filter = ("is_active", "is_used", "created_at")
    search_fields = ("code", "user__username")
    readonly_fields = ("code", "image", "created_at", "user", "is_used", "is_active", "pet")
    actions = ['print_selected_qr_codes']

    def print_image_button(self, obj):
        if obj.image:
            return format_html(
                '<button onclick="window.open(\'{0}\', \'_blank\').print()" '
                'class="button" style="padding: 5px 10px; background: #417690; color: white; border: none; border-radius: 3px; cursor: pointer;">'
                'Печать</button>',
                obj.image.url
            )
        return "Нет изображения"
    
    print_image_button.short_description = "Печать"

    def print_selected_qr_codes(self, request, queryset):
        # фильтруем только те объекты, у которых есть изображение
        qr_codes_with_images = queryset.exclude(image__isnull=True).exclude(image='')
        
        if not qr_codes_with_images:
            self.message_user(request, "Нет QR-кодов с изображениями для печати", level='warning')
            return
        
        # создаем HTML страницу для печати
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Печать QR-кодов</title>
            <style>
                @media print {{
                    body {{ margin: 0; padding: 20px; }}
                    .no-print {{ display: none; }}
                    .qr-container {{ page-break-inside: avoid; margin-bottom: 20px; }}
                }}
                .qr-container {{ 
                    border: 1px solid #ddd; 
                    padding: 15px; 
                    margin: 10px; 
                    text-align: center;
                    display: inline-block;
                    width: 200px;
                }}
                img {{ max-width: 100%; height: auto; max-height: 150px; }}
                .print-header {{ text-align: center; margin-bottom: 30px; }}
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>QR-коды для печати</h1>
                <p>Всего кодов: {count}</p>
            </div>
            <div class="qr-grid">
        """.format(count=qr_codes_with_images.count())
        
        for qr_code in qr_codes_with_images:
            html_content += """
                <div class="qr-container">
                    <img src="{image_url}" alt="QR Code">
                    <h3>{code}</h3>
                </div>
            """.format(
                code=qr_code.code,
                image_url=request.build_absolute_uri(qr_code.image.url),
                username=qr_code.user.username if qr_code.user else 'Не указан',
                created_at=qr_code.created_at,
                status='Активен' if qr_code.is_active else 'Неактивен'
            )
        
        html_content += """
            </div>
            <div class="no-print" style="text-align: center; margin: 30px;">
                <button onclick="window.print()" style="padding: 15px 25px; background: #417690; color: white; border: none; cursor: pointer; font-size: 16px;">
                    🖨️ Печать всех QR-кодов
                </button>
                <button onclick="window.close()" style="padding: 15px 25px; background: #999; color: white; border: none; cursor: pointer; margin-left: 10px; font-size: 16px;">
                    Закрыть
                </button>
            </div>
        </body>
        </html>
        """
        
        # создаем response с HTML содержимым
        from django.http import HttpResponse
        response = HttpResponse(html_content)
        return response
    
    print_selected_qr_codes.short_description = "Распечатать выбранные QR-коды"

admin.site.unregister(User)
admin.site.register(User, UserAdmin)