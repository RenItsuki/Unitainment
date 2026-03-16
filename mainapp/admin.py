from django.contrib import admin
from .models import User, Media, PersonalList, Discussion


admin.site.register(User)
admin.site.register(Media)
admin.site.register(PersonalList)
admin.site.register(Discussion)