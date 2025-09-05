from django.contrib import admin
from .models import *
from django import forms

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
    list_display = ['title', 'actual_before', 'get_available_for_display']
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

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'is_lost']
    list_filter = ['type']
    search_fields = ['owner__username', 'name']
    readonly_fields = ('created_at',)

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
        # Только суперюзеры и staff могут менять
        return request.user.is_superuser or request.user.is_staff

    def has_add_permission(self, request):
        # Добавление только для суперюзеров
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        # Удалять могут только суперюзеры
        return request.user.is_superuser