import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / './.env', override=True)

SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = os.environ.get("DEBUG_MODE", "False").lower() == "true"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

# Base URL for media files
BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:8000")
CSRF_TRUSTED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")

MEDIA_URL = '/media/'
MEDIA_ROOT = os.environ.get("MEDIA_ROOT", os.path.join(BASE_DIR.parent, 'media'))
STATIC_ROOT = os.environ.get("STATIC_ROOT")

CORS_ALLOW_CREDENTIALS = True  # для разрешения cookie
CORS_ALLOW_ALL_ORIGINS = False # запрет всех доменов, кроме whitelist
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")

#is lost урлы для разных окружений
IS_LOST_URL = os.environ.get("IS_LOST_URL")
REDIRECT_LOGIN_URL = os.environ.get("REDIRECT_LOGIN_URL")

CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "HEAD",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH"
]

CORS_ALLOW_HEADERS = [
    'x-api-key', 
    'content-type',
    'authorization',
    'accept',
    'cookie'
]

#смски
SMS_USER = os.environ.get("SMS_USER")
SMS_API_KEY = os.environ.get("SMS_API_KEY")

# редис
REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
REDIS_PORT = 6379

LOGIN_URL = '/admin/login/'

#емаилы
CORP_EMAIL = os.environ.get("CORP_EMAIL")
SUPPORT_EMAIL = os.environ.get("SUPPORT_EMAIL")
DOMAIN = os.environ.get("DOMAIN")
PROJECT_NAME = os.environ.get("PROJECT_NAME")
SENDER_MAIL_LOGIN = os.environ.get("SENDER_MAIL_LOGIN")
SENDER_MAIL_PASSWORD = os.environ.get("SENDER_MAIL_PASSWORD")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL")
MAIL_SERVER_SMTP_PORT = os.environ.get("MAIL_SERVER_SMTP_PORT")
MAIL_SERVER_URL = os.environ.get("MAIL_SERVER_URL")

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.postgres',
    'corsheaders',
    'api.apps.ApiConfig',
    'sitemanagement.apps.SitemanagementConfig',
    'dictionaries.apps.DictionariesConfig',
    'rest_framework',
    'oauth2_provider'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'base.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'api/templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'base.wsgi.application'

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME"),
        "USER": os.environ.get("DB_USER"),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST": os.environ.get("DB_HOST"),
        "PORT": os.environ.get("DB_PORT"),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Minsk'
USE_TZ = True
USE_I18N = True
USE_L10N = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

