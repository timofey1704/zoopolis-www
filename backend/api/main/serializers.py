from rest_framework import serializers
from sitemanagement.models import FAQ, MainPageMedia, Pricing, Feature

class FAQMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"

class MediaMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainPageMedia
        fields = "__all__"

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name']
        
class MembershipPlansSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pricing
        fields = "__all__"