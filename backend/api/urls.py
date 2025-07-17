from django.urls import path

from api.main.views import FAQView, MediaMainView, MembershipPlansView

urlpatterns = [
    path("v1/faq/", FAQView.as_view(), name='faqMain'),
    path("v1/media/", MediaMainView.as_view(), name='mediaMain'),
    path("v1/account/memberships/", MembershipPlansView.as_view(), name='memberships'),
]