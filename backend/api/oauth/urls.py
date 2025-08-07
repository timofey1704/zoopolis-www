from django.urls import path
from .views import (
    ApplicationRegistrationView,
    ApplicationListView,
    TokenIntrospectView,
    ProtectedResourceView
)

urlpatterns = [
    path('applications/register/', ApplicationRegistrationView.as_view(), name='oauth2_register'),
    path('applications/', ApplicationListView.as_view(), name='oauth2_applications'),
    path('introspect/', TokenIntrospectView.as_view(), name='oauth2_introspect'),
    path('userinfo/', ProtectedResourceView.as_view(), name='oauth2_userinfo'),
]