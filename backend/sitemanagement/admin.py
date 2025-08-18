from django.contrib import admin
from .models import *

admin.site.register(FAQ)
admin.site.register(MainPageMedia)

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
    
@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ['name', 'type']
    list_filter = ['type']
    search_fields = ['owner']