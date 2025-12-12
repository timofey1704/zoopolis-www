from rest_framework import serializers
from sitemanagement.constants.account_types import account_types
from sitemanagement.models import FAQ, MainPageMedia, Pricing, Feature
from django.conf import settings
class FAQMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"

class MediaMainSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = MainPageMedia
        fields = ["id", "image"]
    
    def get_image(self, obj):
        return f"{settings.BASE_URL}{obj.image.url}" if obj.image else None
class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name']
        
class MembershipPlansSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)
    plan = serializers.SerializerMethodField()
    
    def get_plan(self, obj):
        return dict(account_types)[obj.plan]
    
    class Meta:
        model = Pricing
        fields = "__all__"