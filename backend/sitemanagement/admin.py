from django.contrib import admin
from .models import *
from django import forms
from api.models import RegisterQRCode

admin.site.register(FAQ)
admin.site.register(MainPageMedia)


class ServicesForm(forms.ModelForm):
    available_for = forms.MultipleChoiceField(
        choices=account_types,
        widget=forms.CheckboxSelectMultiple,
        required=False,
        help_text='Выберите тарифные планы, для которых доступна услуга',
        label='Доступно для тарифов'
    )
    
    class Meta:
        model = Services
        fields = '__all__'

@admin.register(Services)
class ServicesAdmin(admin.ModelAdmin):
    form = ServicesForm
    list_display = ['title', 'actual_before', 'get_available_for_display', 'is_available']
    list_filter = ['available_for', 'actual_before']
    search_fields = ['title', 'description']
    ordering = ['id']
    
    def get_available_for_display(self, obj):
        if obj.available_for and len(obj.available_for) > 0:
            return ", ".join(obj.available_for)
        return "Все тарифы"
    get_available_for_display.short_description = 'Доступно для'

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Pricing)
class PricingAdmin(admin.ModelAdmin):
    list_display = ['plan', 'price', 'is_popular']
    list_filter = ['is_popular']
    search_fields = ['plan']
    filter_horizontal = ['features']
    
@admin.register(MapPoints)
class MapPointsAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'category']
    search_fields = ['title', 'location', 'category']
    
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'service', 'created_at']
    list_filter = ['service', 'created_at']
    search_fields = ['user__username', 'service__title']
    readonly_fields = ('created_at',)
    
class BonusApplicationInline(admin.TabularInline):
    model = BonusApplication
    extra = 0
    readonly_fields = ('applied_at',)
    verbose_name = 'Применение бонуса'
    verbose_name_plural = 'Применения бонуса'

class QRCodeInline(admin.TabularInline):
    model = RegisterQRCode
    extra = 0
    readonly_fields = ('created_at', 'code', 'image', 'activation_date', 'user', 'is_active', 'is_used')
    verbose_name = 'QR код'
    verbose_name_plural = 'QR коды'
    can_delete = False

class PetCoordinatesInline(admin.TabularInline):
    model = PetCoordinates
    extra = 0
    readonly_fields = ('created_at', 'latitude', 'longitude', 'accuracy', 'address', 'founder_name', 'founder_phone')
    verbose_name = 'Координаты питомца'
    verbose_name_plural = 'Координаты питомцев'
    can_delete = False
@admin.register(Bonuses)
class BonusesAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'is_available', 'start_date', 'end_date', 'get_applications_count']
    list_filter = ['is_available', 'created_at', 'start_date', 'end_date']
    search_fields = ['name', 'description']
    readonly_fields = ('created_at',)
    inlines = [BonusApplicationInline]

    def get_applications_count(self, obj):
        return obj.bonusapplication_set.count()
    get_applications_count.short_description = 'Количество применений'

@admin.register(BonusApplication)
class BonusApplicationAdmin(admin.ModelAdmin):
    list_display = ['user', 'bonus', 'applied_at']
    list_filter = ['applied_at', 'bonus']
    search_fields = ['user__username', 'user__email', 'bonus__name']
    readonly_fields = ('applied_at',)

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'is_lost']
    list_filter = ['type']
    search_fields = ['owner__username', 'name']
    readonly_fields = ('created_at',)
    inlines = [QRCodeInline, PetCoordinatesInline]
    
    def get_readonly_fields(self, request, obj=None):
        # created_at всегда readonly
        base_readonly = ['created_at']
        
        if request.user.is_superuser:
            # суперюзер видит все поля редактируемыми кроме created_at
            return base_readonly
        else:
            # staff может редактировать только is_lost
            all_fields = [field.name for field in self.model._meta.fields]
            readonly_for_staff = [f for f in all_fields if f not in ('is_lost', 'created_at')]
            return readonly_for_staff

    def has_change_permission(self, request, obj=None):
        # только суперюзеры и staff могут менять
        return request.user.is_superuser or request.user.is_staff

    def has_add_permission(self, request):
        # добавление только для суперюзеров
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        # удалять могут только суперюзеры
        return request.user.is_superuser

@admin.register(Tranasctions)
class TranasctionsAdmin(admin.ModelAdmin):
    list_display = ['user', 'membership', 'amount', 'status', 'subscription_end']
    list_filter = ['status', 'subscription_start', 'subscription_end']
    search_fields = ['user__username', 'membership__plan']
    readonly_fields = ('created_at',)
    
@admin.register(Devices)
class DevicesAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'image', 'category']
    list_filter = ['title','price', 'category']
    search_fields = ['title', 'description', 'price']
    readonly_fields = ('created_at',)
    
@admin.register(PetCoordinates)
class PetCoordinatesAdmin(admin.ModelAdmin):
    list_display = ['pet', 'latitude', 'longitude', 'accuracy', 'address', 'founder_name', 'founder_phone', 'created_at']
    list_filter = ['pet', 'created_at']
    search_fields = ['pet__name', 'address', 'founder_name', 'founder_phone']
    readonly_fields = ('created_at',)