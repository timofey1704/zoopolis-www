from django.db import models

class Cities(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название города')
    country = models.CharField(max_length=255, verbose_name='Страна')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Город'
        verbose_name_plural = 'Города'
        
    def __str__(self):
        return self.name

class PetsTypes(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название типа питомца')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Тип питомца'
        verbose_name_plural = 'Типы питомцев'

    def __str__(self):
        return self.name

class PetsBreeds(models.Model):
    pet_type = models.ForeignKey(PetsTypes, on_delete=models.CASCADE, verbose_name='Тип питомца')
    name = models.CharField(max_length=255, verbose_name='Название породы')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Порода питомца'
        verbose_name_plural = 'Породы питомцев'
        
    def __str__(self):
        return f'{self.pet_type.name} - {self.name}'
    
class PetsColors(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название цвета')
    hex_code = models.CharField(max_length=255, verbose_name='HEX код цвета')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    
    class Meta:
        verbose_name = 'Цвет питомца'
        verbose_name_plural = 'Цвета питомцев'
        
    def __str__(self):
        return self.name