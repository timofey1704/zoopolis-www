from django.contrib import admin
from django.forms import TextInput
from django.utils.html import format_html
from .models import *

@admin.register(Cities)
class CitiesAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'created_at')
    list_filter = ('country', 'created_at')
    search_fields = ('name', 'country')
    ordering = ('name',)
    readonly_fields = ('created_at',)

@admin.register(PetsTypes)
class PetsTypesAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name',)
    ordering = ('name',)
    readonly_fields = ('created_at',)

@admin.register(PetsBreeds)
class PetsBreedsAdmin(admin.ModelAdmin):
    list_display = ('name', 'pet_type', 'created_at')
    list_filter = ('pet_type', 'created_at')
    search_fields = ('name', 'pet_type')
    ordering = ('name',)
    readonly_fields = ('created_at',)

@admin.register(PetsColors)
class PetsColorsAdmin(admin.ModelAdmin):
    list_display = ('name', 'color_preview', 'hex_code', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'hex_code')
    ordering = ('name',)
    readonly_fields = ('created_at', 'color_preview')
    
    def formfield_for_dbfield(self, db_field, **kwargs):
        formfield = super().formfield_for_dbfield(db_field, **kwargs)
        if db_field.name == 'hex_code' and formfield is not None:
            formfield.widget = TextInput(attrs={'type': 'color'})
        return formfield
    
    def color_preview(self, obj):
        return format_html(
            '<div style="background-color: {}; width: 30px; height: 20px; border: 1px solid #ccc;"></div>',
            obj.hex_code
        )
    color_preview.short_description = 'Предпросмотр'
    
