from rest_framework import serializers
from sitemanagement.models import FAQ

class FAQMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"
        