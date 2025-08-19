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