from django.contrib import admin
from django.conf import settings
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.urls import path
from django import forms
from .models import UserProfile, RegisterQRCode


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name = 'Профиль пользователя'
    verbose_name_plural = 'Профили пользователей'
    fields = ('phone_number', 'uuid', 'privacy_accepted', 'account_type', 'city', 'address', 'image', 'telegram_id')
    readonly_fields = ('uuid',)

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

class BatchQRCodeForm(forms.Form):
    amount = forms.IntegerField(min_value=1, max_value=100, label='Количество QR-кодов')

@admin.register(RegisterQRCode)
class RegisterQRCodeAdmin(admin.ModelAdmin):
    list_display = ("code", "user", "is_active", "is_printed", "is_used", "created_at", "print_image_button")
    list_filter = ("is_active", "is_used", "created_at", "is_printed")
    search_fields = ("code", "user__username")
    readonly_fields = ("code", "image", "is_verificated", "created_at", "user", "is_used", "is_active", "pet", "activation_date")
    actions = ['print_selected_qr_codes']
    change_list_template = 'admin/api/registerqrcode_changelist.html'
    
    def get_readonly_fields(self, request, obj=None):
        readonly_fields = list(self.readonly_fields)
        
        if obj:  # если объект уже существует
            is_customer_service = request.user.groups.filter(name='Customer Service').exists()
            
            if obj.is_printed:
                # если QR уже распечатан
                if is_customer_service:
                    # customer service не может менять is_printed обратно на False
                    readonly_fields.append('is_printed')
            else:
                # если QR не распечатан
                if not is_customer_service and not request.user.is_superuser:
                    # только customer service и суперпользователи могут менять is_printed на True
                    readonly_fields.append('is_printed')
                    
        return readonly_fields

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('batch-create/', self.admin_site.admin_view(self.batch_create_view), name='api_registerqrcode_batch-create'),
        ]
        return custom_urls + urls

    def batch_create_view(self, request):
        if request.method == 'POST':
            form = BatchQRCodeForm(request.POST)
            if form.is_valid():
                amount = form.cleaned_data['amount']
                created_count = 0
                
                for _ in range(amount):
                    try:
                        RegisterQRCode.objects.create()
                        created_count += 1
                    except Exception as e:
                        self.message_user(request, f'Ошибка при создании QR-кодов: {str(e)}', level='error')
                        break
                
                if created_count > 0:
                    self.message_user(request, f'Успешно создано {created_count} QR-кодов')
                return HttpResponseRedirect('../')
        else:
            form = BatchQRCodeForm()

        context = {
            'title': 'Создать QR-коды',
            'form': form,
            'opts': self.model._meta,
            **self.admin_site.each_context(request),
        }
        return TemplateResponse(request, 'admin/api/batch_create_form.html', context)

    def print_image_button(self, obj):
        if obj.image and not obj.is_printed:
            html_content = """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>QR-код</title>
                    <style>
                        @media print {{
                            body {{ margin: 0; padding: 20px; }}
                            .no-print {{ display: none; }}
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
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <div style="position: relative; width: 200px; height: 200px;">
                            <!-- Шаблон с текстом по кругу -->
                            <img src="{2}api/img/round.png" style="width: 200px; height: 200px;" />
                            <!-- QR код в центре -->
                            <img src="{0}" style="position: absolute; left: 50px; top: 49px; width: 100px; height: 100px;" />
                            <!-- Текст кода внизу -->
                            <div style="position: absolute; left: 0; right: 0; bottom: 35px; text-align: center; font-size: 15px; font-weight: bold;">
                                {1}
                            </div>
                        </div>
                    </div>
                    <div class="no-print" style="text-align: center; margin: 20px;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #417690; color: white; border: none; cursor: pointer;">
                            🖨️ Печать
                        </button>
                        <button onclick="window.location.href='/admin/api/registerqrcode/'" style="padding: 10px 20px; background: #999; color: white; border: none; cursor: pointer; margin-left: 10px;">
                            Вернуться в админку
                        </button>
                    </div>
                </body>
                </html>
            """.format(
                obj.image.url,
                obj.code,
                settings.STATIC_URL
            )
            
            return format_html(
                '<button onclick="var w = window.open(); w.document.write(\'{0}\'); w.document.close(); var img = w.document.querySelector(\'img\'); if(img) {{ img.onload = function() {{ w.print(); }}; }}" '
                'class="button" style="padding: 5px 10px; background: #417690; color: white; border: none; border-radius: 3px; cursor: pointer;">'
                'Печать</button>',
                html_content.replace("'", "\\'").replace("\n", "")
            )
        return None if obj.is_printed else "Нет изображения"
    
    print_image_button.short_description = "Печать"

    def print_selected_qr_codes(self, request, queryset):
        # фильтруем только те объекты, у которых есть изображение и которые еще не распечатаны
        qr_codes_with_images = queryset.exclude(image__isnull=True).exclude(image='').filter(is_printed=False)
        
        if not qr_codes_with_images:
            self.message_user(request, "Нет QR-кодов доступных для печати (QR коды должны иметь изображение и не быть распечатанными)", level='warning')
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
                .qr-grid {{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 20px;
                    padding: 20px;
                }}
                .qr-container {{ 
                    margin: 0;
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
                    <div style="position: relative; width: 200px; height: 200px;">
                        <!-- Шаблон с текстом по кругу -->
                        <img src="{static_url}api/img/round.png" style="width: 200px; height: 200px;" />
                        <!-- QR код в центре -->
                        <img src="{image_url}" style="position: absolute; left: 50px; top: 49px; width: 100px; height: 100px;" />
                        <!-- Текст кода внизу -->
                        <div style="position: absolute; left: 0; right: 0; bottom: 35px; text-align: center; font-size: 15px; font-weight: bold;">
                            {code}
                        </div>
                    </div>
                </div>
            """.format(
                code=qr_code.code,
                image_url=request.build_absolute_uri(qr_code.image.url),
                static_url=settings.STATIC_URL
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