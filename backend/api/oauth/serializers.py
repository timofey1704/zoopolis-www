from rest_framework import serializers
from oauth2_provider.models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('client_id', 'client_secret', 'name', 'redirect_uris', 'client_type', 'authorization_grant_type')
        read_only_fields = ('client_id', 'client_secret')

class TokenIntrospectSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)