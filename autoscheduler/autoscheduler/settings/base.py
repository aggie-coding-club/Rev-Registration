import os
from autoscheduler.config import config

# What Google App Engine uses
_IS_GCP = os.getenv('SERVER_SOFTWARE', '').startswith('gunicorn')
# Environment variables for when we collect static files
_IS_STATIC = os.getenv('SETTINGS_MODE') == 'static'
# Env variable for connecting to Cloud SQL through cloud_sql_proxy
_IS_PROXY = os.getenv('SETTINGS_MODE') == 'proxy'

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
if _IS_GCP:
    # For production, load the secret from secret.txt and set it
    # This is set from the GitHub actions secret DJANGO_SECRET in deploy-workflow.yml
    _SECRET_PATH = os.path.dirname(__file__) + "/secret.txt"

    with open(_SECRET_PATH) as _SECRET_FILE:
        SECRET_KEY = _SECRET_FILE.read()[:-1] # Shave off newline
else:
    SECRET_KEY = 'ogxjva5h%&5c7&e#-2f1&+u5p#zygwffcy!@)k8i37#j_89xe2'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = not _IS_GCP

ALLOWED_HOSTS = [
    '*',
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',

    'frontend',
    'scheduler',
    'scraper',
    'user_sessions',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'autoscheduler.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'autoscheduler.wsgi.application'

if _IS_GCP:
    print("Connecting to Google Cloud SQL on App Engine")
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'postgres',
            'HOST': '/cloudsql/revregistration:us-central1:revregistration',
            'USER': config.get_prop("user"),
            'PASSWORD': config.get_prop("password"),
        }
    }
elif _IS_PROXY:
    print("Connecting to Google Cloud SQL (using cloud_sql_proxy)")
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'postgres',
            'HOST': '127.0.0.1',
            'PORT': '3306',
            'USER': config.get_prop("user"),
            'PASSWORD': config.get_prop("password"),
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'dbautoscheduler',
            'HOST': 'localhost',
            'PORT': '5432',
            'USER': config.get_prop("user"),
            'PASSWORD': config.get_prop("password"),
        }
    }


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME':
            'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
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


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

if _IS_GCP or _IS_STATIC:
    print("Using GCP/prod for static files")
    STATIC_ROOT = 'static'
    STATIC_URL = 'https://storage.googleapis.com/revregistration.appspot.com'
else:
    STATIC_URL = '/static/'
