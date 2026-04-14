
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "dev-key"
DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "testserver"]

INSTALLED_APPS = [
'django.contrib.admin',
'django.contrib.auth',
'django.contrib.contenttypes',
'django.contrib.sessions',
'django.contrib.messages',
'django.contrib.staticfiles',
'mainapp',
]

MIDDLEWARE = [
'django.middleware.security.SecurityMiddleware',
'django.contrib.sessions.middleware.SessionMiddleware',
'django.middleware.common.CommonMiddleware',
'django.middleware.csrf.CsrfViewMiddleware',
'django.contrib.auth.middleware.AuthenticationMiddleware',
'django.contrib.messages.middleware.MessageMiddleware',
]

ROOT_URLCONF = 'Unitainment.urls'

TEMPLATES = [
{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',

    'DIRS': [BASE_DIR / 'templates'],

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

WSGI_APPLICATION = 'Unitainment.wsgi.application'

DATABASES = {
'default': {
'ENGINE': 'django.db.backends.sqlite3',
'NAME': BASE_DIR / 'db.sqlite3',
}
}

LOGIN_URL = "login"
LOGIN_REDIRECT_URL = "list-home"
LOGOUT_REDIRECT_URL = "home"

STATIC_URL = "/static/"

STATICFILES_DIRS = [

    BASE_DIR / "static",

]
