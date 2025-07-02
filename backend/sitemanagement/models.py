from django.db import models
from sitemanagement.constants.account_types import account_types

class FAQ (models.Model):
    title = models.CharField(max_length=250)
    content = models.CharField(max_length=800)
    
    class Meta:
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
        ordering = ['id']

    def __str__(self):
        return self.title
    
class Pricing(models.Model):
    plan = models.CharField(max_length=10, choices=account_types)
    description = models.CharField(max_length=255)
    price = models.IntegerField()
    is_popular = models.BooleanField(default=False)
    is_available = models.BooleanField(default=False)
    features = models.ManyToManyField('Feature', related_name='pricing_plans', verbose_name='Свойства')
    class Meta:
        verbose_name = 'Тарифный план'
        verbose_name_plural = 'Тарифные планы'
        
    def __str__(self):
        return self.plan
    
class Feature(models.Model):
    name = models.CharField(max_length=255, verbose_name='Название свойства')
    
    class Meta:
        verbose_name = 'Свойство'
        verbose_name_plural = 'Свойства'
        
    def __str__(self):
        return self.name
