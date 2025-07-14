from django.urls import path

from api.main.views import FAQView

urlpatterns = [
    path("v1/faq/", FAQView.as_view(), name='faqMain'),
]