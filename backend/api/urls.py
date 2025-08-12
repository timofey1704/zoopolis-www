from django.urls import path, include

from api.main.views import FAQView, MediaMainView, MembershipPlansView, SmsSendView
from api.auth.views import (
    LoginViewSet,
    RefreshTokenView,
    LogoutView,
    RegisterViewSet
)

urlpatterns = [
    path("v1/faq/", FAQView.as_view(), name='faqMain'),
    path("v1/media/", MediaMainView.as_view(), name='mediaMain'),
    path("v1/account/memberships/", MembershipPlansView.as_view(), name='memberships'),
    path("v1/send-sms/", SmsSendView.as_view(), name='send-sms'),
    
    path('oauth/', include('api.oauth.urls')),
    
    path('v1/login/', LoginViewSet.as_view({'post': 'login'}), name="login-client"),
    path("v1/auth/refresh/", RefreshTokenView.as_view(), name="token-refresh"),
    path("v1/logout", LogoutView.as_view(), name="logout"),
    path("v1/register/send-verification/", RegisterViewSet.as_view({'post': 'send_verification_code'}), name="send-verification"),
    path("v1/register/verify-and-register/", RegisterViewSet.as_view({'post': 'verify_and_register_client'}), name="verify-and-register"),
]