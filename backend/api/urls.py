from django.urls import path, include

from api.main.views import FAQView, MediaMainView, MembershipPlansView, SmsSendView

urlpatterns = [
    path("v1/faq/", FAQView.as_view(), name='faqMain'),
    path("v1/media/", MediaMainView.as_view(), name='mediaMain'),
    path("v1/account/memberships/", MembershipPlansView.as_view(), name='memberships'),
    path("v1/send-sms/", SmsSendView.as_view(), name='send-sms'),
    path('oauth/', include('api.oauth.urls')),
]