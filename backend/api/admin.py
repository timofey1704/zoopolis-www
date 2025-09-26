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
            html_content = """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>QR-код</title>
                    <style>
                        @media print {{
                            body {{ margin: 0; padding: 20px; }}
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
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <img src="{0}" alt="QR Code">
                        <h3>{1}</h3>
                    </div>
                </body>
                </html>
            """.format(obj.image.url, obj.code)
            
            return format_html(
                '<button onclick="var w = window.open(); w.document.write(\'{0}\'); w.document.close(); var img = w.document.querySelector(\'img\'); if(img) {{ img.onload = function() {{ w.print(); }}; }}" '
                'class="button" style="padding: 5px 10px; background: #417690; color: white; border: none; border-radius: 3px; cursor: pointer;">'
                'Печать</button>',
                html_content.replace("'", "\\'").replace("\n", "")
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
                    .qr-container {{ 
                        page-break-inside: avoid; 
                        margin-bottom: 20px;
                    }}
                }}
                .qr-container {{ 
                    margin: 30px; 
                    text-align: center;
                    display: inline-block;
                    width: 200px;
                }}
                svg {{
                    display: block;
                    margin: 0 auto;
                    background: white;
                }}
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
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        <defs>
                            <clipPath id="circle-clip-{code}">
                                <circle cx="100" cy="100" r="98" />
                            </clipPath>
                        </defs>
                        <circle cx="100" cy="100" r="98" fill="white" stroke="black" stroke-width="4"/>
                        <!-- QR код сверху -->
                        <image x="25" y="15" width="150" height="150" href="{image_url}" 
                               clip-path="url(#circle-clip-{code})" />
                        <!-- Белый фон для текста -->
                        <rect x="30" y="140" width="140" height="30" fill="white"/>
                        <!-- Текст кода -->
                        <text x="100" y="160" text-anchor="middle" font-size="16" font-weight="bold" fill="black">
                            {code}
                        </text>
                    </svg>
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
                <button onclick="window.location.href='/admin/api/registerqrcode/'" style="padding: 15px 25px; background: #999; color: white; border: none; cursor: pointer; margin-left: 10px; font-size: 16px;">
                     Вернуться в админку
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