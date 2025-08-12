from django.urls import path
from .views import UserDataView

urlpatterns = [
    path('user/', UserDataView.as_view({'get': 'user_data'}), name="user"),
]
