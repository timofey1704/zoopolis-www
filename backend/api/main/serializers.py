from rest_framework import serializers
from sitemanagement.models import FAQ, MainPageMedia

class FAQMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = "__all__"

class MediaMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainPageMedia
        fields = "__all__"