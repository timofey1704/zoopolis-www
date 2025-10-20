from django.urls import path, include

from api.main.views import (
FAQView, 
MediaMainView, 
MembershipPlansView, 
SmsSendView, 
IsLostPetView, 
SendCoordinatesView)

from api.auth.views import (
    LoginViewSet,
    RefreshTokenView,
    LogoutView,
    RegisterViewSet
)

from api.account.actions.userActions import UserDataView
from api.account.actions.petActions import PetView, CheckCodeView
from api.account.actions.accountActions import AccountActionsView, MapPointsView, ServicesView, BonusesView, DevicesView
from api.account.actions.dictionariesActions import DictionariesView, CityView
from api.account.actions.membershipActions import VerificationView, NotificationView, MembershipView

urlpatterns = [
    path("v1/faq/", FAQView.as_view(), name='faqMain'),
    path("v1/media/", MediaMainView.as_view(), name='mediaMain'),
    path("v1/account/memberships/", MembershipPlansView.as_view(), name='memberships'),
    path("v1/send-sms/", SmsSendView.as_view(), name='send-sms'),
    path("v1/is-lost/", IsLostPetView.as_view(), name='check-lost-pet'),
    path("v1/send-coordinates/", SendCoordinatesView.as_view(), name='send-coordinates'),
    
    path("v1/membership/verification/", VerificationView.as_view(), name='verification'),
    path("v1/membership/notification/", NotificationView.as_view(), name='notification'),
    
    path('oauth/', include('api.oauth.urls')),
    
    path('v1/login/', LoginViewSet.as_view({'post': 'login_client'}), name="login-client"),
    path("v1/auth/refresh/", RefreshTokenView.as_view(), name="token-refresh"),
    path("v1/logout", LogoutView.as_view(), name="logout"),
    path("v1/register/send-verification/", RegisterViewSet.as_view({'post': 'send_verification_code'}), name="send-verification"),
    path("v1/register/verify/", RegisterViewSet.as_view({'post': 'verify_and_register_client'}), name="verify-and-register"),
    
    path('v1/user/', UserDataView.as_view({'get': 'user_data'}), name="user"),
    
    path('v1/check-code/', CheckCodeView.as_view({'post': 'validate_code'}), name="validate-code"),
    path('v1/pets/get-pets/', PetView.as_view({'get': 'get_pets'}), name="get-pets"),
    path('v1/pets/get-pet/', PetView.as_view({'get': 'get_pet'}), name="get-pet"),
    path('v1/pets/create-pet/', PetView.as_view({'post': 'create_pet'}), name="create-pet"),
    path('v1/pets/update-pet/', PetView.as_view({'patch': 'update_pet'}), name="update-pet"),
    path('v1/pets/delete-pet/', PetView.as_view({'delete': 'delete_pet'}), name="delete-pet"),
    path('v1/pets/is-lost-pet/', PetView.as_view({'patch': 'is_lost_pet'}), name="is-lost-pet"),
    
    
    path('v1/pets/detail/', PetView.as_view({'get': 'get_pet'}), name="pet-detail"),
    
    path('v1/account/profile/contacts/', AccountActionsView.as_view({'patch':'change_profile_contacts_data'}), name='change_profile_contacts_data'),
    path('v1/account/map-points/', MapPointsView.as_view({'get': 'get_map_points'}), name='get_map_points'),
    path('v1/account/services/', ServicesView.as_view({'get': 'get_services'}), name='get_services'),
    path('v1/account/services/<int:pk>/request_service/', ServicesView.as_view({'post': 'request_service'}), name='request_service'),
    path('v1/account/bonuses/', BonusesView.as_view({'get': 'get_bonuses'}), name='get_bonuses'),
    path('v1/account/bonuses/<int:pk>/apply/', BonusesView.as_view({'post': 'apply_bonus'}), name='apply_bonus'),
    path('v1/account/devices/', DevicesView.as_view(), name='get-devices'),
    
    path('v1/account/payments/', MembershipView.as_view({'post': 'change_membership'}), name='change_membership'),
    
    path('v1/dictionaries/cities/', CityView.as_view({'get': 'get_cities'}), name='get_cities'),
    path('v1/dictionaries/pet-types/', DictionariesView.as_view({'get': 'pet_types'}), name='pet_types'),
    path('v1/dictionaries/pet-breeds/', DictionariesView.as_view({'get': 'pet_breeds'}), name='pet_breeds'),
    path('v1/dictionaries/pet-colors/', DictionariesView.as_view({'get': 'pet_colors'}), name='pet_colors'),
    
]